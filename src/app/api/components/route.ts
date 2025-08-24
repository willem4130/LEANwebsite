/**
 * Dynamic Component Management API
 * ================================
 * 
 * API endpoints for managing dynamic components, A/B testing,
 * and theme management within the LEAN CMS framework
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  componentRegistry,
  abTestManager,
  themeManager,
  ComponentMetadata,
  ABTestConfig,
  ThemeConfig
} from '@/lib/component-management'
import { createApiResponse, validateRequest, withErrorHandling } from '@/lib/api-framework'
import { z } from 'zod'

// ================================
// COMPONENT MANAGEMENT ENDPOINTS
// ================================

// GET /api/components - List all components or handle sub-routes
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams, pathname } = new URL(req.url)
  
  // Handle sub-routes based on URL path
  if (pathname.includes('/ab-tests')) {
    const enabled = searchParams.get('enabled')
    
    // Since we don't have a direct method to list all tests, 
    // this would typically come from a database
    const mockTests = [
      {
        id: 'hero-banner-test',
        name: 'Hero Banner Optimization',
        enabled: true,
        variants: ['hero-variant-a', 'hero-variant-b'],
        trafficSplit: [50, 50],
      }
    ]

    const filteredTests = enabled !== null 
      ? mockTests.filter(test => test.enabled === (enabled === 'true'))
      : mockTests

    return createApiResponse(filteredTests)
  }
  
  if (pathname.includes('/themes')) {
    const themes = themeManager.getAllThemes()
    const activeTheme = themeManager.getActiveTheme()

    return createApiResponse({
      themes,
      activeTheme,
    })
  }
  
  // Default: List all components
  const filters = {
    category: searchParams.get('category') || undefined,
    tags: searchParams.get('tags')?.split(',') || undefined,
    author: searchParams.get('author') || undefined,
    featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
  }

  const components = componentRegistry.getAllComponents(filters)
  
  return createApiResponse({
    components,
    total: components.length,
    filters: Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)),
  })
})

// POST /api/components - Register a new component or handle sub-routes
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url)
  
  // Handle A/B testing routes
  if (pathname.includes('/ab-tests')) {
    const ABTestSchema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      enabled: z.boolean().default(true),
      variants: z.array(z.string()).min(2),
      trafficSplit: z.array(z.number()).min(2),
      startDate: z.string().datetime(),
      endDate: z.string().datetime().optional(),
      targetMetrics: z.array(z.string()),
      conditions: z.object({
        userSegments: z.array(z.string()).optional(),
        deviceTypes: z.array(z.string()).optional(),
        geography: z.array(z.string()).optional(),
      }).optional(),
    })

    const testConfig = ABTestSchema.parse(await req.json())
    
    // Validate traffic split sums to 100
    const totalTraffic = testConfig.trafficSplit.reduce((sum, split) => sum + split, 0)
    if (Math.abs(totalTraffic - 100) > 0.01) {
      return createApiResponse(undefined, {
        error: {
          code: 'INVALID_TRAFFIC_SPLIT',
          message: 'Traffic split must sum to 100%',
        },
        statusCode: 400,
      })
    }

    // Setup the A/B test
    abTestManager.setupTest(testConfig)

    return createApiResponse({
      message: 'A/B test created successfully',
      testId: testConfig.id,
    }, { statusCode: 201 })
  }
  
  // Handle theme routes
  if (pathname.includes('/themes')) {
    const ThemeSchema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      version: z.string(),
      variables: z.record(z.string(), z.string()),
      components: z.record(z.string(), z.object({
        styles: z.record(z.string(), z.any()),
        variants: z.record(z.string(), z.any()).optional(),
      })),
      breakpoints: z.record(z.string(), z.string()),
      typography: z.object({
        fontFamilies: z.record(z.string(), z.string()),
        fontSizes: z.record(z.string(), z.string()),
        fontWeights: z.record(z.string(), z.string()),
        lineHeights: z.record(z.string(), z.string()),
      }),
      colors: z.record(z.string(), z.string()),
      spacing: z.record(z.string(), z.string()),
      shadows: z.record(z.string(), z.string()),
      animations: z.record(z.string(), z.string()),
    })
    
    const themeConfig = ThemeSchema.parse(await req.json()) as ThemeConfig
    
    themeManager.registerTheme(themeConfig)

    return createApiResponse({
      message: 'Theme registered successfully',
      themeId: themeConfig.id,
      themeName: themeConfig.name,
    }, { statusCode: 201 })
  }
  
  // Default: Register a new component
  const RegisterComponentSchema = z.object({
    metadata: z.object({
      id: z.string(),
      name: z.string(),
      version: z.string(),
      description: z.string(),
      category: z.enum(['layout', 'navigation', 'content', 'media', 'forms', 'interactive', 'data-display', 'feedback', 'utility']),
      tags: z.array(z.string()),
      author: z.object({
        name: z.string(),
        email: z.string().email(),
        url: z.string().url().optional(),
      }),
      license: z.string().default('MIT'),
      dependencies: z.record(z.string(), z.string()),
      props: z.object({
        schema: z.record(z.string(), z.any()),
        required: z.array(z.string()).default([]),
        examples: z.array(z.record(z.string(), z.any())).default([]),
      }),
      styling: z.object({
        cssVariables: z.array(z.string()).default([]),
        themes: z.array(z.string()).default([]),
        responsive: z.boolean().default(true),
        darkModeSupport: z.boolean().default(true),
      }),
      compatibility: z.object({
        react: z.string().default('>=18.0.0'),
        nextjs: z.string().optional(),
        typescript: z.boolean().default(true),
      }),
      marketplace: z.object({
        featured: z.boolean().default(false),
        price: z.number().default(0),
        lastUpdated: z.string().datetime(),
        downloads: z.number().default(0),
      }),
    }),
    source: z.object({
      type: z.enum(['local', 'remote', 'cdn', 'marketplace']),
      path: z.string(),
      version: z.string().optional(),
      integrity: z.string().optional(),
    }),
  })

  const { metadata, source } = await validateRequest(RegisterComponentSchema)(req)

  // Check if component already exists
  const existing = componentRegistry.getComponentMetadata(metadata.id)
  if (existing) {
    return createApiResponse(undefined, {
      error: {
        code: 'COMPONENT_EXISTS',
        message: `Component ${metadata.id} already exists`,
      },
      statusCode: 409,
    })
  }

  // Register the component
  componentRegistry.registerComponent(metadata as ComponentMetadata, source)

  return createApiResponse({
    message: 'Component registered successfully',
    componentId: metadata.id,
    componentName: metadata.name,
  }, { statusCode: 201 })
})

// ================================
// A/B TESTING ENDPOINTS
// ================================

// A/B testing functionality moved to main GET/POST handlers

// Variant functionality would need separate route file

// ================================
// THEME MANAGEMENT ENDPOINTS
// ================================

// Theme functionality moved to main GET/POST handlers

// Note: Complex sub-routes like [themeId]/apply and [componentId]/load
// would need separate route files in subdirectories for proper Next.js App Router support