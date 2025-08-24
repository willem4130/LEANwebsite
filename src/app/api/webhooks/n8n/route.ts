/**
 * N8N Webhook Integration API Endpoint
 * =====================================
 * 
 * Handles incoming webhooks from n8n automation workflows
 * with full security validation and event processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { webhookSecurity } from '@/lib/webhook-security'
import { webhookRegistry, webhookEvents } from '@/lib/webhook-integration'

// Configure security for n8n webhooks
const securityConfig = {
  authentication: {
    required: true,
    methods: ['hmac-sha256', 'api-key'],
    hmac: {
      secretKey: process.env.WEBHOOK_SECRET || 'default-secret-change-in-production',
      algorithm: 'sha256' as const,
      headerName: 'x-webhook-signature',
    },
    apiKey: {
      keys: [process.env.N8N_API_KEY || 'default-api-key'].filter(Boolean),
      headerName: 'x-api-key',
    },
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    keyGenerator: 'ip' as const,
  },
  validation: {
    maxBodySize: 1024 * 1024, // 1MB
    allowedContentTypes: ['application/json'],
    requiredHeaders: [],
  },
  threatProtection: {
    enableDDoSProtection: true,
    suspiciousActivityThreshold: 100,
    blockDuration: 3600000, // 1 hour
    enableGeoBlocking: false,
    blockedCountries: [],
  },
  logging: {
    logAllRequests: true,
    logPayloads: false,
    logFailedAuth: true,
    retentionDays: 30,
  },
  cors: {
    enabled: true,
    allowedOrigins: ['*'],
    allowedMethods: ['POST'],
    allowedHeaders: ['content-type', 'x-webhook-signature', 'x-api-key'],
  },
}

const securityMiddleware = webhookSecurity.createMiddleware(securityConfig)

export async function POST(request: NextRequest) {
  try {
    // Apply security validation
    const security = await securityMiddleware(request)
    
    if (!security.allowed) {
      console.error('N8N Webhook security validation failed:', security.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Security validation failed',
          details: security.errors 
        },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const { action, data, workflow, executionId } = body

    // Log successful authentication
    console.log(`N8N webhook authenticated - Identity: ${security.identity}`)
    console.log(`Processing action: ${action} from workflow: ${workflow?.name || 'unknown'}`)

    // Process different n8n workflow actions
    switch (action) {
      case 'content_sync':
        await handleContentSync(data)
        break
        
      case 'user_notification':
        await handleUserNotification(data)
        break
        
      case 'email_campaign':
        await handleEmailCampaign(data)
        break
        
      case 'social_media_post':
        await handleSocialMediaPost(data)
        break
        
      case 'data_backup':
        await handleDataBackup(data)
        break
        
      case 'analytics_report':
        await handleAnalyticsReport(data)
        break
        
      default:
        console.warn(`Unknown n8n action: ${action}`)
        // Still emit a custom event for unknown actions
        await webhookEvents.customEvent({
          type: 'n8n_action',
          data: {
            action,
            workflow: workflow?.name,
            executionId,
            ...data,
          },
        })
    }

    // Emit processing complete event
    await webhookEvents.customEvent({
      type: 'n8n_webhook_processed',
      data: {
        action,
        workflow: workflow?.name,
        executionId,
        success: true,
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: `N8N webhook processed successfully`,
      action,
      executionId,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('N8N webhook processing error:', error)
    
    // Emit error event
    await webhookEvents.customEvent({
      type: 'n8n_webhook_error',
      data: {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handler functions for different n8n actions

async function handleContentSync(data: any) {
  console.log('Processing content sync from n8n:', data)
  
  const { collection, document, operation } = data
  
  switch (operation) {
    case 'created':
      await webhookEvents.contentCreated(collection, document, {
        source: 'n8n-automation',
        workflow: 'content-sync',
      })
      break
      
    case 'updated':
      await webhookEvents.contentUpdated(collection, document, data.previousDocument, {
        source: 'n8n-automation',
        workflow: 'content-sync',
      })
      break
      
    case 'deleted':
      await webhookEvents.contentDeleted(collection, document, {
        source: 'n8n-automation',
        workflow: 'content-sync',
      })
      break
  }
}

async function handleUserNotification(data: any) {
  console.log('Processing user notification from n8n:', data)
  
  const { userId, type, message, channel } = data
  
  await webhookEvents.customEvent({
    type: 'user_notification_sent',
    data: {
      userId,
      notificationType: type,
      message,
      channel, // email, sms, push, slack, etc.
      timestamp: new Date().toISOString(),
    },
  })
}

async function handleEmailCampaign(data: any) {
  console.log('Processing email campaign from n8n:', data)
  
  const { campaignId, campaignName, status, recipients, metrics } = data
  
  await webhookEvents.customEvent({
    type: 'email_campaign_updated',
    data: {
      campaignId,
      campaignName,
      status, // sent, delivered, opened, clicked
      recipients: recipients?.length || 0,
      metrics,
      timestamp: new Date().toISOString(),
    },
  })
}

async function handleSocialMediaPost(data: any) {
  console.log('Processing social media post from n8n:', data)
  
  const { platform, postId, status, content, metrics } = data
  
  await webhookEvents.customEvent({
    type: 'social_media_posted',
    data: {
      platform, // twitter, facebook, instagram, linkedin
      postId,
      status, // scheduled, published, failed
      content: {
        text: content?.text?.substring(0, 100), // Truncate for privacy
        hasImage: !!content?.image,
        hasVideo: !!content?.video,
      },
      metrics,
      timestamp: new Date().toISOString(),
    },
  })
}

async function handleDataBackup(data: any) {
  console.log('Processing data backup from n8n:', data)
  
  const { backupId, type, status, size, location } = data
  
  await webhookEvents.customEvent({
    type: 'data_backup_completed',
    data: {
      backupId,
      backupType: type, // full, incremental, database, files
      status, // success, failed, partial
      sizeBytes: size,
      location, // s3, google-drive, etc.
      timestamp: new Date().toISOString(),
    },
  })
}

async function handleAnalyticsReport(data: any) {
  console.log('Processing analytics report from n8n:', data)
  
  const { reportId, type, period, metrics, insights } = data
  
  await webhookEvents.customEvent({
    type: 'analytics_report_generated',
    data: {
      reportId,
      reportType: type, // daily, weekly, monthly, custom
      period,
      metrics,
      insights,
      timestamp: new Date().toISOString(),
    },
  })
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Signature, X-API-Key',
      'Access-Control-Max-Age': '86400',
    },
  })
}