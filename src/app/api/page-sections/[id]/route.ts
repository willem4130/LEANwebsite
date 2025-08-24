/**
 * Individual Page Section API Route - CRUD Operations
 * =================================================
 * 
 * Enhanced API endpoint for individual page section operations:
 * - GET: Fetch single page section with caching
 * - PUT: Update page section with real-time broadcasting
 * - DELETE: Remove page section with cascade invalidation
 * - Type-safe validation and error handling
 */

import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  withErrorHandling,
  validateRequest,
  createApiResponse,
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
// GET - Fetch Single Page Section
// ================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  
  try {
    // Build cache key
    const cacheKey = `page-section:${id}`
    
    // Try cache first
    const cached = await cacheManager.get<PayloadPageSection>(cacheKey)
    if (cached) {
      const response = createApiResponse(cached, {
        statusCode: 200,
        requestId: generateRequestId(),
      })
      
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
    
    // Fetch from database
    const result = await payload.findByID({
      collection: 'page-sections',
      id,
    })

    if (!result) {
      return createApiResponse(undefined, {
        error: {
          code: 'NOT_FOUND',
          message: `Page section with ID ${id} not found`,
        },
        statusCode: 404,
      })
    }

    // Validate data with Zod schema
    const validatedSection = PayloadPageSectionSchema.parse({
      ...result,
      createdAt: typeof result.createdAt === 'string' ? result.createdAt : (result.createdAt as Date).toISOString(),
      updatedAt: typeof result.updatedAt === 'string' ? result.updatedAt : (result.updatedAt as Date).toISOString(),
    })

    // Cache the result
    await cacheManager.set(cacheKey, validatedSection, {
      ttl: 300, // 5 minutes
      tags: ['page-sections', `page-section-${id}`],
    })

    // Record performance metrics
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      cacheHitRate: 0,
      url: req.url,
    })

    const response = createApiResponse(validatedSection, {
      statusCode: 200,
      requestId: generateRequestId(),
    })

    response.headers.set('X-Cache', 'MISS')
    response.headers.set('Cache-Control', 'public, max-age=300')
    
    return addSecurityHeaders(response)

  } catch (error) {
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    return createApiResponse(undefined, {
      error: {
        code: error instanceof Error ? 'INTERNAL_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      statusCode: 500,
    })
  }
}

// ================================
// PUT - Update Page Section
// ================================

const UpdatePageSectionSchema = PayloadPageSectionSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  
  try {
    // Validate request data
    const validateData = validateRequest(UpdatePageSectionSchema)
    const data = await validateData(req)

    // Execute before-update hooks
    const processedData = await pluginManager.executeHook('beforeDataUpdate', 'page-sections', id, data)

    // Get Payload instance
    const payload = await getPayload({ config })

    // Check if section exists
    const existing = await payload.findByID({
      collection: 'page-sections',
      id,
    })

    if (!existing) {
      return createApiResponse(undefined, {
        error: {
          code: 'NOT_FOUND',
          message: `Page section with ID ${id} not found`,
        },
        statusCode: 404,
      })
    }

    // Update in database
    const result = await payload.update({
      collection: 'page-sections',
      id,
      data: processedData[0] || data,
    })

    // Validate result
    const validatedSection = PayloadPageSectionSchema.parse({
      ...result,
      createdAt: typeof result.createdAt === 'string' ? result.createdAt : (result.createdAt as Date).toISOString(),
      updatedAt: typeof result.updatedAt === 'string' ? result.updatedAt : (result.updatedAt as Date).toISOString(),
    })

    // Invalidate related caches
    await cacheManager.invalidateByTag('page-sections')
    await cacheManager.invalidateByTag(`page-section-${id}`)
    
    // Broadcast real-time event
    realtimeManager.broadcast('page-sections', {
      type: 'data_change',
      action: 'update',
      data: validatedSection,
      metadata: {
        timestamp: Date.now(),
        source: 'api',
      },
    })

    // Execute after-update hooks
    await pluginManager.executeHook('afterDataUpdate', 'page-sections', id, data, validatedSection)

    // Record performance metrics
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    const response = createApiResponse(validatedSection, {
      statusCode: 200,
      requestId: generateRequestId(),
    })

    return addSecurityHeaders(response)

  } catch (error) {
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    return createApiResponse(undefined, {
      error: {
        code: error instanceof Error ? 'INTERNAL_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      statusCode: 500,
    })
  }
}

// ================================
// DELETE - Remove Page Section
// ================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  const { id } = await params
  
  try {
    // Execute before-delete hooks
    await pluginManager.executeHook('beforeDataDelete', 'page-sections', id)

    // Get Payload instance
    const payload = await getPayload({ config })

    // Check if section exists and get it for the response
    const existing = await payload.findByID({
      collection: 'page-sections',
      id,
    })

    if (!existing) {
      return createApiResponse(undefined, {
        error: {
          code: 'NOT_FOUND',
          message: `Page section with ID ${id} not found`,
        },
        statusCode: 404,
      })
    }

    // Delete from database
    await payload.delete({
      collection: 'page-sections',
      id,
    })

    // Invalidate related caches
    await cacheManager.invalidateByTag('page-sections')
    await cacheManager.invalidateByTag(`page-section-${id}`)
    
    // Also invalidate page-specific caches
    if (existing.page) {
      for (const page of existing.page) {
        await cacheManager.invalidateByTag(`page-${page}`)
      }
    }
    
    // Broadcast real-time event
    realtimeManager.broadcast('page-sections', {
      type: 'data_change',
      action: 'delete',
      data: { id, sectionName: existing.sectionName },
      metadata: {
        timestamp: Date.now(),
        source: 'api',
      },
    })

    // Execute after-delete hooks
    await pluginManager.executeHook('afterDataDelete', 'page-sections', id)

    // Record performance metrics
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    const response = createApiResponse(
      { 
        deleted: true, 
        id, 
        sectionName: existing.sectionName 
      },
      {
        statusCode: 200,
        requestId: generateRequestId(),
      }
    )

    return addSecurityHeaders(response)

  } catch (error) {
    performanceMonitor.recordMetrics({
      apiResponseTime: Date.now() - startTime,
      url: req.url,
    })

    return createApiResponse(undefined, {
      error: {
        code: error instanceof Error ? 'INTERNAL_ERROR' : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      statusCode: 500,
    })
  }
}

// ================================
// Helper Functions
// ================================

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}