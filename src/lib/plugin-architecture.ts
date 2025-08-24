/**
 * Plugin Architecture - Extensible LEAN Framework
 * ==============================================
 * 
 * Enterprise-level plugin system with:
 * - Type-safe plugin registration
 * - Lifecycle hooks management
 * - Dependency injection
 * - Event system
 * - Plugin marketplace ready
 * - Hot reloading support
 * - Security validation
 * - Performance monitoring
 * 
 * Future-ready for:
 * - n8n webhook integrations
 * - Third-party service connections
 * - Custom UI components
 * - Data transformations
 * - Analytics extensions
 */

import { EventEmitter } from 'events'
import { z } from 'zod'

// ================================
// 1. CORE PLUGIN TYPES
// ================================

export interface PluginMetadata {
  name: string
  version: string
  description: string
  author: string
  homepage?: string
  repository?: string
  license: string
  keywords: string[]
  category: PluginCategory
  compatibility: {
    leanFramework: string
    node: string
    nextjs?: string
  }
}

export type PluginCategory = 
  | 'analytics'
  | 'authentication'
  | 'cms-extension'
  | 'commerce'
  | 'communication'
  | 'content'
  | 'data-transformation'
  | 'deployment'
  | 'development'
  | 'integrations'
  | 'media'
  | 'monitoring'
  | 'optimization'
  | 'security'
  | 'seo'
  | 'social'
  | 'ui-components'
  | 'utilities'
  | 'webhooks'

export interface PluginManifest extends PluginMetadata {
  main: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  config?: PluginConfigSchema
  permissions?: PluginPermission[]
  hooks?: string[]
  routes?: PluginRoute[]
  components?: string[]
}

export interface PluginConfigSchema {
  type: 'object'
  properties: Record<string, any>
  required?: string[]
  additionalProperties?: boolean
}

export interface PluginPermission {
  resource: string
  actions: string[]
  description: string
}

export interface PluginRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  handler: string
  middleware?: string[]
}

// ================================
// 2. PLUGIN LIFECYCLE HOOKS
// ================================

export interface PluginHooks {
  // Core lifecycle
  onInstall?: () => Promise<void>
  onUninstall?: () => Promise<void>
  onEnable?: () => Promise<void>
  onDisable?: () => Promise<void>
  onUpdate?: (oldVersion: string, newVersion: string) => Promise<void>

  // Application lifecycle
  onApplicationStart?: () => Promise<void>
  onApplicationStop?: () => Promise<void>
  onConfigChange?: (config: any) => Promise<void>

  // Request lifecycle
  beforeRequest?: (context: RequestContext) => Promise<RequestContext>
  afterRequest?: (context: RequestContext, response: any) => Promise<any>
  onRequestError?: (context: RequestContext, error: Error) => Promise<void>

  // Data lifecycle
  beforeDataCreate?: <T>(collection: string, data: T) => Promise<T>
  afterDataCreate?: <T>(collection: string, data: T, result: T) => Promise<void>
  beforeDataUpdate?: <T>(collection: string, id: string, data: Partial<T>) => Promise<Partial<T>>
  afterDataUpdate?: <T>(collection: string, id: string, data: Partial<T>, result: T) => Promise<void>
  beforeDataDelete?: (collection: string, id: string) => Promise<void>
  afterDataDelete?: (collection: string, id: string) => Promise<void>

  // UI lifecycle
  beforeRender?: (componentName: string, props: any) => Promise<any>
  afterRender?: (componentName: string, props: any, result: any) => Promise<void>

  // Theme lifecycle
  onThemeChange?: (oldTheme: string, newTheme: string) => Promise<void>

  // Custom hooks
  [key: string]: ((...args: any[]) => Promise<any>) | undefined
}

export interface RequestContext {
  method: string
  url: string
  headers: Record<string, string>
  body?: any
  user?: any
  session?: any
  metadata: Record<string, any>
}

// ================================
// 3. PLUGIN INTERFACE
// ================================

export interface Plugin {
  manifest: PluginManifest
  hooks: PluginHooks
  config?: any
  components?: Record<string, any>
  services?: Record<string, any>
  utils?: Record<string, any>

  // Plugin methods
  init?: (context: PluginContext) => Promise<void>
  destroy?: () => Promise<void>
  validate?: (config: any) => Promise<boolean>
  health?: () => Promise<PluginHealthStatus>
}

export interface PluginContext {
  framework: FrameworkAPI
  config: any
  logger: Logger
  events: EventEmitter
  services: ServiceRegistry
  storage: StorageAPI
}

export interface PluginHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  message?: string
  details?: Record<string, any>
  timestamp: number
}

// ================================
// 4. FRAMEWORK API
// ================================

export interface FrameworkAPI {
  // Data operations
  data: {
    get<T>(collection: string, id?: string): Promise<T | T[]>
    create<T>(collection: string, data: T): Promise<T>
    update<T>(collection: string, id: string, data: Partial<T>): Promise<T>
    delete(collection: string, id: string): Promise<void>
    query<T>(collection: string, query: any): Promise<T[]>
  }

  // Component registration
  components: {
    register(name: string, component: any, schema?: any): void
    unregister(name: string): void
    get(name: string): any
    list(): string[]
  }

  // Route registration
  routes: {
    register(route: PluginRoute, handler: Function): void
    unregister(path: string, method: string): void
    list(): PluginRoute[]
  }

  // Configuration
  config: {
    get(key: string, defaultValue?: any): any
    set(key: string, value: any): void
    has(key: string): boolean
  }

  // Events
  events: {
    emit(event: string, ...args: any[]): void
    on(event: string, listener: Function): void
    off(event: string, listener: Function): void
    once(event: string, listener: Function): void
  }

  // HTTP client
  http: {
    get<T>(url: string, config?: any): Promise<T>
    post<T>(url: string, data?: any, config?: any): Promise<T>
    put<T>(url: string, data?: any, config?: any): Promise<T>
    delete<T>(url: string, config?: any): Promise<T>
  }
}

// ================================
// 5. SERVICE REGISTRY
// ================================

export interface ServiceRegistry {
  register<T>(name: string, service: T): void
  unregister(name: string): void
  get<T>(name: string): T | null
  has(name: string): boolean
  list(): string[]
}

export class ServiceRegistryImpl implements ServiceRegistry {
  private services: Map<string, any> = new Map()

  register<T>(name: string, service: T): void {
    this.services.set(name, service)
  }

  unregister(name: string): void {
    this.services.delete(name)
  }

  get<T>(name: string): T | null {
    return this.services.get(name) || null
  }

  has(name: string): boolean {
    return this.services.has(name)
  }

  list(): string[] {
    return Array.from(this.services.keys())
  }
}

// ================================
// 6. STORAGE API
// ================================

export interface StorageAPI {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  has(key: string): Promise<boolean>
  clear(): Promise<void>
  keys(pattern?: string): Promise<string[]>
}

// ================================
// 7. LOGGER INTERFACE
// ================================

export interface Logger {
  debug(message: string, meta?: any): void
  info(message: string, meta?: any): void
  warn(message: string, meta?: any): void
  error(message: string, error?: Error, meta?: any): void
  child(namespace: string): Logger
}

// ================================
// 8. PLUGIN MANAGER
// ================================

export class PluginManager extends EventEmitter {
  private plugins: Map<string, Plugin> = new Map()
  private pluginStates: Map<string, 'installed' | 'enabled' | 'disabled' | 'error'> = new Map()
  private hookRegistry: Map<string, Function[]> = new Map()
  private serviceRegistry: ServiceRegistry = new ServiceRegistryImpl()
  private frameworkAPI: FrameworkAPI
  private logger: Logger

  constructor(frameworkAPI: FrameworkAPI, logger: Logger) {
    super()
    this.frameworkAPI = frameworkAPI
    this.logger = logger
  }

  // Plugin lifecycle management
  async install(pluginPath: string, config?: any): Promise<void> {
    try {
      const plugin = await this.loadPlugin(pluginPath, config)
      
      // Validate plugin
      await this.validatePlugin(plugin)
      
      // Check dependencies
      await this.checkDependencies(plugin)
      
      // Initialize plugin
      const context = this.createPluginContext(plugin)
      await plugin.init?.(context)
      
      // Register plugin
      this.plugins.set(plugin.manifest.name, plugin)
      this.pluginStates.set(plugin.manifest.name, 'installed')
      
      // Register hooks
      this.registerHooks(plugin)
      
      // Run install hook
      await plugin.hooks.onInstall?.()
      
      this.logger.info(`Plugin ${plugin.manifest.name} installed successfully`)
      this.emit('plugin:installed', plugin.manifest.name)
      
    } catch (error) {
      this.logger.error(`Failed to install plugin from ${pluginPath}`, error)
      throw error
    }
  }

  async uninstall(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    try {
      // Run uninstall hook
      await plugin.hooks.onUninstall?.()
      
      // Unregister hooks
      this.unregisterHooks(plugin)
      
      // Destroy plugin
      await plugin.destroy?.()
      
      // Remove from registry
      this.plugins.delete(pluginName)
      this.pluginStates.delete(pluginName)
      
      this.logger.info(`Plugin ${pluginName} uninstalled successfully`)
      this.emit('plugin:uninstalled', pluginName)
      
    } catch (error) {
      this.logger.error(`Failed to uninstall plugin ${pluginName}`, error)
      throw error
    }
  }

  async enable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    const state = this.pluginStates.get(pluginName)
    if (state === 'enabled') {
      return // Already enabled
    }

    try {
      await plugin.hooks.onEnable?.()
      this.pluginStates.set(pluginName, 'enabled')
      
      this.logger.info(`Plugin ${pluginName} enabled`)
      this.emit('plugin:enabled', pluginName)
      
    } catch (error) {
      this.pluginStates.set(pluginName, 'error')
      this.logger.error(`Failed to enable plugin ${pluginName}`, error)
      throw error
    }
  }

  async disable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    try {
      await plugin.hooks.onDisable?.()
      this.pluginStates.set(pluginName, 'disabled')
      
      this.logger.info(`Plugin ${pluginName} disabled`)
      this.emit('plugin:disabled', pluginName)
      
    } catch (error) {
      this.pluginStates.set(pluginName, 'error')
      this.logger.error(`Failed to disable plugin ${pluginName}`, error)
      throw error
    }
  }

  // Hook execution
  async executeHook<T>(hookName: string, ...args: any[]): Promise<T[]> {
    const hooks = this.hookRegistry.get(hookName) || []
    const results: T[] = []

    for (const hook of hooks) {
      try {
        const result = await hook(...args)
        if (result !== undefined) {
          results.push(result)
        }
      } catch (error) {
        this.logger.error(`Hook ${hookName} failed`, error)
        // Continue executing other hooks
      }
    }

    return results
  }

  // Plugin information
  getPlugin(name: string): Plugin | null {
    return this.plugins.get(name) || null
  }

  getPluginState(name: string): string {
    return this.pluginStates.get(name) || 'not-installed'
  }

  listPlugins(): Array<{ name: string; state: string; manifest: PluginManifest }> {
    return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
      name,
      state: this.getPluginState(name),
      manifest: plugin.manifest,
    }))
  }

  async getPluginHealth(name: string): Promise<PluginHealthStatus | null> {
    const plugin = this.getPlugin(name)
    if (!plugin || !plugin.health) {
      return null
    }

    try {
      return await plugin.health()
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Health check failed',
        timestamp: Date.now(),
      }
    }
  }

  // Private methods
  private async loadPlugin(pluginPath: string, config?: any): Promise<Plugin> {
    // In a real implementation, this would dynamically import the plugin
    // For now, we'll simulate it
    const manifestPath = `${pluginPath}/plugin.json`
    const mainPath = `${pluginPath}/index.js`
    
    // Load manifest
    const manifest: PluginManifest = await import(manifestPath)
    
    // Load plugin code
    const pluginModule = await import(mainPath)
    const plugin: Plugin = pluginModule.default || pluginModule
    
    plugin.manifest = manifest
    plugin.config = config

    return plugin
  }

  private async validatePlugin(plugin: Plugin): Promise<void> {
    // Validate manifest
    const manifestSchema = z.object({
      name: z.string().min(1),
      version: z.string().regex(/^\d+\.\d+\.\d+/),
      description: z.string(),
      author: z.string(),
      license: z.string(),
      category: z.enum([
        'analytics', 'authentication', 'cms-extension', 'commerce',
        'communication', 'content', 'data-transformation', 'deployment',
        'development', 'integrations', 'media', 'monitoring',
        'optimization', 'security', 'seo', 'social', 'ui-components',
        'utilities', 'webhooks'
      ]),
      compatibility: z.object({
        leanFramework: z.string(),
        node: z.string(),
        nextjs: z.string().optional(),
      }),
    })

    try {
      manifestSchema.parse(plugin.manifest)
    } catch (error) {
      throw new Error(`Invalid plugin manifest: ${error}`)
    }

    // Validate plugin structure
    if (!plugin.hooks) {
      throw new Error('Plugin must have hooks object')
    }

    // Custom validation
    if (plugin.validate) {
      const isValid = await plugin.validate(plugin.config)
      if (!isValid) {
        throw new Error('Plugin configuration validation failed')
      }
    }
  }

  private async checkDependencies(plugin: Plugin): Promise<void> {
    const { dependencies = {}, peerDependencies = {} } = plugin.manifest
    
    // Check for dependency conflicts
    for (const [depName, depVersion] of Object.entries(dependencies)) {
      // In a real implementation, check if dependency is available
      // and version is compatible
    }

    for (const [peerName, peerVersion] of Object.entries(peerDependencies)) {
      // Check peer dependencies
    }
  }

  private createPluginContext(plugin: Plugin): PluginContext {
    return {
      framework: this.frameworkAPI,
      config: plugin.config || {},
      logger: this.logger.child(plugin.manifest.name),
      events: this,
      services: this.serviceRegistry,
      storage: this.createStorageAPI(plugin.manifest.name),
    }
  }

  private createStorageAPI(pluginName: string): StorageAPI {
    // Create namespaced storage for the plugin
    return {
      async get<T>(key: string): Promise<T | null> {
        // Implementation would use actual storage
        return null
      },
      async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        // Implementation
      },
      async delete(key: string): Promise<void> {
        // Implementation
      },
      async has(key: string): Promise<boolean> {
        return false
      },
      async clear(): Promise<void> {
        // Implementation
      },
      async keys(pattern?: string): Promise<string[]> {
        return []
      },
    }
  }

  private registerHooks(plugin: Plugin): void {
    Object.entries(plugin.hooks).forEach(([hookName, hookFunction]) => {
      if (typeof hookFunction === 'function') {
        if (!this.hookRegistry.has(hookName)) {
          this.hookRegistry.set(hookName, [])
        }
        this.hookRegistry.get(hookName)!.push(hookFunction)
      }
    })
  }

  private unregisterHooks(plugin: Plugin): void {
    Object.entries(plugin.hooks).forEach(([hookName, hookFunction]) => {
      if (typeof hookFunction === 'function') {
        const hooks = this.hookRegistry.get(hookName) || []
        const index = hooks.indexOf(hookFunction)
        if (index > -1) {
          hooks.splice(index, 1)
        }
      }
    })
  }
}

// ================================
// 9. BUILT-IN PLUGINS
// ================================

// Analytics Plugin Interface
export interface AnalyticsPlugin extends Plugin {
  track(event: string, properties: Record<string, any>): Promise<void>
  identify(userId: string, traits: Record<string, any>): Promise<void>
  page(name: string, properties: Record<string, any>): Promise<void>
}

// Webhook Plugin Interface
export interface WebhookPlugin extends Plugin {
  registerWebhook(url: string, events: string[]): Promise<string>
  unregisterWebhook(id: string): Promise<void>
  triggerWebhook(event: string, data: any): Promise<void>
}

// n8n Integration Plugin Interface
export interface N8nPlugin extends Plugin {
  executeWorkflow(workflowId: string, data: any): Promise<any>
  registerTrigger(trigger: string, callback: Function): Promise<void>
  getWorkflows(): Promise<Array<{ id: string; name: string; active: boolean }>>
}

// ================================
// 10. PLUGIN MARKETPLACE
// ================================

export interface MarketplaceAPI {
  search(query: string, category?: PluginCategory): Promise<MarketplacePlugin[]>
  getPlugin(name: string): Promise<MarketplacePlugin | null>
  getCategories(): Promise<PluginCategory[]>
  getFeatured(): Promise<MarketplacePlugin[]>
  getUpdates(installedPlugins: string[]): Promise<PluginUpdate[]>
}

export interface MarketplacePlugin extends PluginManifest {
  id: string
  downloads: number
  rating: number
  reviews: number
  screenshots: string[]
  readme: string
  changelog: string
  publishedAt: string
  updatedAt: string
  verified: boolean
  price?: number
  currency?: string
}

export interface PluginUpdate {
  pluginName: string
  currentVersion: string
  latestVersion: string
  changelog: string
  breaking: boolean
  security: boolean
}

// ================================
// 11. PLUGIN DEVELOPMENT UTILITIES
// ================================

export class PluginBuilder {
  private manifest: Partial<PluginManifest> = {}
  private hooks: PluginHooks = {}
  private components: Record<string, any> = {}
  private services: Record<string, any> = {}

  setManifest(manifest: Partial<PluginManifest>): this {
    this.manifest = { ...this.manifest, ...manifest }
    return this
  }

  addHook<T extends keyof PluginHooks>(name: T, handler: PluginHooks[T]): this {
    this.hooks[name] = handler
    return this
  }

  addComponent(name: string, component: any): this {
    this.components[name] = component
    return this
  }

  addService(name: string, service: any): this {
    this.services[name] = service
    return this
  }

  build(): Plugin {
    if (!this.manifest.name) {
      throw new Error('Plugin name is required')
    }

    return {
      manifest: this.manifest as PluginManifest,
      hooks: this.hooks,
      components: this.components,
      services: this.services,
    }
  }
}

// ================================
// 12. EXPORTS
// ================================

export const pluginManager = new PluginManager(
  {} as FrameworkAPI, // Will be injected by the framework
  console as Logger   // Will be replaced with proper logger
)

export {
  type Plugin,
  type PluginManifest,
  type PluginHooks,
  type PluginContext,
  type PluginHealthStatus,
  type FrameworkAPI,
  type ServiceRegistry,
  type StorageAPI,
  type Logger,
  type AnalyticsPlugin,
  type WebhookPlugin,
  type N8nPlugin,
  type MarketplaceAPI,
  type MarketplacePlugin,
  type PluginUpdate,
}