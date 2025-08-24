/**
 * LEAN CMS Integration Tests
 * ===========================
 * 
 * Comprehensive test suite for all framework components and integrations
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'

// Import all framework components
import { 
  webhookRegistry,
  webhookEvents,
  WebhookEvent,
  initializePayloadWebhooks,
} from '../../lib/webhook-integration'

import {
  componentRegistry,
  abTestManager,
  themeManager,
  ComponentMetadata,
  ABTestConfig,
  ThemeConfig,
} from '../../lib/component-management'

import {
  pluginMarketplace,
  PluginManifest,
  PluginSandbox,
} from '../../lib/plugin-marketplace'

import {
  serviceRegistry,
  ServiceConfig,
  SendGridAdapter,
  StripeAdapter,
} from '../../lib/service-integration'

import {
  webhookSecurity,
  WebhookSecurityManager,
  RateLimiter,
  ThreatProtector,
} from '../../lib/webhook-security'

// ================================
// TEST SETUP & UTILITIES
// ================================

// Mock environment variables
process.env.WEBHOOK_SECRET = 'test-webhook-secret-32-characters-long'
process.env.API_KEY_1 = 'test-api-key-1'
process.env.SENDGRID_API_KEY = 'SG.test-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'

// Mock fetch for external API calls
global.fetch = jest.fn()

// Utility functions
const createMockRequest = (options: {
  method?: string
  url?: string
  headers?: Record<string, string>
  body?: any
}): NextRequest => {
  const {
    method = 'POST',
    url = 'http://localhost:3000/api/test',
    headers = {},
    body = null,
  } = options

  const request = new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  })

  return request as NextRequest
}

const mockComponent = (id: string, name: string): ComponentMetadata => ({
  id,
  name,
  version: '1.0.0',
  description: `Test component ${name}`,
  category: 'layout',
  tags: ['test'],
  author: {
    name: 'Test Author',
    email: 'test@example.com',
  },
  license: 'MIT',
  dependencies: {},
  props: {
    schema: {
      title: { type: 'string', required: true },
    },
    required: ['title'],
    examples: [{ title: 'Test Title' }],
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
})

const mockPlugin = (id: string, name: string): PluginManifest => ({
  id,
  name,
  version: '1.0.0',
  description: `Test plugin ${name}`,
  category: 'utilities',
  tags: ['test'],
  author: {
    name: 'Test Author',
    email: 'test@example.com',
    verified: true,
  },
  publisher: {
    name: 'Test Publisher',
    verified: true,
  },
  main: 'index.js',
  dependencies: {},
  engines: {
    'lean-cms': '>=1.0.0',
  },
  capabilities: {
    hooks: ['test_event'],
    api: [],
    components: [],
    admin: false,
    database: false,
    filesystem: false,
    network: false,
  },
  marketplace: {
    featured: false,
    price: 0,
    license: 'MIT',
  },
  quality: {
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
  },
})

// ================================
// WEBHOOK INTEGRATION TESTS
// ================================

describe('Webhook Integration System', () => {
  beforeEach(() => {
    // Clear webhooks before each test
    const webhooks = webhookRegistry.getWebhooks()
    webhooks.forEach(({ id }) => webhookRegistry.unregisterWebhook(id))
  })

  test('should register and manage webhooks', () => {
    const webhookConfig = {
      name: 'Test Webhook',
      url: 'https://test.example.com/webhook',
      secret: 'test-secret-32-characters-long!!!',
      events: ['content.created', 'content.updated'],
      enabled: true,
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
      },
    }

    webhookRegistry.registerWebhook('test-webhook', webhookConfig)
    
    const webhooks = webhookRegistry.getWebhooks()
    expect(webhooks).toHaveLength(1)
    expect(webhooks[0].id).toBe('test-webhook')
    expect(webhooks[0].config.name).toBe('Test Webhook')
  })

  test('should emit webhook events', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['x-message-id', 'test-123']]),
    })
    global.fetch = mockFetch

    webhookRegistry.registerWebhook('test-webhook', {
      name: 'Test Webhook',
      url: 'https://test.example.com/webhook',
      secret: 'test-secret-32-characters-long!!!',
      events: ['content.created'],
      enabled: true,
      retryPolicy: {
        maxRetries: 1,
        retryDelay: 100,
        backoffMultiplier: 1,
      },
    })

    await webhookEvents.contentCreated('posts', { id: '123', title: 'Test Post' })

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 200))

    expect(mockFetch).toHaveBeenCalledWith(
      'https://test.example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Webhook-Signature': expect.stringMatching(/^sha256=.+/),
        }),
      })
    )
  })

  test('should filter events based on webhook configuration', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Map(),
    })
    global.fetch = mockFetch

    webhookRegistry.registerWebhook('filtered-webhook', {
      name: 'Filtered Webhook',
      url: 'https://test.example.com/webhook',
      secret: 'test-secret-32-characters-long!!!',
      events: ['content.updated'], // Only listen to updates
      enabled: true,
      retryPolicy: {
        maxRetries: 1,
        retryDelay: 100,
        backoffMultiplier: 1,
      },
    })

    // This should not trigger the webhook
    await webhookEvents.contentCreated('posts', { id: '123' })
    
    // This should trigger the webhook
    await webhookEvents.contentUpdated('posts', { id: '123', title: 'Updated' })

    await new Promise(resolve => setTimeout(resolve, 200))

    // Should only be called once for the update event
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

// ================================
// COMPONENT MANAGEMENT TESTS
// ================================

describe('Dynamic Component Management', () => {
  beforeEach(() => {
    // Clear components before each test
    const components = componentRegistry.getAllComponents()
    components.forEach(comp => componentRegistry['components'].delete(comp.id))
  })

  test('should register and retrieve components', () => {
    const metadata = mockComponent('test-component', 'Test Component')
    
    componentRegistry.registerComponent(metadata, {
      type: 'local',
      path: './TestComponent',
    })

    const retrieved = componentRegistry.getComponentMetadata('test-component')
    expect(retrieved).toEqual(metadata)
  })

  test('should filter components by category and tags', () => {
    const comp1 = mockComponent('comp-1', 'Component 1')
    comp1.category = 'layout'
    comp1.tags = ['header', 'navigation']

    const comp2 = mockComponent('comp-2', 'Component 2')
    comp2.category = 'content'
    comp2.tags = ['article', 'blog']

    componentRegistry.registerComponent(comp1, { type: 'local', path: './Comp1' })
    componentRegistry.registerComponent(comp2, { type: 'local', path: './Comp2' })

    const layoutComponents = componentRegistry.getAllComponents({ category: 'layout' })
    expect(layoutComponents).toHaveLength(1)
    expect(layoutComponents[0].id).toBe('comp-1')

    const headerComponents = componentRegistry.getAllComponents({ tags: ['header'] })
    expect(headerComponents).toHaveLength(1)
    expect(headerComponents[0].id).toBe('comp-1')
  })

  test('should manage component variants for A/B testing', () => {
    const metadata = mockComponent('ab-component', 'A/B Test Component')
    componentRegistry.registerComponent(metadata, { type: 'local', path: './ABComponent' })

    componentRegistry.registerVariant({
      id: 'variant-a',
      name: 'Variant A',
      description: 'Original version',
      componentId: 'ab-component',
      props: { theme: 'default' },
      styling: {},
    })

    componentRegistry.registerVariant({
      id: 'variant-b',
      name: 'Variant B', 
      description: 'Improved version',
      componentId: 'ab-component',
      props: { theme: 'modern' },
      styling: {},
    })

    const variants = componentRegistry.getVariants('ab-component')
    expect(variants).toHaveLength(2)
    expect(variants.map(v => v.id)).toEqual(['variant-a', 'variant-b'])
  })

  test('should assign A/B test variants consistently', () => {
    const testConfig: ABTestConfig = {
      id: 'test-ab',
      name: 'Test A/B',
      description: 'Test A/B test',
      enabled: true,
      variants: ['variant-a', 'variant-b'],
      trafficSplit: [50, 50],
      startDate: new Date().toISOString(),
      targetMetrics: ['conversion'],
    }

    abTestManager.setupTest(testConfig)

    // Same user should always get same variant
    const userId = 'user-123'
    const variant1 = abTestManager.getVariantForUser('test-ab', userId)
    const variant2 = abTestManager.getVariantForUser('test-ab', userId)
    
    expect(variant1).toBe(variant2)
    expect(['variant-a', 'variant-b']).toContain(variant1)
  })

  test('should manage themes', () => {
    const theme: ThemeConfig = {
      id: 'test-theme',
      name: 'Test Theme',
      description: 'A test theme',
      version: '1.0.0',
      variables: {
        '--primary-color': '#007bff',
        '--secondary-color': '#6c757d',
      },
      components: {
        button: {
          styles: {
            'background-color': 'var(--primary-color)',
            'color': 'white',
          },
        },
      },
      breakpoints: {
        sm: '576px',
        md: '768px',
        lg: '992px',
      },
      typography: {
        fontFamilies: {
          body: 'Arial, sans-serif',
        },
        fontSizes: {
          base: '16px',
        },
        fontWeights: {
          normal: '400',
        },
        lineHeights: {
          base: '1.5',
        },
      },
      colors: {
        primary: '#007bff',
      },
      spacing: {
        xs: '0.25rem',
      },
      shadows: {
        sm: '0 1px 2px rgba(0,0,0,0.1)',
      },
      animations: {
        fadeIn: 'fadeIn 0.3s ease-in',
      },
    }

    themeManager.registerTheme(theme)
    
    const retrieved = themeManager.getTheme('test-theme')
    expect(retrieved).toEqual(theme)

    const css = themeManager.generateCSS('test-theme')
    expect(css).toContain('--primary-color: #007bff')
    expect(css).toContain('.button {')
    expect(css).toContain('background-color: var(--primary-color)')
  })
})

// ================================
// PLUGIN MARKETPLACE TESTS
// ================================

describe('Plugin Marketplace', () => {
  beforeEach(() => {
    // Clear plugins before each test
    pluginMarketplace['plugins'].clear()
    pluginMarketplace['installations'].clear()
    pluginMarketplace['loadedPlugins'].clear()
  })

  test('should register and search plugins', () => {
    const plugin1 = mockPlugin('plugin-1', 'Analytics Plugin')
    plugin1.category = 'analytics'
    plugin1.tags = ['google', 'tracking']

    const plugin2 = mockPlugin('plugin-2', 'Email Plugin')
    plugin2.category = 'integrations'
    plugin2.tags = ['email', 'sendgrid']

    pluginMarketplace.registerPlugin(plugin1)
    pluginMarketplace.registerPlugin(plugin2)

    // Search by category
    const analyticsPlugins = pluginMarketplace.searchPlugins({ category: 'analytics' })
    expect(analyticsPlugins).toHaveLength(1)
    expect(analyticsPlugins[0].id).toBe('plugin-1')

    // Search by tags
    const emailPlugins = pluginMarketplace.searchPlugins({ tags: ['email'] })
    expect(emailPlugins).toHaveLength(1)
    expect(emailPlugins[0].id).toBe('plugin-2')

    // Search by text
    const trackingPlugins = pluginMarketplace.searchPlugins({ search: 'tracking' })
    expect(trackingPlugins).toHaveLength(1)
    expect(trackingPlugins[0].id).toBe('plugin-1')
  })

  test('should validate plugin manifests', () => {
    const invalidPlugin = {
      id: 'invalid-plugin',
      // Missing required fields
    }

    expect(() => {
      pluginMarketplace.registerPlugin(invalidPlugin as any)
    }).toThrow()
  })

  test('should create plugin sandbox with restricted context', () => {
    const plugin = mockPlugin('sandbox-test', 'Sandbox Test Plugin')
    const sandbox = new PluginSandbox(plugin)

    // Sandbox should restrict access to dangerous APIs
    expect(sandbox['context']).toHaveProperty('console')
    expect(sandbox['context']).toHaveProperty('setTimeout')
    expect(sandbox['context']).toHaveProperty('leanCMS')

    // Should not have access to global objects
    expect(sandbox['context']).not.toHaveProperty('window')
    expect(sandbox['context']).not.toHaveProperty('document')
    expect(sandbox['context']).not.toHaveProperty('eval')
  })

  test('should handle plugin installation lifecycle', async () => {
    const plugin = mockPlugin('lifecycle-test', 'Lifecycle Test Plugin')
    pluginMarketplace.registerPlugin(plugin)

    // Mock plugin download
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(`
        class TestPlugin {
          async initialize() { console.log('initialized') }
          async cleanup() { console.log('cleaned up') }
        }
        module.exports = TestPlugin
      `),
    })
    global.fetch = mockFetch

    // Mock the plugin loading for testing
    pluginMarketplace['downloadPlugin'] = jest.fn().mockResolvedValue(`
      class TestPlugin {
        async initialize() { return true }
        async cleanup() { return true }
      }
      module.exports = TestPlugin
    `)

    const installed = await pluginMarketplace.installPlugin('lifecycle-test')
    expect(installed).toBe(true)

    const installations = pluginMarketplace.getInstalledPlugins()
    expect(installations).toHaveLength(1)
    expect(installations[0].installation.pluginId).toBe('lifecycle-test')

    const uninstalled = await pluginMarketplace.uninstallPlugin('lifecycle-test')
    expect(uninstalled).toBe(true)

    const installationsAfterUninstall = pluginMarketplace.getInstalledPlugins()
    expect(installationsAfterUninstall).toHaveLength(0)
  })
})

// ================================
// SERVICE INTEGRATION TESTS
// ================================

describe('Service Integration Layer', () => {
  beforeEach(() => {
    // Clear services before each test
    serviceRegistry['services'].clear()
    serviceRegistry['serviceInstances'].clear()
  })

  test('should register and execute services', async () => {
    const serviceConfig: ServiceConfig = {
      id: 'test-service',
      name: 'Test Service',
      type: 'custom',
      provider: 'test',
      version: '1.0.0',
      enabled: true,
      auth: {
        type: 'api-key',
        credentials: {
          apiKey: 'test-key',
        },
      },
      config: {
        baseUrl: 'https://api.test.com',
        endpoints: {
          'test-operation': {
            path: '/test',
            method: 'POST',
          },
        },
      },
    }

    serviceRegistry.registerService(serviceConfig)

    const service = serviceRegistry.getService('test-service')
    expect(service).toEqual(serviceConfig)

    // Mock successful API response
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: 'test-result' }),
    })
    global.fetch = mockFetch

    const result = await serviceRegistry.executeService({
      serviceId: 'test-service',
      operation: 'test-operation',
      data: { test: 'data' },
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ success: true, data: 'test-result' })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test.com/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-key',
        }),
      })
    )
  })

  test('should handle service failures with retry logic', async () => {
    const serviceConfig: ServiceConfig = {
      id: 'retry-test',
      name: 'Retry Test Service',
      type: 'custom',
      provider: 'test',
      version: '1.0.0',
      enabled: true,
      auth: {
        type: 'api-key',
        credentials: {
          apiKey: 'test-key',
        },
      },
      config: {
        baseUrl: 'https://api.test.com',
        endpoints: {
          'test-operation': '/test',
        },
      },
      resilience: {
        retryPolicy: {
          maxRetries: 2,
          backoffMultiplier: 1,
          initialDelay: 10, // Small delay for testing
        },
        timeout: 5000,
      },
    }

    serviceRegistry.registerService(serviceConfig)

    // Mock failed responses that eventually succeed
    const mockFetch = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    
    global.fetch = mockFetch

    const result = await serviceRegistry.executeService({
      serviceId: 'retry-test',
      operation: 'test-operation',
      data: {},
    })

    expect(result.success).toBe(true)
    expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + 2 retries
  })

  test('should track service health metrics', async () => {
    const serviceConfig: ServiceConfig = {
      id: 'health-test',
      name: 'Health Test Service',
      type: 'custom',
      provider: 'test',
      version: '1.0.0',
      enabled: true,
      auth: {
        type: 'api-key',
        credentials: { apiKey: 'test-key' },
      },
      config: {
        baseUrl: 'https://api.test.com',
        endpoints: { 'test-operation': '/test' },
      },
      health: {
        status: 'healthy',
        responseTime: 0,
        errorRate: 0,
      },
    }

    serviceRegistry.registerService(serviceConfig)

    // Mock slow response
    const mockFetch = jest.fn().mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }), 100)
      )
    )
    global.fetch = mockFetch

    await serviceRegistry.executeService({
      serviceId: 'health-test',
      operation: 'test-operation',
      data: {},
    })

    const service = serviceRegistry.getService('health-test')
    expect(service?.health?.responseTime).toBeGreaterThan(50)
    expect(service?.health?.lastCheck).toBeDefined()
  })

  test('should validate SendGrid adapter implementation', async () => {
    const config: ServiceConfig = {
      id: 'sendgrid-test',
      name: 'SendGrid Test',
      type: 'email',
      provider: 'sendgrid',
      version: '1.0.0',
      enabled: true,
      auth: {
        type: 'api-key',
        credentials: {
          apiKey: 'SG.test-key',
        },
      },
      config: {},
    }

    const adapter = new SendGridAdapter(config)

    // Mock SendGrid API response
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Map([['x-message-id', 'msg-123']]),
    })
    global.fetch = mockFetch

    const result = await adapter.execute('send-email', {
      to: 'test@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      html: '<h1>Test</h1>',
    })

    expect(result.messageId).toBe('msg-123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.sendgrid.com/v3/mail/send',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer SG.test-key',
        }),
      })
    )
  })

  test('should validate Stripe adapter implementation', async () => {
    const config: ServiceConfig = {
      id: 'stripe-test',
      name: 'Stripe Test',
      type: 'payment',
      provider: 'stripe',
      version: '1.0.0',
      enabled: true,
      auth: {
        type: 'api-key',
        credentials: {
          secretKey: 'sk_test_123',
        },
      },
      config: {},
    }

    const adapter = new StripeAdapter(config)

    // Mock Stripe API response
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        status: 'requires_payment_method',
      }),
    })
    global.fetch = mockFetch

    const result = await adapter.execute('create-payment-intent', {
      amount: 2000,
      currency: 'usd',
    })

    expect(result.id).toBe('pi_test_123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.stripe.com/v1/payment_intents',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer sk_test_123',
        }),
      })
    )
  })
})

// ================================
// SECURITY & AUTHENTICATION TESTS
// ================================

describe('Webhook Security System', () => {
  test('should validate HMAC signatures correctly', async () => {
    const config = webhookSecurity.defaultConfig
    const securityManager = new WebhookSecurityManager(config)

    const payload = JSON.stringify({ test: 'data' })
    const secret = process.env.WEBHOOK_SECRET!
    
    // Generate valid signature
    const crypto = require('crypto')
    const signature = crypto.createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')

    const request = createMockRequest({
      method: 'POST',
      headers: {
        'x-webhook-signature': `sha256=${signature}`,
        'content-length': payload.length.toString(),
      },
      body: { test: 'data' },
    })

    // Mock request.text() to return the payload
    request.text = jest.fn().mockResolvedValue(payload)

    const result = await securityManager.validateRequest(request)
    expect(result.valid).toBe(true)
    expect(result.identity).toBe('hmac-verified')
  })

  test('should reject invalid HMAC signatures', async () => {
    const config = webhookSecurity.defaultConfig
    const securityManager = new WebhookSecurityManager(config)

    const request = createMockRequest({
      method: 'POST',
      headers: {
        'x-webhook-signature': 'sha256=invalid-signature',
        'content-length': '20',
      },
      body: { test: 'data' },
    })

    request.text = jest.fn().mockResolvedValue(JSON.stringify({ test: 'data' }))

    const result = await securityManager.validateRequest(request)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(expect.stringMatching(/Authentication failed/))
  })

  test('should enforce rate limiting', async () => {
    const rateLimiter = new RateLimiter()

    const key = 'test-user'
    const maxRequests = 5
    const windowMs = 60000

    // Make requests up to limit
    for (let i = 0; i < maxRequests; i++) {
      const result = await rateLimiter.checkRateLimit(key, maxRequests, windowMs)
      expect(result.allowed).toBe(true)
      expect(result.count).toBe(i + 1)
    }

    // Next request should be rejected
    const limitExceeded = await rateLimiter.checkRateLimit(key, maxRequests, windowMs)
    expect(limitExceeded.allowed).toBe(false)
    expect(limitExceeded.count).toBe(maxRequests + 1)
  })

  test('should detect suspicious activity', async () => {
    const threatProtector = new ThreatProtector({
      enableDDoSProtection: true,
      suspiciousActivityThreshold: 10,
      blockDuration: 60000,
      enableGeoBlocking: false,
      blockedCountries: [],
    })

    const request = createMockRequest({
      headers: {
        'x-forwarded-for': '192.168.1.100',
        'user-agent': 'curl/7.68.0', // Suspicious user agent
      },
    })

    const analysis = await threatProtector.analyzeRequest(request)
    expect(analysis.threat).toBe(true)
    expect(analysis.reason).toContain('Malicious user agent')
    expect(analysis.severity).toBe('medium')
  })

  test('should validate request format', async () => {
    const config = {
      ...webhookSecurity.defaultConfig,
      validation: {
        maxBodySize: 1024,
        allowedContentTypes: ['application/json'],
        requiredHeaders: ['x-api-version'],
      },
    }
    const securityManager = new WebhookSecurityManager(config)

    // Request missing required header
    const request1 = createMockRequest({
      headers: {
        'content-type': 'application/json',
        'content-length': '100',
      },
    })
    request1.text = jest.fn().mockResolvedValue('{}')

    const result1 = await securityManager.validateRequest(request1)
    expect(result1.valid).toBe(false)
    expect(result1.errors).toContain('Missing required header: x-api-version')

    // Request with invalid content type
    const request2 = createMockRequest({
      headers: {
        'content-type': 'text/plain',
        'x-api-version': '1.0',
      },
    })
    request2.text = jest.fn().mockResolvedValue('plain text')

    const result2 = await securityManager.validateRequest(request2)
    expect(result2.valid).toBe(false)
    expect(result2.errors).toContain('Invalid content type: text/plain')
  })

  test('should generate secure keys', () => {
    const webhookSecret = webhookSecurity.generateWebhookSecret()
    const apiKey = webhookSecurity.generateAPIKey()

    expect(webhookSecret).toHaveLength(64) // 32 bytes = 64 hex chars
    expect(apiKey.length).toBeGreaterThan(20)
    
    // Should be different each time
    const webhookSecret2 = webhookSecurity.generateWebhookSecret()
    const apiKey2 = webhookSecurity.generateAPIKey()
    
    expect(webhookSecret).not.toBe(webhookSecret2)
    expect(apiKey).not.toBe(apiKey2)
  })
})

// ================================
// END-TO-END INTEGRATION TESTS
// ================================

describe('End-to-End Integration', () => {
  beforeEach(() => {
    // Reset all registries
    webhookRegistry.getWebhooks().forEach(({ id }) => 
      webhookRegistry.unregisterWebhook(id)
    )
    componentRegistry.getAllComponents().forEach(comp => 
      componentRegistry['components'].delete(comp.id)
    )
    serviceRegistry.getAllServices().forEach(service => 
      serviceRegistry['services'].delete(service.id)
    )
    pluginMarketplace['plugins'].clear()
  })

  test('should handle complete workflow: plugin installation -> service integration -> webhook events', async () => {
    // 1. Install a plugin that provides service integration
    const analyticsPlugin = mockPlugin('analytics-integration', 'Analytics Integration Plugin')
    analyticsPlugin.capabilities.network = true
    analyticsPlugin.capabilities.hooks = ['page_view', 'user_action']
    
    pluginMarketplace.registerPlugin(analyticsPlugin)

    // Mock plugin installation
    pluginMarketplace['downloadPlugin'] = jest.fn().mockResolvedValue(`
      class AnalyticsPlugin {
        constructor(config, leanCMS) {
          this.config = config
          this.leanCMS = leanCMS
        }
        
        async initialize() {
          this.leanCMS.hooks.on('page_view', (data) => {
            console.log('Analytics: Page view', data)
          })
          return true
        }
        
        async cleanup() { return true }
      }
      module.exports = AnalyticsPlugin
    `)

    const installed = await pluginMarketplace.installPlugin('analytics-integration', '1.0.0', {
      trackingId: 'GA_TEST_123',
    })
    expect(installed).toBe(true)

    // 2. Register a service that the plugin might use
    const analyticsService: ServiceConfig = {
      id: 'google-analytics',
      name: 'Google Analytics',
      type: 'analytics',
      provider: 'google-analytics',
      version: '1.0.0',
      enabled: true,
      auth: {
        type: 'api-key',
        credentials: {
          measurementId: 'GA_TEST_123',
        },
      },
      config: {
        baseUrl: 'https://www.google-analytics.com',
      },
    }

    serviceRegistry.registerService(analyticsService)

    // 3. Set up webhook to receive analytics events
    webhookRegistry.registerWebhook('analytics-webhook', {
      name: 'Analytics Webhook',
      url: 'https://analytics.example.com/webhook',
      secret: 'analytics-secret-32-characters!!',
      events: ['user.action', 'page.view'],
      enabled: true,
      retryPolicy: {
        maxRetries: 2,
        retryDelay: 1000,
        backoffMultiplier: 2,
      },
    })

    // Mock webhook delivery
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Map(),
    })
    global.fetch = mockFetch

    // 4. Trigger a user action that should flow through the entire system
    await webhookEvents.customEvent({
      type: 'user.action',
      data: {
        action: 'button_click',
        element: 'cta-button',
        page: '/landing',
        user: 'user-123',
      },
    })

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 300))

    // 5. Verify the webhook was called
    expect(mockFetch).toHaveBeenCalledWith(
      'https://analytics.example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-Webhook-Signature': expect.stringMatching(/^sha256=.+/),
          'X-Webhook-Event': 'custom',
        }),
      })
    )

    // 6. Verify service and plugin integration
    const installations = pluginMarketplace.getInstalledPlugins()
    expect(installations).toHaveLength(1)

    const services = serviceRegistry.getAllServices({ type: 'analytics' })
    expect(services).toHaveLength(1)

    const webhooks = webhookRegistry.getWebhooks()
    expect(webhooks).toHaveLength(1)
  })

  test('should handle component A/B testing with analytics tracking', async () => {
    // 1. Register a component for A/B testing
    const heroComponent = mockComponent('hero-section', 'Hero Section')
    componentRegistry.registerComponent(heroComponent, {
      type: 'local',
      path: './HeroSection',
    })

    // 2. Create variants
    componentRegistry.registerVariant({
      id: 'hero-original',
      name: 'Original Hero',
      description: 'Original design',
      componentId: 'hero-section',
      props: { theme: 'blue', layout: 'centered' },
      styling: {},
    })

    componentRegistry.registerVariant({
      id: 'hero-improved',
      name: 'Improved Hero',
      description: 'Improved design with better CTA',
      componentId: 'hero-section',
      props: { theme: 'gradient', layout: 'split', ctaSize: 'large' },
      styling: {},
    })

    // 3. Set up A/B test
    const abTest: ABTestConfig = {
      id: 'hero-cta-test',
      name: 'Hero CTA Optimization',
      description: 'Testing different hero designs for conversion',
      enabled: true,
      variants: ['hero-original', 'hero-improved'],
      trafficSplit: [50, 50],
      startDate: new Date().toISOString(),
      targetMetrics: ['click_through_rate', 'conversion_rate'],
    }

    abTestManager.setupTest(abTest)

    // 4. Set up analytics tracking for A/B test events
    webhookRegistry.registerWebhook('ab-test-analytics', {
      name: 'A/B Test Analytics',
      url: 'https://analytics.example.com/ab-test',
      secret: 'ab-test-secret-32-characters!!!',
      events: ['custom'],
      enabled: true,
      retryPolicy: {
        maxRetries: 1,
        retryDelay: 1000,
        backoffMultiplier: 1,
      },
    })

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Map(),
    })
    global.fetch = mockFetch

    // 5. Simulate user interactions with different variants
    const users = ['user-1', 'user-2', 'user-3', 'user-4']
    
    for (const userId of users) {
      const variant = abTestManager.getVariantForUser('hero-cta-test', userId)
      
      // Simulate user clicking CTA
      await webhookEvents.customEvent({
        type: 'ab_test_interaction',
        data: {
          testId: 'hero-cta-test',
          userId,
          variantId: variant,
          action: 'cta_click',
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Wait for webhook processing
    await new Promise(resolve => setTimeout(resolve, 200))

    // 6. Verify analytics events were sent
    expect(mockFetch).toHaveBeenCalledTimes(4) // One for each user

    // 7. Verify variant consistency
    users.forEach(userId => {
      const variant1 = abTestManager.getVariantForUser('hero-cta-test', userId)
      const variant2 = abTestManager.getVariantForUser('hero-cta-test', userId)
      expect(variant1).toBe(variant2) // Should be consistent
    })
  })

  test('should handle security throughout the integration pipeline', async () => {
    // 1. Set up secure webhook endpoint
    const securityConfig = {
      ...webhookSecurity.defaultConfig,
      authentication: {
        required: true,
        methods: ['hmac-sha256', 'api-key'],
        hmac: {
          secretKey: process.env.WEBHOOK_SECRET!,
          algorithm: 'sha256' as const,
          headerName: 'x-webhook-signature',
        },
        apiKey: {
          keys: [process.env.API_KEY_1!],
          headerName: 'x-api-key',
        },
      },
      rateLimiting: {
        enabled: true,
        windowMs: 60000,
        maxRequests: 10,
        keyGenerator: 'ip' as const,
      },
      threatProtection: {
        enableDDoSProtection: true,
        suspiciousActivityThreshold: 5,
        blockDuration: 60000,
        enableGeoBlocking: false,
        blockedCountries: [],
      },
    }

    const securityManager = new WebhookSecurityManager(securityConfig)

    // 2. Test valid authenticated request
    const validPayload = JSON.stringify({ 
      action: 'test_action',
      data: { test: 'data' } 
    })
    
    const crypto = require('crypto')
    const validSignature = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(validPayload, 'utf8')
      .digest('hex')

    const validRequest = createMockRequest({
      headers: {
        'x-webhook-signature': `sha256=${validSignature}`,
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'LEAN-CMS-Client/1.0',
        'content-length': validPayload.length.toString(),
      },
      body: JSON.parse(validPayload),
    })
    validRequest.text = jest.fn().mockResolvedValue(validPayload)

    const validResult = await securityManager.validateRequest(validRequest)
    expect(validResult.valid).toBe(true)
    expect(validResult.identity).toBe('hmac-verified')

    // 3. Test rate limiting enforcement
    const requests = []
    for (let i = 0; i < 12; i++) {
      const request = createMockRequest({
        headers: {
          'x-api-key': process.env.API_KEY_1!,
          'x-forwarded-for': '192.168.1.2',
          'content-length': '50',
        },
      })
      request.text = jest.fn().mockResolvedValue('{}')
      requests.push(securityManager.validateRequest(request))
    }

    const results = await Promise.all(requests)
    
    // First 10 should be allowed, last 2 should be rate limited
    const allowed = results.filter(r => r.valid).length
    const rateLimited = results.filter(r => !r.valid && 
      r.errors.some(e => e.includes('Rate limit'))
    ).length

    expect(allowed).toBe(10)
    expect(rateLimited).toBe(2)

    // 4. Test threat detection
    const suspiciousRequest = createMockRequest({
      headers: {
        'x-api-key': process.env.API_KEY_1!,
        'x-forwarded-for': '192.168.1.3',
        'user-agent': 'curl/7.68.0', // Flagged as suspicious
        'content-length': '100',
      },
    })
    suspiciousRequest.text = jest.fn().mockResolvedValue('{}')

    const suspiciousResult = await securityManager.validateRequest(suspiciousRequest)
    expect(suspiciousResult.valid).toBe(false)
    expect(suspiciousResult.errors).toContain(
      expect.stringMatching(/Threat detected.*Malicious user agent/)
    )
  })
})

// ================================
// PERFORMANCE & STRESS TESTS
// ================================

describe('Performance & Stress Tests', () => {
  test('should handle concurrent webhook emissions efficiently', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Map(),
    })
    global.fetch = mockFetch

    webhookRegistry.registerWebhook('performance-test', {
      name: 'Performance Test Webhook',
      url: 'https://test.example.com/webhook',
      secret: 'performance-secret-32-characters',
      events: ['custom'],
      enabled: true,
      retryPolicy: {
        maxRetries: 1,
        retryDelay: 100,
        backoffMultiplier: 1,
      },
    })

    const startTime = Date.now()
    const concurrentEvents = 50
    
    // Emit many events concurrently
    const promises = Array.from({ length: concurrentEvents }, (_, i) =>
      webhookEvents.customEvent({
        type: 'performance_test',
        data: { eventId: i, timestamp: Date.now() },
      })
    )

    await Promise.all(promises)
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const endTime = Date.now()
    const duration = endTime - startTime

    // Should complete within reasonable time (5 seconds)
    expect(duration).toBeLessThan(5000)
    
    // All events should have been processed
    expect(mockFetch).toHaveBeenCalledTimes(concurrentEvents)
  })

  test('should handle large component registrations efficiently', () => {
    const startTime = Date.now()
    const componentCount = 100

    // Register many components
    for (let i = 0; i < componentCount; i++) {
      const component = mockComponent(`perf-component-${i}`, `Component ${i}`)
      componentRegistry.registerComponent(component, {
        type: 'local',
        path: `./Component${i}`,
      })
    }

    const registrationTime = Date.now() - startTime

    // Registration should be fast (< 1 second)
    expect(registrationTime).toBeLessThan(1000)

    // Search should also be efficient
    const searchStart = Date.now()
    const results = componentRegistry.getAllComponents({ category: 'layout' })
    const searchTime = Date.now() - searchStart

    expect(searchTime).toBeLessThan(100)
    expect(results).toHaveLength(componentCount)
  })

  test('should handle high-frequency rate limiting efficiently', async () => {
    const rateLimiter = new RateLimiter()
    const requestCount = 1000
    const startTime = Date.now()

    // Make many rapid requests
    const promises = Array.from({ length: requestCount }, () =>
      rateLimiter.checkRateLimit('performance-test', 500, 60000)
    )

    const results = await Promise.all(promises)
    const endTime = Date.now()

    // Should complete quickly (< 2 seconds)
    expect(endTime - startTime).toBeLessThan(2000)

    // First 500 should be allowed, rest should be rate limited
    const allowed = results.filter(r => r.allowed).length
    const rateLimited = results.filter(r => !r.allowed).length

    expect(allowed).toBe(500)
    expect(rateLimited).toBe(500)
  })
})