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

// GET /api/plugins - Browse and search plugins
export const GET = withErrorHandling(async (req: NextRequest) => {
  ensureInitialized()
  
  const { searchParams } = new URL(req.url)
  
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
    categories: [...new Set(plugins.map(p => p.category))],
    tags: [...new Set(plugins.flatMap(p => p.tags))],
  }

  return createApiResponse({
    plugins,
    stats,
    query: Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined)),
  })
})

// POST /api/plugins - Submit/register a plugin
export const POST = withErrorHandling(async (req: NextRequest) => {
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
      dependencies: z.record(z.string()),
      peerDependencies: z.record(z.string()).optional(),
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
        schema: z.record(z.any()),
        defaults: z.record(z.any()).default({}),
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

// GET /api/plugins/installed - List installed plugins
export async function GET_INSTALLED() {
  ensureInitialized()
  
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

  return NextResponse.json({
    success: true,
    data: {
      plugins: installedPlugins,
      total: installedPlugins.length,
      enabled: installedPlugins.filter(p => p.enabled).length,
      disabled: installedPlugins.filter(p => !p.enabled).length,
    },
  })
}

// POST /api/plugins/install - Install a plugin
export async function POST_INSTALL(req: NextRequest) {
  const InstallPluginSchema = z.object({
    pluginId: z.string(),
    version: z.string().optional(),
    config: z.record(z.any()).default({}),
    licenseKey: z.string().optional(),
    autoUpdate: z.boolean().default(false),
  })

  try {
    const { pluginId, version, config, licenseKey, autoUpdate } = InstallPluginSchema.parse(await req.json())
    
    ensureInitialized()
    
    // Check if plugin exists in marketplace
    const plugin = pluginMarketplace.getPlugin(pluginId)
    if (!plugin) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PLUGIN_NOT_FOUND',
          message: `Plugin ${pluginId} not found in marketplace`,
        },
      }, { status: 404 })
    }

    // Check if already installed
    const installations = pluginMarketplace.getInstalledPlugins()
    const alreadyInstalled = installations.find(({ manifest }) => manifest.id === pluginId)
    
    if (alreadyInstalled) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PLUGIN_ALREADY_INSTALLED',
          message: `Plugin ${pluginId} is already installed`,
          details: { installedVersion: alreadyInstalled.installation.version },
        },
      }, { status: 409 })
    }

    // Validate license for paid plugins
    if (plugin.marketplace.price > 0 && !licenseKey) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'LICENSE_REQUIRED',
          message: `Plugin ${pluginId} requires a valid license key`,
          details: { price: plugin.marketplace.price, currency: plugin.marketplace.currency },
        },
      }, { status: 402 })
    }

    // Install the plugin
    const success = await pluginMarketplace.installPlugin(pluginId, version, config, licenseKey)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSTALLATION_FAILED',
          message: `Failed to install plugin ${pluginId}`,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Plugin installed successfully',
        pluginId,
        pluginName: plugin.name,
        version: version || plugin.version,
        enabled: true,
      },
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Invalid installation request',
      },
    }, { status: 400 })
  }
}

// DELETE /api/plugins/[pluginId] - Uninstall a plugin
export async function DELETE_PLUGIN(req: NextRequest, { params }: { params: { pluginId: string } }) {
  ensureInitialized()
  
  try {
    const success = await pluginMarketplace.uninstallPlugin(params.pluginId)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNINSTALL_FAILED',
          message: `Failed to uninstall plugin ${params.pluginId}`,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Plugin uninstalled successfully',
        pluginId: params.pluginId,
      },
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNINSTALL_ERROR',
        message: error instanceof Error ? error.message : 'Uninstall operation failed',
      },
    }, { status: 500 })
  }
}

// PATCH /api/plugins/[pluginId]/toggle - Enable/disable a plugin
export async function PATCH_TOGGLE(req: NextRequest, { params }: { params: { pluginId: string } }) {
  const TogglePluginSchema = z.object({
    enabled: z.boolean(),
  })

  try {
    const { enabled } = TogglePluginSchema.parse(await req.json())
    
    ensureInitialized()
    
    const success = await pluginMarketplace.togglePlugin(params.pluginId, enabled)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TOGGLE_FAILED',
          message: `Failed to ${enabled ? 'enable' : 'disable'} plugin ${params.pluginId}`,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Plugin ${enabled ? 'enabled' : 'disabled'} successfully`,
        pluginId: params.pluginId,
        enabled,
      },
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Invalid toggle request',
      },
    }, { status: 400 })
  }
}

// PUT /api/plugins/[pluginId]/update - Update a plugin
export async function PUT_UPDATE(req: NextRequest, { params }: { params: { pluginId: string } }) {
  const UpdatePluginSchema = z.object({
    version: z.string().optional(),
    config: z.record(z.any()).optional(),
  })

  try {
    const { version, config } = UpdatePluginSchema.parse(await req.json())
    
    ensureInitialized()
    
    // Check if plugin is installed
    const installations = pluginMarketplace.getInstalledPlugins()
    const installation = installations.find(({ manifest }) => manifest.id === params.pluginId)
    
    if (!installation) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PLUGIN_NOT_INSTALLED',
          message: `Plugin ${params.pluginId} is not installed`,
        },
      }, { status: 404 })
    }

    // Update the plugin
    const success = await pluginMarketplace.updatePlugin(params.pluginId, version)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: `Failed to update plugin ${params.pluginId}`,
        },
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Plugin updated successfully',
        pluginId: params.pluginId,
        oldVersion: installation.installation.version,
        newVersion: version || 'latest',
      },
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: error instanceof Error ? error.message : 'Update operation failed',
      },
    }, { status: 500 })
  }
}

// ================================
// PLUGIN DETAILS & METADATA
// ================================

// GET /api/plugins/[pluginId] - Get plugin details
export async function GET_PLUGIN(req: NextRequest, { params }: { params: { pluginId: string } }) {
  ensureInitialized()
  
  const plugin = pluginMarketplace.getPlugin(params.pluginId)
  
  if (!plugin) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'PLUGIN_NOT_FOUND',
        message: `Plugin ${params.pluginId} not found`,
      },
    }, { status: 404 })
  }

  // Check if plugin is installed
  const installations = pluginMarketplace.getInstalledPlugins()
  const installation = installations.find(({ manifest }) => manifest.id === params.pluginId)

  const response = {
    plugin,
    installation: installation ? {
      installed: true,
      version: installation.installation.version,
      enabled: installation.installation.enabled,
      installedAt: installation.installation.installedAt,
      config: installation.installation.config,
      autoUpdate: installation.installation.autoUpdate,
    } : {
      installed: false,
    },
    compatibility: {
      compatible: true, // This would check actual compatibility
      issues: [] as string[],
    },
  }

  return NextResponse.json({
    success: true,
    data: response,
  })
}

// GET /api/plugins/categories - Get available categories
export async function GET_CATEGORIES() {
  ensureInitialized()
  
  const plugins = pluginMarketplace.searchPlugins({})
  const categories = [...new Set(plugins.map(p => p.category))]
  
  const categoryStats = categories.map(category => ({
    name: category,
    count: plugins.filter(p => p.category === category).length,
    featured: plugins.filter(p => p.category === category && p.marketplace.featured).length,
  }))

  return NextResponse.json({
    success: true,
    data: {
      categories: categoryStats,
      total: categories.length,
    },
  })
}

// GET /api/plugins/tags - Get available tags
export async function GET_TAGS() {
  ensureInitialized()
  
  const plugins = pluginMarketplace.searchPlugins({})
  const allTags = plugins.flatMap(p => p.tags)
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const tags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({
    success: true,
    data: {
      tags,
      total: tags.length,
    },
  })
}

// ================================
// PLUGIN MARKETPLACE STATS
// ================================

// GET /api/plugins/stats - Get marketplace statistics
export async function GET_STATS() {
  ensureInitialized()
  
  const plugins = pluginMarketplace.searchPlugins({})
  const installations = pluginMarketplace.getInstalledPlugins()

  const stats = {
    marketplace: {
      totalPlugins: plugins.length,
      featuredPlugins: plugins.filter(p => p.marketplace.featured).length,
      freePlugins: plugins.filter(p => p.marketplace.price === 0).length,
      paidPlugins: plugins.filter(p => p.marketplace.price > 0).length,
      verifiedPlugins: plugins.filter(p => p.quality.verified).length,
      categories: [...new Set(plugins.map(p => p.category))].length,
      totalDownloads: plugins.reduce((sum, p) => sum + p.quality.downloads, 0),
    },
    installation: {
      totalInstalled: installations.length,
      enabledPlugins: installations.filter(({ installation }) => installation.enabled).length,
      disabledPlugins: installations.filter(({ installation }) => !installation.enabled).length,
      pluginsWithLicense: installations.filter(({ installation }) => !!installation.licenseKey).length,
    },
    topCategories: [...new Set(plugins.map(p => p.category))]
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

  return NextResponse.json({
    success: true,
    data: stats,
  })
}