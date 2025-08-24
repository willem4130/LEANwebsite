/**
 * Dynamic UI Component Management Framework
 * ==========================================
 * 
 * Advanced system for dynamic component loading, hot-swapping,
 * theme management, and A/B testing of UI components
 */

import { z } from 'zod'
import { ComponentType, ReactElement, lazy, Suspense } from 'react'
import { webhookRegistry } from './webhook-integration'

// ================================
// 1. COMPONENT METADATA SYSTEM
// ================================

export const ComponentMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  category: z.enum([
    'layout',
    'navigation',
    'content',
    'media',
    'forms',
    'interactive',
    'data-display',
    'feedback',
    'utility'
  ]),
  tags: z.array(z.string()),
  author: z.object({
    name: z.string(),
    email: z.string().email(),
    url: z.string().url().optional(),
  }),
  license: z.string().default('MIT'),
  dependencies: z.record(z.string()), // package.json style dependencies
  peerDependencies: z.record(z.string()).optional(),
  props: z.object({
    schema: z.record(z.any()), // JSON Schema for props validation
    required: z.array(z.string()).default([]),
    examples: z.array(z.record(z.any())).default([]),
  }),
  styling: z.object({
    cssVariables: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    responsive: z.boolean().default(true),
    darkModeSupport: z.boolean().default(true),
  }),
  performance: z.object({
    bundleSize: z.number().optional(), // in bytes
    loadTime: z.number().optional(), // in milliseconds
    memoryUsage: z.number().optional(), // in bytes
  }).optional(),
  compatibility: z.object({
    react: z.string().default('>=18.0.0'),
    nextjs: z.string().optional(),
    typescript: z.boolean().default(true),
  }),
  marketplace: z.object({
    featured: z.boolean().default(false),
    price: z.number().default(0), // 0 for free
    rating: z.number().min(0).max(5).optional(),
    downloads: z.number().default(0),
    lastUpdated: z.string().datetime(),
  }),
})

export type ComponentMetadata = z.infer<typeof ComponentMetadataSchema>

export const ComponentVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  componentId: z.string(),
  props: z.record(z.any()),
  styling: z.record(z.any()),
  conditions: z.object({
    userSegments: z.array(z.string()).optional(),
    deviceTypes: z.array(z.enum(['mobile', 'tablet', 'desktop'])).optional(),
    timeRange: z.object({
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    }).optional(),
    geography: z.array(z.string()).optional(),
  }).optional(),
})

export type ComponentVariant = z.infer<typeof ComponentVariantSchema>

// ================================
// 2. COMPONENT REGISTRY & LOADER
// ================================

export interface ComponentSource {
  type: 'local' | 'remote' | 'cdn' | 'marketplace'
  path: string
  version?: string
  integrity?: string // For CDN sources
}

export class ComponentRegistry {
  private components: Map<string, ComponentMetadata> = new Map()
  private loadedComponents: Map<string, ComponentType<any>> = new Map()
  private componentSources: Map<string, ComponentSource> = new Map()
  private variants: Map<string, ComponentVariant[]> = new Map()
  private abTests: Map<string, ABTestConfig> = new Map()

  // Register component metadata
  registerComponent(metadata: ComponentMetadata, source: ComponentSource): void {
    const validatedMetadata = ComponentMetadataSchema.parse(metadata)
    this.components.set(metadata.id, validatedMetadata)
    this.componentSources.set(metadata.id, source)
    console.log(`Component registered: ${metadata.name} v${metadata.version}`)
  }

  // Get component metadata
  getComponentMetadata(id: string): ComponentMetadata | null {
    return this.components.get(id) || null
  }

  // List all registered components
  getAllComponents(filters?: {
    category?: string
    tags?: string[]
    author?: string
    featured?: boolean
  }): ComponentMetadata[] {
    let components = Array.from(this.components.values())

    if (filters) {
      if (filters.category) {
        components = components.filter(c => c.category === filters.category)
      }
      if (filters.tags) {
        components = components.filter(c => 
          filters.tags!.some(tag => c.tags.includes(tag))
        )
      }
      if (filters.author) {
        components = components.filter(c => c.author.name === filters.author)
      }
      if (filters.featured !== undefined) {
        components = components.filter(c => c.marketplace.featured === filters.featured)
      }
    }

    return components.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Dynamic component loading
  async loadComponent(id: string): Promise<ComponentType<any> | null> {
    // Check if already loaded
    if (this.loadedComponents.has(id)) {
      return this.loadedComponents.get(id)!
    }

    const source = this.componentSources.get(id)
    const metadata = this.components.get(id)

    if (!source || !metadata) {
      console.error(`Component ${id} not found in registry`)
      return null
    }

    try {
      let component: ComponentType<any>

      switch (source.type) {
        case 'local':
          component = await this.loadLocalComponent(source.path)
          break
        case 'remote':
          component = await this.loadRemoteComponent(source.path, source.version)
          break
        case 'cdn':
          component = await this.loadCDNComponent(source.path, source.integrity)
          break
        case 'marketplace':
          component = await this.loadMarketplaceComponent(id, source.path)
          break
        default:
          throw new Error(`Unknown component source type: ${(source as any).type}`)
      }

      // Cache the loaded component
      this.loadedComponents.set(id, component)

      // Emit load event
      webhookRegistry.emitEvent({
        type: 'custom',
        source: 'component-registry',
        data: {
          action: 'component_loaded',
          componentId: id,
          componentName: metadata.name,
          version: metadata.version,
        },
      })

      return component
    } catch (error) {
      console.error(`Failed to load component ${id}:`, error)
      return null
    }
  }

  // Hot-swap component (for development/testing)
  async hotSwapComponent(id: string, newSource: ComponentSource): Promise<boolean> {
    try {
      // Remove from cache
      this.loadedComponents.delete(id)
      
      // Update source
      this.componentSources.set(id, newSource)
      
      // Reload component
      const component = await this.loadComponent(id)
      
      if (component) {
        // Emit hot swap event
        webhookRegistry.emitEvent({
          type: 'custom',
          source: 'component-registry',
          data: {
            action: 'component_hot_swapped',
            componentId: id,
          },
        })
        return true
      }
      return false
    } catch (error) {
      console.error(`Failed to hot-swap component ${id}:`, error)
      return false
    }
  }

  // Component loading methods
  private async loadLocalComponent(path: string): Promise<ComponentType<any>> {
    const module = await import(path)
    return module.default || module
  }

  private async loadRemoteComponent(url: string, version?: string): Promise<ComponentType<any>> {
    const fullUrl = version ? `${url}@${version}` : url
    const response = await fetch(fullUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch component from ${fullUrl}`)
    }

    const code = await response.text()
    
    // Create a dynamic module (this is simplified - in production you'd want
    // proper sandboxing and security measures)
    const module = new Function('require', 'module', 'exports', code)
    const moduleExports = {}
    module(require, { exports: moduleExports }, moduleExports)
    
    return (moduleExports as any).default || moduleExports
  }

  private async loadCDNComponent(url: string, integrity?: string): Promise<ComponentType<any>> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.async = true
      
      if (integrity) {
        script.integrity = integrity
        script.crossOrigin = 'anonymous'
      }

      script.onload = () => {
        // Assume the component is available on window
        const componentName = url.split('/').pop()?.replace(/[^a-zA-Z]/g, '')
        const component = (window as any)[componentName]
        if (component) {
          resolve(component)
        } else {
          reject(new Error(`Component not found on window: ${componentName}`))
        }
      }

      script.onerror = () => {
        reject(new Error(`Failed to load script from ${url}`))
      }

      document.head.appendChild(script)
    })
  }

  private async loadMarketplaceComponent(id: string, path: string): Promise<ComponentType<any>> {
    // This would integrate with the marketplace API
    const response = await fetch(`/api/marketplace/components/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to load marketplace component ${id}`)
    }

    const componentData = await response.json()
    // Process and load the component...
    return lazy(() => import(componentData.bundleUrl))
  }

  // Variant management
  registerVariant(variant: ComponentVariant): void {
    const validatedVariant = ComponentVariantSchema.parse(variant)
    const variants = this.variants.get(variant.componentId) || []
    variants.push(validatedVariant)
    this.variants.set(variant.componentId, variants)
  }

  getVariants(componentId: string): ComponentVariant[] {
    return this.variants.get(componentId) || []
  }

  // A/B Testing integration
  setupABTest(config: ABTestConfig): void {
    this.abTests.set(config.id, config)
  }

  getABTestVariant(testId: string, userId: string): ComponentVariant | null {
    const test = this.abTests.get(testId)
    if (!test || !test.enabled) return null

    // Simple hash-based assignment
    const hash = this.hashString(`${testId}-${userId}`)
    const bucketIndex = hash % test.variants.length
    const variantId = test.variants[bucketIndex]
    
    // Find the variant
    for (const variants of this.variants.values()) {
      const variant = variants.find(v => v.id === variantId)
      if (variant) return variant
    }

    return null
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
}

// ================================
// 3. A/B TESTING FRAMEWORK
// ================================

export const ABTestConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean().default(true),
  variants: z.array(z.string()), // Array of variant IDs
  trafficSplit: z.array(z.number()).default([50, 50]), // Percentage split
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  targetMetrics: z.array(z.string()), // Metrics to track
  conditions: z.object({
    userSegments: z.array(z.string()).optional(),
    deviceTypes: z.array(z.string()).optional(),
    geography: z.array(z.string()).optional(),
  }).optional(),
})

export type ABTestConfig = z.infer<typeof ABTestConfigSchema>

export class ABTestManager {
  private tests: Map<string, ABTestConfig> = new Map()
  private assignments: Map<string, Map<string, string>> = new Map() // userId -> testId -> variantId

  setupTest(config: ABTestConfig): void {
    const validatedConfig = ABTestConfigSchema.parse(config)
    this.tests.set(config.id, validatedConfig)
  }

  getVariantForUser(testId: string, userId: string): string | null {
    const test = this.tests.get(testId)
    if (!test || !test.enabled) return null

    // Check if user already has assignment
    const userAssignments = this.assignments.get(userId) || new Map()
    if (userAssignments.has(testId)) {
      return userAssignments.get(testId)!
    }

    // Assign variant based on traffic split
    const hash = this.hashString(`${testId}-${userId}`)
    const percentage = (hash % 100) + 1

    let cumulative = 0
    for (let i = 0; i < test.variants.length; i++) {
      cumulative += test.trafficSplit[i] || 0
      if (percentage <= cumulative) {
        const variantId = test.variants[i]
        
        // Store assignment
        userAssignments.set(testId, variantId)
        this.assignments.set(userId, userAssignments)
        
        return variantId
      }
    }

    return test.variants[0] // Fallback
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }
}

// ================================
// 4. THEME MANAGEMENT SYSTEM
// ================================

export const ThemeConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  variables: z.record(z.string()), // CSS custom properties
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

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>

export class ThemeManager {
  private themes: Map<string, ThemeConfig> = new Map()
  private activeTheme: string | null = null

  registerTheme(config: ThemeConfig): void {
    const validatedConfig = ThemeConfigSchema.parse(config)
    this.themes.set(config.id, validatedConfig)
  }

  getTheme(id: string): ThemeConfig | null {
    return this.themes.get(id) || null
  }

  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values())
  }

  applyTheme(themeId: string): boolean {
    const theme = this.themes.get(themeId)
    if (!theme) return false

    // Apply CSS custom properties
    const root = document.documentElement
    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key.startsWith('--') ? key : `--${key}`, value)
    })

    // Apply component styles (this would integrate with your styling system)
    this.applyComponentStyles(theme)

    this.activeTheme = themeId

    // Emit theme change event
    webhookRegistry.emitEvent({
      type: 'custom',
      source: 'theme-manager',
      data: {
        action: 'theme_applied',
        themeId,
        themeName: theme.name,
      },
    })

    return true
  }

  private applyComponentStyles(theme: ThemeConfig): void {
    // This would integrate with your component styling system
    // For example, updating CSS-in-JS theme provider or injecting CSS
    console.log(`Applying component styles for theme: ${theme.name}`)
  }

  getActiveTheme(): string | null {
    return this.activeTheme
  }

  // Generate CSS from theme
  generateCSS(themeId: string): string {
    const theme = this.themes.get(themeId)
    if (!theme) return ''

    const cssRules = [
      ':root {',
      ...Object.entries(theme.variables).map(([key, value]) => 
        `  ${key.startsWith('--') ? key : `--${key}`}: ${value};`
      ),
      '}',
      '',
    ]

    // Add component styles
    Object.entries(theme.components).forEach(([component, config]) => {
      cssRules.push(`.${component} {`)
      Object.entries(config.styles).forEach(([property, value]) => {
        cssRules.push(`  ${property}: ${value};`)
      })
      cssRules.push('}', '')

      // Add variants
      if (config.variants) {
        Object.entries(config.variants).forEach(([variant, styles]) => {
          cssRules.push(`.${component}--${variant} {`)
          Object.entries(styles as Record<string, any>).forEach(([property, value]) => {
            cssRules.push(`  ${property}: ${value};`)
          })
          cssRules.push('}', '')
        })
      }
    })

    return cssRules.join('\n')
  }
}

// ================================
// 5. REACT INTEGRATION COMPONENTS
// ================================

import React from 'react'

// Dynamic component loader component
// ================================
// DYNAMIC COMPONENT
// ================================
// 
// NOTE: DynamicComponent has been moved to /src/components/DynamicComponent.tsx
// Import from there for client-side components that need React hooks and JSX

// ================================
// A/B TEST COMPONENT
// ================================
// 
// NOTE: ABTestComponent has been moved to /src/components/ABTestComponent.tsx
// Import from there for client-side components that need React hooks and JSX

// ================================
// 6. GLOBAL INSTANCES & SETUP
// ================================

export const componentRegistry = new ComponentRegistry()
export const abTestManager = new ABTestManager()
export const themeManager = new ThemeManager()

// Default component registration
export function registerDefaultComponents() {
  // Register built-in components
  const builtInComponents = [
    {
      metadata: {
        id: 'hero-section',
        name: 'Hero Section',
        version: '1.0.0',
        description: 'A customizable hero section component',
        category: 'layout' as const,
        tags: ['hero', 'banner', 'landing'],
        author: {
          name: 'LEAN CMS',
          email: 'dev@lean-cms.com',
        },
        license: 'MIT',
        dependencies: {},
        props: {
          schema: {
            title: { type: 'string', required: true },
            subtitle: { type: 'string' },
            backgroundImage: { type: 'string' },
            ctaText: { type: 'string' },
            ctaUrl: { type: 'string' },
          },
          required: ['title'],
          examples: [
            {
              title: 'Welcome to Our Site',
              subtitle: 'Discover amazing content',
              ctaText: 'Get Started',
              ctaUrl: '/signup',
            },
          ],
        },
        styling: {
          cssVariables: ['--hero-bg-color', '--hero-text-color'],
          themes: ['default', 'dark', 'neon'],
          responsive: true,
          darkModeSupport: true,
        },
        compatibility: {
          react: '>=18.0.0',
          nextjs: '>=13.0.0',
          typescript: true,
        },
        marketplace: {
          featured: true,
          price: 0,
          lastUpdated: new Date().toISOString(),
          downloads: 0,
        },
      },
      source: {
        type: 'local' as const,
        path: '@/components/sections/HeroSection',
      },
    },
  ]

  builtInComponents.forEach(({ metadata, source }) => {
    componentRegistry.registerComponent(metadata, source)
  })
}

// Initialize the system
registerDefaultComponents()