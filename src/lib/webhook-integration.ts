/**
 * N8N Webhook Integration System - Event-Driven Architecture
 * ===========================================================
 * 
 * Bidirectional webhook system for automation workflows with n8n
 * Provides secure, scalable webhook handling for CMS events
 */

import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { ApiError, createApiResponse, withErrorHandling } from './api-framework'

// ================================
// 1. WEBHOOK EVENT SYSTEM
// ================================

export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    'content.created',
    'content.updated',
    'content.deleted',
    'user.registered',
    'user.updated',
    'form.submitted',
    'media.uploaded',
    'media.processed',
    'site.published',
    'tour.created',
    'tour.updated',
    'gallery.updated',
    'custom'
  ]),
  source: z.string(), // The source system (payload-cms, frontend, api)
  timestamp: z.string().datetime(),
  data: z.record(z.any()),
  metadata: z.object({
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    domain: z.string().optional(),
    environment: z.enum(['development', 'staging', 'production']).optional(),
  }).optional(),
})

export type WebhookEvent = z.infer<typeof WebhookEventSchema>

export const N8nWebhookConfigSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  secret: z.string().min(32), // HMAC secret for verification
  events: z.array(z.string()), // Event types this webhook listens to
  enabled: z.boolean().default(true),
  retryPolicy: z.object({
    maxRetries: z.number().min(0).max(10).default(3),
    retryDelay: z.number().min(1000).default(5000), // milliseconds
    backoffMultiplier: z.number().min(1).default(2),
  }),
  filters: z.object({
    domains: z.array(z.string()).optional(), // Filter by domain
    userRoles: z.array(z.string()).optional(), // Filter by user role
    conditions: z.record(z.any()).optional(), // Custom filter conditions
  }).optional(),
})

export type N8nWebhookConfig = z.infer<typeof N8nWebhookConfigSchema>

// ================================
// 2. WEBHOOK REGISTRY & MANAGEMENT
// ================================

export class WebhookRegistry {
  private webhooks: Map<string, N8nWebhookConfig> = new Map()
  private eventQueue: WebhookEvent[] = []
  private processing = false

  constructor(private readonly secret?: string) {}

  // Register a new webhook
  registerWebhook(id: string, config: N8nWebhookConfig): void {
    const validatedConfig = N8nWebhookConfigSchema.parse(config)
    this.webhooks.set(id, validatedConfig)
    console.log(`Webhook registered: ${id} -> ${config.url}`)
  }

  // Unregister a webhook
  unregisterWebhook(id: string): boolean {
    return this.webhooks.delete(id)
  }

  // Get all registered webhooks
  getWebhooks(): Array<{ id: string; config: N8nWebhookConfig }> {
    return Array.from(this.webhooks.entries()).map(([id, config]) => ({ id, config }))
  }

  // Get webhooks that should receive a specific event
  getWebhooksForEvent(event: WebhookEvent): Array<{ id: string; config: N8nWebhookConfig }> {
    return this.getWebhooks().filter(({ config }) => {
      if (!config.enabled) return false
      if (!config.events.includes(event.type) && !config.events.includes('*')) return false

      // Apply filters
      if (config.filters) {
        if (config.filters.domains && event.metadata?.domain) {
          if (!config.filters.domains.includes(event.metadata.domain)) return false
        }
        // Add more filter logic as needed
      }

      return true
    })
  }

  // Emit an event to appropriate webhooks
  async emitEvent(event: Omit<WebhookEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: WebhookEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    // Validate event
    WebhookEventSchema.parse(fullEvent)

    // Add to queue
    this.eventQueue.push(fullEvent)

    // Process queue if not already processing
    if (!this.processing) {
      this.processQueue()
    }
  }

  // Process the event queue
  private async processQueue(): Promise<void> {
    if (this.processing || this.eventQueue.length === 0) return

    this.processing = true

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift()!
        await this.deliverEvent(event)
      }
    } catch (error) {
      console.error('Error processing webhook queue:', error)
    } finally {
      this.processing = false
    }
  }

  // Deliver event to webhooks
  private async deliverEvent(event: WebhookEvent): Promise<void> {
    const webhooks = this.getWebhooksForEvent(event)

    const deliveryPromises = webhooks.map(async ({ id, config }) => {
      try {
        await this.deliverToWebhook(event, config)
        console.log(`Event delivered to webhook ${id}`)
      } catch (error) {
        console.error(`Failed to deliver event to webhook ${id}:`, error)
        // Implement retry logic here
        await this.retryDelivery(event, config)
      }
    })

    await Promise.allSettled(deliveryPromises)
  }

  // Deliver event to a specific webhook
  private async deliverToWebhook(event: WebhookEvent, config: N8nWebhookConfig): Promise<void> {
    const payload = JSON.stringify(event)
    const signature = this.generateSignature(payload, config.secret)

    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': `sha256=${signature}`,
        'X-Webhook-Event': event.type,
        'X-Webhook-Delivery': event.id,
        'User-Agent': 'LEAN-CMS-Webhooks/1.0',
      },
      body: payload,
    })

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText}`)
    }
  }

  // Retry delivery with exponential backoff
  private async retryDelivery(event: WebhookEvent, config: N8nWebhookConfig): Promise<void> {
    const { maxRetries, retryDelay, backoffMultiplier } = config.retryPolicy

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const delay = retryDelay * Math.pow(backoffMultiplier, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
        await this.deliverToWebhook(event, config)
        console.log(`Event delivery succeeded on attempt ${attempt}`)
        return
      } catch (error) {
        console.error(`Retry attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          console.error('Max retries exceeded, giving up')
          // Could store failed deliveries for manual retry or dead letter queue
        }
      }
    }
  }

  // Generate HMAC signature for webhook security
  private generateSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex')
  }

  // Verify webhook signature
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret)
    const providedSignature = signature.replace('sha256=', '')
    
    return timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )
  }
}

// ================================
// 3. PAYLOAD CMS INTEGRATION
// ================================

export interface PayloadWebhookHandler {
  afterChange: (args: any) => Promise<void>
  afterDelete: (args: any) => Promise<void>
  beforeChange: (args: any) => Promise<void>
}

export class PayloadWebhookIntegration implements PayloadWebhookHandler {
  constructor(private webhookRegistry: WebhookRegistry) {}

  async afterChange(args: any): Promise<void> {
    const { doc, collection, operation, previousDoc } = args

    let eventType: WebhookEvent['type']
    switch (operation) {
      case 'create':
        eventType = 'content.created'
        break
      case 'update':
        eventType = 'content.updated'
        break
      default:
        return
    }

    await this.webhookRegistry.emitEvent({
      type: eventType,
      source: 'payload-cms',
      data: {
        collection,
        document: doc,
        previousDocument: previousDoc,
        operation,
      },
      metadata: {
        userId: args.req?.user?.id,
        domain: args.req?.headers?.host,
        environment: process.env.NODE_ENV as any,
      },
    })
  }

  async afterDelete(args: any): Promise<void> {
    const { doc, collection } = args

    await this.webhookRegistry.emitEvent({
      type: 'content.deleted',
      source: 'payload-cms',
      data: {
        collection,
        document: doc,
      },
      metadata: {
        userId: args.req?.user?.id,
        domain: args.req?.headers?.host,
        environment: process.env.NODE_ENV as any,
      },
    })
  }

  async beforeChange(args: any): Promise<void> {
    // Can be used for validation or preprocessing
    // before changes are committed
  }
}

// ================================
// 4. WEBHOOK API ENDPOINTS
// ================================

export const webhookRegistry = new WebhookRegistry(process.env.WEBHOOK_SECRET)

// Incoming webhook handler (for receiving events from n8n)
export const handleIncomingWebhook = withErrorHandling(async (req: NextRequest) => {
  if (req.method !== 'POST') {
    throw new ApiError('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405)
  }

  const body = await req.text()
  const signature = req.headers.get('x-webhook-signature') || ''
  const eventType = req.headers.get('x-webhook-event') || 'custom'

  // Verify signature if secret is configured
  if (process.env.WEBHOOK_SECRET) {
    if (!webhookRegistry.verifySignature(body, signature, process.env.WEBHOOK_SECRET)) {
      throw new ApiError('INVALID_SIGNATURE', 'Webhook signature verification failed', 401)
    }
  }

  try {
    const data = JSON.parse(body)
    
    // Process the incoming webhook data
    console.log(`Received webhook event: ${eventType}`, data)
    
    // Here you could trigger internal actions based on the webhook
    // For example, update cache, send notifications, etc.

    return createApiResponse({ received: true, eventType })
  } catch (error) {
    throw new ApiError('INVALID_PAYLOAD', 'Invalid JSON payload', 400)
  }
})

// Webhook management API
export const webhookManagementAPI = {
  // Register new webhook
  register: withErrorHandling(async (req: NextRequest) => {
    const { id, ...config } = await req.json()
    webhookRegistry.registerWebhook(id, config)
    return createApiResponse({ message: 'Webhook registered successfully', id })
  }),

  // List webhooks
  list: withErrorHandling(async (req: NextRequest) => {
    const webhooks = webhookRegistry.getWebhooks()
    return createApiResponse(webhooks)
  }),

  // Unregister webhook
  unregister: withErrorHandling(async (req: NextRequest) => {
    const { id } = await req.json()
    const removed = webhookRegistry.unregisterWebhook(id)
    return createApiResponse({ removed, id })
  }),

  // Test webhook delivery
  test: withErrorHandling(async (req: NextRequest) => {
    const { webhookId, testData } = await req.json()
    
    await webhookRegistry.emitEvent({
      type: 'custom',
      source: 'webhook-test',
      data: testData || { test: true, timestamp: new Date().toISOString() },
    })

    return createApiResponse({ message: 'Test webhook sent' })
  }),
}

// ================================
// 5. N8N WORKFLOW TEMPLATES
// ================================

export const N8N_WORKFLOW_TEMPLATES = {
  // Content sync workflow
  contentSync: {
    name: 'LEAN CMS Content Sync',
    description: 'Sync content changes to external services',
    workflow: {
      nodes: [
        {
          name: 'Webhook',
          type: 'n8n-nodes-base.webhook',
          position: [250, 300],
          parameters: {
            path: 'lean-cms-content',
            httpMethod: 'POST',
          },
        },
        {
          name: 'Filter Content Types',
          type: 'n8n-nodes-base.if',
          position: [450, 300],
          parameters: {
            conditions: {
              string: [
                {
                  value1: '={{ $json.type }}',
                  operation: 'equal',
                  value2: 'content.updated',
                },
              ],
            },
          },
        },
        {
          name: 'Update Search Index',
          type: 'n8n-nodes-base.httpRequest',
          position: [650, 200],
          parameters: {
            url: '{{ process.env.SEARCH_API_URL }}/index',
            method: 'POST',
          },
        },
        {
          name: 'Send Notification',
          type: 'n8n-nodes-base.slack',
          position: [650, 400],
          parameters: {
            channel: '#content-updates',
            text: 'Content updated: {{ $json.data.collection }}',
          },
        },
      ],
    },
  },

  // User registration workflow
  userRegistration: {
    name: 'User Registration Flow',
    description: 'Handle new user registrations with email verification',
    workflow: {
      nodes: [
        {
          name: 'User Registration Webhook',
          type: 'n8n-nodes-base.webhook',
          position: [250, 300],
          parameters: {
            path: 'user-registered',
            httpMethod: 'POST',
          },
        },
        {
          name: 'Send Welcome Email',
          type: 'n8n-nodes-base.emailSend',
          position: [450, 300],
          parameters: {
            fromEmail: 'noreply@{{ $json.metadata.domain }}',
            toEmail: '={{ $json.data.document.email }}',
            subject: 'Welcome to {{ $json.metadata.domain }}!',
          },
        },
        {
          name: 'Add to CRM',
          type: 'n8n-nodes-base.httpRequest',
          position: [650, 300],
          parameters: {
            url: '{{ process.env.CRM_API_URL }}/contacts',
            method: 'POST',
          },
        },
      ],
    },
  },

  // Form submission workflow
  formSubmission: {
    name: 'Contact Form Handler',
    description: 'Process contact form submissions',
    workflow: {
      nodes: [
        {
          name: 'Form Submission Webhook',
          type: 'n8n-nodes-base.webhook',
          position: [250, 300],
        },
        {
          name: 'Validate Submission',
          type: 'n8n-nodes-base.function',
          position: [450, 300],
          parameters: {
            functionCode: `
              const { name, email, message } = items[0].json.data;
              if (!name || !email || !message) {
                throw new Error('Missing required fields');
              }
              return items;
            `,
          },
        },
        {
          name: 'Send Email Notification',
          type: 'n8n-nodes-base.emailSend',
          position: [650, 200],
        },
        {
          name: 'Save to Database',
          type: 'n8n-nodes-base.postgres',
          position: [650, 400],
        },
      ],
    },
  },
}

// ================================
// 6. HELPER FUNCTIONS
// ================================

// Initialize webhook integration with Payload CMS
export function initializePayloadWebhooks(webhookRegistry: WebhookRegistry) {
  return new PayloadWebhookIntegration(webhookRegistry)
}

// Configure default webhooks for common n8n workflows
export function setupDefaultWebhooks(webhookRegistry: WebhookRegistry) {
  if (process.env.N8N_WEBHOOK_URL && process.env.WEBHOOK_SECRET) {
    webhookRegistry.registerWebhook('default-n8n', {
      name: 'Default N8N Webhook',
      url: process.env.N8N_WEBHOOK_URL,
      secret: process.env.WEBHOOK_SECRET,
      events: ['*'], // Listen to all events
      enabled: true,
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 5000,
        backoffMultiplier: 2,
      },
    })
  }
}

// Event emission helpers
export const webhookEvents = {
  contentCreated: (collection: string, document: any, metadata?: any) => 
    webhookRegistry.emitEvent({
      type: 'content.created',
      source: 'api',
      data: { collection, document },
      metadata,
    }),

  contentUpdated: (collection: string, document: any, previousDocument?: any, metadata?: any) => 
    webhookRegistry.emitEvent({
      type: 'content.updated',
      source: 'api',
      data: { collection, document, previousDocument },
      metadata,
    }),

  contentDeleted: (collection: string, document: any, metadata?: any) => 
    webhookRegistry.emitEvent({
      type: 'content.deleted',
      source: 'api',
      data: { collection, document },
      metadata,
    }),

  formSubmitted: (formType: string, data: any, metadata?: any) => 
    webhookRegistry.emitEvent({
      type: 'form.submitted',
      source: 'frontend',
      data: { formType, ...data },
      metadata,
    }),

  userRegistered: (user: any, metadata?: any) => 
    webhookRegistry.emitEvent({
      type: 'user.registered',
      source: 'auth',
      data: { user },
      metadata,
    }),

  sitePublished: (domain: string, version: string, metadata?: any) => 
    webhookRegistry.emitEvent({
      type: 'site.published',
      source: 'deployment',
      data: { domain, version },
      metadata,
    }),
}

// Initialize the system
setupDefaultWebhooks(webhookRegistry)