'use client'

import { useState, useEffect } from 'react'

// API Client (re-import for client-side use)
class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string> } = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options
    
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

    return response.json()
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

const apiClient = new ApiClient()

export function useApi<T>(
  endpoint: string,
  options: { immediate?: boolean; dependencies?: any[] } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiClient.get<T>(endpoint)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchData()
  }

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData()
    }
  }, options.dependencies || [endpoint])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

export function useMutation<T, V = any>(endpoint: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (data?: V, method: 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      let result: T
      switch (method) {
        case 'POST':
          result = await apiClient.post<T>(endpoint, data)
          break
        case 'PUT':
          result = await apiClient.put<T>(endpoint, data)
          break
        case 'DELETE':
          result = await apiClient.delete<T>(endpoint)
          break
      }
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    mutate,
    loading,
    error,
  }
}