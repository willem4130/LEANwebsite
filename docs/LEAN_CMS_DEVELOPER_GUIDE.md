# LEAN CMS Developer Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [n8n Webhook Integration](#n8n-webhook-integration)
5. [Dynamic Component System](#dynamic-component-system)
6. [Plugin Development](#plugin-development)
7. [Service Integration](#service-integration)
8. [Security & Authentication](#security--authentication)
9. [API Reference](#api-reference)
10. [Best Practices](#best-practices)
11. [Examples](#examples)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The LEAN CMS Framework is a comprehensive, future-proofed content management system built for modern web applications. It provides:

- **n8n Webhook Integration**: Bidirectional event-driven automation
- **Dynamic Component Management**: Hot-swappable UI components with A/B testing
- **Plugin Marketplace**: Extensible architecture with sandboxed plugins
- **Service Integration Layer**: Unified API for third-party services
- **Advanced Security**: Multi-layer protection for webhooks and APIs

### Key Features

- 🚀 **Performance-First**: Optimized for speed and scalability
- 🔒 **Security-Focused**: Multi-layer security with threat protection
- 🧩 **Modular Architecture**: Component-based extensibility
- 📊 **Analytics Ready**: Built-in tracking and monitoring
- 🌐 **Multi-Service**: Unified integration layer for external APIs
- 🔄 **Event-Driven**: Real-time automation with n8n workflows

---

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    LEAN CMS Framework                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Dynamic         │  │ Component       │  │ A/B Testing  │ │
│  │ Components      │  │ Registry        │  │ Manager      │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Integration Layer                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Plugin          │  │ Service         │  │ n8n Webhook  │ │
│  │ Marketplace     │  │ Registry        │  │ Integration  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Security Layer                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Authentication  │  │ Rate Limiting   │  │ Threat       │ │
│  │ Manager         │  │ & DDOS          │  │ Protection   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Payload CMS     │  │ Event Store     │  │ Configuration│ │
│  │ Collections     │  │ & Webhooks      │  │ Management   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Installation

```bash
# Clone the framework
git clone https://github.com/your-org/lean-cms-framework.git
cd lean-cms-framework

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Configuration

```env
# Core Configuration
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database & CMS
DATABASE_URL=mongodb://localhost:27017/lean-cms
PAYLOAD_SECRET=your-secret-key

# Webhook Security
WEBHOOK_SECRET=your-webhook-secret-32-chars-min
WEBHOOK_ENCRYPTION_KEY=your-encryption-key

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key

# Service Integration
SENDGRID_API_KEY=your-sendgrid-key
STRIPE_SECRET_KEY=your-stripe-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### Basic Setup

```typescript
// pages/api/webhooks/n8n.ts
import { handleIncomingWebhook } from '@/lib/webhook-integration'

export default handleIncomingWebhook

// pages/_app.tsx
import { ComponentProvider } from '@/lib/component-management'
import { ServiceProvider } from '@/lib/service-integration'

export default function App({ Component, pageProps }) {
  return (
    <ServiceProvider>
      <ComponentProvider>
        <Component {...pageProps} />
      </ComponentProvider>
    </ServiceProvider>
  )
}
```

---

## n8n Webhook Integration

### Setting Up Webhooks

#### 1. Register Webhook Endpoints

```typescript
import { webhookRegistry, webhookEvents } from '@/lib/webhook-integration'

// Register a webhook for n8n
webhookRegistry.registerWebhook('content-sync', {
  name: 'Content Sync to External Systems',
  url: 'https://your-n8n-instance.com/webhook/content-sync',
  secret: process.env.WEBHOOK_SECRET!,
  events: ['content.created', 'content.updated', 'content.deleted'],
  enabled: true,
  retryPolicy: {
    maxRetries: 3,
    retryDelay: 5000,
    backoffMultiplier: 2,
  },
  filters: {
    domains: ['your-domain.com'],
  },
})
```

#### 2. Emit Events from Your Application

```typescript
// In your API route or component
import { webhookEvents } from '@/lib/webhook-integration'

// When content is created
await webhookEvents.contentCreated('posts', {
  id: '123',
  title: 'New Blog Post',
  status: 'published',
}, {
  userId: 'user-123',
  domain: 'your-site.com',
})

// When a form is submitted
await webhookEvents.formSubmitted('contact', {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello world',
}, {
  sessionId: 'sess-456',
  domain: 'your-site.com',
})
```

#### 3. Handle Incoming Webhooks from n8n

```typescript
// pages/api/webhooks/incoming.ts
import { webhookManagementAPI } from '@/lib/webhook-integration'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // n8n sending data back to your system
    const { action, data } = req.body
    
    switch (action) {
      case 'email_sent':
        // Update email delivery status
        await updateEmailStatus(data.messageId, 'delivered')
        break
        
      case 'lead_qualified':
        // Update lead scoring
        await updateLeadScore(data.leadId, data.score)
        break
        
      case 'social_media_posted':
        // Update post status
        await updateSocialMediaStatus(data.postId, 'published')
        break
    }
    
    res.json({ received: true })
  }
}
```

### n8n Workflow Templates

#### Content Sync Workflow

```json
{
  "name": "LEAN CMS Content Sync",
  "nodes": [
    {
      "name": "Content Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "lean-cms-content",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Filter Content Type",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.type }}",
              "operation": "equal", 
              "value2": "content.created"
            }
          ]
        }
      }
    },
    {
      "name": "Sync to Search Index",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://your-search-api.com/index",
        "method": "POST",
        "body": {
          "id": "={{ $json.data.document.id }}",
          "title": "={{ $json.data.document.title }}",
          "content": "={{ $json.data.document.content }}"
        }
      }
    },
    {
      "name": "Send Slack Notification",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#content-updates",
        "text": "New content published: {{ $json.data.document.title }}"
      }
    }
  ]
}
```

---

## Dynamic Component System

### Creating Dynamic Components

#### 1. Register a Component

```typescript
import { componentRegistry } from '@/lib/component-management'

// Register your component
componentRegistry.registerComponent({
  id: 'hero-banner',
  name: 'Hero Banner',
  version: '1.0.0',
  description: 'A customizable hero banner component',
  category: 'layout',
  tags: ['hero', 'banner', 'marketing'],
  author: {
    name: 'Your Name',
    email: 'you@example.com',
  },
  license: 'MIT',
  dependencies: {},
  props: {
    schema: {
      title: { type: 'string', required: true },
      subtitle: { type: 'string' },
      backgroundImage: { type: 'string', format: 'uri' },
      ctaText: { type: 'string' },
      ctaUrl: { type: 'string', format: 'uri' },
    },
    required: ['title'],
    examples: [
      {
        title: 'Welcome to Our Platform',
        subtitle: 'The best solution for your needs',
        ctaText: 'Get Started',
        ctaUrl: '/signup',
      },
    ],
  },
  styling: {
    cssVariables: ['--hero-bg-color', '--hero-text-color'],
    themes: ['default', 'dark', 'gradient'],
    responsive: true,
    darkModeSupport: true,
  },
  compatibility: {
    react: '>=18.0.0',
    nextjs: '>=13.0.0',
    typescript: true,
  },
  marketplace: {
    featured: false,
    price: 0,
    lastUpdated: new Date().toISOString(),
  },
}, {
  type: 'local',
  path: '@/components/HeroBanner',
})
```

#### 2. Create the Component

```typescript
// components/HeroBanner.tsx
import React from 'react'

interface HeroBannerProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  ctaText?: string
  ctaUrl?: string
  theme?: 'default' | 'dark' | 'gradient'
}

export default function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaUrl,
  theme = 'default'
}: HeroBannerProps) {
  return (
    <section 
      className={`hero-banner hero-banner--${theme}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {ctaText && ctaUrl && (
          <a href={ctaUrl} className="hero-cta">
            {ctaText}
          </a>
        )}
      </div>
    </section>
  )
}
```

#### 3. Use Dynamic Components

```typescript
// pages/index.tsx
import { DynamicComponent } from '@/lib/component-management'

export default function HomePage() {
  return (
    <div>
      <DynamicComponent
        componentId="hero-banner"
        title="Welcome to Our Site"
        subtitle="Experience the future"
        ctaText="Learn More"
        ctaUrl="/about"
        theme="gradient"
      />
      
      <DynamicComponent
        componentId="feature-grid"
        features={[
          { title: 'Fast', description: 'Lightning fast performance' },
          { title: 'Secure', description: 'Enterprise-grade security' },
          { title: 'Scalable', description: 'Grows with your business' },
        ]}
      />
    </div>
  )
}
```

### A/B Testing Components

#### 1. Set Up A/B Test

```typescript
import { abTestManager, componentRegistry } from '@/lib/component-management'

// Create component variants
componentRegistry.registerVariant({
  id: 'hero-variant-a',
  name: 'Hero Banner - Version A',
  description: 'Original hero banner',
  componentId: 'hero-banner',
  props: {
    title: 'Welcome to Our Platform',
    theme: 'default',
  },
  styling: {},
})

componentRegistry.registerVariant({
  id: 'hero-variant-b', 
  name: 'Hero Banner - Version B',
  description: 'Hero banner with gradient theme',
  componentId: 'hero-banner',
  props: {
    title: 'Transform Your Business Today',
    theme: 'gradient',
  },
  styling: {},
})

// Set up A/B test
abTestManager.setupTest({
  id: 'hero-banner-test',
  name: 'Hero Banner A/B Test',
  description: 'Testing different hero banner versions',
  enabled: true,
  variants: ['hero-variant-a', 'hero-variant-b'],
  trafficSplit: [50, 50],
  startDate: new Date().toISOString(),
  targetMetrics: ['conversion_rate', 'click_through_rate'],
})
```

#### 2. Use A/B Test Components

```typescript
// components/HomePage.tsx
import { ABTestComponent } from '@/lib/component-management'

export default function HomePage({ userId }) {
  return (
    <div>
      <ABTestComponent
        testId="hero-banner-test"
        userId={userId}
        fallback={<div>Loading...</div>}
      />
    </div>
  )
}
```

### Hot-Swapping Components

```typescript
// For development/testing - hot swap a component
await componentRegistry.hotSwapComponent('hero-banner', {
  type: 'remote',
  path: 'https://cdn.example.com/components/hero-banner-v2.js',
  version: '2.0.0',
})

// Component will be reloaded automatically
```

---

## Plugin Development

### Creating a Plugin

#### 1. Plugin Manifest

```json
// plugin.json
{
  "id": "google-analytics-enhanced",
  "name": "Google Analytics Enhanced",
  "version": "1.2.0",
  "description": "Advanced Google Analytics integration with custom events and e-commerce tracking",
  "category": "analytics",
  "tags": ["analytics", "google", "tracking", "ecommerce"],
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "verified": true
  },
  "main": "index.js",
  "dependencies": {
    "gtag": "^1.0.0"
  },
  "engines": {
    "lean-cms": ">=1.0.0"
  },
  "capabilities": {
    "hooks": ["page_view", "user_action", "ecommerce_event"],
    "network": true,
    "admin": true
  },
  "config": {
    "schema": {
      "trackingId": {
        "type": "string",
        "required": true,
        "description": "Google Analytics 4 Measurement ID"
      },
      "enhanced": {
        "type": "boolean",
        "default": true,
        "description": "Enable enhanced e-commerce tracking"
      },
      "customDimensions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "value": { "type": "string" }
          }
        }
      }
    },
    "required": ["trackingId"]
  },
  "marketplace": {
    "price": 0,
    "license": "MIT"
  }
}
```

#### 2. Plugin Implementation

```javascript
// index.js
class GoogleAnalyticsPlugin {
  constructor(config, leanCMS) {
    this.config = config
    this.leanCMS = leanCMS
    this.trackingId = config.trackingId
  }

  // Plugin lifecycle methods
  async initialize() {
    // Initialize Google Analytics
    this.loadGoogleAnalytics()
    
    // Register event listeners
    this.leanCMS.hooks.on('page_view', this.handlePageView.bind(this))
    this.leanCMS.hooks.on('user_action', this.handleUserAction.bind(this))
    
    if (this.config.enhanced) {
      this.leanCMS.hooks.on('ecommerce_event', this.handleEcommerce.bind(this))
    }
    
    console.log('Google Analytics Enhanced plugin initialized')
  }

  async enable() {
    // Enable tracking
    gtag('config', this.trackingId, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }

  async disable() {
    // Disable tracking
    gtag('config', this.trackingId, {
      send_page_view: false,
    })
  }

  async cleanup() {
    // Clean up resources
    this.removeEventListeners()
  }

  // Event handlers
  handlePageView(data) {
    gtag('event', 'page_view', {
      page_title: data.title,
      page_location: data.url,
      ...this.getCustomDimensions(),
    })
  }

  handleUserAction(data) {
    gtag('event', data.action, {
      event_category: data.category || 'engagement',
      event_label: data.label,
      value: data.value,
    })
  }

  handleEcommerce(data) {
    switch (data.type) {
      case 'purchase':
        gtag('event', 'purchase', {
          transaction_id: data.transactionId,
          value: data.value,
          currency: data.currency,
          items: data.items,
        })
        break
      
      case 'add_to_cart':
        gtag('event', 'add_to_cart', {
          currency: data.currency,
          value: data.value,
          items: data.items,
        })
        break
    }
  }

  // Utility methods
  loadGoogleAnalytics() {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    window.gtag = gtag

    gtag('js', new Date())
  }

  getCustomDimensions() {
    const dimensions = {}
    if (this.config.customDimensions) {
      this.config.customDimensions.forEach((dim, index) => {
        dimensions[`custom_parameter_${index + 1}`] = dim.value
      })
    }
    return dimensions
  }
}

// Export the plugin
module.exports = GoogleAnalyticsPlugin
```

#### 3. Install Plugin

```typescript
// Install plugin programmatically
import { pluginMarketplace } from '@/lib/plugin-marketplace'

await pluginMarketplace.installPlugin('google-analytics-enhanced', '1.2.0', {
  trackingId: 'GA_MEASUREMENT_ID',
  enhanced: true,
  customDimensions: [
    { name: 'user_type', value: 'premium' },
    { name: 'source', value: 'organic' },
  ],
})
```

### Publishing to Marketplace

#### 1. Package Plugin

```bash
# Create plugin package
mkdir my-plugin
cd my-plugin

# Add plugin files
touch plugin.json index.js README.md

# Package for distribution
npm pack
```

#### 2. Submit to Marketplace

```typescript
// Submit plugin to marketplace
import { pluginMarketplace } from '@/lib/plugin-marketplace'

await pluginMarketplace.submitPlugin({
  packagePath: './my-plugin-1.0.0.tgz',
  manifest: pluginManifest,
  documentation: './README.md',
  license: 'MIT',
})
```

---

## Service Integration

### Integrating External Services

#### 1. Register Service

```typescript
import { serviceRegistry } from '@/lib/service-integration'

// Register SendGrid email service
serviceRegistry.registerService({
  id: 'sendgrid-email',
  name: 'SendGrid Email Service',
  type: 'email',
  provider: 'sendgrid',
  version: '1.0.0',
  enabled: true,
  auth: {
    type: 'api-key',
    credentials: {
      apiKey: process.env.SENDGRID_API_KEY!,
    },
  },
  config: {
    fromEmail: 'noreply@yoursite.com',
    fromName: 'Your Site',
  },
  limits: {
    rateLimit: {
      requests: 100,
      window: 60, // per minute
    },
    dailyQuota: 10000,
  },
  resilience: {
    retryPolicy: {
      maxRetries: 3,
      backoffMultiplier: 2,
      initialDelay: 1000,
    },
    timeout: 30000,
    fallbackService: 'mailgun-email', // optional fallback
  },
})
```

#### 2. Use Service

```typescript
import { serviceRegistry } from '@/lib/service-integration'

// Send email
const result = await serviceRegistry.executeService({
  serviceId: 'sendgrid-email',
  operation: 'send-email',
  data: {
    to: 'user@example.com',
    from: 'noreply@yoursite.com',
    subject: 'Welcome to Our Platform!',
    html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
  },
})

if (result.success) {
  console.log('Email sent:', result.data.messageId)
} else {
  console.error('Email failed:', result.error)
}
```

#### 3. Custom Service Adapter

```typescript
import { ServiceAdapter } from '@/lib/service-integration'

export class CustomServiceAdapter extends ServiceAdapter {
  async execute(operation: string, data: any): Promise<any> {
    switch (operation) {
      case 'create-user':
        return await this.createUser(data)
      case 'update-profile':
        return await this.updateProfile(data)
      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }
  }

  private async createUser(userData: {
    email: string
    name: string
    plan: string
  }): Promise<any> {
    const response = await this.makeRequest('/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.auth.credentials.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    return await response.json()
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/api/health', {
        headers: {
          'Authorization': `Bearer ${this.config.auth.credentials.token}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}
```

### Service Health Monitoring

```typescript
import { serviceRegistry } from '@/lib/service-integration'

// Monitor service health
const healthResults = await serviceRegistry.performHealthChecks()

healthResults.forEach((isHealthy, serviceId) => {
  if (!isHealthy) {
    console.error(`Service ${serviceId} is down!`)
    // Send alert, switch to fallback, etc.
  }
})

// Get service metrics
const services = serviceRegistry.getAllServices({ status: 'degraded' })
services.forEach(service => {
  console.warn(`Service ${service.name} is experiencing issues:`, {
    responseTime: service.health?.responseTime,
    errorRate: service.health?.errorRate,
  })
})
```

---

## Security & Authentication

### Webhook Security

#### 1. Configure Security

```typescript
import { webhookSecurity } from '@/lib/webhook-security'

const securityConfig = {
  authentication: {
    required: true,
    methods: ['hmac-sha256', 'api-key'],
    hmac: {
      secretKey: process.env.WEBHOOK_SECRET!,
      algorithm: 'sha256',
      headerName: 'x-webhook-signature',
    },
    apiKey: {
      keys: [process.env.API_KEY_1!, process.env.API_KEY_2!],
      headerName: 'x-api-key',
    },
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    keyGenerator: 'ip',
  },
  validation: {
    maxBodySize: 1024 * 1024, // 1MB
    allowedContentTypes: ['application/json'],
    ipWhitelist: ['192.168.1.0/24'], // optional
  },
  threatProtection: {
    enableDDoSProtection: true,
    suspiciousActivityThreshold: 100,
    blockDuration: 3600000, // 1 hour
  },
  logging: {
    logAllRequests: true,
    logPayloads: false, // for security
    logFailedAuth: true,
    retentionDays: 30,
  },
}

const securityMiddleware = webhookSecurity.createMiddleware(securityConfig)
```

#### 2. Secure Webhook Endpoint

```typescript
// pages/api/webhooks/secure.ts
import { NextRequest } from 'next/server'
import { webhookSecurity } from '@/lib/webhook-security'

const securityMiddleware = webhookSecurity.createMiddleware({
  // ... security config
})

export default async function handler(req: NextRequest) {
  // Apply security middleware
  const securityResult = await securityMiddleware(req)
  
  if (!securityResult.allowed) {
    return new Response(
      JSON.stringify({ 
        error: 'Security validation failed',
        details: securityResult.errors 
      }),
      { 
        status: securityResult.statusCode || 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  // Process webhook safely
  const body = await req.json()
  
  // Your webhook logic here
  console.log('Authenticated user:', securityResult.identity)
  console.log('Request metadata:', securityResult.metadata)
  
  return new Response(JSON.stringify({ success: true }))
}
```

#### 3. Generate Security Keys

```typescript
import { webhookSecurity } from '@/lib/webhook-security'

// Generate webhook secret
const webhookSecret = webhookSecurity.generateWebhookSecret()
console.log('WEBHOOK_SECRET:', webhookSecret)

// Generate API key
const apiKey = webhookSecurity.generateAPIKey()
console.log('API_KEY:', apiKey)
```

### Authentication Examples

#### HMAC Signature Verification

```typescript
// Client-side: Generate signature
import { createHmac } from 'crypto'

const payload = JSON.stringify(webhookData)
const signature = createHmac('sha256', webhookSecret)
  .update(payload, 'utf8')
  .digest('hex')

await fetch('/api/webhooks/secure', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': `sha256=${signature}`,
  },
  body: payload,
})
```

#### OAuth2 Integration

```typescript
// Configure OAuth2 authentication
const oauth2Config = {
  provider: 'google',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  introspectionEndpoint: 'https://oauth2.googleapis.com/tokeninfo',
}

// Use in security config
const securityConfig = {
  authentication: {
    required: true,
    methods: ['oauth2'],
    oauth2: oauth2Config,
  },
  // ... other config
}
```

---

## API Reference

### Webhook Integration API

```typescript
// Import the webhook system
import { 
  webhookRegistry,
  webhookEvents,
  N8nWebhookConfig,
  WebhookEvent
} from '@/lib/webhook-integration'

// Register webhook
webhookRegistry.registerWebhook(id: string, config: N8nWebhookConfig): void

// Emit events
webhookEvents.contentCreated(collection: string, document: any, metadata?: any): Promise<void>
webhookEvents.contentUpdated(collection: string, document: any, previousDocument?: any, metadata?: any): Promise<void>
webhookEvents.formSubmitted(formType: string, data: any, metadata?: any): Promise<void>

// Get registered webhooks
webhookRegistry.getWebhooks(): Array<{ id: string; config: N8nWebhookConfig }>
```

### Component Management API

```typescript
// Import component system
import {
  componentRegistry,
  abTestManager,
  themeManager,
  ComponentMetadata
} from '@/lib/component-management'

// Register components
componentRegistry.registerComponent(metadata: ComponentMetadata, source: ComponentSource): void
componentRegistry.loadComponent(id: string): Promise<ComponentType<any> | null>

// A/B testing
abTestManager.setupTest(config: ABTestConfig): void
abTestManager.getVariantForUser(testId: string, userId: string): string | null

// Theme management
themeManager.registerTheme(config: ThemeConfig): void
themeManager.applyTheme(themeId: string): boolean
```

### Plugin Marketplace API

```typescript
// Import plugin system
import {
  pluginMarketplace,
  pluginStoreAPI,
  PluginManifest
} from '@/lib/plugin-marketplace'

// Plugin management
pluginMarketplace.installPlugin(pluginId: string, version?: string, config?: any, licenseKey?: string): Promise<boolean>
pluginMarketplace.uninstallPlugin(pluginId: string): Promise<boolean>
pluginMarketplace.searchPlugins(query: SearchQuery): PluginManifest[]

// Plugin store
pluginStoreAPI.browse(query?: any): Promise<PluginManifest[]>
pluginStoreAPI.install(pluginId: string, options?: any): Promise<boolean>
```

### Service Integration API

```typescript
// Import service system
import {
  serviceRegistry,
  services,
  ServiceConfig,
  ServiceRequest
} from '@/lib/service-integration'

// Service management
serviceRegistry.registerService(config: ServiceConfig): void
serviceRegistry.executeService(request: ServiceRequest): Promise<ServiceResponse>

// Helper services
services.email.send(data: EmailData): Promise<ServiceResponse>
services.payment.createIntent(data: PaymentData): Promise<ServiceResponse>
```

### Security API

```typescript
// Import security system
import {
  webhookSecurity,
  WebhookSecurityConfig
} from '@/lib/webhook-security'

// Security middleware
webhookSecurity.createMiddleware(config: WebhookSecurityConfig): SecurityMiddleware

// Utility functions
webhookSecurity.generateWebhookSecret(): string
webhookSecurity.generateAPIKey(): string
```

---

## Best Practices

### Component Development

1. **Type Safety**: Always use TypeScript for component props
2. **Prop Validation**: Define comprehensive prop schemas
3. **Accessibility**: Follow WCAG guidelines
4. **Performance**: Use React.memo and useMemo for expensive operations
5. **Testing**: Write unit tests for component logic

```typescript
// Good component example
interface MyComponentProps {
  title: string
  onClick?: () => void
  disabled?: boolean
}

const MyComponent = React.memo<MyComponentProps>(({ 
  title, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      className="my-component"
    >
      {title}
    </button>
  )
})
```

### Plugin Development

1. **Sandboxing**: Never use eval() or Function() constructor
2. **Error Handling**: Always wrap operations in try-catch
3. **Resource Cleanup**: Implement proper cleanup in plugin lifecycle
4. **Configuration**: Validate all configuration inputs
5. **Documentation**: Provide comprehensive usage examples

```typescript
// Good plugin structure
class MyPlugin {
  constructor(config, leanCMS) {
    this.config = this.validateConfig(config)
    this.leanCMS = leanCMS
  }

  validateConfig(config) {
    if (!config.apiKey) {
      throw new Error('API key is required')
    }
    return config
  }

  async initialize() {
    try {
      await this.setupIntegration()
      this.leanCMS.hooks.on('event', this.handleEvent.bind(this))
    } catch (error) {
      console.error('Plugin initialization failed:', error)
      throw error
    }
  }

  async cleanup() {
    // Clean up resources
    this.removeEventListeners()
    await this.closeConnections()
  }
}
```

### Security Best Practices

1. **Input Validation**: Validate all inputs server-side
2. **Rate Limiting**: Implement appropriate rate limits
3. **Authentication**: Use strong authentication methods
4. **Logging**: Log security events without sensitive data
5. **Updates**: Keep dependencies updated

```typescript
// Secure API endpoint example
export default async function handler(req: NextRequest) {
  // 1. Apply security middleware
  const security = await securityMiddleware(req)
  if (!security.allowed) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Validate input
  const data = await req.json()
  const validatedData = schema.parse(data) // throws on invalid

  // 3. Process request
  try {
    const result = await processRequest(validatedData)
    return Response.json({ success: true, data: result })
  } catch (error) {
    // 4. Log error (without sensitive data)
    console.error('Request processing failed:', {
      error: error.message,
      user: security.identity,
      timestamp: new Date().toISOString(),
    })
    
    return Response.json({ error: 'Processing failed' }, { status: 500 })
  }
}
```

### Performance Optimization

1. **Lazy Loading**: Load components and plugins on demand
2. **Caching**: Cache component definitions and configurations
3. **Bundle Splitting**: Split code by routes and features
4. **Resource Management**: Clean up unused resources
5. **Monitoring**: Monitor performance metrics

```typescript
// Performance optimized component loading
const LazyComponent = lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
)

function MyPage() {
  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <LazyComponent />
    </Suspense>
  )
}
```

---

## Examples

### Complete Integration Example

```typescript
// pages/api/example-integration.ts
import { NextRequest } from 'next/server'
import { 
  webhookRegistry, 
  webhookEvents,
  serviceRegistry,
  pluginMarketplace,
  webhookSecurity
} from '@/lib/lean-cms'

// 1. Set up security
const securityMiddleware = webhookSecurity.createMiddleware({
  authentication: {
    required: true,
    methods: ['hmac-sha256'],
    hmac: {
      secretKey: process.env.WEBHOOK_SECRET!,
      algorithm: 'sha256',
    },
  },
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000,
  },
})

// 2. Register services
serviceRegistry.registerService({
  id: 'email-service',
  name: 'Email Service',
  type: 'email',
  provider: 'sendgrid',
  version: '1.0.0',
  enabled: true,
  auth: {
    type: 'api-key',
    credentials: {
      apiKey: process.env.SENDGRID_API_KEY!,
    },
  },
  config: {
    fromEmail: 'noreply@example.com',
  },
})

// 3. Set up webhooks
webhookRegistry.registerWebhook('user-events', {
  name: 'User Events Webhook',
  url: 'https://n8n.example.com/webhook/user-events',
  secret: process.env.WEBHOOK_SECRET!,
  events: ['user.registered', 'form.submitted'],
  enabled: true,
  retryPolicy: {
    maxRetries: 3,
    retryDelay: 5000,
    backoffMultiplier: 2,
  },
})

// 4. API handler
export default async function handler(req: NextRequest) {
  // Apply security
  const security = await securityMiddleware(req)
  if (!security.allowed) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (req.method === 'POST') {
    const data = await req.json()
    
    try {
      // Process the request based on action
      switch (data.action) {
        case 'user_registered':
          // Send welcome email
          await serviceRegistry.executeService({
            serviceId: 'email-service',
            operation: 'send-email',
            data: {
              to: data.user.email,
              subject: 'Welcome!',
              html: '<h1>Welcome to our platform!</h1>',
            },
          })
          
          // Emit webhook event
          await webhookEvents.userRegistered(data.user, {
            source: 'api',
            timestamp: new Date().toISOString(),
          })
          break
          
        case 'contact_form':
          // Emit form submission event
          await webhookEvents.formSubmitted('contact', data.form, {
            sessionId: data.sessionId,
          })
          break
          
        default:
          return Response.json({ error: 'Unknown action' }, { status: 400 })
      }
      
      return Response.json({ success: true })
      
    } catch (error) {
      console.error('API handler error:', error)
      return Response.json({ error: 'Internal error' }, { status: 500 })
    }
  }
  
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}
```

### Component with A/B Testing

```typescript
// components/ProductCard.tsx
import React from 'react'
import { componentRegistry, abTestManager } from '@/lib/component-management'

// Register component variants
componentRegistry.registerVariant({
  id: 'product-card-variant-a',
  name: 'Product Card - Original',
  componentId: 'product-card',
  props: {
    layout: 'vertical',
    showRating: true,
    buttonStyle: 'solid',
  },
})

componentRegistry.registerVariant({
  id: 'product-card-variant-b',
  name: 'Product Card - Horizontal',
  componentId: 'product-card',
  props: {
    layout: 'horizontal',
    showRating: false,
    buttonStyle: 'outline',
  },
})

// Set up A/B test
abTestManager.setupTest({
  id: 'product-card-layout-test',
  name: 'Product Card Layout Test',
  enabled: true,
  variants: ['product-card-variant-a', 'product-card-variant-b'],
  trafficSplit: [50, 50],
  startDate: new Date().toISOString(),
  targetMetrics: ['add_to_cart', 'purchase'],
})

// Component implementation
interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    rating?: number
  }
  layout?: 'vertical' | 'horizontal'
  showRating?: boolean
  buttonStyle?: 'solid' | 'outline'
  onAddToCart?: (productId: string) => void
}

export default function ProductCard({
  product,
  layout = 'vertical',
  showRating = true,
  buttonStyle = 'solid',
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product.id)
    
    // Track A/B test conversion
    webhookEvents.customEvent({
      type: 'add_to_cart',
      data: {
        productId: product.id,
        testId: 'product-card-layout-test',
        variant: layout,
      },
    })
  }

  return (
    <div className={`product-card product-card--${layout}`}>
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        {showRating && product.rating && (
          <div className="rating">★★★★★ {product.rating}/5</div>
        )}
      </div>
      <button
        className={`btn btn--${buttonStyle}`}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  )
}
```

---

## Troubleshooting

### Common Issues

#### Webhook Not Receiving Events

**Problem**: n8n webhook not receiving events from LEAN CMS

**Solution**:
```typescript
// Check webhook registration
const webhooks = webhookRegistry.getWebhooks()
console.log('Registered webhooks:', webhooks)

// Verify webhook URL is accessible
try {
  const response = await fetch(webhookUrl, { method: 'POST' })
  console.log('Webhook accessibility:', response.status)
} catch (error) {
  console.error('Webhook URL not accessible:', error)
}

// Check event emission
await webhookEvents.contentCreated('test', { id: '123' })
```

#### Component Not Loading

**Problem**: Dynamic component fails to load

**Solution**:
```typescript
// Check component registration
const metadata = componentRegistry.getComponentMetadata('my-component')
if (!metadata) {
  console.error('Component not registered')
}

// Check component source
const component = await componentRegistry.loadComponent('my-component')
if (!component) {
  console.error('Component failed to load')
}

// Verify component path
import('./components/MyComponent')
  .then(module => console.log('Component exists:', !!module.default))
  .catch(error => console.error('Component import failed:', error))
```

#### Plugin Installation Failed

**Problem**: Plugin fails to install

**Solution**:
```typescript
// Check plugin manifest
try {
  const manifest = PluginManifestSchema.parse(pluginManifest)
  console.log('Manifest valid')
} catch (error) {
  console.error('Invalid manifest:', error)
}

// Check dependencies
const dependencies = await pluginMarketplace.resolveDependencies(plugin)
console.log('Dependencies:', dependencies)

// Check sandbox restrictions
const sandbox = new PluginSandbox(plugin)
// Review plugin capabilities and restrictions
```

#### Service Integration Issues

**Problem**: External service calls failing

**Solution**:
```typescript
// Check service configuration
const service = serviceRegistry.getService('my-service')
console.log('Service config:', service)

// Test service health
const healthResults = await serviceRegistry.performHealthChecks()
console.log('Service health:', healthResults.get('my-service'))

// Check authentication
const testRequest = {
  serviceId: 'my-service',
  operation: 'health-check',
  data: {},
}
const result = await serviceRegistry.executeService(testRequest)
console.log('Service test:', result)
```

#### Authentication Failures

**Problem**: Webhook authentication failing

**Solution**:
```typescript
// Verify webhook secret
const secret = process.env.WEBHOOK_SECRET
if (!secret || secret.length < 32) {
  console.error('Webhook secret too short or missing')
}

// Check signature generation
const payload = JSON.stringify(data)
const signature = createHmac('sha256', secret)
  .update(payload, 'utf8')
  .digest('hex')
console.log('Expected signature:', signature)

// Test authentication handler
const authHandler = new HMACAuthHandler()
const result = await authHandler.authenticate(request, { 
  secretKey: secret,
  algorithm: 'sha256' 
})
console.log('Auth result:', result)
```

### Debug Mode

Enable debug mode for detailed logging:

```typescript
// Set environment variable
process.env.LEAN_CMS_DEBUG = 'true'

// Or enable programmatically
import { setDebugMode } from '@/lib/lean-cms'
setDebugMode(true)
```

### Performance Issues

Monitor performance with built-in metrics:

```typescript
// Monitor component loading times
componentRegistry.on('component_loaded', (event) => {
  console.log(`Component ${event.componentId} loaded in ${event.loadTime}ms`)
})

// Monitor service response times
serviceRegistry.getAllServices().forEach(service => {
  if (service.health?.responseTime > 5000) {
    console.warn(`Slow service: ${service.name} (${service.health.responseTime}ms)`)
  }
})
```

---

## Support & Community

### Getting Help

- **Documentation**: Check this guide and inline code comments
- **GitHub Issues**: Report bugs and request features
- **Community Forum**: Ask questions and share solutions
- **Discord**: Join our developer community for real-time help

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request
5. Follow our coding standards

### License

This framework is licensed under MIT License. See LICENSE file for details.

---

**Happy coding with LEAN CMS! 🚀**