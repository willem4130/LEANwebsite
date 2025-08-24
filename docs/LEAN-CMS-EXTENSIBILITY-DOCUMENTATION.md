<metadata>
purpose: Complete extensibility guide for LEAN CMS Framework plugins, marketplace, and integrations
type: extensibility-documentation
language: TypeScript
framework: Next.js 14 + Payload CMS 3.x + n8n
integration-systems: plugins, marketplace, webhooks, third-party-services
last-updated: 2025-08-24
target-audience: developers-extending-lean-cms
extensibility-scope: plugins, workflows, integrations, marketplace
</metadata>

<overview>
Comprehensive extensibility documentation for the LEAN CMS Framework covering plugin development, component marketplace integration, n8n workflow automation, third-party service integrations, and custom extension patterns. Enables developers to extend and customize the framework for specific business needs while maintaining compatibility and performance.
</overview>

<plugin-architecture>
<plugin-system>
  <core-concepts>
    <concept name="Plugin Lifecycle">
      <phases>
        <phase name="Registration">Plugin discovery and validation</phase>
        <phase name="Initialization">Plugin setup and configuration</phase>
        <phase name="Activation">Runtime integration and hooks</phase>
        <phase name="Deactivation">Cleanup and resource release</phase>
      </phases>
    </concept>
    
    <concept name="Plugin Types">
      <type name="Component Plugin">Custom UI components and layouts</type>
      <type name="API Plugin">Custom API endpoints and middleware</type>
      <type name="CMS Plugin">Payload CMS collections and fields</type>
      <type name="Theme Plugin">Custom themes and styling systems</type>
      <type name="Integration Plugin">Third-party service integrations</type>
    </concept>
    
    <concept name="Plugin API">
      <interface>Standardized plugin interface for consistency</interface>
      <hooks>Event system for plugin communication</hooks>
      <context>Shared context and state management</context>
      <validation>Runtime plugin validation and error handling</validation>
    </concept>
  </core-concepts>
  
  <plugin-structure>
    <directory-layout>
      <root-directory name="my-lean-plugin/">
        <file name="package.json">Plugin metadata and dependencies</file>
        <file name="index.ts">Main plugin entry point</file>
        <file name="plugin.config.ts">Plugin configuration schema</file>
        <directory name="src/">
          <directory name="components/">React components</directory>
          <directory name="api/">API route handlers</directory>
          <directory name="collections/">CMS collections</directory>
          <directory name="hooks/">React hooks</directory>
          <directory name="utils/">Utility functions</directory>
        </directory>
        <directory name="types/">TypeScript type definitions</directory>
        <directory name="docs/">Plugin documentation</directory>
        <directory name="examples/">Usage examples</directory>
      </root-directory>
    </directory-layout>
    
    <plugin-manifest path="package.json">
{
  "name": "@my-org/lean-cms-social-plugin",
  "version": "1.0.0",
  "description": "Social media integration plugin for LEAN CMS",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["lean-cms", "plugin", "social-media"],
  "peerDependencies": {
    "@lean-cms/framework": "^1.0.0",
    "react": "^18.0.0",
    "next": "^14.0.0"
  },
  "leanCms": {
    "plugin": true,
    "version": "1.0.0",
    "type": "integration",
    "compatibility": {
      "framework": "^1.0.0",
      "node": ">=18.0.0"
    },
    "permissions": ["api:read", "api:write", "cms:collections"],
    "config": "./plugin.config.ts"
  }
}
    </plugin-manifest>
  </plugin-structure>
</plugin-system>

<plugin-development>
  <base-plugin-class path="src/plugins/base/BasePlugin.ts">
import { Plugin, PluginContext, PluginConfig } from '@lean-cms/framework/plugins'

export abstract class BasePlugin<TConfig = any> implements Plugin<TConfig> {
  public readonly id: string
  public readonly name: string
  public readonly version: string
  protected config: TConfig
  protected context: PluginContext
  
  constructor(
    id: string,
    name: string,
    version: string,
    config: TConfig,
    context: PluginContext
  ) {
    this.id = id
    this.name = name
    this.version = version
    this.config = config
    this.context = context
  }
  
  // Lifecycle hooks
  abstract async initialize(): Promise<void>
  abstract async activate(): Promise<void>
  abstract async deactivate(): Promise<void>
  
  // Optional hooks
  async beforeInitialize?(): Promise<void>
  async afterActivate?(): Promise<void>
  async onError?(error: Error): Promise<void>
  
  // Configuration management
  getConfig(): TConfig {
    return this.config
  }
  
  updateConfig(updates: Partial<TConfig>): void {
    this.config = { ...this.config, ...updates }
  }
  
  // Context access
  getContext(): PluginContext {
    return this.context
  }
  
  // Event system
  emit(event: string, data?: any): void {
    this.context.eventEmitter.emit(`${this.id}:${event}`, data)
  }
  
  on(event: string, handler: (data?: any) => void): void {
    this.context.eventEmitter.on(`${this.id}:${event}`, handler)
  }
}
  </base-plugin-class>
  
  <component-plugin-example path="plugins/social-media-plugin/index.ts">
import { BasePlugin } from '@lean-cms/framework/plugins'
import { SocialMediaWidget } from './components/SocialMediaWidget'
import { InstagramFeed } from './components/InstagramFeed'
import { socialMediaApi } from './api/social-media'

export interface SocialMediaConfig {
  instagram: {
    accessToken: string
    userId: string
    enabled: boolean
  }
  twitter: {
    apiKey: string
    apiSecret: string
    enabled: boolean
  }
  facebook: {
    pageId: string
    accessToken: string
    enabled: boolean
  }
}

export class SocialMediaPlugin extends BasePlugin<SocialMediaConfig> {
  async initialize(): Promise<void> {
    // Validate configuration
    this.validateConfig()
    
    // Register components
    this.context.componentRegistry.register('SocialMediaWidget', SocialMediaWidget)
    this.context.componentRegistry.register('InstagramFeed', InstagramFeed)
    
    // Register API routes
    this.context.apiRouter.register('/api/social-media', socialMediaApi)
    
    console.log('Social Media Plugin initialized')
  }
  
  async activate(): Promise<void> {
    // Start background tasks
    if (this.config.instagram.enabled) {
      this.startInstagramSync()
    }
    
    // Register event listeners
    this.context.eventEmitter.on('content:published', this.handleContentPublished.bind(this))
    
    console.log('Social Media Plugin activated')
  }
  
  async deactivate(): Promise<void> {
    // Stop background tasks
    this.stopInstagramSync()
    
    // Clean up event listeners
    this.context.eventEmitter.removeAllListeners(`${this.id}:*`)
    
    console.log('Social Media Plugin deactivated')
  }
  
  private validateConfig(): void {
    if (this.config.instagram.enabled && !this.config.instagram.accessToken) {
      throw new Error('Instagram access token is required when Instagram is enabled')
    }
  }
  
  private startInstagramSync(): void {
    // Implementation for syncing Instagram content
    setInterval(async () => {
      try {
        await this.syncInstagramPosts()
      } catch (error) {
        console.error('Instagram sync failed:', error)
        this.emit('instagram:sync:error', { error })
      }
    }, 60000 * 15) // Every 15 minutes
  }
  
  private stopInstagramSync(): void {
    // Clear intervals and cleanup
  }
  
  private async syncInstagramPosts(): Promise<void> {
    // Fetch and sync Instagram posts
    const posts = await this.fetchInstagramPosts()
    await this.savePostsToDatabase(posts)
    this.emit('instagram:sync:complete', { count: posts.length })
  }
  
  private async fetchInstagramPosts(): Promise<any[]> {
    // Instagram API implementation
    return []
  }
  
  private async savePostsToDatabase(posts: any[]): Promise<void> {
    // Save posts using CMS API
  }
  
  private handleContentPublished(data: any): void {
    // Auto-share to social media when content is published
    if (this.config.instagram.enabled) {
      this.shareToInstagram(data)
    }
  }
  
  private async shareToInstagram(content: any): Promise<void> {
    // Share content to Instagram
  }
}

// Plugin factory function
export function createSocialMediaPlugin(config: SocialMediaConfig) {
  return (context: PluginContext) => {
    return new SocialMediaPlugin(
      'social-media',
      'Social Media Integration',
      '1.0.0',
      config,
      context
    )
  }
}
  </component-plugin-example>
  
  <api-plugin-example path="plugins/analytics-plugin/index.ts">
import { BasePlugin } from '@lean-cms/framework/plugins'
import { analyticsRoutes } from './api/analytics'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'

export interface AnalyticsConfig {
  providers: {
    googleAnalytics?: {
      measurementId: string
      apiKey: string
    }
    plausible?: {
      domain: string
      apiKey: string
    }
  }
  tracking: {
    pageViews: boolean
    events: boolean
    conversions: boolean
  }
  dashboard: {
    enabled: boolean
    refreshInterval: number
  }
}

export class AnalyticsPlugin extends BasePlugin<AnalyticsConfig> {
  private analyticsClient?: any
  
  async initialize(): Promise<void> {
    // Initialize analytics clients
    await this.initializeClients()
    
    // Register API routes
    this.context.apiRouter.register('/api/analytics', analyticsRoutes)
    
    // Register dashboard component
    if (this.config.dashboard.enabled) {
      this.context.componentRegistry.register('AnalyticsDashboard', AnalyticsDashboard)
    }
    
    // Register CMS fields for analytics tracking
    this.registerCMSFields()
  }
  
  async activate(): Promise<void> {
    // Start tracking
    if (this.config.tracking.pageViews) {
      this.startPageViewTracking()
    }
    
    if (this.config.tracking.events) {
      this.startEventTracking()
    }
    
    // Set up dashboard refresh
    if (this.config.dashboard.enabled) {
      this.startDashboardRefresh()
    }
  }
  
  async deactivate(): Promise<void> {
    // Stop all tracking
    this.stopTracking()
  }
  
  private async initializeClients(): Promise<void> {
    if (this.config.providers.googleAnalytics) {
      // Initialize Google Analytics client
    }
    
    if (this.config.providers.plausible) {
      // Initialize Plausible client
    }
  }
  
  private registerCMSFields(): void {
    // Add analytics fields to CMS collections
    this.context.cmsRegistry.addField('pages', {
      name: 'analyticsEnabled',
      type: 'checkbox',
      label: 'Enable Analytics Tracking',
      defaultValue: true,
    })
    
    this.context.cmsRegistry.addField('pages', {
      name: 'conversionGoals',
      type: 'array',
      label: 'Conversion Goals',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'selector',
          type: 'text',
          required: true,
        },
      ],
    })
  }
  
  private startPageViewTracking(): void {
    // Implement page view tracking
  }
  
  private startEventTracking(): void {
    // Implement event tracking
  }
  
  private startDashboardRefresh(): void {
    // Implement dashboard data refresh
  }
  
  private stopTracking(): void {
    // Clean up tracking
  }
}

export function createAnalyticsPlugin(config: AnalyticsConfig) {
  return (context: PluginContext) => {
    return new AnalyticsPlugin(
      'analytics',
      'Analytics Integration',
      '1.0.0',
      config,
      context
    )
  }
}
  </api-plugin-example>
</plugin-development>
</plugin-architecture>

<component-marketplace>
<marketplace-architecture>
  <registry-system>
    <component-registry>
      <structure>
        <field name="id">Unique component identifier</field>
        <field name="name">Display name</field>
        <field name="description">Component description</field>
        <field name="version">Semantic version</field>
        <field name="category">Component category (layout, form, media, etc.)</field>
        <field name="tags">Searchable tags</field>
        <field name="author">Component author information</field>
        <field name="license">License type</field>
        <field name="dependencies">Required dependencies</field>
        <field name="compatibility">Framework version compatibility</field>
        <field name="preview">Preview image/demo</field>
      </structure>
      
      <categories>
        <category name="Hero Sections">Landing page hero components</category>
        <category name="Gallery Layouts">Image and video gallery layouts</category>
        <category name="Contact Forms">Form components with validation</category>
        <category name="Navigation">Menu and navigation components</category>
        <category name="Content Blocks">Reusable content sections</category>
        <category name="Animations">GSAP and Framer Motion animations</category>
        <category name="Integrations">Third-party service integrations</category>
      </categories>
    </component-registry>
    
    <publishing-workflow>
      <steps>
        <step number="1">Component development and testing</step>
        <step number="2">Documentation and examples creation</step>
        <step number="3">Package and manifest preparation</step>
        <step number="4">Marketplace submission</step>
        <step number="5">Review and quality assurance</step>
        <step number="6">Publication and distribution</step>
      </steps>
      
      <quality-requirements>
        <requirement name="TypeScript">Full TypeScript support with types</requirement>
        <requirement name="Documentation">Complete API documentation</requirement>
        <requirement name="Examples">Working usage examples</requirement>
        <requirement name="Tests">Unit and integration tests</requirement>
        <requirement name="Accessibility">WCAG 2.1 AA compliance</requirement>
        <requirement name="Performance">Lighthouse performance score > 90</requirement>
      </quality-requirements>
    </publishing-workflow>
  </registry-system>
  
  <component-development>
    <component-template path="marketplace/components/advanced-hero/index.tsx">
import React from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ComponentProps, ComponentConfig } from '@lean-cms/framework/types'

export interface AdvancedHeroConfig extends ComponentConfig {
  title: string
  subtitle?: string
  backgroundType: 'gradient' | 'image' | 'video'
  backgroundMedia?: string
  ctaText?: string
  ctaLink?: string
  animationIntensity: 'subtle' | 'moderate' | 'intense'
  parallaxEnabled: boolean
}

export interface AdvancedHeroProps extends ComponentProps<AdvancedHeroConfig> {
  className?: string
}

export const AdvancedHero: React.FC<AdvancedHeroProps> = ({
  config,
  className = '',
  ...props
}) => {
  const heroRef = React.useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    if (!heroRef.current) return
    
    const tl = gsap.timeline()
    
    // Animate based on intensity
    switch (config.animationIntensity) {
      case 'subtle':
        tl.from('.hero-title', { opacity: 0, y: 20, duration: 1 })
          .from('.hero-subtitle', { opacity: 0, y: 15, duration: 0.8 }, '-=0.5')
          .from('.hero-cta', { opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.3')
        break
        
      case 'moderate':
        tl.from('.hero-title', { opacity: 0, y: 50, rotationX: -15, duration: 1.2 })
          .from('.hero-subtitle', { opacity: 0, x: -30, duration: 1 }, '-=0.8')
          .from('.hero-cta', { opacity: 0, scale: 0.8, rotation: -5, duration: 0.8 }, '-=0.5')
        break
        
      case 'intense':
        tl.from('.hero-title', { 
          opacity: 0, 
          y: 100, 
          rotationX: -30, 
          scale: 0.8,
          duration: 1.5,
          ease: 'power3.out'
        })
        .from('.hero-subtitle', { 
          opacity: 0, 
          x: -50, 
          rotationY: 15,
          duration: 1.2 
        }, '-=1')
        .from('.hero-cta', { 
          opacity: 0, 
          scale: 0.5, 
          rotation: 10,
          y: 30,
          duration: 1,
          ease: 'back.out(1.7)'
        }, '-=0.8')
        break
    }
    
    // Parallax effect
    if (config.parallaxEnabled) {
      gsap.to('.hero-background', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    }
  }, [config.animationIntensity, config.parallaxEnabled])
  
  const renderBackground = () => {
    switch (config.backgroundType) {
      case 'gradient':
        return (
          <div className="hero-background absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        )
        
      case 'image':
        return (
          <div 
            className="hero-background absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${config.backgroundMedia})` }}
          />
        )
        
      case 'video':
        return (
          <video
            className="hero-background absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={config.backgroundMedia} type="video/mp4" />
          </video>
        )
        
      default:
        return null
    }
  }
  
  return (
    <section 
      ref={heroRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      {...props}
    >
      {renderBackground()}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1 
          className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {config.title}
        </motion.h1>
        
        {config.subtitle && (
          <motion.p 
            className="hero-subtitle text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {config.subtitle}
          </motion.p>
        )}
        
        {config.ctaText && config.ctaLink && (
          <motion.a
            href={config.ctaLink}
            className="hero-cta inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {config.ctaText}
          </motion.a>
        )}
      </div>
    </section>
  )
}

// Component metadata for marketplace
export const AdvancedHeroMetadata = {
  id: 'advanced-hero',
  name: 'Advanced Hero Section',
  description: 'Highly customizable hero section with animations and parallax effects',
  version: '1.0.0',
  category: 'Hero Sections',
  tags: ['hero', 'animation', 'parallax', 'gsap', 'framer-motion'],
  author: {
    name: 'LEAN CMS Team',
    email: 'team@lean-cms.com'
  },
  license: 'MIT',
  dependencies: {
    'framer-motion': '^12.0.0',
    'gsap': '^3.13.0',
    '@gsap/react': '^2.1.0'
  },
  compatibility: {
    framework: '^1.0.0'
  },
  configSchema: {
    title: { type: 'string', required: true },
    subtitle: { type: 'string', required: false },
    backgroundType: { type: 'select', options: ['gradient', 'image', 'video'], required: true },
    backgroundMedia: { type: 'string', required: false },
    ctaText: { type: 'string', required: false },
    ctaLink: { type: 'string', required: false },
    animationIntensity: { type: 'select', options: ['subtle', 'moderate', 'intense'], default: 'moderate' },
    parallaxEnabled: { type: 'boolean', default: true }
  }
}
    </component-template>
    
    <component-manifest path="marketplace/components/advanced-hero/component.json">
{
  "id": "advanced-hero",
  "name": "Advanced Hero Section",
  "description": "Highly customizable hero section with GSAP animations, parallax effects, and multiple background options",
  "version": "1.0.0",
  "category": "Hero Sections",
  "tags": ["hero", "animation", "parallax", "gsap", "framer-motion", "responsive"],
  "author": {
    "name": "LEAN CMS Team",
    "email": "team@lean-cms.com",
    "url": "https://lean-cms.com"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/lean-cms/components/tree/main/advanced-hero"
  },
  "dependencies": {
    "framer-motion": "^12.0.0",
    "gsap": "^3.13.0",
    "@gsap/react": "^2.1.0"
  },
  "peerDependencies": {
    "@lean-cms/framework": "^1.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.4.0"
  },
  "compatibility": {
    "framework": "^1.0.0",
    "node": ">=18.0.0"
  },
  "files": {
    "main": "./index.tsx",
    "types": "./index.d.ts",
    "styles": "./styles.css",
    "examples": "./examples/",
    "docs": "./README.md"
  },
  "preview": {
    "image": "./preview.jpg",
    "demo": "./demo/index.html"
  },
  "configSchema": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "title": "Hero Title",
        "description": "Main hero section title",
        "required": true
      },
      "subtitle": {
        "type": "string",
        "title": "Subtitle",
        "description": "Optional subtitle text"
      },
      "backgroundType": {
        "type": "string",
        "enum": ["gradient", "image", "video"],
        "title": "Background Type",
        "description": "Type of background to display",
        "default": "gradient"
      },
      "backgroundMedia": {
        "type": "string",
        "title": "Background Media",
        "description": "URL to background image or video",
        "format": "uri"
      },
      "ctaText": {
        "type": "string",
        "title": "Call-to-Action Text",
        "description": "Text for the main CTA button"
      },
      "ctaLink": {
        "type": "string",
        "title": "Call-to-Action Link",
        "description": "URL for the CTA button",
        "format": "uri"
      },
      "animationIntensity": {
        "type": "string",
        "enum": ["subtle", "moderate", "intense"],
        "title": "Animation Intensity",
        "description": "Level of animation effects",
        "default": "moderate"
      },
      "parallaxEnabled": {
        "type": "boolean",
        "title": "Enable Parallax",
        "description": "Enable parallax scrolling effect",
        "default": true
      }
    }
  },
  "features": [
    "Multiple background types (gradient, image, video)",
    "GSAP-powered animations with intensity control",
    "Parallax scrolling effects",
    "Responsive design",
    "Accessibility compliant",
    "Customizable styling",
    "TypeScript support"
  ],
  "keywords": [
    "hero-section",
    "landing-page",
    "animation",
    "parallax",
    "responsive",
    "accessibility",
    "typescript"
  ]
}
    </component-manifest>
  </component-development>
  
  <marketplace-integration>
    <installation-command>
      <cli-installation>lean-cms install advanced-hero</cli-installation>
      <npm-installation>npm install @lean-cms-marketplace/advanced-hero</npm-installation>
      <config-update>Automatically updates lean-cms.config.js with component registration</config-update>
    </installation-command>
    
    <component-browser path="src/admin/ComponentBrowser.tsx">
import React, { useState, useEffect } from 'react'
import { MarketplaceAPI } from '@lean-cms/framework/marketplace'
import { ComponentCard } from './ComponentCard'
import { FilterSidebar } from './FilterSidebar'

export interface MarketplaceComponent {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  version: string
  downloads: number
  rating: number
  preview: {
    image: string
    demo?: string
  }
  installed: boolean
}

export function ComponentBrowser() {
  const [components, setComponents] = useState<MarketplaceComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    tags: [],
    sort: 'downloads',
    search: ''
  })
  
  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true)
      try {
        const data = await MarketplaceAPI.searchComponents({
          category: filters.category,
          tags: filters.tags,
          sort: filters.sort,
          search: filters.search
        })
        setComponents(data)
      } catch (error) {
        console.error('Failed to fetch components:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchComponents()
  }, [filters])
  
  const handleInstall = async (componentId: string) => {
    try {
      await MarketplaceAPI.installComponent(componentId)
      setComponents(prev => 
        prev.map(comp => 
          comp.id === componentId 
            ? { ...comp, installed: true }
            : comp
        )
      )
    } catch (error) {
      console.error('Installation failed:', error)
    }
  }
  
  const handleUninstall = async (componentId: string) => {
    try {
      await MarketplaceAPI.uninstallComponent(componentId)
      setComponents(prev => 
        prev.map(comp => 
          comp.id === componentId 
            ? { ...comp, installed: false }
            : comp
        )
      )
    } catch (error) {
      console.error('Uninstallation failed:', error)
    }
  }
  
  return (
    <div className="component-browser flex">
      <FilterSidebar 
        filters={filters} 
        onChange={setFilters} 
      />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Component Marketplace</h1>
          <p className="text-gray-600">Discover and install components for your LEAN CMS site</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map(component => (
              <ComponentCard
                key={component.id}
                component={component}
                onInstall={handleInstall}
                onUninstall={handleUninstall}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
    </component-browser>
  </marketplace-integration>
</component-marketplace>

<n8n-workflow-integration>
<workflow-architecture>
  <workflow-concepts>
    <concept name="Workflow Triggers">
      <trigger name="Content Published">When new content is published in CMS</trigger>
      <trigger name="Form Submitted">When contact or other forms are submitted</trigger>
      <trigger name="User Registered">When new users register</trigger>
      <trigger name="Event Scheduled">Time-based workflow triggers</trigger>
      <trigger name="API Webhook">External service webhooks</trigger>
    </concept>
    
    <concept name="Workflow Actions">
      <action name="Send Email">Email notifications and campaigns</action>
      <action name="Update CMS">Modify CMS content</action>
      <action name="Social Media">Post to social platforms</action>
      <action name="Analytics">Send events to analytics</action>
      <action name="File Processing">Process uploaded files</action>
    </concept>
    
    <concept name="Data Flow">
      <flow>LEAN CMS → n8n Webhook → Workflow Processing → External Services</flow>
      <flow>External Services → n8n → LEAN CMS API → Content Updates</flow>
    </concept>
  </workflow-concepts>
  
  <webhook-configuration>
    <webhook-setup path="src/lib/n8n-integration.ts">
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export interface N8NWebhookConfig {
  url: string
  secret: string
  workflows: {
    [key: string]: {
      id: string
      name: string
      enabled: boolean
    }
  }
}

export class N8NIntegration {
  private config: N8NWebhookConfig
  
  constructor(config: N8NWebhookConfig) {
    this.config = config
  }
  
  // Send data to n8n workflow
  async triggerWorkflow(workflowName: string, data: any): Promise<void> {
    const workflow = this.config.workflows[workflowName]
    if (!workflow || !workflow.enabled) {
      console.warn(`Workflow '${workflowName}' is not enabled`)
      return
    }
    
    const webhookUrl = `${this.config.url}/webhook/${workflow.id}`
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-Webhook-Secret': this.config.secret
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          workflow: workflowName,
          data
        })
      })
      
      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.statusText}`)
      }
      
      console.log(`Triggered n8n workflow: ${workflowName}`)
    } catch (error) {
      console.error(`Failed to trigger n8n workflow '${workflowName}':`, error)
      throw error
    }
  }
  
  // Verify incoming webhook from n8n
  verifyWebhook(req: NextRequest): boolean {
    const signature = req.headers.get('x-n8n-signature')
    const body = req.body
    
    if (!signature || !body) {
      return false
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', this.config.secret)
      .update(JSON.stringify(body))
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
  
  // Handle incoming webhook from n8n
  async handleIncomingWebhook(req: NextRequest): Promise<NextResponse> {
    if (!this.verifyWebhook(req)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }
    
    try {
      const payload = await req.json()
      await this.processWebhookPayload(payload)
      
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Webhook processing failed:', error)
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 500 }
      )
    }
  }
  
  private async processWebhookPayload(payload: any): Promise<void> {
    const { action, data } = payload
    
    switch (action) {
      case 'update_content':
        await this.updateContent(data)
        break
        
      case 'send_notification':
        await this.sendNotification(data)
        break
        
      case 'sync_social_media':
        await this.syncSocialMedia(data)
        break
        
      default:
        console.warn(`Unknown webhook action: ${action}`)
    }
  }
  
  private async updateContent(data: any): Promise<void> {
    // Update CMS content based on n8n workflow results
  }
  
  private async sendNotification(data: any): Promise<void> {
    // Send notifications based on n8n workflow
  }
  
  private async syncSocialMedia(data: any): Promise<void> {
    // Sync social media content
  }
}

// Global n8n integration instance
export const n8nIntegration = new N8NIntegration({
  url: process.env.N8N_WEBHOOK_URL || '',
  secret: process.env.N8N_WEBHOOK_SECRET || '',
  workflows: {
    contactForm: {
      id: 'contact-form-processor',
      name: 'Contact Form Processing',
      enabled: true
    },
    contentPublished: {
      id: 'content-publisher',
      name: 'Content Publishing Automation',
      enabled: true
    },
    socialMediaSync: {
      id: 'social-sync',
      name: 'Social Media Synchronization',
      enabled: false
    }
  }
})
    </webhook-setup>
    
    <workflow-triggers path="src/lib/workflow-triggers.ts">
import { n8nIntegration } from './n8n-integration'

export class WorkflowTriggers {
  // Trigger when contact form is submitted
  static async onContactFormSubmit(formData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<void> {
    await n8nIntegration.triggerWorkflow('contactForm', {
      type: 'contact_form_submitted',
      form: formData,
      timestamp: new Date().toISOString(),
      source: 'website_contact_form'
    })
  }
  
  // Trigger when content is published
  static async onContentPublished(content: {
    id: string
    type: string
    title: string
    slug: string
    author: string
  }): Promise<void> {
    await n8nIntegration.triggerWorkflow('contentPublished', {
      type: 'content_published',
      content,
      timestamp: new Date().toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${content.slug}`
    })
  }
  
  // Trigger when user registers
  static async onUserRegistered(user: {
    id: string
    email: string
    name: string
    role: string
  }): Promise<void> {
    await n8nIntegration.triggerWorkflow('userManagement', {
      type: 'user_registered',
      user,
      timestamp: new Date().toISOString(),
      welcomeEmailRequired: true
    })
  }
  
  // Trigger when tour event is created
  static async onTourEventCreated(event: {
    id: string
    name: string
    venue: string
    date: string
    ticketUrl?: string
  }): Promise<void> {
    await n8nIntegration.triggerWorkflow('tourManagement', {
      type: 'tour_event_created',
      event,
      timestamp: new Date().toISOString(),
      socialMediaAnnouncement: true
    })
  }
  
  // Trigger for scheduled tasks
  static async onScheduledTask(taskName: string, data: any): Promise<void> {
    await n8nIntegration.triggerWorkflow('scheduledTasks', {
      type: 'scheduled_task',
      taskName,
      data,
      timestamp: new Date().toISOString()
    })
  }
}
    </workflow-triggers>
  </webhook-configuration>
  
  <workflow-examples>
    <contact-form-workflow>
      <description>Process contact form submissions with email notifications and CRM integration</description>
      <steps>
        <step number="1">Receive webhook from LEAN CMS</step>
        <step number="2">Validate and sanitize form data</step>
        <step number="3">Send confirmation email to user</step>
        <step number="4">Send notification email to admin</step>
        <step number="5">Add contact to CRM system</step>
        <step number="6">Log interaction in analytics</step>
      </steps>
      
      <n8n-workflow-json>
{
  "name": "Contact Form Processing",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "contact-form",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Validate Data",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Validate incoming form data\nconst { name, email, subject, message } = items[0].json.data.form;\n\nif (!name || !email || !message) {\n  throw new Error('Required fields missing');\n}\n\nreturn items.map(item => ({\n  json: {\n    ...item.json,\n    validated: true\n  }\n}));"
      }
    },
    {
      "name": "Send Confirmation Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "fromEmail": "noreply@yoursite.com",
        "toEmail": "={{$json.data.form.email}}",
        "subject": "Thank you for your message",
        "text": "Hi {{$json.data.form.name}},\n\nThank you for reaching out. We've received your message about '{{$json.data.form.subject}}' and will get back to you soon.\n\nBest regards,\nThe Team"
      }
    },
    {
      "name": "Notify Admin",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "fromEmail": "website@yoursite.com",
        "toEmail": "admin@yoursite.com",
        "subject": "New Contact Form Submission",
        "text": "New message from {{$json.data.form.name}} ({{$json.data.form.email}}):\n\nSubject: {{$json.data.form.subject}}\nMessage: {{$json.data.form.message}}"
      }
    },
    {
      "name": "Add to CRM",
      "type": "n8n-nodes-base.hubspot",
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "email": "={{$json.data.form.email}}",
        "firstname": "={{$json.data.form.name}}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Validate Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Data": {
      "main": [
        [
          {
            "node": "Send Confirmation Email",
            "type": "main",
            "index": 0
          },
          {
            "node": "Notify Admin",
            "type": "main",
            "index": 0
          },
          {
            "node": "Add to CRM",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
      </n8n-workflow-json>
    </contact-form-workflow>
    
    <content-publishing-workflow>
      <description>Automatically share new content to social media and email subscribers</description>
      <steps>
        <step number="1">Receive content published webhook</step>
        <step number="2">Generate social media posts</step>
        <step number="3">Post to Twitter/X</step>
        <step number="4">Post to Instagram</step>
        <step number="5">Send email to subscribers</step>
        <step number="6">Update analytics</step>
      </steps>
    </content-publishing-workflow>
    
    <tour-management-workflow>
      <description>Manage tour announcements and ticket sales integration</description>
      <steps>
        <step number="1">New tour event webhook</step>
        <step number="2">Create ticket listing</step>
        <step number="3">Generate promotional materials</step>
        <step number="4">Schedule social media posts</step>
        <step number="5">Add to calendar systems</step>
        <step number="6">Notify email subscribers</step>
      </steps>
    </tour-management-workflow>
  </workflow-examples>
</n8n-workflow-integration>

<third-party-integrations>
<email-service-integrations>
  <sendgrid-integration path="src/integrations/email/sendgrid.ts">
import sgMail from '@sendgrid/mail'

export interface SendGridConfig {
  apiKey: string
  fromEmail: string
  fromName: string
  templates: {
    welcome: string
    contactConfirmation: string
    newsletter: string
  }
}

export class SendGridIntegration {
  private config: SendGridConfig
  
  constructor(config: SendGridConfig) {
    this.config = config
    sgMail.setApiKey(config.apiKey)
  }
  
  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const msg = {
      to,
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName
      },
      subject,
      text: content,
      html: content
    }
    
    try {
      await sgMail.send(msg)
      console.log(`Email sent to ${to}`)
    } catch (error) {
      console.error('SendGrid email failed:', error)
      throw error
    }
  }
  
  async sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, any>
  ): Promise<void> {
    const msg = {
      to,
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName
      },
      templateId,
      dynamicTemplateData: dynamicData
    }
    
    try {
      await sgMail.send(msg)
      console.log(`Template email sent to ${to}`)
    } catch (error) {
      console.error('SendGrid template email failed:', error)
      throw error
    }
  }
  
  async addToList(email: string, listId: string): Promise<void> {
    const data = {
      contacts: [{ email }],
      list_ids: [listId]
    }
    
    try {
      await sgMail.request({
        url: `/v3/marketing/contacts`,
        method: 'PUT',
        body: data
      })
      console.log(`Added ${email} to list ${listId}`)
    } catch (error) {
      console.error('Failed to add contact to list:', error)
      throw error
    }
  }
}

export const sendGridIntegration = new SendGridIntegration({
  apiKey: process.env.SENDGRID_API_KEY || '',
  fromEmail: process.env.FROM_EMAIL || 'noreply@yoursite.com',
  fromName: process.env.FROM_NAME || 'Your Site',
  templates: {
    welcome: process.env.SENDGRID_WELCOME_TEMPLATE || '',
    contactConfirmation: process.env.SENDGRID_CONTACT_TEMPLATE || '',
    newsletter: process.env.SENDGRID_NEWSLETTER_TEMPLATE || ''
  }
})
  </sendgrid-integration>
  
  <mailchimp-integration path="src/integrations/email/mailchimp.ts">
import mailchimp from '@mailchimp/mailchimp_marketing'

export interface MailchimpConfig {
  apiKey: string
  server: string
  audienceId: string
}

export class MailchimpIntegration {
  private config: MailchimpConfig
  
  constructor(config: MailchimpConfig) {
    this.config = config
    
    mailchimp.setConfig({
      apiKey: config.apiKey,
      server: config.server
    })
  }
  
  async addSubscriber(email: string, firstName?: string, lastName?: string): Promise<void> {
    try {
      const response = await mailchimp.lists.addListMember(this.config.audienceId, {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          ...(firstName && { FNAME: firstName }),
          ...(lastName && { LNAME: lastName })
        }
      })
      
      console.log('Added subscriber to Mailchimp:', response.id)
    } catch (error) {
      console.error('Mailchimp subscription failed:', error)
      throw error
    }
  }
  
  async createCampaign(subject: string, content: string): Promise<string> {
    try {
      const campaign = await mailchimp.campaigns.create({
        type: 'regular',
        recipients: {
          list_id: this.config.audienceId
        },
        settings: {
          subject_line: subject,
          from_name: process.env.FROM_NAME || 'Your Site',
          reply_to: process.env.FROM_EMAIL || 'noreply@yoursite.com'
        }
      })
      
      await mailchimp.campaigns.setContent(campaign.id, {
        html: content
      })
      
      return campaign.id
    } catch (error) {
      console.error('Failed to create Mailchimp campaign:', error)
      throw error
    }
  }
  
  async sendCampaign(campaignId: string): Promise<void> {
    try {
      await mailchimp.campaigns.send(campaignId)
      console.log(`Sent campaign ${campaignId}`)
    } catch (error) {
      console.error('Failed to send campaign:', error)
      throw error
    }
  }
}
  </mailchimp-integration>
</email-service-integrations>

<social-media-integrations>
  <instagram-integration path="src/integrations/social/instagram.ts">
export interface InstagramConfig {
  accessToken: string
  userId: string
  webhookSecret: string
}

export class InstagramIntegration {
  private config: InstagramConfig
  private baseUrl = 'https://graph.instagram.com/v18.0'
  
  constructor(config: InstagramConfig) {
    this.config = config
  }
  
  async getUserMedia(limit: number = 25): Promise<any[]> {
    const url = `${this.baseUrl}/${this.config.userId}/media`
    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
      limit: limit.toString(),
      access_token: this.config.accessToken
    })
    
    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Instagram API error')
      }
      
      return data.data || []
    } catch (error) {
      console.error('Failed to fetch Instagram media:', error)
      throw error
    }
  }
  
  async getMediaDetails(mediaId: string): Promise<any> {
    const url = `${this.baseUrl}/${mediaId}`
    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
      access_token: this.config.accessToken
    })
    
    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Instagram API error')
      }
      
      return data
    } catch (error) {
      console.error('Failed to fetch Instagram media details:', error)
      throw error
    }
  }
  
  async syncToGallery(): Promise<void> {
    try {
      const media = await this.getUserMedia(50)
      
      for (const item of media) {
        await this.saveToGallery({
          id: `instagram_${item.id}`,
          type: item.media_type.toLowerCase() === 'video' ? 'video' : 'image',
          url: item.media_url,
          thumbnailUrl: item.thumbnail_url || item.media_url,
          caption: item.caption || '',
          category: ['social', 'instagram'],
          metadata: {
            instagramId: item.id,
            permalink: item.permalink,
            timestamp: item.timestamp
          }
        })
      }
      
      console.log(`Synced ${media.length} Instagram posts to gallery`)
    } catch (error) {
      console.error('Instagram sync failed:', error)
      throw error
    }
  }
  
  private async saveToGallery(itemData: any): Promise<void> {
    // Save to CMS gallery collection
    // Implementation depends on your CMS setup
  }
}
  </instagram-integration>
  
  <twitter-integration path="src/integrations/social/twitter.ts">
export interface TwitterConfig {
  apiKey: string
  apiSecret: string
  accessToken: string
  accessTokenSecret: string
  bearerToken: string
}

export class TwitterIntegration {
  private config: TwitterConfig
  private baseUrl = 'https://api.twitter.com/2'
  
  constructor(config: TwitterConfig) {
    this.config = config
  }
  
  async postTweet(text: string, mediaIds?: string[]): Promise<string> {
    const url = `${this.baseUrl}/tweets`
    
    const body: any = {
      text
    }
    
    if (mediaIds?.length) {
      body.media = {
        media_ids: mediaIds
      }
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Twitter API error')
      }
      
      return data.data.id
    } catch (error) {
      console.error('Failed to post tweet:', error)
      throw error
    }
  }
  
  async uploadMedia(mediaUrl: string): Promise<string> {
    // Download media from URL
    const mediaResponse = await fetch(mediaUrl)
    const mediaBuffer = await mediaResponse.arrayBuffer()
    
    // Upload to Twitter
    const uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json'
    
    const formData = new FormData()
    formData.append('media', new Blob([mediaBuffer]))
    
    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`
        },
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Media upload failed')
      }
      
      return data.media_id_string
    } catch (error) {
      console.error('Failed to upload media to Twitter:', error)
      throw error
    }
  }
  
  async announceNewContent(content: {
    title: string
    url: string
    imageUrl?: string
  }): Promise<void> {
    let tweetText = `🎵 New content: ${content.title}\n\n${content.url}\n\n#music #newrelease`
    
    let mediaIds: string[] = []
    if (content.imageUrl) {
      const mediaId = await this.uploadMedia(content.imageUrl)
      mediaIds.push(mediaId)
    }
    
    await this.postTweet(tweetText, mediaIds)
  }
}
  </twitter-integration>
</social-media-integrations>

<analytics-integrations>
  <google-analytics-integration path="src/integrations/analytics/google-analytics.ts">
import { BetaAnalyticsDataClient } from '@google-analytics/data'

export interface GoogleAnalyticsConfig {
  propertyId: string
  keyFilename?: string
  credentials?: any
}

export class GoogleAnalyticsIntegration {
  private client: BetaAnalyticsDataClient
  private propertyId: string
  
  constructor(config: GoogleAnalyticsConfig) {
    this.propertyId = config.propertyId
    
    this.client = new BetaAnalyticsDataClient({
      keyFilename: config.keyFilename,
      credentials: config.credentials
    })
  }
  
  async getPageViews(startDate: string, endDate: string): Promise<any> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate
          }
        ],
        dimensions: [
          {
            name: 'pagePath'
          }
        ],
        metrics: [
          {
            name: 'screenPageViews'
          },
          {
            name: 'activeUsers'
          }
        ]
      })
      
      return response.rows?.map(row => ({
        path: row.dimensionValues?.[0]?.value,
        pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
        users: parseInt(row.metricValues?.[1]?.value || '0')
      })) || []
    } catch (error) {
      console.error('Failed to fetch Google Analytics data:', error)
      throw error
    }
  }
  
  async getTopPages(days: number = 30): Promise<any> {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    
    return this.getPageViews(startDate, endDate)
  }
  
  async trackEvent(eventName: string, parameters: Record<string, any>): Promise<void> {
    // For tracking events, you would typically use the client-side gtag
    // This is more for reading data
    console.log(`Event tracked: ${eventName}`, parameters)
  }
}
  </google-analytics-integration>
  
  <plausible-integration path="src/integrations/analytics/plausible.ts">
export interface PlausibleConfig {
  domain: string
  apiKey: string
}

export class PlausibleIntegration {
  private config: PlausibleConfig
  private baseUrl = 'https://plausible.io/api/v1'
  
  constructor(config: PlausibleConfig) {
    this.config = config
  }
  
  async getStats(period: string = '30d'): Promise<any> {
    const url = `${this.baseUrl}/stats/aggregate`
    const params = new URLSearchParams({
      site_id: this.config.domain,
      period,
      metrics: 'visitors,pageviews,bounce_rate,visit_duration'
    })
    
    try {
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Plausible API error')
      }
      
      return data.results
    } catch (error) {
      console.error('Failed to fetch Plausible stats:', error)
      throw error
    }
  }
  
  async getTopPages(period: string = '30d'): Promise<any> {
    const url = `${this.baseUrl}/stats/breakdown`
    const params = new URLSearchParams({
      site_id: this.config.domain,
      period,
      property: 'page',
      metrics: 'visitors,pageviews'
    })
    
    try {
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Plausible API error')
      }
      
      return data.results
    } catch (error) {
      console.error('Failed to fetch Plausible top pages:', error)
      throw error
    }
  }
  
  async trackEvent(eventName: string, url: string, props?: Record<string, any>): Promise<void> {
    const apiUrl = `${this.baseUrl}/event`
    
    const body = {
      name: eventName,
      url,
      domain: this.config.domain,
      ...(props && { props })
    }
    
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(body)
      })
    } catch (error) {
      console.error('Failed to track Plausible event:', error)
      throw error
    }
  }
}
  </plausible-integration>
</analytics-integrations>
</third-party-integrations>

<custom-extension-patterns>
<custom-field-types>
  <rich-media-field path="src/extensions/fields/RichMediaField.tsx">
import React, { useState, useCallback } from 'react'
import { useField } from 'payload/components/forms'
import { FieldType } from 'payload/types'

export interface RichMediaFieldType extends FieldType {
  name: string
  type: 'richMedia'
  allowedTypes?: ('image' | 'video' | 'audio' | 'document')[]
  maxFiles?: number
  gallery?: boolean
}

export const RichMediaField: React.FC<RichMediaFieldType> = ({
  name,
  path: pathFromProps,
  allowedTypes = ['image', 'video'],
  maxFiles = 10,
  gallery = true,
  ...props
}) => {
  const path = pathFromProps || name
  const { value, setValue } = useField({ path })
  
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const handleFileDrop = useCallback(async (files: FileList) => {
    setUploading(true)
    try {
      const uploadedFiles = []
      
      for (const file of Array.from(files)) {
        if (uploadedFiles.length >= maxFiles) break
        
        const fileType = file.type.split('/')[0]
        if (!allowedTypes.includes(fileType as any)) continue
        
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const uploadedFile = await response.json()
          uploadedFiles.push({
            id: uploadedFile.id,
            filename: uploadedFile.filename,
            mimeType: uploadedFile.mimeType,
            url: uploadedFile.url,
            thumbnailUrl: uploadedFile.thumbnailUrl,
            type: fileType
          })
        }
      }
      
      setValue([...(value || []), ...uploadedFiles])
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }, [value, setValue, allowedTypes, maxFiles])
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileDrop(e.dataTransfer.files)
  }
  
  const removeFile = (index: number) => {
    const newValue = [...(value || [])]
    newValue.splice(index, 1)
    setValue(newValue)
  }
  
  return (
    <div className="rich-media-field">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="uploading">
            <div className="spinner" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="upload-prompt">
            <p>Drag & drop files here or click to select</p>
            <p className="file-types">
              Allowed: {allowedTypes.join(', ')}
            </p>
          </div>
        )}
      </div>
      
      {value && value.length > 0 && (
        <div className={`media-grid ${gallery ? 'gallery-view' : 'list-view'}`}>
          {value.map((item: any, index: number) => (
            <div key={item.id || index} className="media-item">
              {item.type === 'image' ? (
                <img src={item.thumbnailUrl || item.url} alt={item.filename} />
              ) : item.type === 'video' ? (
                <video src={item.url} controls />
              ) : (
                <div className="file-icon">
                  <span>{item.filename}</span>
                </div>
              )}
              
              <div className="media-controls">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Field registration
export const richMediaField = {
  name: 'richMedia',
  component: RichMediaField,
  validate: (value: any[], { allowedTypes, maxFiles }: RichMediaFieldType) => {
    if (!value) return true
    
    if (maxFiles && value.length > maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }
    
    return true
  }
}
  </rich-media-field>
  
  <location-field path="src/extensions/fields/LocationField.tsx">
import React, { useState, useEffect } from 'react'
import { useField } from 'payload/components/forms'

export interface LocationFieldValue {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export interface LocationFieldType {
  name: string
  type: 'location'
  googleMapsApiKey?: string
  defaultZoom?: number
  required?: boolean
}

export const LocationField: React.FC<LocationFieldType> = ({
  name,
  path: pathFromProps,
  googleMapsApiKey,
  defaultZoom = 13,
  ...props
}) => {
  const path = pathFromProps || name
  const { value, setValue } = useField<LocationFieldValue>({ path })
  
  const [address, setAddress] = useState(value?.address || '')
  const [isLoading, setIsLoading] = useState(false)
  
  const geocodeAddress = async (addressInput: string) => {
    if (!addressInput || !googleMapsApiKey) return
    
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressInput)}&key=${googleMapsApiKey}`
      )
      const data = await response.json()
      
      if (data.results && data.results[0]) {
        const result = data.results[0]
        const location = result.geometry.location
        
        // Parse address components
        const addressComponents = result.address_components.reduce((acc: any, component: any) => {
          component.types.forEach((type: string) => {
            acc[type] = component.long_name
          })
          return acc
        }, {})
        
        setValue({
          address: result.formatted_address,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          },
          city: addressComponents.locality,
          state: addressComponents.administrative_area_level_1,
          country: addressComponents.country,
          postalCode: addressComponents.postal_code
        })
      }
    } catch (error) {
      console.error('Geocoding failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }
  
  const handleAddressBlur = () => {
    if (address !== value?.address) {
      geocodeAddress(address)
    }
  }
  
  return (
    <div className="location-field">
      <div className="address-input">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          onBlur={handleAddressBlur}
          placeholder="Enter address..."
          disabled={isLoading}
        />
        {isLoading && <span className="loading">Geocoding...</span>}
      </div>
      
      {value?.coordinates && (
        <div className="location-details">
          <div className="coordinates">
            <span>Lat: {value.coordinates.lat.toFixed(6)}</span>
            <span>Lng: {value.coordinates.lng.toFixed(6)}</span>
          </div>
          
          <div className="address-components">
            {value.city && <span className="city">{value.city}</span>}
            {value.state && <span className="state">{value.state}</span>}
            {value.country && <span className="country">{value.country}</span>}
          </div>
          
          {googleMapsApiKey && (
            <div className="map-preview">
              <iframe
                width="100%"
                height="200"
                src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${value.coordinates.lat},${value.coordinates.lng}&zoom=${defaultZoom}`}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
  </location-field>
</custom-field-types>

<custom-collections>
  <events-collection path="src/extensions/collections/events.ts">
import { CollectionConfig } from 'payload/types'
import { LocationField } from '../fields/LocationField'
import { RichMediaField } from '../fields/RichMediaField'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultSort: 'date',
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Event Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the event name',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Detailed event description',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Event Date & Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'location',
      required: true,
      label: 'Event Location',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    } as any,
    {
      name: 'venue',
      type: 'group',
      label: 'Venue Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Venue Name',
        },
        {
          name: 'capacity',
          type: 'number',
          label: 'Capacity',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Venue Website',
          validate: (val) => {
            if (val && !val.match(/^https?:\/\/.+/)) {
              return 'Please enter a valid URL'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'ticketing',
      type: 'group',
      label: 'Ticket Information',
      fields: [
        {
          name: 'ticketUrl',
          type: 'text',
          label: 'Ticket URL',
          validate: (val) => {
            if (val && !val.match(/^https?:\/\/.+/)) {
              return 'Please enter a valid URL'
            }
            return true
          },
        },
        {
          name: 'price',
          type: 'group',
          fields: [
            {
              name: 'min',
              type: 'number',
              label: 'Minimum Price',
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'max',
              type: 'number',
              label: 'Maximum Price',
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'USD',
              options: [
                { label: 'US Dollar', value: 'USD' },
                { label: 'Euro', value: 'EUR' },
                { label: 'British Pound', value: 'GBP' },
                { label: 'Canadian Dollar', value: 'CAD' },
              ],
            },
          ],
        },
        {
          name: 'soldOut',
          type: 'checkbox',
          defaultValue: false,
          label: 'Sold Out',
        },
        {
          name: 'salesEndDate',
          type: 'date',
          label: 'Ticket Sales End',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'media',
      type: 'richMedia',
      label: 'Event Media',
      allowedTypes: ['image', 'video'],
      maxFiles: 20,
      gallery: true,
    } as any,
    {
      name: 'lineup',
      type: 'array',
      label: 'Event Lineup',
      fields: [
        {
          name: 'artist',
          type: 'text',
          required: true,
          label: 'Artist Name',
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Headliner', value: 'headliner' },
            { label: 'Support Act', value: 'support' },
            { label: 'DJ Set', value: 'dj' },
            { label: 'Special Guest', value: 'guest' },
          ],
          defaultValue: 'support',
        },
        {
          name: 'setTime',
          type: 'text',
          label: 'Set Time',
          admin: {
            placeholder: 'e.g., 9:00 PM - 10:30 PM',
          },
        },
      ],
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      label: 'Event Categories',
      options: [
        { label: 'Concert', value: 'concert' },
        { label: 'Festival', value: 'festival' },
        { label: 'Club Night', value: 'club' },
        { label: 'Private Event', value: 'private' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Masterclass', value: 'masterclass' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Event',
      admin: {
        description: 'Show this event prominently on the homepage',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Postponed', value: 'postponed' },
        { label: 'Completed', value: 'completed' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          // Trigger n8n workflow for event updates
          if (doc.status === 'published') {
            // Send webhook to n8n
            try {
              await fetch(`${process.env.N8N_WEBHOOK_URL}/event-published`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': process.env.N8N_WEBHOOK_SECRET || '',
                },
                body: JSON.stringify({
                  event: doc,
                  operation,
                  timestamp: new Date().toISOString(),
                }),
              })
            } catch (error) {
              console.error('Failed to trigger event webhook:', error)
            }
          }
        }
      },
    ],
  },
}
  </events-collection>
</custom-collections>

<api-extensions>
  <custom-endpoints path="src/extensions/api/events.ts">
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Get upcoming events
export async function getUpcomingEvents(req: NextRequest) {
  const payload = await getPayload({ config })
  
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const featured = searchParams.get('featured') === 'true'
  
  try {
    const events = await payload.find({
      collection: 'events',
      where: {
        and: [
          {
            date: {
              greater_than: new Date().toISOString()
            }
          },
          {
            status: {
              equals: 'published'
            }
          },
          ...(featured ? [{
            featured: {
              equals: true
            }
          }] : [])
        ]
      },
      limit,
      sort: 'date'
    })
    
    return NextResponse.json({
      success: true,
      data: events.docs,
      pagination: {
        page: events.page,
        limit: events.limit,
        total: events.totalDocs,
        totalPages: events.totalPages
      }
    })
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch events'
      }
    }, { status: 500 })
  }
}

// Get events by location
export async function getEventsByLocation(req: NextRequest) {
  const payload = await getPayload({ config })
  
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')
  const state = searchParams.get('state')
  const radius = parseInt(searchParams.get('radius') || '50') // miles
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  
  try {
    let whereClause: any = {
      status: { equals: 'published' },
      date: { greater_than: new Date().toISOString() }
    }
    
    // Filter by city/state if provided
    if (city) {
      whereClause['location.city'] = { equals: city }
    }
    if (state) {
      whereClause['location.state'] = { equals: state }
    }
    
    const events = await payload.find({
      collection: 'events',
      where: whereClause,
      limit: 100 // We'll filter by radius client-side for simplicity
    })
    
    // Filter by radius if lat/lng provided
    let filteredEvents = events.docs
    if (lat !== 0 && lng !== 0) {
      filteredEvents = events.docs.filter((event: any) => {
        if (!event.location?.coordinates) return false
        
        const distance = calculateDistance(
          lat, lng,
          event.location.coordinates.lat,
          event.location.coordinates.lng
        )
        
        return distance <= radius
      })
    }
    
    return NextResponse.json({
      success: true,
      data: filteredEvents,
      meta: {
        total: filteredEvents.length,
        filters: { city, state, radius, lat, lng }
      }
    })
  } catch (error) {
    console.error('Failed to fetch events by location:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'LOCATION_FETCH_FAILED',
        message: 'Failed to fetch events by location'
      }
    }, { status: 500 })
  }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

// Export handlers for Next.js API routes
export { getUpcomingEvents as GET }

// Event statistics endpoint
export async function getEventStats(req: NextRequest) {
  const payload = await getPayload({ config })
  
  try {
    const [total, upcoming, completed, featured] = await Promise.all([
      payload.count({ collection: 'events' }),
      payload.count({
        collection: 'events',
        where: {
          and: [
            { date: { greater_than: new Date().toISOString() } },
            { status: { equals: 'published' } }
          ]
        }
      }),
      payload.count({
        collection: 'events',
        where: {
          and: [
            { date: { less_than: new Date().toISOString() } },
            { status: { equals: 'completed' } }
          ]
        }
      }),
      payload.count({
        collection: 'events',
        where: {
          featured: { equals: true }
        }
      })
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        total: total.totalDocs,
        upcoming: upcoming.totalDocs,
        completed: completed.totalDocs,
        featured: featured.totalDocs
      }
    })
  } catch (error) {
    console.error('Failed to fetch event stats:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'STATS_FETCH_FAILED',
        message: 'Failed to fetch event statistics'
      }
    }, { status: 500 })
  }
}
  </api-extensions>
</custom-collections>
</custom-extension-patterns>

<marketplace-publishing>
<publishing-guidelines>
  <quality-checklist>
    <requirement name="Code Quality">
      <criteria>TypeScript with strict types</criteria>
      <criteria>ESLint and Prettier compliance</criteria>
      <criteria>No console.log statements</criteria>
      <criteria>Proper error handling</criteria>
    </requirement>
    
    <requirement name="Documentation">
      <criteria>Complete README with examples</criteria>
      <criteria>API documentation for components</criteria>
      <criteria>Configuration options explained</criteria>
      <criteria>Installation instructions</criteria>
    </requirement>
    
    <requirement name="Testing">
      <criteria>Unit tests with >80% coverage</criteria>
      <criteria>Integration tests for components</criteria>
      <criteria>Example implementations work</criteria>
      <criteria>Performance benchmarks included</criteria>
    </requirement>
    
    <requirement name="Accessibility">
      <criteria>WCAG 2.1 AA compliance</criteria>
      <criteria>Keyboard navigation support</criteria>
      <criteria>Screen reader compatibility</criteria>
      <criteria>Focus management</criteria>
    </requirement>
    
    <requirement name="Performance">
      <criteria>Lighthouse performance score >90</criteria>
      <criteria>Bundle size optimization</criteria>
      <criteria>Lazy loading where appropriate</criteria>
      <criteria>No memory leaks</criteria>
    </requirement>
  </quality-checklist>
  
  <submission-process>
    <step number="1">
      <title>Prepare Package</title>
      <tasks>
        <task>Complete development and testing</task>
        <task>Write comprehensive documentation</task>
        <task>Create component manifest</task>
        <task>Generate preview images/videos</task>
      </tasks>
    </step>
    
    <step number="2">
      <title>Submit for Review</title>
      <tasks>
        <task>Submit via marketplace portal</task>
        <task>Include all required metadata</task>
        <task>Provide test cases and examples</task>
        <task>Complete author verification</task>
      </tasks>
    </step>
    
    <step number="3">
      <title>Quality Assurance</title>
      <tasks>
        <task>Automated testing pipeline</task>
        <task>Code review by maintainers</task>
        <task>Security vulnerability scan</task>
        <task>Performance benchmarking</task>
      </tasks>
    </step>
    
    <step number="4">
      <title>Publication</title>
      <tasks>
        <task>Component approved and published</task>
        <task>Listed in marketplace directory</task>
        <task>Available via CLI installation</task>
        <task>Documentation indexed for search</task>
      </tasks>
    </step>
  </submission-process>
</publishing-guidelines>

<monetization-options>
  <pricing-models>
    <model name="Free">
      <description>Open source components with MIT/Apache license</description>
      <benefits>Wide adoption, community contributions, portfolio building</benefits>
    </model>
    
    <model name="Freemium">
      <description>Basic version free, premium features paid</description>
      <pricing>$0 basic, $29-99 premium features</pricing>
    </model>
    
    <model name="One-time Purchase">
      <description>Single payment for lifetime usage</description>
      <pricing>$49-299 depending on complexity</pricing>
    </model>
    
    <model name="Subscription">
      <description>Monthly/yearly subscription with updates</description>
      <pricing>$9-29/month or $99-299/year</pricing>
    </model>
  </pricing-models>
  
  <revenue-sharing>
    <marketplace-fee>20% of gross sales</marketplace-fee>
    <payment-processing>2.9% + $0.30 per transaction</payment-processing>
    <developer-payout>Monthly payments via Stripe Connect</developer-payout>
    <minimum-payout>$50 minimum for payout</minimum-payout>
  </revenue-sharing>
</monetization-options>
</marketplace-publishing>

<community-ecosystem>
<contribution-guidelines>
  <open-source-contributions>
    <framework-core>Core framework improvements and bug fixes</framework-core>
    <documentation>Documentation improvements and translations</documentation>
    <starter-templates>New website templates and examples</starter-templates>
    <integrations>Third-party service integrations</integrations>
  </open-source-contributions>
  
  <community-resources>
    <discord-server>Real-time community support and discussions</discord-server>
    <github-discussions>Feature requests and technical discussions</github-discussions>
    <blog-tutorials>Community-written tutorials and guides</blog-tutorials>
    <showcase-gallery>Community websites built with LEAN CMS</showcase-gallery>
  </community-resources>
</contribution-guidelines>

<support-ecosystem>
  <documentation-tiers>
    <tier name="Community Docs">
      <access>Free, publicly available</access>
      <content>Basic guides, API reference, examples</content>
    </tier>
    
    <tier name="Premium Docs">
      <access>Paid subscribers only</access>
      <content>Advanced tutorials, video courses, exclusive content</content>
    </tier>
  </documentation-tiers>
  
  <support-channels>
    <channel name="Community Forum">
      <type>Self-service community support</type>
      <response-time>Best effort by community</response-time>
    </channel>
    
    <channel name="Priority Support">
      <type>Direct access to core team</type>
      <response-time>24-48 hours</response-time>
      <pricing>$99/month per developer</pricing>
    </channel>
    
    <channel name="Enterprise Support">
      <type>Dedicated support engineer</type>
      <response-time>4-8 hours</response-time>
      <pricing>$499/month + custom SLA</pricing>
    </channel>
  </support-channels>
</support-ecosystem>
</community-ecosystem>