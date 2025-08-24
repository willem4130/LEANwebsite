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

// GET /api/components - List all components
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  
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

// POST /api/components - Register a new component
export const POST = withErrorHandling(async (req: NextRequest) => {
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
      dependencies: z.record(z.string()),
      props: z.object({
        schema: z.record(z.any()),
        required: z.array(z.string()).default([]),
        examples: z.array(z.record(z.any())).default([]),
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

// GET /api/components/ab-tests - List A/B tests
export async function GET_AB_TESTS(req: NextRequest) {
  const { searchParams } = new URL(req.url)
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

  return NextResponse.json({
    success: true,
    data: filteredTests,
  })
}

// POST /api/components/ab-tests - Create A/B test
export async function POST_AB_TESTS(req: NextRequest) {
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

  try {
    const testConfig = ABTestSchema.parse(await req.json())
    
    // Validate traffic split sums to 100
    const totalTraffic = testConfig.trafficSplit.reduce((sum, split) => sum + split, 0)
    if (Math.abs(totalTraffic - 100) > 0.01) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_TRAFFIC_SPLIT',
          message: 'Traffic split must sum to 100%',
        },
      }, { status: 400 })
    }

    // Setup the A/B test
    abTestManager.setupTest(testConfig)

    return NextResponse.json({
      success: true,
      data: {
        message: 'A/B test created successfully',
        testId: testConfig.id,
      },
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Invalid test configuration',
      },
    }, { status: 400 })
  }
}

// GET /api/components/ab-tests/[testId]/variant - Get user's variant
export async function GET_VARIANT(req: NextRequest, { params }: { params: { testId: string } }) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'MISSING_USER_ID',
        message: 'userId parameter is required',
      },
    }, { status: 400 })
  }

  const variant = abTestManager.getVariantForUser(params.testId, userId)
  
  if (!variant) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'TEST_NOT_FOUND',
        message: `A/B test ${params.testId} not found or not enabled`,
      },
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      testId: params.testId,
      userId,
      variantId: variant,
    },
  })
}

// ================================
// THEME MANAGEMENT ENDPOINTS
// ================================

// GET /api/components/themes - List themes
export async function GET_THEMES(req: NextRequest) {
  const themes = themeManager.getAllThemes()
  const activeTheme = themeManager.getActiveTheme()

  return NextResponse.json({
    success: true,
    data: {
      themes,
      activeTheme,
    },
  })
}

// POST /api/components/themes - Register theme
export async function POST_THEMES(req: NextRequest) {
  const ThemeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    version: z.string(),
    variables: z.record(z.string()),
    components: z.record(z.object({
      styles: z.record(z.any()),
      variants: z.record(z.any()).optional(),
    })),
    breakpoints: z.record(z.string()),
    typography: z.object({
      fontFamilies: z.record(z.string()),
      fontSizes: z.record(z.string()),
      fontWeights: z.record(z.string()),
      lineHeights: z.record(z.string()),
    }),
    colors: z.record(z.string()),
    spacing: z.record(z.string()),
    shadows: z.record(z.string()),
    animations: z.record(z.string()),
  })

  try {
    const themeConfig = ThemeSchema.parse(await req.json()) as ThemeConfig
    
    themeManager.registerTheme(themeConfig)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Theme registered successfully',
        themeId: themeConfig.id,
        themeName: themeConfig.name,
      },
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Invalid theme configuration',
      },
    }, { status: 400 })
  }
}

// PUT /api/components/themes/[themeId]/apply - Apply theme
export async function PUT_APPLY_THEME(req: NextRequest, { params }: { params: { themeId: string } }) {
  const success = themeManager.applyTheme(params.themeId)
  
  if (!success) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'THEME_NOT_FOUND',
        message: `Theme ${params.themeId} not found`,
      },
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      message: 'Theme applied successfully',
      themeId: params.themeId,
      activeTheme: themeManager.getActiveTheme(),
    },
  })
}

// GET /api/components/themes/[themeId]/css - Generate CSS
export async function GET_THEME_CSS(req: NextRequest, { params }: { params: { themeId: string } }) {
  const css = themeManager.generateCSS(params.themeId)
  
  if (!css) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'THEME_NOT_FOUND',
        message: `Theme ${params.themeId} not found`,
      },
    }, { status: 404 })
  }

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

// ================================
// COMPONENT LOADING ENDPOINTS
// ================================

// GET /api/components/[componentId] - Get component metadata
export async function GET_COMPONENT(req: NextRequest, { params }: { params: { componentId: string } }) {
  const component = componentRegistry.getComponentMetadata(params.componentId)
  
  if (!component) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'COMPONENT_NOT_FOUND',
        message: `Component ${params.componentId} not found`,
      },
    }, { status: 404 })
  }

  const variants = componentRegistry.getVariants(params.componentId)

  return NextResponse.json({
    success: true,
    data: {
      component,
      variants,
    },
  })
}

// POST /api/components/[componentId]/load - Load component
export async function POST_LOAD_COMPONENT(req: NextRequest, { params }: { params: { componentId: string } }) {
  try {
    const component = await componentRegistry.loadComponent(params.componentId)
    
    if (!component) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'COMPONENT_LOAD_FAILED',
          message: `Failed to load component ${params.componentId}`,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Component loaded successfully',
        componentId: params.componentId,
        loaded: true,
      },
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'COMPONENT_LOAD_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error loading component',
      },
    }, { status: 500 })
  }
}

// POST /api/components/[componentId]/hot-swap - Hot swap component
export async function POST_HOT_SWAP(req: NextRequest, { params }: { params: { componentId: string } }) {
  const HotSwapSchema = z.object({
    source: z.object({
      type: z.enum(['local', 'remote', 'cdn', 'marketplace']),
      path: z.string(),
      version: z.string().optional(),
      integrity: z.string().optional(),
    }),
  })

  try {
    const { source } = HotSwapSchema.parse(await req.json())
    
    const success = await componentRegistry.hotSwapComponent(params.componentId, source)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'HOT_SWAP_FAILED',
          message: `Failed to hot-swap component ${params.componentId}`,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Component hot-swapped successfully',
        componentId: params.componentId,
        newSource: source,
      },
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'HOT_SWAP_ERROR',
        message: error instanceof Error ? error.message : 'Hot swap validation failed',
      },
    }, { status: 500 })
  }
}