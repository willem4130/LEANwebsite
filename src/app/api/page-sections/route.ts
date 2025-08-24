/**
 * Page Sections API Route - Enhanced with Real-time Updates
 * =======================================================
 * 
 * Enterprise-level API endpoint for page sections with:
 * - Type-safe validation using Zod schemas
 * - Real-time broadcasting of changes
 * - Advanced caching with tag-based invalidation
 * - Performance monitoring
 * - Error handling with detailed logging
 * - Plugin hook integration
 */

import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  withErrorHandling,
  validateRequest,
  createApiResponse,
  createPaginatedResponse,
  addSecurityHeaders,
} from '@/lib/api-framework'
import {
  PayloadPageSectionSchema,
  type PayloadPageSection,
} from '@/lib/type-safe-data-flow'
import { realtimeManager, cacheManager } from '@/lib/enhanced-api-framework'
import { performanceMonitor } from '@/lib/performance-optimization'
import { pluginManager } from '@/lib/plugin-architecture'

// ================================
// GET - Fetch Page Sections
// ================================

export const GET = withErrorHandling(async (req: NextRequest) => {
  const startTime = Date.now()
  const url = new URL(req.url)
  
  // Extract query parameters
  const page = url.searchParams.get('page')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const offset = parseInt(url.searchParams.get('offset') || '0')
  const sort = url.searchParams.get('sort') || 'order'
  const enabled = url.searchParams.get('enabled')
  
  try {
    // Execute before-request hooks
    const hookContext = await pluginManager.executeHook('beforeRequest', {
      method: 'GET',
      endpoint: '/api/page-sections',
      query: Object.fromEntries(url.searchParams),
    })

    // Build cache key
    const cacheKey = `page-sections:${page || 'all'}:${limit}:${offset}:${sort}:${enabled}`
    
    // Try cache first
    const cached = await cacheManager.get<PayloadPageSection[]>(cacheKey)
    if (cached) {
      const response = createApiResponse(cached, {
        statusCode: 200,
        requestId: generateRequestId(),
      })
      
      // Add cache headers
      response.headers.set('X-Cache', 'HIT')
      response.headers.set('Cache-Control', 'public, max-age=300')
      
      performanceMonitor.recordMetrics({
        apiResponseTime: Date.now() - startTime,
        cacheHitRate: 1,
        url: req.url,
      })
      
      return addSecurityHeaders(response)
    }

    // Get Payload instance
    const payload = await getPayload({ config })
    
    // Build query conditions
    const where: any = {}
    
    if (page) {
      where.page = { contains: page }
    }
    
    if (enabled !== null) {
      where.enabled = { equals: enabled === 'true' }
    }

    // Fetch from database
    const result = await payload.find({
      collection: 'page-sections',
      where,
      limit,
      sort,
    })

    // Validate data with Zod schemas
    const validatedSections = result.docs.map(doc => 
      PayloadPageSectionSchema.parse({
        ...doc,
        createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : (doc.createdAt as Date).toISOString(),
        updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : (doc.updatedAt as Date).toISOString(),
      })
    )

    // Cache the result
    await cacheManager.set(cacheKey, validatedSections, {
      ttl: 300, // 5 minutes
      tags: ['page-sections', ...(page ? [`page-${page}`] : [])],
    })

    // Execute after-request hooks
    await pluginManager.executeHook('afterRequest', hookContext, validatedSections)

    // Record performance metrics
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      cacheHitRate: 0,
      url: req.url,
    })

    // Return paginated response
    const response = createPaginatedResponse(
      validatedSections,
      Math.floor(offset / limit) + 1,
      limit,
      result.totalDocs
    )

    response.headers.set('X-Cache', 'MISS')
    response.headers.set('Cache-Control', 'public, max-age=300')
    
    return addSecurityHeaders(response)

  } catch (error) {
    await pluginManager.executeHook('onRequestError', {
      method: 'GET',
      url: req.url,
      error,
    })

    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    throw error
  }
})

// ================================
// POST - Create Page Section
// ================================

const CreatePageSectionSchema = PayloadPageSectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const POST = withErrorHandling(async (req: NextRequest) => {
  const startTime = Date.now()
  
  try {
    // Validate request data
    const validateData = validateRequest(CreatePageSectionSchema)
    const data = await validateData(req)

    // Execute before-create hooks
    const processedData = await pluginManager.executeHook('beforeDataCreate', 'page-sections', data)

    // Get Payload instance
    const payload = await getPayload({ config })

    // Create in database
    const result = await payload.create({
      collection: 'page-sections',
      data: (Array.isArray(processedData) ? processedData[0] || data : processedData || data) as any,
    })

    // Validate result
    const validatedSection = PayloadPageSectionSchema.parse({
      ...result,
      createdAt: typeof result.createdAt === 'string' ? result.createdAt : (result.createdAt as Date).toISOString(),
      updatedAt: typeof result.updatedAt === 'string' ? result.updatedAt : (result.updatedAt as Date).toISOString(),
    })

    // Invalidate related caches
    await cacheManager.invalidateByTag('page-sections')
    
    // Broadcast real-time event
    realtimeManager.broadcast('page-sections', {
      type: 'data_change',
      action: 'create',
      data: validatedSection,
      metadata: {
        timestamp: Date.now(),
        source: 'api',
      },
    })

    // Execute after-create hooks
    await pluginManager.executeHook('afterDataCreate', 'page-sections', data, validatedSection)

    // Record performance metrics
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    const response = createApiResponse(validatedSection, {
      statusCode: 201,
      requestId: generateRequestId(),
    })

    return addSecurityHeaders(response)

  } catch (error) {
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    throw error
  }
})

// ================================
// Helper Functions
// ================================

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// ================================
// REVALIDATION WEBHOOK
// ================================

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  
  if (action === 'revalidate') {
    // Invalidate all page-sections cache
    await cacheManager.invalidateByTag('page-sections')
    
    // Broadcast cache invalidation event
    realtimeManager.broadcast('page-sections', {
      type: 'cache_invalidation',
      action: 'bulk',
      data: { tag: 'page-sections' },
      metadata: {
        timestamp: Date.now(),
        source: 'revalidation_webhook',
      },
    })

    return createApiResponse({ revalidated: true }, {
      statusCode: 200,
    })
  }

  return createApiResponse(undefined, {
    error: {
      code: 'INVALID_ACTION',
      message: 'Invalid revalidation action',
    },
    statusCode: 400,
  })
})