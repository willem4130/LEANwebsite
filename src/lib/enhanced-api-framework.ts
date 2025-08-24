/**
 * Enhanced LEAN API Framework - Real-time Connectivity & Type Safety
 * ===============================================================
 * 
 * Enterprise-level API framework with:
 * - Real-time updates via WebSockets/SSE
 * - SSR + client-side sync
 * - Advanced caching with invalidation
 * - Type-safe data flow
 * - Plugin architecture
 * - Performance monitoring
 * - Error recovery
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { EventEmitter } from 'events'

// ================================
// 1. ENHANCED TYPE SYSTEM
// ================================

export interface EnhancedApiResponse<T = any> extends ApiResponse<T> {
  cached?: boolean
  cacheKey?: string
  timestamp: number
  version?: string
  etag?: string
}

export interface RealtimeEvent<T = any> {
  type: string
  collection?: string
  action: 'create' | 'update' | 'delete' | 'bulk'
  data: T
  metadata: {
    userId?: string
    timestamp: number
    source: string
  }
}

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  tags: string[]
  etag: string
}

export interface ApiPlugin {
  name: string
  version: string
  hooks: {
    beforeRequest?: (config: RequestConfig) => Promise<RequestConfig>
    afterResponse?: <T>(response: EnhancedApiResponse<T>) => Promise<EnhancedApiResponse<T>>
    onError?: (error: Error, config: RequestConfig) => Promise<void>
    onCache?: <T>(key: string, data: T) => Promise<void>
  }
}

interface RequestConfig {
  endpoint: string
  method: string
  data?: any
  headers?: Record<string, string>
  cache?: {
    enabled: boolean
    ttl?: number
    tags?: string[]
  }
  realtime?: boolean
}

// Import base types
import type { ApiResponse, ApiError } from './api-framework'

// ================================
// 2. ENHANCED PAYLOAD CMS SCHEMAS
// ================================

// Page Sections Schema
export const PageSectionSchema = z.object({
  id: z.string(),
  sectionName: z.string(),
  sectionId: z.string(),
  sectionType: z.enum(['hero', 'about', 'services', 'gallery', 'testimonials', 'contact', 'cta', 'music', 'events', 'team', 'blog', 'stats', 'faq', 'newsletter', 'social', 'custom', 'html']),
  page: z.array(z.enum(['homepage', 'about', 'music', 'gallery', 'tour', 'contact', 'blog', 'global'])),
  enabled: z.boolean(),
  order: z.number(),
  content: z.record(z.string(), z.any()), // Dynamic content based on sectionType
  styling: z.object({
    containerWidth: z.enum(['full', 'wide', 'container', 'narrow']).optional(),
    padding: z.object({
      top: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
      bottom: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
    }).optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
  animations: z.object({
    entranceAnimation: z.enum(['none', 'fadeIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'bounceIn']).optional(),
    animationDelay: z.number().optional(),
    animationDuration: z.number().optional(),
  }).optional(),
  conditions: z.object({
    deviceVisibility: z.array(z.enum(['desktop', 'tablet', 'mobile'])).optional(),
    userRoles: z.array(z.enum(['public', 'user', 'admin'])).optional(),
    dateRange: z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional(),
  }).optional(),
})

export type PageSection = z.infer<typeof PageSectionSchema>

// Component Library Schema
export const ComponentLibrarySchema = z.object({
  id: z.string(),
  componentName: z.string(),
  displayName: z.string(),
  description: z.string(),
  category: z.enum(['layout', 'navigation', 'content', 'interactive', 'media', 'forms', 'ecommerce', 'social', 'analytics', 'third-party', 'custom']),
  version: z.string(),
  status: z.enum(['development', 'testing', 'stable', 'deprecated']),
  implementation: z.object({
    framework: z.enum(['react', 'vue', 'svelte', 'vanilla', 'web-component']),
    sourceCode: z.string(),
    styles: z.string().optional(),
    dependencies: z.array(z.object({
      package: z.string(),
      version: z.string(),
      required: z.boolean(),
    })),
  }),
  propsSchema: z.record(z.string(), z.any()),
  defaultProps: z.record(z.string(), z.any()).optional(),
})

export type ComponentLibraryItem = z.infer<typeof ComponentLibrarySchema>

// Theme Settings Schema
export const ThemeSettingsSchema = z.object({
  id: z.string(),
  themeName: z.string(),
  displayName: z.string(),
  version: z.string(),
  status: z.enum(['development', 'testing', 'production', 'deprecated']),
  isDefault: z.boolean(),
  colors: z.object({
    primary: z.object({
      main: z.string(),
      light: z.string().optional(),
      dark: z.string().optional(),
      contrast: z.string().optional(),
    }),
    secondary: z.object({
      main: z.string(),
      light: z.string().optional(),
      dark: z.string().optional(),
      contrast: z.string().optional(),
    }),
    accent: z.object({
      main: z.string(),
      light: z.string().optional(),
      dark: z.string().optional(),
      contrast: z.string().optional(),
    }).optional(),
  }),
  typography: z.object({
    fontFamilies: z.object({
      primary: z.string(),
      headings: z.string().optional(),
      monospace: z.string().optional(),
    }),
    fontSizes: z.record(z.string(), z.string()),
    fontWeights: z.record(z.string(), z.number()),
  }),
  spacing: z.object({
    base: z.string(),
    scale: z.record(z.string(), z.string()),
  }),
  animations: z.object({
    enabled: z.boolean(),
    duration: z.record(z.string(), z.string()).optional(),
    easing: z.record(z.string(), z.string()).optional(),
  }).optional(),
})

export type ThemeSettings = z.infer<typeof ThemeSettingsSchema>

// ================================
// 3. REAL-TIME EVENT SYSTEM
// ================================

class RealtimeManager extends EventEmitter {
  private connections: Set<any> = new Set()
  private subscriptions: Map<string, Set<string>> = new Map()

  subscribe(collection: string, callback: (event: RealtimeEvent) => void): () => void {
    const subscriptionId = `${collection}_${Date.now()}_${Math.random()}`
    
    if (!this.subscriptions.has(collection)) {
      this.subscriptions.set(collection, new Set())
    }
    this.subscriptions.get(collection)!.add(subscriptionId)
    
    this.on(`${collection}:change`, callback)
    
    // Return unsubscribe function
    return () => {
      this.off(`${collection}:change`, callback)
      this.subscriptions.get(collection)?.delete(subscriptionId)
    }
  }

  broadcast<T>(collection: string, event: RealtimeEvent<T>) {
    this.emit(`${collection}:change`, event)
    
    // Also emit to global listeners
    this.emit('*:change', { ...event, collection })
  }

  getSubscriberCount(collection: string): number {
    return this.subscriptions.get(collection)?.size || 0
  }
}

export const realtimeManager = new RealtimeManager()

// ================================
// 4. ADVANCED CACHING SYSTEM
// ================================

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private tagIndex: Map<string, Set<string>> = new Map()

  set<T>(key: string, data: T, options: {
    ttl?: number
    tags?: string[]
    etag?: string
  } = {}): void {
    const { ttl = 300000, tags = [], etag } = options // Default 5 minutes
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
      etag: etag || this.generateETag(data),
    }

    this.cache.set(key, entry)

    // Update tag index
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set())
      }
      this.tagIndex.get(tag)!.add(key)
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string): void {
    const entry = this.cache.get(key)
    if (entry) {
      // Remove from tag index
      entry.tags.forEach(tag => {
        this.tagIndex.get(tag)?.delete(key)
      })
    }
    this.cache.delete(key)
  }

  invalidateByTag(tag: string): void {
    const keys = this.tagIndex.get(tag)
    if (keys) {
      keys.forEach(key => this.delete(key))
      this.tagIndex.delete(tag)
    }
  }

  clear(): void {
    this.cache.clear()
    this.tagIndex.clear()
  }

  getStats() {
    return {
      size: this.cache.size,
      tags: this.tagIndex.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  private generateETag(data: any): string {
    return `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`
  }
}

export const cacheManager = new CacheManager()

// ================================
// 5. PLUGIN SYSTEM
// ================================

class PluginManager {
  private plugins: Map<string, ApiPlugin> = new Map()

  register(plugin: ApiPlugin): void {
    this.plugins.set(plugin.name, plugin)
  }

  unregister(name: string): void {
    this.plugins.delete(name)
  }

  async executeHook<T>(
    hookName: keyof ApiPlugin['hooks'],
    payload: T
  ): Promise<T> {
    let result = payload

    for (const plugin of Array.from(this.plugins.values())) {
      const hook = plugin.hooks[hookName]
      if (hook) {
        try {
          result = await (hook as any)(result)
        } catch (error) {
          console.error(`Plugin ${plugin.name} hook ${hookName} failed:`, error)
        }
      }
    }

    return result
  }

  getPlugins(): ApiPlugin[] {
    return Array.from(this.plugins.values())
  }
}

export const pluginManager = new PluginManager()

// ================================
// 6. ENHANCED API CLIENT
// ================================

export class EnhancedApiClient {
  private baseUrl: string
  private headers: HeadersInit
  private requestQueue: Map<string, Promise<any>> = new Map()

  constructor(baseUrl: string = '/api', defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  private async request<T>(config: RequestConfig): Promise<EnhancedApiResponse<T>> {
    // Execute before-request hooks
    const processedConfig = await pluginManager.executeHook('beforeRequest', config)
    
    const { endpoint, method, data, headers = {}, cache = { enabled: true } } = processedConfig
    const url = `${this.baseUrl}${endpoint}`
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(method, url, data)
    
    // Check cache first
    if (cache.enabled && method === 'GET') {
      const cached = cacheManager.get<T>(cacheKey)
      if (cached) {
        const response: EnhancedApiResponse<T> = {
          success: true,
          data: cached,
          cached: true,
          cacheKey,
          timestamp: Date.now(),
          meta: {
            timestamp: new Date().toISOString(),
            requestId: this.generateRequestId(),
            version: '2.0.0'
          }
        }
        return await pluginManager.executeHook('afterResponse', response)
      }
    }

    // Deduplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey)
    }

    const requestPromise = this.executeRequest<T>(url, {
      method,
      headers: { ...this.headers, ...headers },
      ...(data && { body: JSON.stringify(data) }),
    })

    this.requestQueue.set(cacheKey, requestPromise)

    try {
      const response = await requestPromise
      
      // Cache successful GET requests
      if (cache.enabled && method === 'GET' && response.success) {
        cacheManager.set(cacheKey, response.data, {
          ttl: cache.ttl,
          tags: cache.tags,
          etag: response.etag,
        })
      }

      // Execute after-response hooks
      const processedResponse = await pluginManager.executeHook('afterResponse', response)
      
      return processedResponse
    } catch (error) {
      await pluginManager.executeHook('onError', error)
      throw error
    } finally {
      this.requestQueue.delete(cacheKey)
    }
  }

  private async executeRequest<T>(url: string, options: RequestInit): Promise<EnhancedApiResponse<T>> {
    const response = await fetch(url, options)
    const data: EnhancedApiResponse<T> = await response.json()
    
    return {
      ...data,
      timestamp: Date.now(),
      etag: response.headers.get('etag') || undefined,
    }
  }

  // Enhanced methods with real-time capabilities
  async get<T>(endpoint: string, options: {
    cache?: boolean
    ttl?: number
    tags?: string[]
    realtime?: boolean
  } = {}): Promise<EnhancedApiResponse<T>> {
    const response = await this.request<T>({
      endpoint,
      method: 'GET',
      cache: {
        enabled: options.cache !== false,
        ttl: options.ttl,
        tags: options.tags,
      },
      realtime: options.realtime,
    })

    // Set up real-time subscription if requested
    if (options.realtime) {
      const collection = endpoint.split('/')[1]
      realtimeManager.subscribe(collection, (event) => {
        // Invalidate cache on data changes
        cacheManager.invalidateByTag(collection)
      })
    }

    return response
  }

  async post<T>(endpoint: string, data: any, options: {
    invalidateTags?: string[]
  } = {}): Promise<EnhancedApiResponse<T>> {
    const response = await this.request<T>({
      endpoint,
      method: 'POST',
      data,
    })

    // Invalidate related cache entries
    if (options.invalidateTags) {
      options.invalidateTags.forEach(tag => {
        cacheManager.invalidateByTag(tag)
      })
    }

    // Broadcast real-time event
    const collection = endpoint.split('/')[1]
    realtimeManager.broadcast(collection, {
      type: 'data_change',
      action: 'create',
      data: response.data,
      metadata: {
        timestamp: Date.now(),
        source: 'api_client',
      },
    })

    return response
  }

  async put<T>(endpoint: string, data: any, options: {
    invalidateTags?: string[]
  } = {}): Promise<EnhancedApiResponse<T>> {
    const response = await this.request<T>({
      endpoint,
      method: 'PUT',
      data,
    })

    // Invalidate and broadcast
    if (options.invalidateTags) {
      options.invalidateTags.forEach(tag => {
        cacheManager.invalidateByTag(tag)
      })
    }

    const collection = endpoint.split('/')[1]
    realtimeManager.broadcast(collection, {
      type: 'data_change',
      action: 'update',
      data: response.data,
      metadata: {
        timestamp: Date.now(),
        source: 'api_client',
      },
    })

    return response
  }

  async delete<T>(endpoint: string, options: {
    invalidateTags?: string[]
  } = {}): Promise<EnhancedApiResponse<T>> {
    const response = await this.request<T>({
      endpoint,
      method: 'DELETE',
    })

    // Invalidate and broadcast
    if (options.invalidateTags) {
      options.invalidateTags.forEach(tag => {
        cacheManager.invalidateByTag(tag)
      })
    }

    const collection = endpoint.split('/')[1]
    realtimeManager.broadcast(collection, {
      type: 'data_change',
      action: 'delete',
      data: response.data,
      metadata: {
        timestamp: Date.now(),
        source: 'api_client',
      },
    })

    return response
  }

  // Bulk operations
  async bulk<T>(operations: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    endpoint: string
    data?: any
  }>): Promise<EnhancedApiResponse<T[]>> {
    const results = await Promise.allSettled(
      operations.map(op => this.request<T>(op))
    )

    const successful = results
      .filter((result): result is PromiseFulfilledResult<EnhancedApiResponse<T>> => result.status === 'fulfilled')
      .map(result => result.value.data!)

    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason)

    return {
      success: failed.length === 0,
      data: successful,
      timestamp: Date.now(),
      meta: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        version: '2.0.0',
      },
      ...(failed.length > 0 && {
        error: {
          code: 'BULK_OPERATION_PARTIAL_FAILURE',
          message: `${failed.length} operations failed`,
          details: { failed },
        },
      }),
    }
  }

  private generateCacheKey(method: string, url: string, data?: any): string {
    const base = `${method}:${url}`
    return data ? `${base}:${JSON.stringify(data)}` : base
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// ================================
// 7. REACT HOOKS FOR ENHANCED API
// ================================
// 
// NOTE: React hooks have been moved to /src/hooks/useEnhancedApi.tsx
// Import from there for client-side components

// Default enhanced client instance
export const enhancedApiClient = new EnhancedApiClient()

// ================================
// 8. PERFORMANCE MONITORING
// ================================

class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  recordRequestTime(endpoint: string, duration: number) {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, [])
    }
    this.metrics.get(endpoint)!.push(duration)
    
    // Keep only last 100 measurements
    const times = this.metrics.get(endpoint)!
    if (times.length > 100) {
      times.shift()
    }
  }

  getStats(endpoint?: string) {
    if (endpoint) {
      const times = this.metrics.get(endpoint) || []
      return this.calculateStats(times)
    }

    const allStats: Record<string, any> = {}
    for (const [ep, times] of Array.from(this.metrics.entries())) {
      allStats[ep] = this.calculateStats(times)
    }
    return allStats
  }

  private calculateStats(times: number[]) {
    if (times.length === 0) return { avg: 0, min: 0, max: 0, count: 0 }
    
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    const min = Math.min(...times)
    const max = Math.max(...times)
    
    return { avg, min, max, count: times.length }
  }
}

export const performanceMonitor = new PerformanceMonitor()