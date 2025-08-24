/**
 * Type-Safe Data Flow - Enterprise Payload CMS Integration
 * =======================================================
 * 
 * Complete type safety between frontend and Payload CMS with:
 * - Auto-generated TypeScript types from Payload collections
 * - Zod schema validation for runtime safety
 * - Type-safe API clients with full intellisense
 * - Real-time type synchronization
 * - Schema migration handling
 * - Performance-optimized serialization
 * 
 * Enterprise features:
 * - Schema versioning
 * - Type compatibility checking
 * - Automated type generation
 * - Runtime type validation
 * - Development-time type checking
 */

import { z } from 'zod'
import type { CollectionConfig } from 'payload'

// ================================
// 1. PAYLOAD TYPE GENERATION
// ================================

// Base Payload document interface
export interface PayloadDocument {
  id: string
  createdAt: string
  updatedAt: string
}

// Media type from Payload
export interface PayloadMedia extends PayloadDocument {
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  thumbnailURL?: string
  alt?: string
}

// User type from Payload
export interface PayloadUser extends PayloadDocument {
  email: string
  role: 'admin' | 'user'
  firstName?: string
  lastName?: string
  avatar?: PayloadMedia
}

// Generated types for our enhanced collections
export interface PayloadPageSection extends PayloadDocument {
  sectionName: string
  sectionId: string
  sectionType: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'cta' | 'music' | 'events' | 'team' | 'blog' | 'stats' | 'faq' | 'newsletter' | 'social' | 'custom' | 'html'
  page: Array<'homepage' | 'about' | 'music' | 'gallery' | 'tour' | 'contact' | 'blog' | 'global'>
  enabled: boolean
  order: number
  content: Record<string, any>
  styling?: {
    containerWidth?: 'full' | 'wide' | 'container' | 'narrow'
    padding?: {
      top?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
      bottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    }
    backgroundColor?: string
    textColor?: string
    backgroundImage?: PayloadMedia
    customBackgroundColor?: string
    customTextColor?: string
  }
  animations?: {
    entranceAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn'
    animationDelay?: number
    animationDuration?: number
  }
  conditions?: {
    deviceVisibility?: Array<'desktop' | 'tablet' | 'mobile'>
    userRoles?: Array<'public' | 'user' | 'admin'>
    dateRange?: {
      startDate?: string
      endDate?: string
    }
  }
  seo?: {
    seoTitle?: string
    seoDescription?: string
    structuredData?: Record<string, any>
  }
  analytics?: {
    trackingEvents?: Array<{
      eventType: 'view' | 'click' | 'scroll' | 'submit'
      eventName: string
      eventCategory?: string
    }>
  }
  abTesting?: {
    enabled: boolean
    testName?: string
    variants?: Array<{
      name: string
      weight: number
      contentOverride?: Record<string, any>
    }>
  }
}

export interface PayloadComponentLibrary extends PayloadDocument {
  componentName: string
  displayName: string
  description: string
  category: 'layout' | 'navigation' | 'content' | 'interactive' | 'media' | 'forms' | 'ecommerce' | 'social' | 'analytics' | 'third-party' | 'custom'
  version: string
  status: 'development' | 'testing' | 'stable' | 'deprecated'
  tags?: string
  implementation: {
    framework: 'react' | 'vue' | 'svelte' | 'vanilla' | 'web-component'
    sourceCode: string
    styles?: string
    dependencies: Array<{
      package: string
      version: string
      required: boolean
    }>
  }
  propsSchema: Record<string, any>
  defaultProps?: Record<string, any>
  exampleUsage?: string
  preview: {
    screenshot: PayloadMedia
    thumbnails?: Array<{
      variant: string
      image: PayloadMedia
    }>
    liveDemo?: string
  }
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA' | 'not-tested'
    keyboardNavigation: boolean
    screenReaderSupport: boolean
    colorContrastCompliant: boolean
    ariaLabels?: Record<string, any>
  }
  responsive: {
    breakpoints: Array<'mobile' | 'tablet' | 'desktop' | 'large'>
    mobileOptimized: boolean
  }
  configuration: {
    configurable: boolean
    configSchema?: Record<string, any>
    adminInterface: 'form' | 'visual' | 'code' | 'json'
    presets?: Array<{
      name: string
      description?: string
      config: Record<string, any>
      preview?: PayloadMedia
    }>
  }
  integrations: {
    cmsFields?: Record<string, any>
    apiEndpoints?: Array<{
      name: string
      endpoint: string
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      required: boolean
    }>
    thirdPartyServices?: Array<{
      service: string
      purpose?: string
      apiKeyRequired: boolean
      configFields?: Record<string, any>
    }>
  }
  performance: {
    bundleSize?: number
    renderTime?: number
    cacheStrategy?: 'static' | 'dynamic' | 'isr' | 'no-cache'
    lazyLoading: boolean
    serverSideRendering: boolean
  }
  seo: {
    seoFriendly: boolean
    structuredData?: Record<string, any>
    metaTags?: Record<string, any>
  }
  documentation: {
    readme?: string
    installation?: string
    apiDocs?: Record<string, any>
    examples?: Array<{
      title: string
      description?: string
      code?: string
      liveDemo?: string
    }>
    changelog?: Array<{
      version: string
      date: string
      changes: string
      breakingChanges: boolean
    }>
  }
  testing: {
    testCoverage?: number
    testFiles?: string
    e2eTests?: string
  }
}

export interface PayloadThemeSettings extends PayloadDocument {
  themeName: string
  displayName: string
  description?: string
  version: string
  status: 'development' | 'testing' | 'production' | 'deprecated'
  isDefault: boolean
  previewImage?: PayloadMedia
  colors: {
    primary: {
      main: string
      light?: string
      dark?: string
      contrast?: string
    }
    secondary: {
      main: string
      light?: string
      dark?: string
      contrast?: string
    }
    accent?: {
      main: string
      light?: string
      dark?: string
      contrast?: string
    }
    semantic: {
      success?: string
      warning?: string
      error?: string
      info?: string
    }
    neutral: {
      white?: string
      black?: string
      gray50?: string
      gray100?: string
      gray200?: string
      gray300?: string
      gray400?: string
      gray500?: string
      gray600?: string
      gray700?: string
      gray800?: string
      gray900?: string
    }
    custom?: Array<{
      name: string
      value: string
      description?: string
    }>
  }
  typography: {
    fontFamilies: {
      primary: string
      customPrimary?: string
      headings: string
      customHeadings?: string
      monospace: string
    }
    fontSizes: Record<string, string>
    fontWeights: Record<string, number>
    lineHeights: Record<string, string>
  }
  spacing: {
    base: string
    scale: Record<string, string>
  }
  breakpoints: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  containers: {
    maxWidths: Record<string, string>
    padding: Record<string, string>
  }
  components: {
    buttons: {
      borderRadius: string
      padding: Record<string, string>
      fontSize: Record<string, string>
      fontWeight: number
      variants: Record<string, any>
    }
    cards: {
      borderRadius: string
      padding: string
      shadow: string
      border: string
    }
    forms: {
      inputBorderRadius: string
      inputPadding: string
      inputBorder: string
      inputFocusBorder: string
      labelFontWeight: number
    }
  }
  animations?: {
    enabled: boolean
    duration?: Record<string, string>
    easing?: Record<string, string>
    presets?: Record<string, any>
  }
  darkMode?: {
    enabled: boolean
    strategy: 'css-vars' | 'css-classes' | 'data-attrs'
    colorOverrides?: Record<string, string>
  }
  customCSS?: string
  cssVariables?: Record<string, any>
  generateUtilities: boolean
  purgeCSS?: {
    enabled: boolean
    safelist?: Array<{ pattern: string }>
  }
}

// ================================
// 2. ZOD SCHEMA DEFINITIONS
// ================================

// Media schema
export const PayloadMediaSchema = z.object({
  id: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  filesize: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  url: z.string().url(),
  thumbnailURL: z.string().url().optional(),
  alt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// User schema
export const PayloadUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: PayloadMediaSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Page Section schema
export const PayloadPageSectionSchema = z.object({
  id: z.string(),
  sectionName: z.string().min(1),
  sectionId: z.string().min(1),
  sectionType: z.enum(['hero', 'about', 'services', 'gallery', 'testimonials', 'contact', 'cta', 'music', 'events', 'team', 'blog', 'stats', 'faq', 'newsletter', 'social', 'custom', 'html']),
  page: z.array(z.enum(['homepage', 'about', 'music', 'gallery', 'tour', 'contact', 'blog', 'global'])),
  enabled: z.boolean(),
  order: z.number(),
  content: z.record(z.string(), z.any()),
  styling: z.object({
    containerWidth: z.enum(['full', 'wide', 'container', 'narrow']).optional(),
    padding: z.object({
      top: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
      bottom: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
    }).optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    backgroundImage: PayloadMediaSchema.optional(),
    customBackgroundColor: z.string().optional(),
    customTextColor: z.string().optional(),
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
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional(),
  }).optional(),
  seo: z.object({
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    structuredData: z.record(z.string(), z.any()).optional(),
  }).optional(),
  analytics: z.object({
    trackingEvents: z.array(z.object({
      eventType: z.enum(['view', 'click', 'scroll', 'submit']),
      eventName: z.string(),
      eventCategory: z.string().optional(),
    })).optional(),
  }).optional(),
  abTesting: z.object({
    enabled: z.boolean(),
    testName: z.string().optional(),
    variants: z.array(z.object({
      name: z.string(),
      weight: z.number().min(0).max(100),
      contentOverride: z.record(z.string(), z.any()).optional(),
    })).optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Component Library schema
export const PayloadComponentLibrarySchema = z.object({
  id: z.string(),
  componentName: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['layout', 'navigation', 'content', 'interactive', 'media', 'forms', 'ecommerce', 'social', 'analytics', 'third-party', 'custom']),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  status: z.enum(['development', 'testing', 'stable', 'deprecated']),
  tags: z.string().optional(),
  implementation: z.object({
    framework: z.enum(['react', 'vue', 'svelte', 'vanilla', 'web-component']),
    sourceCode: z.string().min(1),
    styles: z.string().optional(),
    dependencies: z.array(z.object({
      package: z.string(),
      version: z.string(),
      required: z.boolean(),
    })),
  }),
  propsSchema: z.record(z.string(), z.any()),
  defaultProps: z.record(z.string(), z.any()).optional(),
  exampleUsage: z.string().optional(),
  preview: z.object({
    screenshot: PayloadMediaSchema,
    thumbnails: z.array(z.object({
      variant: z.string(),
      image: PayloadMediaSchema,
    })).optional(),
    liveDemo: z.string().url().optional(),
  }),
  accessibility: z.object({
    wcagLevel: z.enum(['A', 'AA', 'AAA', 'not-tested']),
    keyboardNavigation: z.boolean(),
    screenReaderSupport: z.boolean(),
    colorContrastCompliant: z.boolean(),
    ariaLabels: z.record(z.string(), z.any()).optional(),
  }),
  responsive: z.object({
    breakpoints: z.array(z.enum(['mobile', 'tablet', 'desktop', 'large'])),
    mobileOptimized: z.boolean(),
  }),
  configuration: z.object({
    configurable: z.boolean(),
    configSchema: z.record(z.string(), z.any()).optional(),
    adminInterface: z.enum(['form', 'visual', 'code', 'json']),
    presets: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      config: z.record(z.string(), z.any()),
      preview: PayloadMediaSchema.optional(),
    })).optional(),
  }),
  integrations: z.object({
    cmsFields: z.record(z.string(), z.any()).optional(),
    apiEndpoints: z.array(z.object({
      name: z.string(),
      endpoint: z.string(),
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
      required: z.boolean(),
    })).optional(),
    thirdPartyServices: z.array(z.object({
      service: z.string(),
      purpose: z.string().optional(),
      apiKeyRequired: z.boolean(),
      configFields: z.record(z.string(), z.any()).optional(),
    })).optional(),
  }),
  performance: z.object({
    bundleSize: z.number().optional(),
    renderTime: z.number().optional(),
    cacheStrategy: z.enum(['static', 'dynamic', 'isr', 'no-cache']).optional(),
    lazyLoading: z.boolean(),
    serverSideRendering: z.boolean(),
  }),
  seo: z.object({
    seoFriendly: z.boolean(),
    structuredData: z.record(z.string(), z.any()).optional(),
    metaTags: z.record(z.string(), z.any()).optional(),
  }),
  documentation: z.object({
    readme: z.string().optional(),
    installation: z.string().optional(),
    apiDocs: z.record(z.string(), z.any()).optional(),
    examples: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      code: z.string().optional(),
      liveDemo: z.string().optional(),
    })).optional(),
    changelog: z.array(z.object({
      version: z.string(),
      date: z.string(),
      changes: z.string(),
      breakingChanges: z.boolean(),
    })).optional(),
  }),
  testing: z.object({
    testCoverage: z.number().min(0).max(100).optional(),
    testFiles: z.string().optional(),
    e2eTests: z.string().optional(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Theme Settings schema
export const PayloadThemeSettingsSchema = z.object({
  id: z.string(),
  themeName: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  status: z.enum(['development', 'testing', 'production', 'deprecated']),
  isDefault: z.boolean(),
  previewImage: PayloadMediaSchema.optional(),
  colors: z.object({
    primary: z.object({
      main: z.string().regex(/^#[0-9a-f]{6}$/i),
      light: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      dark: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      contrast: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    }),
    secondary: z.object({
      main: z.string().regex(/^#[0-9a-f]{6}$/i),
      light: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      dark: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      contrast: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    }),
    accent: z.object({
      main: z.string().regex(/^#[0-9a-f]{6}$/i),
      light: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      dark: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      contrast: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    }).optional(),
    semantic: z.object({
      success: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      warning: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      error: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      info: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    }),
    neutral: z.object({
      white: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      black: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray50: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray100: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray200: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray300: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray400: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray500: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray600: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray700: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray800: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
      gray900: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
    }),
    custom: z.array(z.object({
      name: z.string(),
      value: z.string().regex(/^#[0-9a-f]{6}$/i),
      description: z.string().optional(),
    })).optional(),
  }),
  typography: z.object({
    fontFamilies: z.object({
      primary: z.string(),
      customPrimary: z.string().optional(),
      headings: z.string(),
      customHeadings: z.string().optional(),
      monospace: z.string(),
    }),
    fontSizes: z.record(z.string(), z.string()),
    fontWeights: z.record(z.string(), z.number()),
    lineHeights: z.record(z.string(), z.string()),
  }),
  spacing: z.object({
    base: z.string(),
    scale: z.record(z.string(), z.string()),
  }),
  breakpoints: z.object({
    xs: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
  }),
  containers: z.object({
    maxWidths: z.record(z.string(), z.string()),
    padding: z.record(z.string(), z.string()),
  }),
  components: z.object({
    buttons: z.object({
      borderRadius: z.string(),
      padding: z.record(z.string(), z.string()),
      fontSize: z.record(z.string(), z.string()),
      fontWeight: z.number(),
      variants: z.record(z.string(), z.any()),
    }),
    cards: z.object({
      borderRadius: z.string(),
      padding: z.string(),
      shadow: z.string(),
      border: z.string(),
    }),
    forms: z.object({
      inputBorderRadius: z.string(),
      inputPadding: z.string(),
      inputBorder: z.string(),
      inputFocusBorder: z.string(),
      labelFontWeight: z.number(),
    }),
  }),
  animations: z.object({
    enabled: z.boolean(),
    duration: z.record(z.string(), z.string()).optional(),
    easing: z.record(z.string(), z.string()).optional(),
    presets: z.record(z.string(), z.any()).optional(),
  }).optional(),
  darkMode: z.object({
    enabled: z.boolean(),
    strategy: z.enum(['css-vars', 'css-classes', 'data-attrs']),
    colorOverrides: z.record(z.string(), z.string()).optional(),
  }).optional(),
  customCSS: z.string().optional(),
  cssVariables: z.record(z.string(), z.any()).optional(),
  generateUtilities: z.boolean(),
  purgeCSS: z.object({
    enabled: z.boolean(),
    safelist: z.array(z.object({
      pattern: z.string(),
    })).optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// ================================
// 3. TYPE-SAFE API CLIENT
// ================================

import { EnhancedApiClient, type EnhancedApiResponse } from './enhanced-api-framework'

export class TypeSafeApiClient extends EnhancedApiClient {
  // Page Sections API
  async getPageSections(page?: string): Promise<EnhancedApiResponse<PayloadPageSection[]>> {
    const endpoint = page ? `/page-sections?page=${page}` : '/page-sections'
    const response = await this.get<PayloadPageSection[]>(endpoint, {
      cache: true,
      ttl: 300000,
      tags: ['page-sections'],
      realtime: true,
    })

    // Runtime validation
    if (response.data) {
      response.data = response.data.map(section => 
        PayloadPageSectionSchema.parse(section)
      )
    }

    return response
  }

  async getPageSection(id: string): Promise<EnhancedApiResponse<PayloadPageSection>> {
    const response = await this.get<PayloadPageSection>(`/page-sections/${id}`, {
      cache: true,
      ttl: 300000,
      tags: ['page-sections', `page-section-${id}`],
    })

    if (response.data) {
      response.data = PayloadPageSectionSchema.parse(response.data)
    }

    return response
  }

  async createPageSection(data: Omit<PayloadPageSection, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnhancedApiResponse<PayloadPageSection>> {
    // Validate before sending
    const validatedData = PayloadPageSectionSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(data)

    const response = await this.post<PayloadPageSection>('/page-sections', validatedData, {
      invalidateTags: ['page-sections'],
    })

    if (response.data) {
      response.data = PayloadPageSectionSchema.parse(response.data)
    }

    return response
  }

  async updatePageSection(id: string, data: Partial<PayloadPageSection>): Promise<EnhancedApiResponse<PayloadPageSection>> {
    const response = await this.put<PayloadPageSection>(`/page-sections/${id}`, data, {
      invalidateTags: ['page-sections', `page-section-${id}`],
    })

    if (response.data) {
      response.data = PayloadPageSectionSchema.parse(response.data)
    }

    return response
  }

  async deletePageSection(id: string): Promise<EnhancedApiResponse<void>> {
    return this.delete(`/page-sections/${id}`, {
      invalidateTags: ['page-sections', `page-section-${id}`],
    })
  }

  // Component Library API
  async getComponents(): Promise<EnhancedApiResponse<PayloadComponentLibrary[]>> {
    const response = await this.get<PayloadComponentLibrary[]>('/component-library', {
      cache: true,
      ttl: 600000, // 10 minutes
      tags: ['component-library'],
    })

    if (response.data) {
      response.data = response.data.map(component => 
        PayloadComponentLibrarySchema.parse(component)
      )
    }

    return response
  }

  async getComponent(id: string): Promise<EnhancedApiResponse<PayloadComponentLibrary>> {
    const response = await this.get<PayloadComponentLibrary>(`/component-library/${id}`, {
      cache: true,
      ttl: 600000,
      tags: ['component-library', `component-${id}`],
    })

    if (response.data) {
      response.data = PayloadComponentLibrarySchema.parse(response.data)
    }

    return response
  }

  async createComponent(data: Omit<PayloadComponentLibrary, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnhancedApiResponse<PayloadComponentLibrary>> {
    const validatedData = PayloadComponentLibrarySchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(data)

    const response = await this.post<PayloadComponentLibrary>('/component-library', validatedData, {
      invalidateTags: ['component-library'],
    })

    if (response.data) {
      response.data = PayloadComponentLibrarySchema.parse(response.data)
    }

    return response
  }

  // Theme Settings API
  async getThemes(): Promise<EnhancedApiResponse<PayloadThemeSettings[]>> {
    const response = await this.get<PayloadThemeSettings[]>('/theme-settings', {
      cache: true,
      ttl: 600000,
      tags: ['theme-settings'],
    })

    if (response.data) {
      response.data = response.data.map(theme => 
        PayloadThemeSettingsSchema.parse(theme)
      )
    }

    return response
  }

  async getTheme(id: string): Promise<EnhancedApiResponse<PayloadThemeSettings>> {
    const response = await this.get<PayloadThemeSettings>(`/theme-settings/${id}`, {
      cache: true,
      ttl: 600000,
      tags: ['theme-settings', `theme-${id}`],
    })

    if (response.data) {
      response.data = PayloadThemeSettingsSchema.parse(response.data)
    }

    return response
  }

  async getDefaultTheme(): Promise<EnhancedApiResponse<PayloadThemeSettings>> {
    const response = await this.get<PayloadThemeSettings>('/theme-settings?isDefault=true', {
      cache: true,
      ttl: 600000,
      tags: ['theme-settings', 'default-theme'],
    })

    if (response.data) {
      response.data = PayloadThemeSettingsSchema.parse(response.data)
    }

    return response
  }

  async createTheme(data: Omit<PayloadThemeSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<EnhancedApiResponse<PayloadThemeSettings>> {
    const validatedData = PayloadThemeSettingsSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).parse(data)

    const response = await this.post<PayloadThemeSettings>('/theme-settings', validatedData, {
      invalidateTags: ['theme-settings'],
    })

    if (response.data) {
      response.data = PayloadThemeSettingsSchema.parse(response.data)
    }

    return response
  }

  // Navigation API
  async getNavigation(): Promise<EnhancedApiResponse<any>> {
    const response = await this.get('/navigation', {
      cache: true,
      ttl: 600000,
      tags: ['navigation'],
      realtime: true,
    })

    return response
  }

  // Media API
  async getMedia(): Promise<EnhancedApiResponse<PayloadMedia[]>> {
    const response = await this.get<PayloadMedia[]>('/media', {
      cache: true,
      ttl: 300000,
      tags: ['media'],
    })

    if (response.data) {
      response.data = response.data.map(media => 
        PayloadMediaSchema.parse(media)
      )
    }

    return response
  }

  async uploadMedia(file: File, alt?: string): Promise<EnhancedApiResponse<PayloadMedia>> {
    const formData = new FormData()
    formData.append('file', file)
    if (alt) {
      formData.append('alt', alt)
    }

    // Override content type for file upload
    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (data.success && data.data) {
      data.data = PayloadMediaSchema.parse(data.data)
    }

    return data
  }
}

// ================================
// 4. TYPE-SAFE REACT HOOKS
// ================================

import { useEnhancedApi, useEnhancedMutation } from '../hooks/useEnhancedApi'

// Typed hooks for each collection
export function usePageSections(page?: string) {
  const client = new TypeSafeApiClient()
  
  return useEnhancedApi<PayloadPageSection[]>(
    page ? `/page-sections?page=${page}` : '/page-sections',
    {
      realtime: true,
      enableCache: true,
      ttl: 300000,
    }
  )
}

export function usePageSection(id: string) {
  const client = new TypeSafeApiClient()
  
  return useEnhancedApi<PayloadPageSection>(
    `/page-sections/${id}`,
    {
      enableCache: true,
      ttl: 300000,
      dependencies: [id],
    }
  )
}

export function useComponents() {
  return useEnhancedApi<PayloadComponentLibrary[]>('/component-library', {
    enableCache: true,
    ttl: 600000,
  })
}

export function useComponent(id: string) {
  return useEnhancedApi<PayloadComponentLibrary>(`/component-library/${id}`, {
    enableCache: true,
    ttl: 600000,
    dependencies: [id],
  })
}

export function useThemes() {
  return useEnhancedApi<PayloadThemeSettings[]>('/theme-settings', {
    enableCache: true,
    ttl: 600000,
  })
}

export function useTheme(id?: string) {
  const endpoint = id ? `/theme-settings/${id}` : '/theme-settings?isDefault=true'
  
  return useEnhancedApi<PayloadThemeSettings>(endpoint, {
    enableCache: true,
    ttl: 600000,
    dependencies: [id],
  })
}

export function useNavigation() {
  return useEnhancedApi('/navigation', {
    realtime: true,
    enableCache: true,
    ttl: 600000,
  })
}

// Mutation hooks
export function usePageSectionMutation() {
  return useEnhancedMutation<PayloadPageSection, Partial<PayloadPageSection>>()
}

export function useComponentMutation() {
  return useEnhancedMutation<PayloadComponentLibrary, Partial<PayloadComponentLibrary>>()
}

export function useThemeMutation() {
  return useEnhancedMutation<PayloadThemeSettings, Partial<PayloadThemeSettings>>()
}

// ================================
// 5. SCHEMA MIGRATION UTILITIES
// ================================

export interface SchemaMigration {
  version: string
  description: string
  up: (data: any) => any
  down: (data: any) => any
}

export class SchemaMigrator {
  private migrations: Map<string, SchemaMigration[]> = new Map()

  registerMigration(collection: string, migration: SchemaMigration) {
    if (!this.migrations.has(collection)) {
      this.migrations.set(collection, [])
    }
    this.migrations.get(collection)!.push(migration)
  }

  async migrateData(collection: string, data: any, fromVersion: string, toVersion: string): Promise<any> {
    const migrations = this.migrations.get(collection) || []
    
    // Sort migrations by version
    migrations.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }))
    
    let migratedData = data
    
    for (const migration of migrations) {
      if (this.isVersionInRange(migration.version, fromVersion, toVersion)) {
        migratedData = migration.up(migratedData)
      }
    }
    
    return migratedData
  }

  private isVersionInRange(migrationVersion: string, fromVersion: string, toVersion: string): boolean {
    return migrationVersion > fromVersion && migrationVersion <= toVersion
  }
}

// ================================
// 6. TYPE COMPATIBILITY CHECKER
// ================================

export class TypeCompatibilityChecker {
  checkSchemaCompatibility(oldSchema: z.ZodSchema, newSchema: z.ZodSchema, data: any): {
    compatible: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    try {
      // Try parsing with old schema first
      oldSchema.parse(data)
      
      // Then try with new schema
      newSchema.parse(data)
      
      return { compatible: true, errors, warnings }
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.issues.map(e => `${e.path.join('.')}: ${e.message}`))
      }
      
      return { compatible: false, errors, warnings }
    }
  }

  generateMigrationSuggestions(oldSchema: z.ZodSchema, newSchema: z.ZodSchema): string[] {
    // This would analyze the schema differences and suggest migrations
    return ['Schema migration suggestions would be generated here']
  }
}

// ================================
// 7. EXPORTS
// ================================

export const typeSafeApiClient = new TypeSafeApiClient()
export const schemaMigrator = new SchemaMigrator()
export const typeCompatibilityChecker = new TypeCompatibilityChecker()

