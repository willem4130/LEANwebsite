/**
 * Plugin Marketplace Architecture
 * ===============================
 * 
 * Comprehensive system for plugin discovery, installation, management,
 * and monetization with security sandboxing and dependency resolution
 */

import { z } from 'zod'
import { webhookRegistry } from './webhook-integration'
import { componentRegistry } from './component-management'

// ================================
// 1. PLUGIN METADATA & MANIFEST
// ================================

export const PluginManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  category: z.enum([
    'analytics',
    'seo',
    'social-media',
    'e-commerce',
    'forms',
    'media',
    'security',
    'performance',
    'ui-components',
    'integrations',
    'utilities',
    'developer-tools'
  ]),
  tags: z.array(z.string()),
  
  // Author & Publishing Info
  author: z.object({
    name: z.string(),
    email: z.string().email(),
    url: z.string().url().optional(),
    verified: z.boolean().default(false),
  }),
  publisher: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    verified: z.boolean().default(false),
  }),
  
  // Technical Specifications
  main: z.string(), // Entry point file
  dependencies: z.record(z.string(), z.string()),
  peerDependencies: z.record(z.string(), z.string()).optional(),
  engines: z.object({
    node: z.string().optional(),
    npm: z.string().optional(),
    'lean-cms': z.string(),
  }),
  
  // Plugin Capabilities
  capabilities: z.object({
    hooks: z.array(z.string()).default([]), // CMS hooks this plugin uses
    api: z.array(z.string()).default([]), // API endpoints provided
    components: z.array(z.string()).default([]), // UI components provided
    admin: z.boolean().default(false), // Requires admin panel access
    database: z.boolean().default(false), // Requires database access
    filesystem: z.boolean().default(false), // Requires file system access
    network: z.boolean().default(false), // Requires network access
  }),
  
  // Configuration & Settings
  config: z.object({
    schema: z.record(z.string(), z.any()), // JSON Schema for plugin configuration
    defaults: z.record(z.string(), z.any()).default({}),
    required: z.array(z.string()).default([]),
  }).optional(),
  
  // Marketplace Information
  marketplace: z.object({
    featured: z.boolean().default(false),
    price: z.number().min(0).default(0), // Price in cents
    currency: z.string().default('USD'),
    license: z.string().default('MIT'),
    trial: z.object({
      enabled: z.boolean().default(false),
      days: z.number().min(1).max(90).default(14),
    }).optional(),
    subscription: z.object({
      enabled: z.boolean().default(false),
      interval: z.enum(['month', 'year']).default('month'),
    }).optional(),
  }),
  
  // Quality & Safety Metrics
  quality: z.object({
    rating: z.number().min(0).max(5).optional(),
    reviews: z.number().min(0).default(0),
    downloads: z.number().min(0).default(0),
    lastUpdated: z.string().datetime(),
    verified: z.boolean().default(false),
    security: z.object({
      scanned: z.boolean().default(false),
      scanDate: z.string().datetime().optional(),
      vulnerabilities: z.number().min(0).default(0),
    }),
  }),
  
  // Compatibility & Requirements
  compatibility: z.object({
    'lean-cms': z.string(),
    react: z.string().optional(),
    nextjs: z.string().optional(),
    node: z.string().optional(),
  }),
  
  // Documentation & Support
  documentation: z.object({
    readme: z.string().url().optional(),
    homepage: z.string().url().optional(),
    repository: z.string().url().optional(),
    issues: z.string().url().optional(),
    changelog: z.string().url().optional(),
  }).optional(),
})

export type PluginManifest = z.infer<typeof PluginManifestSchema>

export const PluginInstallationSchema = z.object({
  pluginId: z.string(),
  version: z.string(),
  installedAt: z.string().datetime(),
  enabled: z.boolean().default(true),
  config: z.record(z.string(), z.any()).default({}),
  autoUpdate: z.boolean().default(false),
  installationMethod: z.enum(['marketplace', 'npm', 'github', 'local']),
  licenseKey: z.string().optional(), // For paid plugins
})

export type PluginInstallation = z.infer<typeof PluginInstallationSchema>

// ================================
// 2. PLUGIN REGISTRY & STORE
// ================================

export class PluginMarketplace {
  private plugins: Map<string, PluginManifest> = new Map()
  private installations: Map<string, PluginInstallation> = new Map()
  private loadedPlugins: Map<string, any> = new Map()
  private pluginSandboxes: Map<string, PluginSandbox> = new Map()

  // Register plugin in marketplace
  registerPlugin(manifest: PluginManifest): void {
    const validatedManifest = PluginManifestSchema.parse(manifest)
    this.plugins.set(manifest.id, validatedManifest)
    console.log(`Plugin registered: ${manifest.name} v${manifest.version}`)
  }

  // Search and filter plugins
  searchPlugins(query: {
    search?: string
    category?: string
    tags?: string[]
    featured?: boolean
    free?: boolean
    verified?: boolean
    minRating?: number
    sortBy?: 'name' | 'rating' | 'downloads' | 'updated'
    sortOrder?: 'asc' | 'desc'
  } = {}): PluginManifest[] {
    let results = Array.from(this.plugins.values())

    // Apply filters
    if (query.search) {
      const searchTerm = query.search.toLowerCase()
      results = results.filter(plugin =>
        plugin.name.toLowerCase().includes(searchTerm) ||
        plugin.description.toLowerCase().includes(searchTerm) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    if (query.category) {
      results = results.filter(plugin => plugin.category === query.category)
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(plugin =>
        query.tags!.some(tag => plugin.tags.includes(tag))
      )
    }

    if (query.featured !== undefined) {
      results = results.filter(plugin => plugin.marketplace.featured === query.featured)
    }

    if (query.free !== undefined) {
      const isFree = query.free
      results = results.filter(plugin => 
        isFree ? plugin.marketplace.price === 0 : plugin.marketplace.price > 0
      )
    }

    if (query.verified !== undefined) {
      results = results.filter(plugin => plugin.quality.verified === query.verified)
    }

    if (query.minRating !== undefined) {
      results = results.filter(plugin => 
        plugin.quality.rating && plugin.quality.rating >= query.minRating!
      )
    }

    // Apply sorting
    if (query.sortBy) {
      results.sort((a, b) => {
        let aVal, bVal
        switch (query.sortBy) {
          case 'name':
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          case 'rating':
            aVal = a.quality.rating || 0
            bVal = b.quality.rating || 0
            break
          case 'downloads':
            aVal = a.quality.downloads
            bVal = b.quality.downloads
            break
          case 'updated':
            aVal = new Date(a.quality.lastUpdated).getTime()
            bVal = new Date(b.quality.lastUpdated).getTime()
            break
          default:
            return 0
        }

        if (aVal < bVal) return query.sortOrder === 'desc' ? 1 : -1
        if (aVal > bVal) return query.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }

    return results
  }

  // Get plugin details
  getPlugin(id: string): PluginManifest | null {
    return this.plugins.get(id) || null
  }

  // Install plugin
  async installPlugin(
    pluginId: string, 
    version?: string,
    config: Record<string, any> = {},
    licenseKey?: string
  ): Promise<boolean> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    // Version validation
    const targetVersion = version || plugin.version
    if (!this.isVersionCompatible(targetVersion, plugin.compatibility['lean-cms'])) {
      throw new Error(`Plugin ${pluginId} v${targetVersion} is not compatible with current LEAN CMS version`)
    }

    // License validation for paid plugins
    if (plugin.marketplace.price > 0 && !licenseKey) {
      throw new Error('License key required for paid plugin')
    }

    try {
      // Create sandbox
      const sandbox = new PluginSandbox(plugin)
      this.pluginSandboxes.set(pluginId, sandbox)

      // Download and validate plugin
      const pluginCode = await this.downloadPlugin(pluginId, targetVersion)
      const validatedCode = await this.validatePlugin(pluginCode, plugin)

      // Load plugin in sandbox
      const loadedPlugin = await sandbox.loadPlugin(validatedCode)
      this.loadedPlugins.set(pluginId, loadedPlugin)

      // Register installation
      const installation: PluginInstallation = {
        pluginId,
        version: targetVersion,
        installedAt: new Date().toISOString(),
        enabled: true,
        config,
        autoUpdate: false,
        installationMethod: 'marketplace',
        licenseKey,
      }

      this.installations.set(pluginId, installation)

      // Initialize plugin
      if (loadedPlugin.initialize && typeof loadedPlugin.initialize === 'function') {
        await loadedPlugin.initialize(config)
      }

      // Register plugin components if any
      if (plugin.capabilities.components.length > 0) {
        await this.registerPluginComponents(pluginId, loadedPlugin)
      }

      // Emit installation event
      webhookRegistry.emitEvent({
        type: 'custom',
        source: 'plugin-marketplace',
        data: {
          action: 'plugin_installed',
          pluginId,
          pluginName: plugin.name,
          version: targetVersion,
        },
      })

      console.log(`Plugin ${plugin.name} v${targetVersion} installed successfully`)
      return true

    } catch (error) {
      console.error(`Failed to install plugin ${pluginId}:`, error)
      // Cleanup on failure
      this.pluginSandboxes.delete(pluginId)
      this.loadedPlugins.delete(pluginId)
      this.installations.delete(pluginId)
      throw error
    }
  }

  // Uninstall plugin
  async uninstallPlugin(pluginId: string): Promise<boolean> {
    const installation = this.installations.get(pluginId)
    if (!installation) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    try {
      const loadedPlugin = this.loadedPlugins.get(pluginId)
      
      // Run plugin cleanup
      if (loadedPlugin && loadedPlugin.cleanup && typeof loadedPlugin.cleanup === 'function') {
        await loadedPlugin.cleanup()
      }

      // Remove from sandbox
      const sandbox = this.pluginSandboxes.get(pluginId)
      if (sandbox) {
        await sandbox.destroy()
        this.pluginSandboxes.delete(pluginId)
      }

      // Cleanup registrations
      this.loadedPlugins.delete(pluginId)
      this.installations.delete(pluginId)

      // Emit uninstallation event
      webhookRegistry.emitEvent({
        type: 'custom',
        source: 'plugin-marketplace',
        data: {
          action: 'plugin_uninstalled',
          pluginId,
        },
      })

      console.log(`Plugin ${pluginId} uninstalled successfully`)
      return true

    } catch (error) {
      console.error(`Failed to uninstall plugin ${pluginId}:`, error)
      throw error
    }
  }

  // Get installed plugins
  getInstalledPlugins(): Array<{ manifest: PluginManifest; installation: PluginInstallation }> {
    return Array.from(this.installations.entries()).map(([pluginId, installation]) => ({
      manifest: this.plugins.get(pluginId)!,
      installation,
    }))
  }

  // Enable/disable plugin
  async togglePlugin(pluginId: string, enabled: boolean): Promise<boolean> {
    const installation = this.installations.get(pluginId)
    if (!installation) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    installation.enabled = enabled
    
    const loadedPlugin = this.loadedPlugins.get(pluginId)
    if (loadedPlugin) {
      if (enabled && loadedPlugin.enable) {
        await loadedPlugin.enable()
      } else if (!enabled && loadedPlugin.disable) {
        await loadedPlugin.disable()
      }
    }

    webhookRegistry.emitEvent({
      type: 'custom',
      source: 'plugin-marketplace',
      data: {
        action: enabled ? 'plugin_enabled' : 'plugin_disabled',
        pluginId,
      },
    })

    return true
  }

  // Update plugin
  async updatePlugin(pluginId: string, targetVersion?: string): Promise<boolean> {
    const installation = this.installations.get(pluginId)
    const plugin = this.plugins.get(pluginId)
    
    if (!installation || !plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    const newVersion = targetVersion || plugin.version
    if (installation.version === newVersion) {
      return true // Already up to date
    }

    // Uninstall current version
    await this.uninstallPlugin(pluginId)
    
    // Install new version
    return await this.installPlugin(pluginId, newVersion, installation.config, installation.licenseKey)
  }

  // Plugin dependency management
  private async resolveDependencies(plugin: PluginManifest): Promise<string[]> {
    const dependencies: string[] = []
    
    for (const [depId, version] of Object.entries(plugin.dependencies)) {
      if (!this.installations.has(depId)) {
        // Check if dependency is available in marketplace
        const depPlugin = this.plugins.get(depId)
        if (depPlugin && this.isVersionCompatible(depPlugin.version, version)) {
          dependencies.push(depId)
        } else {
          throw new Error(`Dependency ${depId}@${version} not found or incompatible`)
        }
      }
    }
    
    return dependencies
  }

  // Version compatibility check
  private isVersionCompatible(available: string, required: string): boolean {
    // Simplified semantic version checking
    // In production, use a proper semver library
    const parseVersion = (v: string) => v.replace(/[^\d.]/g, '').split('.').map(Number)
    const availableVer = parseVersion(available)
    const requiredVer = parseVersion(required)
    
    // Major version must match, minor and patch can be greater
    return availableVer[0] === requiredVer[0] && 
           (availableVer[1] > requiredVer[1] || 
            (availableVer[1] === requiredVer[1] && availableVer[2] >= requiredVer[2]))
  }

  // Download plugin code
  private async downloadPlugin(pluginId: string, version: string): Promise<string> {
    const response = await fetch(`/api/marketplace/plugins/${pluginId}/${version}/download`)
    if (!response.ok) {
      throw new Error(`Failed to download plugin ${pluginId}@${version}`)
    }
    return await response.text()
  }

  // Validate plugin code
  private async validatePlugin(code: string, manifest: PluginManifest): Promise<string> {
    // Basic security validation
    const dangerousPatterns = [
      /eval\(/,
      /Function\(/,
      /document\.write/,
      /innerHTML\s*=/,
      /outerHTML\s*=/,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error(`Plugin contains potentially dangerous code: ${pattern}`)
      }
    }

    // Additional validation could include:
    // - AST analysis
    // - Dependency scanning
    // - API usage validation
    // - Performance checks

    return code
  }

  // Register plugin components
  private async registerPluginComponents(pluginId: string, loadedPlugin: any): Promise<void> {
    if (loadedPlugin.components) {
      for (const [componentName, componentClass] of Object.entries(loadedPlugin.components)) {
        const componentMetadata = {
          id: `${pluginId}-${componentName}`,
          name: componentName,
          version: '1.0.0', // Get from plugin manifest
          description: `Component from ${pluginId} plugin`,
          category: 'utility' as const,
          tags: ['plugin', pluginId],
          author: {
            name: 'Plugin',
            email: 'plugin@example.com',
          },
          license: 'MIT',
          dependencies: {},
          props: {
            schema: {},
            required: [],
            examples: [],
          },
          styling: {
            cssVariables: [],
            themes: [],
            responsive: true,
            darkModeSupport: true,
          },
          compatibility: {
            react: '>=18.0.0',
            typescript: true,
          },
          marketplace: {
            featured: false,
            price: 0,
            lastUpdated: new Date().toISOString(),
            downloads: 0,
          },
        }

        componentRegistry.registerComponent(componentMetadata, {
          type: 'local',
          path: `plugin:${pluginId}:${componentName}`,
        })
      }
    }
  }
}

// ================================
// 3. PLUGIN SANDBOX SYSTEM
// ================================

export class PluginSandbox {
  private context: any = {}
  private allowedAPIs: Set<string>

  constructor(private manifest: PluginManifest) {
    this.allowedAPIs = new Set([
      'console',
      'setTimeout',
      'setInterval',
      'clearTimeout',
      'clearInterval',
      'fetch', // Conditionally allowed based on capabilities
      'localStorage', // Conditionally allowed
      'sessionStorage', // Conditionally allowed
    ])

    // Configure based on plugin capabilities
    if (manifest.capabilities.network) {
      this.allowedAPIs.add('fetch')
      this.allowedAPIs.add('XMLHttpRequest')
    }

    if (manifest.capabilities.filesystem) {
      // Would add file system APIs if running in Node.js environment
    }

    this.setupContext()
  }

  private setupContext(): void {
    // Create restricted context
    this.context = {
      console: {
        log: (...args: any[]) => console.log(`[${this.manifest.id}]`, ...args),
        error: (...args: any[]) => console.error(`[${this.manifest.id}]`, ...args),
        warn: (...args: any[]) => console.warn(`[${this.manifest.id}]`, ...args),
      },
      
      // Provide safe APIs
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      
      // Plugin-specific APIs
      leanCMS: {
        version: '1.0.0',
        hooks: this.createHookAPI(),
        components: this.createComponentAPI(),
        config: this.createConfigAPI(),
      },
    }

    // Conditionally add APIs based on capabilities
    if (this.manifest.capabilities.network) {
      this.context.fetch = fetch
    }
  }

  private createHookAPI() {
    return {
      on: (eventName: string, handler: Function) => {
        // Register event handler
        webhookRegistry.emitEvent({
          type: 'custom',
          source: 'plugin-hook',
          data: {
            action: 'hook_registered',
            pluginId: this.manifest.id,
            eventName,
          },
        })
      },
      emit: (eventName: string, data: any) => {
        // Emit custom event
        webhookRegistry.emitEvent({
          type: 'custom',
          source: `plugin-${this.manifest.id}`,
          data: { eventName, ...data },
        })
      },
    }
  }

  private createComponentAPI() {
    return {
      register: (name: string, component: any) => {
        // Register component
        console.log(`Plugin ${this.manifest.id} registered component: ${name}`)
      },
    }
  }

  private createConfigAPI() {
    return {
      get: (key: string) => {
        // Get plugin configuration value
        return this.context.pluginConfig?.[key]
      },
      set: (key: string, value: any) => {
        // Set plugin configuration value (with validation)
        this.context.pluginConfig = this.context.pluginConfig || {}
        this.context.pluginConfig[key] = value
      },
    }
  }

  async loadPlugin(code: string): Promise<any> {
    try {
      // Create function with restricted context
      const wrappedCode = `
        (function(${Object.keys(this.context).join(', ')}) {
          "use strict";
          ${code}
          return typeof module !== 'undefined' ? module.exports : exports;
        })
      `

      const pluginFunction = new Function('return ' + wrappedCode)()
      const pluginExports = pluginFunction(...Object.values(this.context))

      return pluginExports
    } catch (error) {
      console.error(`Failed to load plugin ${this.manifest.id}:`, error)
      throw error
    }
  }

  async destroy(): Promise<void> {
    // Cleanup sandbox resources
    this.context = {}
    this.allowedAPIs.clear()
  }
}

// ================================
// 4. PLUGIN STORE API
// ================================

export const pluginStoreAPI = {
  // Browse plugins
  browse: async (query: any = {}) => {
    return pluginMarketplace.searchPlugins(query)
  },

  // Get plugin details
  details: async (pluginId: string) => {
    const plugin = pluginMarketplace.getPlugin(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }
    return plugin
  },

  // Install plugin
  install: async (pluginId: string, options: {
    version?: string
    config?: Record<string, any>
    licenseKey?: string
  } = {}) => {
    return pluginMarketplace.installPlugin(
      pluginId,
      options.version,
      options.config,
      options.licenseKey
    )
  },

  // Uninstall plugin
  uninstall: async (pluginId: string) => {
    return pluginMarketplace.uninstallPlugin(pluginId)
  },

  // List installed plugins
  installed: async () => {
    return pluginMarketplace.getInstalledPlugins()
  },

  // Update plugin
  update: async (pluginId: string, version?: string) => {
    return pluginMarketplace.updatePlugin(pluginId, version)
  },

  // Toggle plugin
  toggle: async (pluginId: string, enabled: boolean) => {
    return pluginMarketplace.togglePlugin(pluginId, enabled)
  },
}

// ================================
// 5. DEFAULT MARKETPLACE PLUGINS
// ================================

export const MARKETPLACE_PLUGINS: PluginManifest[] = [
  {
    id: 'google-analytics-4',
    name: 'Google Analytics 4',
    version: '1.0.0',
    description: 'Complete Google Analytics 4 integration with enhanced e-commerce tracking',
    category: 'analytics',
    tags: ['analytics', 'google', 'tracking', 'e-commerce'],
    author: {
      name: 'LEAN CMS Team',
      email: 'plugins@lean-cms.com',
      verified: true,
    },
    publisher: {
      name: 'LEAN CMS',
      verified: true,
    },
    main: 'index.js',
    dependencies: {},
    engines: {
      'lean-cms': '>=1.0.0',
    },
    capabilities: {
      hooks: ['page_view', 'user_action'],
      api: [],
      components: [],
      admin: true,
      database: false,
      filesystem: false,
      network: true,
    },
    config: {
      schema: {
        trackingId: { type: 'string', required: true },
        enhanced: { type: 'boolean', default: true },
        anonymizeIP: { type: 'boolean', default: true },
      },
      defaults: {
        enhanced: true,
        anonymizeIP: true,
      },
      required: ['trackingId'],
    },
    marketplace: {
      featured: true,
      price: 0,
      currency: 'USD',
      license: 'MIT',
    },
    quality: {
      verified: true,
      reviews: 0,
      downloads: 0,
      lastUpdated: new Date().toISOString(),
      security: {
        scanned: true,
        scanDate: new Date().toISOString(),
        vulnerabilities: 0,
      },
    },
    compatibility: {
      'lean-cms': '>=1.0.0',
      react: '>=18.0.0',
    },
  },

  {
    id: 'mailchimp-integration',
    name: 'Mailchimp Integration',
    version: '1.2.1',
    description: 'Seamless Mailchimp integration for email marketing and automation',
    category: 'integrations',
    tags: ['email', 'marketing', 'automation', 'mailchimp'],
    author: {
      name: 'Third Party Dev',
      email: 'dev@thirdparty.com',
      verified: true,
    },
    publisher: {
      name: 'Third Party Solutions',
      verified: false,
    },
    main: 'mailchimp.js',
    dependencies: {
      '@mailchimp/mailchimp_marketing': '^3.0.80',
    },
    engines: {
      'lean-cms': '>=1.0.0',
    },
    capabilities: {
      hooks: ['form_submit', 'user_register'],
      api: [],
      components: [],
      admin: true,
      database: false,
      filesystem: false,
      network: true,
    },
    marketplace: {
      featured: false,
      price: 2999, // $29.99
      currency: 'USD',
      license: 'Commercial',
      trial: {
        enabled: true,
        days: 14,
      },
    },
    quality: {
      rating: 4.8,
      reviews: 156,
      downloads: 2847,
      verified: true,
      lastUpdated: new Date().toISOString(),
      security: {
        scanned: true,
        scanDate: new Date().toISOString(),
        vulnerabilities: 0,
      },
    },
    compatibility: {
      'lean-cms': '>=1.0.0',
      node: '>=16.0.0',
    },
  },
]

// ================================
// 6. GLOBAL INSTANCES & INITIALIZATION
// ================================

export const pluginMarketplace = new PluginMarketplace()

// Initialize marketplace with default plugins
export function initializeMarketplace() {
  MARKETPLACE_PLUGINS.forEach(plugin => {
    pluginMarketplace.registerPlugin(plugin)
  })
  
  console.log(`Plugin marketplace initialized with ${MARKETPLACE_PLUGINS.length} plugins`)
}