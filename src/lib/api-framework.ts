/**
 * LEAN API Framework - Type-Safe Frontend/Backend Connectivity
 * =========================================================
 * 
 * A comprehensive framework for rapid website deployment with consistent
 * API patterns, type safety, and validation.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ================================
// 1. CORE TYPE SYSTEM
// ================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
  }
  meta?: {
    timestamp: string
    requestId: string
    version: string
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ================================
// 2. STANDARD API CONTRACTS
// ================================

// Contact Form Contract
export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  phoneNumber: z.string().optional(),
  preferredContact: z.enum(['email', 'phone']).default('email'),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

// Artist Site Configuration Contract
export const SiteConfigSchema = z.object({
  siteName: z.string(),
  primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  secondaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  logo: z.object({
    url: z.string().url(),
    alt: z.string(),
  }).optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(['instagram', 'facebook', 'youtube', 'spotify', 'soundcloud', 'twitter']),
    url: z.string().url(),
    username: z.string().optional(),
  })),
})

export type SiteConfig = z.infer<typeof SiteConfigSchema>

// Tour Events Contract
export const TourEventSchema = z.object({
  id: z.string(),
  eventName: z.string(),
  venue: z.string(),
  city: z.string(),
  date: z.string().datetime(),
  ticketUrl: z.string().url().optional(),
  soldOut: z.boolean().default(false),
  featured: z.boolean().default(false),
  price: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('USD'),
  }).optional(),
})

export type TourEvent = z.infer<typeof TourEventSchema>

// Gallery Items Contract
export const GalleryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  caption: z.string().optional(),
  category: z.array(z.enum(['live', 'studio', 'acoustic', 'video', 'equipment', 'crowd', 'bts', 'press'])),
  featured: z.boolean().default(false),
  altText: z.string(),
  metadata: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    duration: z.number().optional(), // for videos
  }).optional(),
})

export type GalleryItem = z.infer<typeof GalleryItemSchema>

// ================================
// 3. API UTILITIES & MIDDLEWARE
// ================================

export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Request validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest): Promise<T> => {
    try {
      const body = await req.json()
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(
          'VALIDATION_ERROR',
          'Invalid request data',
          400,
          { validationErrors: error.issues }
        )
      }
      throw new ApiError('INVALID_JSON', 'Invalid JSON in request body', 400)
    }
  }
}

// Response formatter
export function createApiResponse<T>(
  data?: T,
  options: {
    success?: boolean
    error?: { code: string; message: string; details?: any }
    statusCode?: number
    requestId?: string
  } = {}
): NextResponse<ApiResponse<T>> {
  const { 
    success = !options.error, 
    error, 
    statusCode = success ? 200 : 400,
    requestId = generateRequestId()
  } = options

  const response: ApiResponse<T> = {
    success,
    ...(data !== undefined && { data }),
    ...(error && { error }),
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      version: '1.0.0'
    }
  }

  return NextResponse.json(response, { status: statusCode })
}

// Pagination utility
export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  requestId?: string
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit)
  
  const response: PaginatedResponse<T> = {
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId(),
      version: '1.0.0'
    }
  }

  return NextResponse.json(response)
}

// Error handler wrapper
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ApiError) {
        return createApiResponse(undefined, {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
          statusCode: error.statusCode,
        })
      }

      return createApiResponse(undefined, {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
        statusCode: 500,
      })
    }
  }
}

// Rate limiting middleware
export function rateLimit(requests: number = 100, windowMs: number = 15 * 60 * 1000) {
  const requests_store = new Map<string, { count: number; resetTime: number }>()
  
  return (req: NextRequest): boolean => {
    const clientId = getClientId(req)
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean old entries
    for (const [key, value] of Array.from(requests_store.entries())) {
      if (value.resetTime < windowStart) {
        requests_store.delete(key)
      }
    }
    
    const current = requests_store.get(clientId)
    if (!current || current.resetTime < windowStart) {
      requests_store.set(clientId, { count: 1, resetTime: now })
      return true
    }
    
    if (current.count >= requests) {
      return false
    }
    
    current.count++
    return true
  }
}

// ================================
// 4. UTILITY FUNCTIONS
// ================================

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function getClientId(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
  return ip
}

// Security headers
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

// ================================
// 5. FRONTEND API CLIENT
// ================================

export class ApiClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor(baseUrl: string = '/api', defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    })

    const data: ApiResponse<T> = await response.json()
    
    if (!data.success) {
      throw new Error(data.error?.message || 'API request failed')
    }
    
    return data
  }

  async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Default client instance
export const apiClient = new ApiClient()

// ================================
// 6. REACT HOOKS FOR API INTEGRATION
// ================================
// 
// NOTE: React hooks have been moved to /src/hooks/useApi.tsx
// Import from there for client-side components