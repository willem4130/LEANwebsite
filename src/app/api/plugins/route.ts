/**
 * Plugin Marketplace API
 * ======================
 * 
 * RESTful API endpoints for plugin discovery, installation,
 * management, and marketplace operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  pluginMarketplace,
  PluginManifest,
  initializeMarketplace
} from '@/lib/plugin-marketplace'
import { createApiResponse, validateRequest, withErrorHandling } from '@/lib/api-framework'
import { z } from 'zod'

// Initialize marketplace on first request
let initialized = false
function ensureInitialized() {
  if (!initialized) {
    initializeMarketplace()
    initialized = true
  }
}

// ================================
// PLUGIN DISCOVERY & BROWSING
// ================================

// GET /api/plugins - Browse and search plugins or handle sub-routes
export const GET = withErrorHandling(async (req: NextRequest) => {
  ensureInitialized()
  
  const { searchParams, pathname } = new URL(req.url)
  
  // Handle sub-routes based on URL path
  if (pathname.includes('/installed')) {
    const installations = pluginMarketplace.getInstalledPlugins()
    
    const installedPlugins = installations.map(({ manifest, installation }) => ({
      id: manifest.id,
      name: manifest.name,
      version: installation.version,
      enabled: installation.enabled,
      installedAt: installation.installedAt,
      config: installation.config,
      autoUpdate: installation.autoUpdate,
      installationMethod: installation.installationMethod,
      hasLicense: !!installation.licenseKey,
      category: manifest.category,
      author: manifest.author,
      capabilities: manifest.capabilities,
    }))

    return createApiResponse({
      plugins: installedPlugins,
      total: installedPlugins.length,
      enabled: installedPlugins.filter(p => p.enabled).length,
      disabled: installedPlugins.filter(p => !p.enabled).length,
    })
  }
  
  if (pathname.includes('/categories')) {
    const plugins = pluginMarketplace.searchPlugins({})
    const categories = Array.from(new Set(plugins.map(p => p.category)))
    
    const categoryStats = categories.map(category => ({
      name: category,
      count: plugins.filter(p => p.category === category).length,
      featured: plugins.filter(p => p.category === category && p.marketplace.featured).length,
    }))

    return createApiResponse({
      categories: categoryStats,
      total: categories.length,
    })
  }
  
  if (pathname.includes('/tags')) {
    const plugins = pluginMarketplace.searchPlugins({})
    const allTags = plugins.flatMap(p => p.tags)
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    return createApiResponse({
      tags,
      total: tags.length,
    })
  }
  
  if (pathname.includes('/stats')) {
    const plugins = pluginMarketplace.searchPlugins({})
    const installations = pluginMarketplace.getInstalledPlugins()

    const stats = {
      marketplace: {
        totalPlugins: plugins.length,
        featuredPlugins: plugins.filter(p => p.marketplace.featured).length,
        freePlugins: plugins.filter(p => p.marketplace.price === 0).length,
        paidPlugins: plugins.filter(p => p.marketplace.price > 0).length,
        verifiedPlugins: plugins.filter(p => p.quality.verified).length,
        categories: Array.from(new Set(plugins.map(p => p.category))).length,
        totalDownloads: plugins.reduce((sum, p) => sum + p.quality.downloads, 0),
      },
      installation: {
        totalInstalled: installations.length,
        enabledPlugins: installations.filter(({ installation }) => installation.enabled).length,
        disabledPlugins: installations.filter(({ installation }) => !installation.enabled).length,
        pluginsWithLicense: installations.filter(({ installation }) => !!installation.licenseKey).length,
      },
      topCategories: Array.from(new Set(plugins.map(p => p.category)))
        .map(category => ({
          category,
          count: plugins.filter(p => p.category === category).length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      recentPlugins: plugins
        .sort((a, b) => new Date(b.quality.lastUpdated).getTime() - new Date(a.quality.lastUpdated).getTime())
        .slice(0, 10)
        .map(p => ({
          id: p.id,
          name: p.name,
          version: p.version,
          lastUpdated: p.quality.lastUpdated,
          downloads: p.quality.downloads,
          rating: p.quality.rating,
        })),
    }

    return createApiResponse(stats)
  }
  
  // Default: Browse and search plugins
  const query = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    tags: searchParams.get('tags')?.split(',') || undefined,
    featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
    free: searchParams.get('free') ? searchParams.get('free') === 'true' : undefined,
    verified: searchParams.get('verified') ? searchParams.get('verified') === 'true' : undefined,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
    sortBy: (searchParams.get('sortBy') as 'name' | 'rating' | 'downloads' | 'updated') || 'name',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
  }

  const plugins = pluginMarketplace.searchPlugins(query)
  
  // Add marketplace statistics
  const stats = {
    total: plugins.length,
    featured: plugins.filter(p => p.marketplace.featured).length,
    free: plugins.filter(p => p.marketplace.price === 0).length,
    verified: plugins.filter(p => p.quality.verified).length,
    categories: Array.from(new Set(plugins.map(p => p.category))),
    tags: Array.from(new Set(plugins.flatMap(p => p.tags))),
  }

  return createApiResponse({
    plugins,
    stats,
    query: Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined)),
  })
})

// POST /api/plugins - Submit/register a plugin or handle installations
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { pathname } = new URL(req.url)
  
  // Handle installation route
  if (pathname.includes('/install')) {
    const InstallPluginSchema = z.object({
      pluginId: z.string(),
      version: z.string().optional(),
      config: z.record(z.string(), z.any()).default({}),
      licenseKey: z.string().optional(),
      autoUpdate: z.boolean().default(false),
    })

    const { pluginId, version, config, licenseKey, autoUpdate } = InstallPluginSchema.parse(await req.json())
    
    ensureInitialized()
    
    // Check if plugin exists in marketplace
    const plugin = pluginMarketplace.getPlugin(pluginId)
    if (!plugin) {
      return createApiResponse(undefined, {
        error: {
          code: 'PLUGIN_NOT_FOUND',
          message: `Plugin ${pluginId} not found in marketplace`,
        },
        statusCode: 404,
      })
    }

    // Check if already installed
    const installations = pluginMarketplace.getInstalledPlugins()
    const alreadyInstalled = installations.find(({ manifest }) => manifest.id === pluginId)
    
    if (alreadyInstalled) {
      return createApiResponse(undefined, {
        error: {
          code: 'PLUGIN_ALREADY_INSTALLED',
          message: `Plugin ${pluginId} is already installed`,
          details: { installedVersion: alreadyInstalled.installation.version },
        },
        statusCode: 409,
      })
    }

    // Validate license for paid plugins
    if (plugin.marketplace.price > 0 && !licenseKey) {
      return createApiResponse(undefined, {
        error: {
          code: 'LICENSE_REQUIRED',
          message: `Plugin ${pluginId} requires a valid license key`,
          details: { price: plugin.marketplace.price, currency: plugin.marketplace.currency },
        },
        statusCode: 402,
      })
    }

    // Install the plugin
    const success = await pluginMarketplace.installPlugin(pluginId, version, config, licenseKey)
    
    if (!success) {
      return createApiResponse(undefined, {
        error: {
          code: 'INSTALLATION_FAILED',
          message: `Failed to install plugin ${pluginId}`,
        },
        statusCode: 500,
      })
    }

    return createApiResponse({
      message: 'Plugin installed successfully',
      pluginId,
      pluginName: plugin.name,
      version: version || plugin.version,
      enabled: true,
    }, { statusCode: 201 })
  }
  
  // Default: Submit/register a plugin
  const PluginSubmissionSchema = z.object({
    manifest: z.object({
      id: z.string(),
      name: z.string(),
      version: z.string(),
      description: z.string(),
      category: z.enum([
        'analytics', 'seo', 'social-media', 'e-commerce', 'forms', 'media',
        'security', 'performance', 'ui-components', 'integrations',
        'utilities', 'developer-tools'
      ]),
      tags: z.array(z.string()),
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
      main: z.string(),
      dependencies: z.record(z.string(), z.string()),
      peerDependencies: z.record(z.string(), z.string()).optional(),
      engines: z.object({
        node: z.string().optional(),
        npm: z.string().optional(),
        'lean-cms': z.string(),
      }),
      capabilities: z.object({
        hooks: z.array(z.string()).default([]),
        api: z.array(z.string()).default([]),
        components: z.array(z.string()).default([]),
        admin: z.boolean().default(false),
        database: z.boolean().default(false),
        filesystem: z.boolean().default(false),
        network: z.boolean().default(false),
      }),
      config: z.object({
        schema: z.record(z.string(), z.any()),
        defaults: z.record(z.string(), z.any()).default({}),
        required: z.array(z.string()).default([]),
      }).optional(),
      marketplace: z.object({
        featured: z.boolean().default(false),
        price: z.number().min(0).default(0),
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
      compatibility: z.object({
        'lean-cms': z.string(),
        react: z.string().optional(),
        nextjs: z.string().optional(),
        node: z.string().optional(),
      }),
      documentation: z.object({
        readme: z.string().url().optional(),
        homepage: z.string().url().optional(),
        repository: z.string().url().optional(),
        issues: z.string().url().optional(),
        changelog: z.string().url().optional(),
      }).optional(),
    }),
    packageUrl: z.string().url().optional(),
    documentation: z.string().optional(),
  })

  const { manifest, packageUrl, documentation } = await validateRequest(PluginSubmissionSchema)(req)

  // Check if plugin already exists
  const existing = pluginMarketplace.getPlugin(manifest.id)
  if (existing) {
    return createApiResponse(undefined, {
      error: {
        code: 'PLUGIN_EXISTS',
        message: `Plugin ${manifest.id} already exists`,
        details: { existingVersion: existing.version, submittedVersion: manifest.version },
      },
      statusCode: 409,
    })
  }

  // Register the plugin
  pluginMarketplace.registerPlugin(manifest as PluginManifest)

  return createApiResponse({
    message: 'Plugin submitted successfully',
    pluginId: manifest.id,
    pluginName: manifest.name,
    version: manifest.version,
    status: 'pending-review', // In a real system, this would go through review
  }, { statusCode: 201 })
})

// ================================
// PLUGIN INSTALLATION & MANAGEMENT
// ================================

// Installed plugins functionality moved to main GET handler

// Install functionality moved to main POST handler

// Uninstall functionality would need separate dynamic route

// Toggle functionality would need separate dynamic route

// Update functionality would need separate dynamic route

// ================================
// PLUGIN DETAILS & METADATA
// ================================

// Plugin details functionality would need separate dynamic route

// Categories functionality moved to main GET handler

// Tags functionality moved to main GET handler

// ================================
// PLUGIN MARKETPLACE STATS
// ================================

// Stats functionality moved to main GET handler