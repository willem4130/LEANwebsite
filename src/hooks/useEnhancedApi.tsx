'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Enhanced API Response interface
interface EnhancedApiResponse<T = any> {
  data: T
  meta: {
    timestamp: number
    cached: boolean
    source: string
    version?: string
  }
  links?: {
    self?: string
    next?: string
    prev?: string
  }
}

// Enhanced API Client for client-side use
class EnhancedApiClient {
  private baseUrl: string
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  private getCacheKey(endpoint: string, params?: Record<string, string>): string {
    const paramString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return `${endpoint}${paramString}`
  }

  private getFromCache<T>(key: string): EnhancedApiResponse<T> | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return {
        data: cached.data,
        meta: {
          timestamp: cached.timestamp,
          cached: true,
          source: 'cache'
        }
      }
    }
    return null
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & { 
      params?: Record<string, string>
      cache?: boolean
      ttl?: number
    } = {}
  ): Promise<EnhancedApiResponse<T>> {
    const { params, cache = false, ttl = 300000, ...fetchOptions } = options
    const cacheKey = this.getCacheKey(endpoint, params)

    // Check cache first
    if (cache) {
      const cached = this.getFromCache<T>(cacheKey)
      if (cached) return cached
    }
    
    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams}`
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    const enhancedResponse: EnhancedApiResponse<T> = {
      data: result.data || result,
      meta: {
        timestamp: Date.now(),
        cached: false,
        source: 'api'
      }
    }

    // Cache if requested
    if (cache) {
      this.setCache(cacheKey, enhancedResponse.data, ttl)
    }

    return enhancedResponse
  }

  async get<T>(
    endpoint: string, 
    params?: Record<string, string>,
    options: { cache?: boolean; ttl?: number } = {}
  ): Promise<EnhancedApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params, ...options })
  }

  async post<T>(
    endpoint: string, 
    data?: any,
    options: { invalidateTags?: string[] } = {}
  ): Promise<EnhancedApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    endpoint: string, 
    data?: any,
    options: { invalidateTags?: string[] } = {}
  ): Promise<EnhancedApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(
    endpoint: string,
    options: { invalidateTags?: string[] } = {}
  ): Promise<EnhancedApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export function useEnhancedApi<T>(
  endpoint: string,
  options: {
    immediate?: boolean
    dependencies?: any[]
    realtime?: boolean
    cache?: boolean
    ttl?: number
    pollInterval?: number
  } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<any>(null)
  
  const client = useRef(new EnhancedApiClient()).current

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await client.get<T>(endpoint, undefined, {
        cache: options.cache,
        ttl: options.ttl
      })
      setData(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [endpoint, client, options.cache, options.ttl])

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData()
    }

    // Set up polling if requested
    let pollInterval: NodeJS.Timeout | undefined
    if (options.pollInterval && options.pollInterval > 0) {
      pollInterval = setInterval(fetchData, options.pollInterval)
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [fetchData, options.immediate, options.pollInterval, ...(options.dependencies || [])])

  return {
    data,
    loading,
    error,
    meta,
    refetch: fetchData,
  }
}

export function useEnhancedMutation<TData, TVariables = any>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const client = useRef(new EnhancedApiClient()).current

  const mutate = useCallback(async (
    endpoint: string,
    variables: TVariables,
    options: {
      method?: 'POST' | 'PUT' | 'DELETE'
      invalidateTags?: string[]
      optimistic?: boolean
    } = {}
  ): Promise<TData | null> => {
    const { method = 'POST', invalidateTags, optimistic } = options
    
    setLoading(true)
    setError(null)
    
    try {
      let response: EnhancedApiResponse<TData>
      
      switch (method) {
        case 'POST':
          response = await client.post<TData>(endpoint, variables, { invalidateTags })
          break
        case 'PUT':
          response = await client.put<TData>(endpoint, variables, { invalidateTags })
          break
        case 'DELETE':
          response = await client.delete<TData>(endpoint, { invalidateTags })
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      
      return response.data || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [client])

  return { mutate, loading, error }
}