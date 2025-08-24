/**
 * Enhanced Payload CMS Integration Tests
 * ====================================
 * 
 * Comprehensive integration tests for the enhanced LEAN framework:
 * - Type-safe API clients
 * - Real-time data synchronization
 * - Dynamic component rendering
 * - Performance optimization
 * - Error handling and recovery
 * - Plugin architecture
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/testing-library/jest-dom'
import { render, screen, waitFor, act } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'

// Import our enhanced framework components
import { typeSafeApiClient } from '@/lib/type-safe-data-flow'
import { enhancedApiClient, realtimeManager, cacheManager } from '@/lib/enhanced-api-framework'
import { dynamicRenderer, componentRegistry } from '@/lib/dynamic-renderer'
import { performanceMonitor, cacheManager as perfCacheManager } from '@/lib/performance-optimization'
import { pluginManager } from '@/lib/plugin-architecture'
import SectionManager from '@/components/sections/SectionManager'
import NavigationManager from '@/components/sections/NavigationManager'

// Mock data
const mockPageSection = {
  id: 'section-1',
  sectionName: 'Hero Section',
  sectionId: 'hero-home',
  sectionType: 'hero' as const,
  page: ['homepage'] as const,
  enabled: true,
  order: 0,
  content: {
    heroContent: {
      headline: 'Welcome to LEAN Framework',
      subheadline: 'Enterprise-level website management',
      description: '<p>Build and manage websites with complete control.</p>',
      ctaButtons: [
        {
          text: 'Get Started',
          href: '/docs',
          style: 'primary' as const,
          newTab: false,
        }
      ],
    }
  },
  styling: {
    containerWidth: 'container' as const,
    padding: {
      top: 'lg' as const,
      bottom: 'lg' as const,
    },
    backgroundColor: '#ffffff',
  },
  animations: {
    entranceAnimation: 'fadeIn' as const,
    animationDelay: 0,
    animationDuration: 600,
  },
  createdAt: '2023-12-01T00:00:00.000Z',
  updatedAt: '2023-12-01T00:00:00.000Z',
}

const mockComponentLibrary = {
  id: 'comp-1',
  componentName: 'HeroComponent',
  displayName: 'Hero Component',
  description: 'A customizable hero section component',
  category: 'content' as const,
  version: '1.0.0',
  status: 'stable' as const,
  implementation: {
    framework: 'react' as const,
    sourceCode: 'export const HeroComponent = (props) => <div>{props.headline}</div>',
    dependencies: [],
  },
  propsSchema: {
    headline: { type: 'string', required: true },
    subheadline: { type: 'string', required: false },
  },
  preview: {
    screenshot: {
      id: 'img-1',
      url: '/preview.jpg',
      filename: 'preview.jpg',
      mimeType: 'image/jpeg',
      filesize: 50000,
      createdAt: '2023-12-01T00:00:00.000Z',
      updatedAt: '2023-12-01T00:00:00.000Z',
    }
  },
  accessibility: {
    wcagLevel: 'AA' as const,
    keyboardNavigation: true,
    screenReaderSupport: true,
    colorContrastCompliant: true,
  },
  responsive: {
    breakpoints: ['mobile', 'tablet', 'desktop'] as const,
    mobileOptimized: true,
  },
  configuration: {
    configurable: true,
    adminInterface: 'form' as const,
  },
  integrations: {},
  performance: {
    lazyLoading: false,
    serverSideRendering: true,
  },
  seo: {
    seoFriendly: true,
  },
  documentation: {},
  testing: {},
  createdAt: '2023-12-01T00:00:00.000Z',
  updatedAt: '2023-12-01T00:00:00.000Z',
}

const mockThemeSettings = {
  id: 'theme-1',
  themeName: 'default-theme',
  displayName: 'Default Theme',
  version: '1.0.0',
  status: 'production' as const,
  isDefault: true,
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
      contrast: '#ffffff',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    neutral: {
      white: '#ffffff',
      black: '#000000',
      gray100: '#f3f4f6',
      gray500: '#6b7280',
      gray900: '#111827',
    },
  },
  typography: {
    fontFamilies: {
      primary: 'Inter, sans-serif',
      headings: 'Inter, sans-serif',
      monospace: '"Fira Code", monospace',
    },
    fontSizes: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
    },
    fontWeights: {
      normal: 400,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  spacing: {
    base: '1rem',
    scale: {
      '1': '0.25rem',
      '4': '1rem',
      '8': '2rem',
    },
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  containers: {
    maxWidths: {
      container: '1024px',
      wide: '1280px',
    },
    padding: {
      mobile: '1rem',
      desktop: '2rem',
    },
  },
  components: {
    buttons: {
      borderRadius: '0.375rem',
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
      },
      fontSize: {
        sm: '0.875rem',
        md: '1rem',
      },
      fontWeight: 500,
      variants: {
        primary: {
          background: 'var(--color-primary)',
          color: 'white',
        },
      },
    },
    cards: {
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
    },
    forms: {
      inputBorderRadius: '0.375rem',
      inputPadding: '0.75rem 1rem',
      inputBorder: '1px solid #d1d5db',
      inputFocusBorder: '2px solid #3b82f6',
      labelFontWeight: 500,
    },
  },
  generateUtilities: true,
  createdAt: '2023-12-01T00:00:00.000Z',
  updatedAt: '2023-12-01T00:00:00.000Z',
}

const mockNavigationData = {
  primaryNavigation: [
    {
      id: 'nav-1',
      label: 'Home',
      type: 'internal' as const,
      href: '/',
      order: 0,
      enabled: true,
    },
    {
      id: 'nav-2',
      label: 'About',
      type: 'internal' as const,
      href: '/about',
      order: 1,
      enabled: true,
    },
    {
      id: 'nav-3',
      label: 'Contact',
      type: 'internal' as const,
      href: '/contact',
      order: 2,
      enabled: true,
    },
  ],
  socialLinks: [
    {
      platform: 'instagram',
      url: 'https://instagram.com/example',
      username: 'example',
    },
  ],
}

// MSW server setup
const server = setupServer(
  // Page Sections API
  rest.get('/api/page-sections', (req, res, ctx) => {
    const page = req.url.searchParams.get('page')
    let sections = [mockPageSection]
    
    if (page && page !== 'homepage') {
      sections = sections.filter(section => section.page.includes(page as any))
    }
    
    return res(ctx.json({
      success: true,
      data: sections,
      timestamp: Date.now(),
      meta: {
        timestamp: new Date().toISOString(),
        requestId: 'req_test_123',
        version: '2.0.0'
      }
    }))
  }),

  rest.get('/api/page-sections/:id', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: mockPageSection,
      timestamp: Date.now(),
    }))
  }),

  rest.post('/api/page-sections', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: { ...mockPageSection, id: 'new-section' },
      timestamp: Date.now(),
    }))
  }),

  // Component Library API
  rest.get('/api/component-library', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: [mockComponentLibrary],
      timestamp: Date.now(),
    }))
  }),

  // Theme Settings API
  rest.get('/api/theme-settings', (req, res, ctx) => {
    const isDefault = req.url.searchParams.get('isDefault')
    
    if (isDefault === 'true') {
      return res(ctx.json({
        success: true,
        data: mockThemeSettings,
        timestamp: Date.now(),
      }))
    }
    
    return res(ctx.json({
      success: true,
      data: [mockThemeSettings],
      timestamp: Date.now(),
    }))
  }),

  // Navigation API
  rest.get('/api/navigation', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      data: mockNavigationData,
      timestamp: Date.now(),
    }))
  }),
)

// Test setup
beforeAll(() => {
  server.listen()
  
  // Register a test component
  componentRegistry.register('HeroComponent', {
    component: ({ headline, subheadline }: any) => (
      <div data-testid="hero-component">
        <h1>{headline}</h1>
        {subheadline && <p>{subheadline}</p>}
      </div>
    ),
    propsSchema: mockComponentLibrary.propsSchema,
  })
})

afterAll(() => {
  server.close()
})

beforeEach(() => {
  // Clear caches
  cacheManager.clear()
  
  // Reset performance metrics
  performanceMonitor.stop()
  performanceMonitor.start()
})

// ================================
// INTEGRATION TESTS
// ================================

describe('Enhanced Payload CMS Integration', () => {
  describe('Type-Safe API Client', () => {
    it('should fetch page sections with type validation', async () => {
      const response = await typeSafeApiClient.getPageSections('homepage')
      
      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(1)
      expect(response.data![0]).toMatchObject({
        id: 'section-1',
        sectionName: 'Hero Section',
        sectionType: 'hero',
        page: ['homepage'],
        enabled: true,
      })
    })

    it('should fetch component library with validation', async () => {
      const response = await typeSafeApiClient.getComponents()
      
      expect(response.success).toBe(true)
      expect(response.data).toHaveLength(1)
      expect(response.data![0]).toMatchObject({
        componentName: 'HeroComponent',
        status: 'stable',
        category: 'content',
      })
    })

    it('should fetch theme settings with validation', async () => {
      const response = await typeSafeApiClient.getDefaultTheme()
      
      expect(response.success).toBe(true)
      expect(response.data).toMatchObject({
        themeName: 'default-theme',
        isDefault: true,
        status: 'production',
      })
    })

    it('should handle validation errors gracefully', async () => {
      // Mock invalid data
      server.use(
        rest.get('/api/page-sections', (req, res, ctx) => {
          return res(ctx.json({
            success: true,
            data: [{ ...mockPageSection, sectionType: 'invalid-type' }],
            timestamp: Date.now(),
          }))
        })
      )

      await expect(typeSafeApiClient.getPageSections()).rejects.toThrow()
    })
  })

  describe('Real-time Data Synchronization', () => {
    it('should set up real-time subscriptions', async () => {
      let eventReceived = false
      
      const unsubscribe = realtimeManager.subscribe('page-sections', (event) => {
        eventReceived = true
        expect(event.type).toBe('data_change')
        expect(event.action).toBe('update')
      })

      // Simulate real-time event
      realtimeManager.broadcast('page-sections', {
        type: 'data_change',
        action: 'update',
        data: mockPageSection,
        metadata: {
          timestamp: Date.now(),
          source: 'test',
        },
      })

      await waitFor(() => {
        expect(eventReceived).toBe(true)
      })

      unsubscribe()
    })

    it('should handle cache invalidation on data changes', async () => {
      // First, cache some data
      await cacheManager.set('test-key', { data: 'test' }, { tags: ['page-sections'] })
      
      let cached = await cacheManager.get('test-key')
      expect(cached).toEqual({ data: 'test' })

      // Simulate data change that should invalidate cache
      await cacheManager.invalidateByTag('page-sections')
      
      cached = await cacheManager.get('test-key')
      expect(cached).toBeNull()
    })
  })

  describe('Dynamic Component Rendering', () => {
    it('should render sections dynamically', () => {
      render(
        <SectionManager 
          page="homepage"
          theme={mockThemeSettings}
          enableAnalytics={false}
        />
      )

      expect(screen.getByText('Welcome to LEAN Framework')).toBeInTheDocument()
      expect(screen.getByText('Enterprise-level website management')).toBeInTheDocument()
    })

    it('should render navigation with real-time updates', () => {
      render(
        <NavigationManager 
          variant="header"
          theme={mockThemeSettings}
          enableAnalytics={false}
        />
      )

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('should handle component errors gracefully', () => {
      // Register a component that throws an error
      componentRegistry.register('ErrorComponent', {
        component: () => {
          throw new Error('Test component error')
        },
        propsSchema: {},
      })

      // Mock section with error component
      const errorSection = {
        ...mockPageSection,
        sectionType: 'custom' as const,
        content: {
          customContent: {
            componentName: 'ErrorComponent',
            props: {},
          },
        },
      }

      server.use(
        rest.get('/api/page-sections', (req, res, ctx) => {
          return res(ctx.json({
            success: true,
            data: [errorSection],
            timestamp: Date.now(),
          }))
        })
      )

      render(
        <SectionManager 
          page="homepage"
          theme={mockThemeSettings}
        />
      )

      expect(screen.getByText(/Component Error/)).toBeInTheDocument()
    })
  })

  describe('Performance Optimization', () => {
    it('should cache API responses', async () => {
      // Clear any existing cache
      await cacheManager.clear()

      // First request should not be cached
      const response1 = await enhancedApiClient.get('/page-sections', { cache: true })
      expect(response1.cached).toBeFalsy()

      // Second request should be cached
      const response2 = await enhancedApiClient.get('/page-sections', { cache: true })
      expect(response2.cached).toBeTruthy()
    })

    it('should track performance metrics', async () => {
      const startTime = Date.now()
      
      performanceMonitor.recordMetrics({
        lcp: 1500,
        fid: 50,
        cls: 0.05,
        apiResponseTime: 200,
        cacheHitRate: 0.9,
        url: '/test',
      })

      const metrics = performanceMonitor.getMetrics()
      expect(metrics.length).toBeGreaterThan(0)
      expect(metrics[0].lcp).toBe(1500)
      expect(metrics[0].cacheHitRate).toBe(0.9)
    })

    it('should alert on performance budget violations', async () => {
      let alertReceived = false
      
      performanceMonitor.on('budget:violation', (data) => {
        alertReceived = true
        expect(data.violations.length).toBeGreaterThan(0)
      })

      // Record metrics that violate budget
      performanceMonitor.recordMetrics({
        lcp: 5000, // Over budget (2500ms)
        fid: 200,  // Over budget (100ms)
        cls: 0.05,
        url: '/test',
      })

      await waitFor(() => {
        expect(alertReceived).toBe(true)
      })
    })
  })

  describe('Error Handling and Recovery', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      server.use(
        rest.get('/api/page-sections', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Database connection failed',
            },
          }))
        })
      )

      render(
        <SectionManager 
          page="homepage"
          theme={mockThemeSettings}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/Unable to Load Sections/)).toBeInTheDocument()
      })
    })

    it('should retry failed requests', async () => {
      let requestCount = 0
      
      server.use(
        rest.get('/api/page-sections', (req, res, ctx) => {
          requestCount++
          
          if (requestCount < 3) {
            return res(ctx.status(500), ctx.json({ success: false }))
          }
          
          return res(ctx.json({
            success: true,
            data: [mockPageSection],
            timestamp: Date.now(),
          }))
        })
      )

      const response = await enhancedApiClient.get('/page-sections')
      expect(response.success).toBe(true)
      expect(requestCount).toBe(3) // Should have retried twice
    })
  })

  describe('Plugin Architecture', () => {
    it('should register and execute plugin hooks', async () => {
      let hookExecuted = false
      
      // Register a test plugin
      const testPlugin = {
        manifest: {
          name: 'test-plugin',
          version: '1.0.0',
          description: 'Test plugin',
          author: 'Test',
          license: 'MIT',
          keywords: [],
          category: 'utilities' as const,
          compatibility: {
            leanFramework: '^2.0.0',
            node: '^18.0.0',
          },
          main: 'index.js',
        },
        hooks: {
          beforeRequest: async (config: any) => {
            hookExecuted = true
            return config
          },
        },
      }

      await pluginManager.install('/mock/plugin/path', testPlugin)
      await pluginManager.enable('test-plugin')

      // Execute hook
      await pluginManager.executeHook('beforeRequest', { endpoint: '/test' })

      expect(hookExecuted).toBe(true)
    })

    it('should handle plugin errors without breaking the system', async () => {
      const errorPlugin = {
        manifest: {
          name: 'error-plugin',
          version: '1.0.0',
          description: 'Error plugin',
          author: 'Test',
          license: 'MIT',
          keywords: [],
          category: 'utilities' as const,
          compatibility: {
            leanFramework: '^2.0.0',
            node: '^18.0.0',
          },
          main: 'index.js',
        },
        hooks: {
          beforeRequest: async () => {
            throw new Error('Plugin error')
          },
        },
      }

      await pluginManager.install('/mock/error/plugin/path', errorPlugin)
      await pluginManager.enable('error-plugin')

      // Should not throw, but continue execution
      const results = await pluginManager.executeHook('beforeRequest', { endpoint: '/test' })
      expect(results).toEqual([])
    })
  })

  describe('Complete Integration Flow', () => {
    it('should handle complete user flow with real-time updates', async () => {
      // Initial render
      const { rerender } = render(
        <SectionManager 
          page="homepage"
          theme={mockThemeSettings}
          enableAnalytics={true}
        />
      )

      // Check initial content
      await waitFor(() => {
        expect(screen.getByText('Welcome to LEAN Framework')).toBeInTheDocument()
      })

      // Simulate real-time content update
      const updatedSection = {
        ...mockPageSection,
        content: {
          heroContent: {
            ...mockPageSection.content.heroContent,
            headline: 'Updated LEAN Framework',
          },
        },
      }

      // Mock updated API response
      server.use(
        rest.get('/api/page-sections', (req, res, ctx) => {
          return res(ctx.json({
            success: true,
            data: [updatedSection],
            timestamp: Date.now(),
          }))
        })
      )

      // Simulate real-time event
      act(() => {
        realtimeManager.broadcast('page-sections', {
          type: 'data_change',
          action: 'update',
          data: updatedSection,
          metadata: {
            timestamp: Date.now(),
            source: 'cms_admin',
          },
        })
      })

      // Content should update
      await waitFor(() => {
        expect(screen.getByText('Updated LEAN Framework')).toBeInTheDocument()
      })
    })

    it('should maintain performance during high-frequency updates', async () => {
      const startTime = performance.now()
      
      // Simulate multiple rapid updates
      for (let i = 0; i < 100; i++) {
        realtimeManager.broadcast('page-sections', {
          type: 'data_change',
          action: 'update',
          data: { ...mockPageSection, id: `section-${i}` },
          metadata: {
            timestamp: Date.now(),
            source: 'load_test',
          },
        })
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (< 100ms)
      expect(duration).toBeLessThan(100)
    })
  })
})

// ================================
// PERFORMANCE TESTS
// ================================

describe('Performance Benchmarks', () => {
  it('should render 100 sections within performance budget', async () => {
    const sections = Array.from({ length: 100 }, (_, i) => ({
      ...mockPageSection,
      id: `section-${i}`,
      sectionName: `Section ${i}`,
      order: i,
    }))

    server.use(
      rest.get('/api/page-sections', (req, res, ctx) => {
        return res(ctx.json({
          success: true,
          data: sections,
          timestamp: Date.now(),
        }))
      })
    )

    const startTime = performance.now()
    
    render(
      <SectionManager 
        page="homepage"
        theme={mockThemeSettings}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Section 0')).toBeInTheDocument()
    })

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render within 1 second
    expect(renderTime).toBeLessThan(1000)
  })

  it('should handle cache operations efficiently', async () => {
    const startTime = performance.now()
    
    // Perform 1000 cache operations
    for (let i = 0; i < 1000; i++) {
      await cacheManager.set(`key-${i}`, { data: `value-${i}` })
      await cacheManager.get(`key-${i}`)
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    // Should complete within 100ms
    expect(duration).toBeLessThan(100)
  })
})