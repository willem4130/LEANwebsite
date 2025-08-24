<metadata>
purpose: Developer experience guide for rapid deployment and optimization with LEAN CMS Framework
type: developer-experience-guide
language: TypeScript
framework: Next.js 14 + Payload CMS 3.x + React 18
tools: CLI, VS Code Extensions, Development Scripts
last-updated: 2025-08-24
target-audience: developers-implementing-lean-cms
experience-level: beginner-to-advanced
</metadata>

<overview>
Complete developer experience guide for the LEAN CMS Framework covering quick start templates, development workflows, debugging tools, performance optimization, testing strategies, and production deployment. Designed to enable rapid music artist and business website development with minimal friction and maximum productivity.
</overview>

<quick-start-templates>
<template-gallery>
  <template name="Electronic Artist Website" complexity="intermediate" setup-time="15 minutes">
    <description>Complete electronic music artist website with tour dates, gallery, and booking system</description>
    <features>
      <feature>Animated hero section with GSAP effects</feature>
      <feature>Tour events with ticket integration</feature>
      <feature>Photo/video gallery with filtering</feature>
      <feature>Professional booking contact form</feature>
      <feature>Newsletter signup with email automation</feature>
      <feature>Social media integration</feature>
      <feature>Spotify/SoundCloud embeds</feature>
    </features>
    
    <setup-commands>
      <command description="Create project from template">
npx @lean-cms/framework create electronic-artist-site --template=electronic-artist
      </command>
      <command description="Navigate to project">
cd electronic-artist-site
      </command>
      <command description="Install dependencies">
npm install
      </command>
      <command description="Configure environment">
cp .env.example .env.local
# Edit .env.local with your database URL and API keys
      </command>
      <command description="Initialize database">
npm run db:setup
      </command>
      <command description="Start development server">
npm run dev
      </command>
    </setup-commands>
    
    <customization-points>
      <point name="Theme Colors">Update primary/secondary colors in lean-cms.config.js</point>
      <point name="Artist Name">Configure site name and branding</point>
      <point name="Social Links">Add Instagram, Spotify, YouTube links</point>
      <point name="Gallery Categories">Customize image/video categories</point>
      <point name="Tour Events">Set up tour date management</point>
    </customization-points>
    
    <example-config path="lean-cms.config.js">
export default {
  siteName: 'DJ Neon Pulse',
  theme: 'electronic-neon',
  colors: {
    primary: '#00ffff',
    secondary: '#ff0080',
    accent: '#8000ff',
  },
  sections: {
    hero: { enabled: true, style: 'animated' },
    about: { enabled: true },
    tours: { enabled: true, featured: 3 },
    gallery: { enabled: true, layout: 'masonry' },
    contact: { enabled: true, style: 'modal' },
  },
  integrations: {
    spotify: { artistId: 'your-spotify-artist-id' },
    instagram: { username: '@djneonpulse' },
    analytics: { trackingId: 'G-XXXXXXXXXX' },
  },
}
    </example-config>
  </template>
  
  <template name="Business Portfolio Website" complexity="beginner" setup-time="10 minutes">
    <description>Professional business website with services, portfolio, and lead generation</description>
    <features>
      <feature>Professional hero section</feature>
      <feature>Services showcase</feature>
      <feature>Portfolio/case studies gallery</feature>
      <feature>Team member profiles</feature>
      <feature>Client testimonials</feature>
      <feature>Contact form with lead tracking</feature>
      <feature>Blog/news section</feature>
    </features>
    
    <setup-commands>
      <command description="Create business website">
npx @lean-cms/framework create my-business-site --template=business
      </command>
    </setup-commands>
    
    <customization-points>
      <point name="Brand Colors">Professional color scheme configuration</point>
      <point name="Services">Define service offerings and descriptions</point>
      <point name="Portfolio">Upload case studies and project showcases</point>
      <point name="Team">Add team member profiles and bios</point>
      <point name="Testimonials">Client testimonials and reviews</point>
    </customization-points>
  </template>
  
  <template name="Minimal Starter" complexity="beginner" setup-time="5 minutes">
    <description>Clean, minimal starter template for custom development</description>
    <features>
      <feature>Basic CMS setup</feature>
      <feature>Simple hero section</feature>
      <feature>Contact form</feature>
      <feature>Extensible architecture</feature>
    </features>
    
    <setup-commands>
      <command description="Create minimal starter">
npx @lean-cms/framework create minimal-site --template=minimal
      </command>
    </setup-commands>
  </template>
  
  <template name="Portfolio Showcase" complexity="intermediate" setup-time="12 minutes">
    <description>Creative portfolio website for designers, developers, and artists</description>
    <features>
      <feature>Work showcase gallery</feature>
      <feature>Project case studies</feature>
      <feature>About section with skills</feature>
      <feature>Experience timeline</feature>
      <feature>Blog integration</feature>
      <feature>Contact and availability</feature>
    </features>
    
    <setup-commands>
      <command description="Create portfolio site">
npx @lean-cms/framework create portfolio-site --template=portfolio
      </command>
    </setup-commands>
  </template>
</template-gallery>

<development-workflow>
  <local-development>
    <development-server>
      <command name="Start development server">npm run dev</command>
      <features>
        <feature>Hot module replacement for instant updates</feature>
        <feature>TypeScript compilation with error reporting</feature>
        <feature>Tailwind CSS with JIT compilation</feature>
        <feature>Payload CMS admin at /admin route</feature>
        <feature>API endpoints with request logging</feature>
      </features>
      
      <ports>
        <port number="3000">Frontend application</port>
        <port number="3000/admin">CMS administration panel</port>
        <port number="3000/api">API endpoints</port>
      </ports>
    </development-server>
    
    <development-scripts>
      <script name="dev">
        <command>npm run dev</command>
        <description>Start development server with hot reload</description>
      </script>
      
      <script name="build">
        <command>npm run build</command>
        <description>Build production-optimized application</description>
      </script>
      
      <script name="start">
        <command>npm run start</command>
        <description>Start production server locally</description>
      </script>
      
      <script name="type-check">
        <command>npm run type-check</command>
        <description>Run TypeScript type checking</description>
      </script>
      
      <script name="lint">
        <command>npm run lint</command>
        <description>Run ESLint code quality checks</description>
      </script>
      
      <script name="test">
        <command>npm run test</command>
        <description>Run test suites</description>
      </script>
      
      <script name="db:setup">
        <command>npm run db:setup</command>
        <description>Initialize database with schema and admin user</description>
      </script>
      
      <script name="db:migrate">
        <command>npm run db:migrate</command>
        <description>Run database migrations</description>
      </script>
      
      <script name="db:seed">
        <command>npm run db:seed</command>
        <description>Populate database with sample content</description>
      </script>
    </development-scripts>
  </local-development>
  
  <vs-code-integration>
    <recommended-extensions>
      <extension name="ES7+ React/Redux/React-Native snippets">
        <purpose>React component snippets and autocomplete</purpose>
        <identifier>dsznajder.es7-react-js-snippets</identifier>
      </extension>
      
      <extension name="Tailwind CSS IntelliSense">
        <purpose>Tailwind class autocomplete and validation</purpose>
        <identifier>bradlc.vscode-tailwindcss</identifier>
      </extension>
      
      <extension name="TypeScript Importer">
        <purpose>Auto import TypeScript modules</purpose>
        <identifier>pmneo.tsimporter</identifier>
      </extension>
      
      <extension name="GitLens">
        <purpose>Enhanced Git capabilities</purpose>
        <identifier>eamodio.gitlens</identifier>
      </extension>
      
      <extension name="Prettier - Code formatter">
        <purpose>Consistent code formatting</purpose>
        <identifier>esbenp.prettier-vscode</identifier>
      </extension>
      
      <extension name="Thunder Client">
        <purpose>API testing within VS Code</purpose>
        <identifier>rangav.vscode-thunder-client</identifier>
      </extension>
    </recommended-extensions>
    
    <workspace-configuration path=".vscode/settings.json">
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
    </workspace-configuration>
    
    <code-snippets path=".vscode/lean-cms.code-snippets">
{
  "LEAN CMS Page Component": {
    "prefix": "lean-page",
    "body": [
      "import { Metadata } from 'next'",
      "import { ${1:ComponentName} } from '@/components/${2:component-name}'",
      "",
      "export const metadata: Metadata = {",
      "  title: '${3:Page Title}',",
      "  description: '${4:Page Description}',",
      "}",
      "",
      "export default function ${1:ComponentName}Page() {",
      "  return (",
      "    <main className=\"min-h-screen\">",
      "      <${1:ComponentName} />",
      "    </main>",
      "  )",
      "}"
    ],
    "description": "Create a new LEAN CMS page component"
  },
  
  "LEAN CMS API Route": {
    "prefix": "lean-api",
    "body": [
      "import { NextRequest, NextResponse } from 'next/server'",
      "import { withErrorHandling, createApiResponse } from '@lean-cms/framework/api'",
      "",
      "export const GET = withErrorHandling(async (req: NextRequest) => {",
      "  // TODO: Implement GET logic",
      "  const data = { message: 'Hello from ${1:endpoint}' }",
      "  ",
      "  return createApiResponse(data)",
      "})",
      "",
      "export const POST = withErrorHandling(async (req: NextRequest) => {",
      "  // TODO: Implement POST logic",
      "  const body = await req.json()",
      "  ",
      "  return createApiResponse({ received: body })",
      "})"
    ],
    "description": "Create a new LEAN CMS API route"
  }
}
    </code-snippets>
  </vs-code-integration>
</development-workflow>
</quick-start-templates>

<debugging-tools>
<development-debugging>
  <debug-configuration>
    <environment-variables>
      <variable name="DEBUG">Enable debug logging (DEBUG=* for all)</variable>
      <variable name="NODE_ENV">Set to 'development' for debug features</variable>
      <variable name="PAYLOAD_DEBUG">Enable Payload CMS debug logging</variable>
      <variable name="DATABASE_LOGGING">Enable database query logging</variable>
    </environment-variables>
    
    <debug-example path=".env.local">
# Enable comprehensive debugging
DEBUG=lean-cms:*,payload:*
NODE_ENV=development
PAYLOAD_DEBUG=true
DATABASE_LOGGING=true

# Disable caching for development
DISABLE_CACHE=true
NEXT_TELEMETRY_DISABLED=1
    </debug-example>
  </debug-configuration>
  
  <logging-system>
    <log-levels>
      <level name="error">Critical errors and exceptions</level>
      <level name="warn">Warnings and deprecations</level>
      <level name="info">General application info</level>
      <level name="debug">Detailed debug information</level>
      <level name="trace">Function-level tracing</level>
    </log-levels>
    
    <usage-example>
import { logger } from '@lean-cms/framework/utils'

// Structured logging with context
logger.info('User login attempt', {
  email: user.email,
  ip: req.ip,
  userAgent: req.headers['user-agent']
})

logger.error('Database connection failed', {
  error: err.message,
  connectionString: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@')
})
    </usage-example>
  </logging-system>
  
  <dev-tools-integration>
    <next-dev-tools>
      <feature>Built-in bundle analyzer</feature>
      <feature>Performance profiler</feature>
      <feature>React Developer Tools integration</feature>
      <feature>Network request inspector</feature>
    </next-dev-tools>
    
    <payload-admin-tools>
      <feature>GraphQL playground at /admin/api/playground</feature>
      <feature>Collection data browser</feature>
      <feature>Media library management</feature>
      <feature>User role management</feature>
    </payload-admin-tools>
  </dev-tools-integration>
</development-debugging>

<testing-integration>
  <unit-testing>
    <framework>Jest + React Testing Library</framework>
    <configuration path="jest.config.js">
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
    </configuration>
    
    <test-utilities path="src/test/utils.tsx">
import { render } from '@testing-library/react'
import { LeanCMSProvider } from '@lean-cms/framework/providers'
import { mockSiteConfig } from './mocks'

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LeanCMSProvider config={mockSiteConfig}>
      {ui}
    </LeanCMSProvider>
  )
}

export { screen, fireEvent, waitFor } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
    </test-utilities>
    
    <example-component-test path="src/components/__tests__/ContactForm.test.tsx">
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/utils'
import { ContactForm } from '../ContactForm'

describe('ContactForm', () => {
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn()
    renderWithProviders(<ContactForm onSubmit={mockSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message content' }
    })
    
    fireEvent.click(screen.getByText(/send message/i))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message content'
      })
    })
  })
})
    </example-component-test>
  </unit-testing>
  
  <integration-testing>
    <framework>Playwright</framework>
    <configuration path="playwright.config.ts">
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './src/e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
}

export default config
    </configuration>
    
    <example-e2e-test path="src/e2e/contact-form.spec.ts">
import { test, expect } from '@playwright/test'

test('contact form submission flow', async ({ page }) => {
  await page.goto('/contact')
  
  // Fill out the contact form
  await page.fill('[name="name"]', 'Test User')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="subject"]', 'Test Subject')
  await page.fill('[name="message"]', 'This is a test message')
  
  // Submit the form
  await page.click('button[type="submit"]')
  
  // Verify success message appears
  await expect(page.locator('.success-message')).toBeVisible()
  await expect(page.locator('.success-message')).toContainText('Message sent successfully')
})
    </example-e2e-test>
  </integration-testing>
  
  <api-testing>
    <framework>Jest + Supertest</framework>
    <example-api-test path="src/api/__tests__/contact.test.ts">
import request from 'supertest'
import { createMocks } from 'node-mocks-http'
import { POST } from '../contact/route'

describe('/api/contact', () => {
  it('should handle valid contact form submission', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      }
    })
    
    await POST(req)
    
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(true)
    expect(data.data.message).toContain('successfully')
  })
  
  it('should reject invalid email addresses', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Test message'
      }
    })
    
    await POST(req)
    
    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data.success).toBe(false)
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })
})
    </example-api-test>
  </api-testing>
</testing-integration>

<performance-monitoring>
  <lighthouse-integration>
    <automated-audits>
      <command>npm run lighthouse</command>
      <configuration path="lighthouse.config.js">
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/gallery', 'http://localhost:3000/contact'],
      startServerCommand: 'npm run start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
  },
}
      </configuration>
    </automated-audits>
    
    <performance-budgets>
      <budget-config path="performance-budget.json">
{
  "budgets": [
    {
      "path": "/*",
      "timings": [
        {
          "metric": "first-contentful-paint",
          "budget": 2000
        },
        {
          "metric": "largest-contentful-paint", 
          "budget": 2500
        },
        {
          "metric": "cumulative-layout-shift",
          "budget": 0.1
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 100000
        },
        {
          "resourceType": "total",
          "budget": 300000
        }
      ]
    }
  ]
}
      </budget-config>
    </performance-budgets>
  </lighthouse-integration>
  
  <bundle-analysis>
    <analyzer-setup>
      <command>npm run analyze</command>
      <configuration path="analyze.js">
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js config
})
      </configuration>
    </analyzer-setup>
    
    <optimization-targets>
      <target name="Initial Bundle">Keep under 100KB gzipped</target>
      <target name="Route Bundles">Each route under 50KB gzipped</target>
      <target name="Third-party Dependencies">Minimize and tree-shake</target>
      <target name="Image Assets">WebP format with responsive sizes</target>
    </optimization-targets>
  </bundle-analysis>
  
  <real-user-monitoring>
    <web-vitals-tracking path="src/lib/analytics.ts">
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to Google Analytics, Plausible, or custom endpoint
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    })
  }
}

// Measure and report Core Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
    </web-vitals-tracking>
    
    <performance-dashboard>
      <metrics>
        <metric name="Core Web Vitals">LCP, FID, CLS tracking</metric>
        <metric name="Load Times">Page load performance by route</metric>
        <metric name="Error Rates">JavaScript errors and API failures</metric>
        <metric name="User Interactions">Form submissions, navigation patterns</metric>
      </metrics>
    </performance-dashboard>
  </real-user-monitoring>
</performance-monitoring>
</debugging-tools>

<optimization-strategies>
<build-optimization>
  <next-js-optimization>
    <image-optimization>
      <configuration path="next.config.js">
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@lean-cms/framework', 'lucide-react'],
  },
}
      </configuration>
      
      <usage-example>
import Image from 'next/image'

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={props.priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  )
}
      </usage-example>
    </image-optimization>
    
    <code-splitting>
      <dynamic-imports>
import dynamic from 'next/dynamic'

// Lazy load heavy components
const GallerySection = dynamic(() => import('@/components/GallerySection'), {
  loading: () => <GallerySkeleton />,
  ssr: false, // Client-side only for interactive components
})

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
  loading: () => <ContactFormSkeleton />,
})

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <ContactForm />
    </main>
  )
}
      </dynamic-imports>
      
      <route-based-splitting>
        <automatic>Next.js automatically splits routes</automatic>
        <manual>Use dynamic imports for heavy components</manual>
        <shared-chunks>Common dependencies automatically bundled</shared-chunks>
      </route-based-splitting>
    </code-splitting>
    
    <css-optimization>
      <tailwind-purging>
        <configuration path="tailwind.config.js">
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
        </configuration>
      </tailwind-purging>
      
      <critical-css>
        <inline-critical>Critical CSS inlined in HTML head</inline-critical>
        <async-loading>Non-critical CSS loaded asynchronously</async-loading>
      </critical-css>
    </css-optimization>
  </next-js-optimization>
  
  <database-optimization>
    <connection-pooling>
      <configuration path="src/lib/db.ts">
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export { pool }
      </configuration>
    </connection-pooling>
    
    <query-optimization>
      <indexing>
        <strategy>Index frequently queried columns</strategy>
        <composite-indexes>Multi-column indexes for complex queries</composite-indexes>
        <monitoring>Query performance monitoring</monitoring>
      </indexing>
      
      <caching>
        <redis-caching>
          <configuration path="src/lib/cache.ts">
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCache<T>(key: string, value: T, ttl = 3600): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value))
}
          </configuration>
        </redis-caching>
        
        <application-caching>
          <strategy>Cache frequently accessed data</strategy>
          <invalidation>Smart cache invalidation on updates</invalidation>
          <ttl>Appropriate TTL values by data type</ttl>
        </application-caching>
      </caching>
    </query-optimization>
  </database-optimization>
  
  <asset-optimization>
    <compression>
      <gzip>Gzip compression for text assets</gzip>
      <brotli>Brotli compression for modern browsers</brotli>
      <configuration path="next.config.js">
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
}
      </configuration>
    </compression>
    
    <cdn-integration>
      <static-assets>Serve static assets via CDN</static-assets>
      <image-optimization>CDN-based image transformation</image-optimization>
      <cache-headers>Appropriate cache headers for different asset types</cache-headers>
    </cdn-integration>
  </asset-optimization>
</build-optimization>

<runtime-optimization>
  <server-side-rendering>
    <static-generation>
      <pages>Generate static pages at build time</pages>
      <incremental-static-regeneration>ISR for dynamic content</incremental-static-regeneration>
      <example path="src/app/gallery/page.tsx">
export const revalidate = 3600 // Regenerate every hour

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems()
  
  return (
    <main>
      <GallerySection items={galleryItems} />
    </main>
  )
}
      </example>
    </static-generation>
    
    <server-components>
      <data-fetching>Fetch data directly in server components</data-fetching>
      <reduced-javascript>Less JavaScript sent to client</reduced-javascript>
      <streaming>Stream content as it becomes available</streaming>
    </server-components>
  </server-side-rendering>
  
  <client-optimization>
    <lazy-loading>
      <images>Lazy load images below fold</images>
      <components>Lazy load interactive components</components>
      <intersection-observer>Use Intersection Observer API</intersection-observer>
    </lazy-loading>
    
    <preloading>
      <critical-resources>Preload critical resources</critical-resources>
      <route-prefetching>Prefetch likely next routes</route-prefetching>
      <example path="src/components/Navigation.tsx">
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      <Link href="/gallery" prefetch={true}>
        Gallery
      </Link>
      <Link href="/contact" prefetch={true}>
        Contact
      </Link>
    </nav>
  )
}
      </example>
    </preloading>
  </client-optimization>
</runtime-optimization>
</optimization-strategies>

<deployment-workflows>
<staging-environment>
  <setup>
    <environment-separation>
      <development>Local development with hot reload</development>
      <staging>Production-like environment for testing</staging>
      <production>Live production environment</production>
    </environment-separation>
    
    <staging-deployment>
      <automatic>Deploy to staging on every pull request</automatic>
      <testing>Run full test suite on staging</testing>
      <review>Manual review before production deployment</review>
    </staging-deployment>
  </setup>
  
  <ci-cd-pipeline path=".github/workflows/deploy.yml">
name: Deploy LEAN CMS Site

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Run build
        run: npm run build
  
  deploy-staging:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
  
  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
  </ci-cd-pipeline>
</staging-environment>

<production-deployment>
  <platform-specific>
    <vercel-deployment>
      <configuration path="vercel.json">
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=86400" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/admin",
      "destination": "/admin/",
      "permanent": true
    }
  ]
}
      </configuration>
      
      <deployment-script>
#!/bin/bash
echo "🚀 Deploying to Vercel..."

# Environment check
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN not set"
  exit 1
fi

# Build and deploy
npm run build
vercel --prod --token $VERCEL_TOKEN

echo "✅ Deployment complete!"
      </deployment-script>
    </vercel-deployment>
    
    <netlify-deployment>
      <configuration path="netlify.toml">
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/admin"
  to = "/admin/"
  status = 301
      </configuration>
    </netlify-deployment>
  </platform-specific>
  
  <health-checks>
    <endpoints>
      <endpoint path="/api/health">Basic health check</endpoint>
      <endpoint path="/api/health/db">Database connectivity</endpoint>
      <endpoint path="/api/health/external">Third-party services</endpoint>
    </endpoints>
    
    <monitoring>
      <uptime>Monitor endpoint availability</uptime>
      <performance>Track response times</performance>
      <alerts>Set up alerting for failures</alerts>
    </monitoring>
  </health-checks>
</production-deployment>
</deployment-workflows>

<troubleshooting-guide>
<common-issues>
  <issue name="Build Failures" frequency="common">
    <symptoms>
      <symptom>TypeScript compilation errors</symptom>
      <symptom>Missing environment variables</symptom>
      <symptom>Dependency resolution issues</symptom>
      <symptom>Out of memory errors</symptom>
    </symptoms>
    
    <debugging-steps>
      <step number="1">Check TypeScript errors with `npm run type-check`</step>
      <step number="2">Verify all environment variables are set</step>
      <step number="3">Clear node_modules and package-lock.json, reinstall</step>
      <step number="4">Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`</step>
      <step number="5">Check for conflicting dependencies</step>
    </debugging-steps>
    
    <solutions>
      <solution>Fix TypeScript errors before building</solution>
      <solution>Use environment variable validation</solution>
      <solution>Keep dependencies up to date</solution>
      <solution>Monitor build performance</solution>
    </solutions>
  </issue>
  
  <issue name="Database Connection Issues" frequency="common">
    <symptoms>
      <symptom>Cannot connect to database</symptom>
      <symptom>Connection timeouts</symptom>
      <symptom>Pool exhaustion errors</symptom>
      <symptom>Migration failures</symptom>
    </symptoms>
    
    <debugging-steps>
      <step number="1">Verify DATABASE_URL format and credentials</step>
      <step number="2">Test connection with database client</step>
      <step number="3">Check firewall and network settings</step>
      <step number="4">Review connection pool configuration</step>
      <step number="5">Check database server status</step>
    </debugging-steps>
    
    <solutions>
      <solution>Use connection pooling properly</solution>
      <solution>Implement connection retry logic</solution>
      <solution>Monitor database performance</solution>
      <solution>Set appropriate timeouts</solution>
    </solutions>
  </issue>
  
  <issue name="Performance Issues" frequency="moderate">
    <symptoms>
      <symptom>Slow page load times</symptom>
      <symptom>Large bundle sizes</symptom>
      <symptom>Memory leaks</symptom>
      <symptom>High server response times</symptom>
    </symptoms>
    
    <debugging-steps>
      <step number="1">Run Lighthouse audit</step>
      <step number="2">Analyze bundle with `npm run analyze`</step>
      <step number="3">Profile with browser dev tools</step>
      <step number="4">Check database query performance</step>
      <step number="5">Monitor server resource usage</step>
    </debugging-steps>
    
    <solutions>
      <solution>Optimize images and assets</solution>
      <solution>Implement code splitting</solution>
      <solution>Add appropriate caching</solution>
      <solution>Optimize database queries</solution>
    </solutions>
  </issue>
  
  <issue name="CMS Admin Issues" frequency="low">
    <symptoms>
      <symptom>Cannot access /admin route</symptom>
      <symptom>Login failures</symptom>
      <symptom>Collection data not loading</symptom>
      <symptom>File upload failures</symptom>
    </symptoms>
    
    <debugging-steps>
      <step number="1">Verify Payload CMS configuration</step>
      <step number="2">Check admin user credentials</step>
      <step number="3">Review server logs</step>
      <step number="4">Test API endpoints directly</step>
      <step number="5">Check file system permissions</step>
    </debugging-steps>
    
    <solutions>
      <solution>Verify Payload config is valid</solution>
      <solution>Ensure admin user exists</solution>
      <solution>Check file upload configuration</solution>
      <solution>Review CORS settings</solution>
    </solutions>
  </issue>
</common-issues>

<debugging-workflows>
  <development-debugging>
    <step-by-step>
      <step number="1">Enable debug logging</step>
      <step number="2">Reproduce the issue</step>
      <step number="3">Check browser console</step>
      <step number="4">Review server logs</step>
      <step number="5">Use debugger breakpoints</step>
      <step number="6">Test with minimal reproduction</step>
    </step-by-step>
    
    <tools>
      <tool name="Browser DevTools">Network, Console, Performance tabs</tool>
      <tool name="VS Code Debugger">Set breakpoints in server code</tool>
      <tool name="React DevTools">Component tree and props inspection</tool>
      <tool name="Next.js DevTools">Build analysis and performance</tool>
    </tools>
  </development-debugging>
  
  <production-debugging>
    <step-by-step>
      <step number="1">Check error monitoring dashboard</step>
      <step number="2">Review server logs</step>
      <step number="3">Check health endpoints</step>
      <step number="4">Verify environment variables</step>
      <step number="5">Test with staging environment</step>
      <step number="6">Implement gradual rollback if needed</step>
    </step-by-step>
    
    <tools>
      <tool name="Error Tracking">Sentry, Bugsnag, or similar</tool>
      <tool name="Log Aggregation">Centralized logging system</tool>
      <tool name="APM">Application performance monitoring</tool>
      <tool name="Uptime Monitoring">External service monitoring</tool>
    </tools>
  </production-debugging>
</debugging-workflows>
</troubleshooting-guide>

<best-practices>
<code-quality>
  <style-guide>
    <typescript>Use strict TypeScript configuration</typescript>
    <naming-conventions>Consistent naming for files and functions</naming-conventions>
    <component-structure>Follow established component patterns</component-structure>
    <api-design>RESTful API design principles</api-design>
  </style-guide>
  
  <linting-setup path=".eslintrc.json">
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["src/app/api/**/*.ts"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
  </linting-setup>
  
  <pre-commit-hooks path=".husky/pre-commit">
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm test --passWithNoTests
  </pre-commit-hooks>
</code-quality>

<security-practices>
  <input-validation>Always validate and sanitize user input</input-validation>
  <authentication>Use strong JWT tokens and secure session management</authentication>
  <authorization>Implement proper role-based access control</authorization>
  <rate-limiting>Protect APIs with rate limiting</rate-limiting>
  <cors-configuration>Configure CORS appropriately for your domain</cors-configuration>
</security-practices>

<performance-practices>
  <lazy-loading>Implement lazy loading for images and components</lazy-loading>
  <code-splitting>Split code at route and component levels</code-splitting>
  <caching-strategy>Implement appropriate caching at all levels</caching-strategy>
  <bundle-optimization>Monitor and optimize bundle sizes</bundle-optimization>
  <image-optimization>Use Next.js Image component with optimization</image-optimization>
</performance-practices>
</best-practices>