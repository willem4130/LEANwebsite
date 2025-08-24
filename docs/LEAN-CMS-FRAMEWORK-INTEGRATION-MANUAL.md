<metadata>
purpose: Comprehensive integration manual for LEAN CMS Framework implementation
type: integration-guide
language: TypeScript
framework: Next.js 14 + Payload CMS 3.x + React 18
dependencies: Tailwind CSS, GSAP, Framer Motion, shadcn/ui
last-updated: 2025-08-24
target-audience: developers-integrating-framework
integration-complexity: intermediate-to-advanced
</metadata>

<overview>
Complete step-by-step integration manual for implementing the LEAN CMS Framework in existing projects or creating new websites from scratch. Covers framework setup, customization, theming, content management integration, and deployment optimization for rapid music artist and business website deployment.
</overview>

<integration-approaches>
<new-project-setup>
  <quick-start method="CLI-based">
    <command-sequence>
      <step number="1">
        <command>npx @lean-cms/framework create my-website --template=artist</command>
        <description>Generate new project with artist template</description>
        <output>Complete Next.js 14 project with Payload CMS configured</output>
      </step>
      <step number="2">
        <command>cd my-website && npm install</command>
        <description>Navigate and install dependencies</description>
        <duration>2-3 minutes</duration>
      </step>
      <step number="3">
        <command>cp .env.example .env.local</command>
        <description>Configure environment variables</description>
        <required-vars>DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL</required-vars>
      </step>
      <step number="4">
        <command>npm run db:setup</command>
        <description>Initialize database and create admin user</description>
        <interactive>true</interactive>
      </step>
      <step number="5">
        <command>npm run dev</command>
        <description>Start development server</description>
        <ports>3000 (frontend), 3000/admin (CMS)</ports>
      </step>
    </command-sequence>
    
    <post-setup-verification>
      <check name="Frontend Loading">
        <url>http://localhost:3000</url>
        <expected>Hero section with placeholder content</expected>
      </check>
      <check name="CMS Admin">
        <url>http://localhost:3000/admin</url>
        <expected>Payload CMS login screen</expected>
      </check>
      <check name="API Endpoints">
        <url>http://localhost:3000/api/contact</url>
        <expected>POST method available message</expected>
      </check>
    </post-setup-verification>
  </quick-start>
  
  <manual-setup method="existing-project">
    <prerequisites>
      <requirement>Next.js 14+ project</requirement>
      <requirement>TypeScript configuration</requirement>
      <requirement>Tailwind CSS setup</requirement>
      <requirement>Node.js 18+ runtime</requirement>
    </prerequisites>
    
    <installation-steps>
      <step number="1">
        <command>npm install @lean-cms/framework</command>
        <description>Install core framework package</description>
      </step>
      <step number="2">
        <command>npm install @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-slate</command>
        <description>Install Payload CMS dependencies</description>
      </step>
      <step number="3">
        <description>Configure next.config.js</description>
        <code-example language="javascript">
const { withLeanCMS } = require('@lean-cms/framework/next')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
}

module.exports = withLeanCMS(nextConfig)
        </code-example>
      </step>
      <step number="4">
        <description>Create Payload CMS configuration</description>
        <file-path>payload.config.ts</file-path>
        <code-example language="typescript">
import { buildConfig } from '@lean-cms/framework/cms'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    bundler: 'webpack',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  editor: slateEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
})
        </code-example>
      </step>
    </installation-steps>
  </manual-setup>
</new-project-setup>

<existing-project-integration>
  <migration-strategy>
    <assessment-checklist>
      <item name="Current Tech Stack">
        <compatible>Next.js 13+, React 18+, TypeScript</compatible>
        <needs-upgrade>Next.js 12-, React 17-, JavaScript only</needs-upgrade>
        <incompatible>Vue, Angular, non-React frameworks</incompatible>
      </item>
      <item name="Database Setup">
        <preferred>PostgreSQL 14+</preferred>
        <supported>MySQL 8+, SQLite (development)</supported>
        <migration-required>MongoDB, Firebase</migration-required>
      </item>
      <item name="Styling System">
        <compatible>Tailwind CSS 3+, CSS Modules</compatible>
        <adaptable>Styled Components, Emotion</adaptable>
        <conflicts>Bootstrap, Materialize</conflicts>
      </item>
    </assessment-checklist>
    
    <gradual-migration>
      <phase name="Phase 1: Foundation Setup" duration="1-2 days">
        <tasks>
          <task>Install LEAN CMS Framework package</task>
          <task>Configure Payload CMS</task>
          <task>Set up database connection</task>
          <task>Create basic content types</task>
        </tasks>
        <success-criteria>
          <criterion>CMS admin accessible</criterion>
          <criterion>API endpoints responding</criterion>
          <criterion>No breaking changes to existing pages</criterion>
        </success-criteria>
      </phase>
      
      <phase name="Phase 2: Component Integration" duration="2-3 days">
        <tasks>
          <task>Replace existing components with LEAN components</task>
          <task>Migrate to LEAN theming system</task>
          <task>Implement LEAN API patterns</task>
          <task>Update routing and navigation</task>
        </tasks>
        <success-criteria>
          <criterion>All pages render correctly</criterion>
          <criterion>Theme system functional</criterion>
          <criterion>API integration working</criterion>
        </success-criteria>
      </phase>
      
      <phase name="Phase 3: Optimization" duration="1-2 days">
        <tasks>
          <task>Performance optimization</task>
          <task>SEO configuration</task>
          <task>Animation integration</task>
          <task>Mobile responsiveness verification</task>
        </tasks>
        <success-criteria>
          <criterion>Lighthouse score >90</criterion>
          <criterion>All devices responsive</criterion>
          <criterion>Animations smooth</criterion>
        </success-criteria>
      </phase>
    </gradual-migration>
  </migration-strategy>
</existing-project-integration>
</integration-approaches>

<configuration-system>
<site-configuration>
  <config-file path="lean-cms.config.js">
    <basic-configuration>
export default {
  // Site Identity
  siteName: 'Artist Name',
  siteDescription: 'Official website of Artist Name',
  
  // Theme Selection
  theme: 'electronic-neon', // or 'minimal-clean', 'vintage-warm'
  
  // Color Customization
  colors: {
    primary: '#00ffff',
    secondary: '#8b5cf6',
    accent: '#e91e63',
  },
  
  // Sections Configuration
  sections: {
    hero: { enabled: true, style: 'animated' },
    about: { enabled: true },
    tours: { enabled: true, featured: 3 },
    gallery: { enabled: true, layout: 'masonry' },
    contact: { enabled: true, style: 'inline' },
    shop: { enabled: false },
    blog: { enabled: false },
  },
  
  // Integrations
  integrations: {
    spotify: {
      enabled: true,
      artistId: 'your-spotify-artist-id',
    },
    instagram: {
      enabled: true,
      username: '@artisthandle',
    },
    analytics: {
      provider: 'google',
      trackingId: 'GA_MEASUREMENT_ID',
    },
    email: {
      provider: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
}
    </basic-configuration>
    
    <advanced-configuration>
export default {
  siteName: 'Advanced Artist Configuration',
  
  // Custom Theme Definition
  theme: {
    id: 'custom-electronic',
    name: 'Custom Electronic Theme',
    colors: {
      primary: '#ff0080',
      secondary: '#8000ff',
      accent: '#00ff80',
      background: '#0a0a0a',
      text: '#ffffff',
      muted: '#666666',
    },
    fonts: {
      display: 'Orbitron, monospace',
      body: 'Inter, sans-serif',
      mono: 'Space Mono, monospace',
    },
    animations: {
      enabled: true,
      intensity: 'intense', // subtle, moderate, intense
      duration: 3, // seconds
      easing: 'power2.out',
    },
    components: {
      heroStyle: 'video', // gradient, image, video, animated
      navStyle: 'electronic', // minimal, electronic, classic, modern  
      galleryLayout: 'masonry', // grid, masonry, carousel, mosaic
      contactStyle: 'modal', // inline, modal, dedicated-page
    },
  },
  
  // Content Management
  cms: {
    collections: {
      tours: {
        enabled: true,
        fields: ['eventName', 'venue', 'city', 'date', 'ticketUrl'],
        admin: {
          defaultSort: 'date',
          useAsTitle: 'eventName',
        },
      },
      gallery: {
        enabled: true,
        upload: {
          staticDir: 'media',
          adminThumbnail: 'thumbnail',
          mimeTypes: ['image/*', 'video/*'],
        },
        fields: ['alt', 'caption', 'category'],
      },
      pages: {
        enabled: true,
        admin: {
          useAsTitle: 'title',
        },
      },
    },
    admin: {
      meta: {
        titleSuffix: '- Artist CMS',
        favicon: '/admin-favicon.ico',
      },
      user: 'users',
      autoLogin: process.env.NODE_ENV === 'development' ? {
        email: 'dev@example.com',
        password: 'test123',
        prefillOnly: true,
      } : false,
    },
  },
  
  // API Configuration
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
      message: 'Too many requests, please try again later',
    },
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : true,
      credentials: true,
    },
    validation: {
      strict: true,
      sanitize: true,
      errorFormat: 'detailed',
    },
  },
  
  // Performance Optimization
  performance: {
    images: {
      formats: ['webp', 'avif'],
      sizes: [400, 800, 1200, 1600],
      quality: 85,
      loading: 'lazy',
    },
    caching: {
      static: '1y',
      api: '5m',
      pages: '1h',
    },
    bundling: {
      analyzer: process.env.ANALYZE === 'true',
      splitChunks: true,
      compression: 'gzip',
    },
  },
  
  // SEO Configuration  
  seo: {
    defaultTitle: 'Artist Name - Official Website',
    titleTemplate: '%s | Artist Name',
    description: 'Official website featuring music, tours, and updates from Artist Name',
    keywords: ['artist name', 'electronic music', 'tours', 'concerts'],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Artist Name',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Artist Name',
        },
      ],
    },
    twitter: {
      handle: '@artisthandle',
      cardType: 'summary_large_image',
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      name: 'Artist Name',
      genre: ['Electronic', 'Ambient'],
    },
  },
}
    </advanced-configuration>
  </config-file>
  
  <environment-configuration>
    <development-env path=".env.local">
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/leandb"

# Payload CMS
PAYLOAD_SECRET="your-32-character-secret-key-here"
PAYLOAD_PUBLIC_SERVER_URL="http://localhost:3000"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Artist Name"

# Third-party Services (Optional)
SENDGRID_API_KEY="your-sendgrid-api-key"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
SPOTIFY_CLIENT_ID="your-spotify-client-id"
INSTAGRAM_ACCESS_TOKEN="your-instagram-token"

# Development Tools
ANALYZE="false"
DISABLE_CACHE="false"
    </development-env>
    
    <production-env path=".env.production">
# Database (Production PostgreSQL)
DATABASE_URL="postgresql://produser:securepass@prod-db.provider.com:5432/prod_db"

# Payload CMS (Secure)
PAYLOAD_SECRET="ultra-secure-production-secret-key-min-32-chars"
PAYLOAD_PUBLIC_SERVER_URL="https://yourdomain.com"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_NAME="Artist Name"

# Production Services
SENDGRID_API_KEY="production-sendgrid-key"
GOOGLE_ANALYTICS_ID="G-PROD-TRACKING-ID"

# Security & Performance
NODE_ENV="production"
ANALYZE="false"
    </production-env>
  </environment-configuration>
</site-configuration>

<theme-customization>
  <predefined-themes>
    <theme name="electronic-neon">
      <description>Cyberpunk-inspired with neon accents and dark backgrounds</description>
      <use-cases>Electronic music artists, DJs, tech-focused brands</use-cases>
      <color-palette>
        <primary>#00ffff (cyan)</primary>
        <secondary>#8b5cf6 (purple)</secondary>
        <accent>#e91e63 (pink)</accent>
        <background>#060609 (dark)</background>
      </color-palette>
      <typography>
        <display>Orbitron (futuristic)</display>
        <body>Inter (clean)</body>
        <mono>Space Mono (code)</mono>
      </typography>
      <animations>High intensity, GPU-accelerated effects</animations>
    </theme>
    
    <theme name="minimal-clean">
      <description>Clean and minimal design for sophisticated artists</description>
      <use-cases>Classical musicians, indie artists, corporate</use-cases>
      <color-palette>
        <primary>#1f2937 (dark gray)</primary>
        <secondary>#6b7280 (gray)</secondary>
        <accent>#3b82f6 (blue)</accent>
        <background>#ffffff (white)</background>
      </color-palette>
      <typography>
        <display>Inter (modern)</display>
        <body>Inter (consistent)</body>
      </typography>
      <animations>Subtle, refined transitions</animations>
    </theme>
    
    <theme name="vintage-warm">
      <description>Warm colors and vintage typography for indie artists</description>
      <use-cases>Folk artists, indie bands, vintage aesthetic</use-cases>
      <color-palette>
        <primary>#92400e (brown)</primary>
        <secondary>#dc2626 (red)</secondary>
        <accent>#f59e0b (amber)</accent>
        <background>#fef7ed (cream)</background>
      </color-palette>
      <typography>
        <display>Playfair Display (elegant)</display>
        <body>Source Serif Pro (readable)</body>
      </typography>
      <animations>Moderate, organic movements</animations>
    </theme>
  </predefined-themes>
  
  <custom-theme-creation>
    <theme-builder-config path="theme/custom.js">
export const customTheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  
  // Color System
  colors: {
    // Primary brand colors
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    accent: '#your-accent-color',
    
    // Background and surfaces
    background: '#background-color',
    surface: '#surface-color',
    
    // Text colors
    text: '#text-color',
    textMuted: '#muted-text-color',
    
    // State colors
    success: '#success-color',
    warning: '#warning-color',
    error: '#error-color',
    
    // Interactive states
    hover: '#hover-color',
    active: '#active-color',
    disabled: '#disabled-color',
  },
  
  // Typography Scale
  typography: {
    fonts: {
      display: 'Your Display Font, serif',
      body: 'Your Body Font, sans-serif',
      mono: 'Your Mono Font, monospace',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing System
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Animation Configuration
  animations: {
    enabled: true,
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    intensity: 'moderate', // subtle, moderate, intense
  },
  
  // Component Styles
  components: {
    button: {
      variants: {
        primary: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-background)',
        },
        secondary: {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-text)',
        },
      },
      sizes: {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
      },
    },
    card: {
      backgroundColor: 'var(--color-surface)',
      borderRadius: '0.5rem',
      padding: 'var(--spacing-lg)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
  },
  
  // Responsive Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}
    </theme-builder-config>
    
    <theme-application>
      <css-variables path="styles/theme.css">
:root {
  /* Colors */
  --color-primary: #{colors.primary};
  --color-secondary: #{colors.secondary};
  --color-accent: #{colors.accent};
  --color-background: #{colors.background};
  --color-text: #{colors.text};
  
  /* Typography */
  --font-display: #{typography.fonts.display};
  --font-body: #{typography.fonts.body};
  --font-mono: #{typography.fonts.mono};
  
  /* Spacing */
  --spacing-xs: #{spacing.xs};
  --spacing-sm: #{spacing.sm};
  --spacing-md: #{spacing.md};
  --spacing-lg: #{spacing.lg};
  --spacing-xl: #{spacing.xl};
  
  /* Animations */
  --animation-duration-fast: #{animations.duration.fast}ms;
  --animation-duration-normal: #{animations.duration.normal}ms;
  --animation-duration-slow: #{animations.duration.slow}ms;
  --animation-easing-default: #{animations.easing.default};
}
      </css-variables>
      
      <tailwind-integration path="tailwind.config.js">
const { customTheme } = require('./theme/custom.js')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: customTheme.colors,
      fontFamily: {
        display: customTheme.typography.fonts.display.split(','),
        body: customTheme.typography.fonts.body.split(','),
        mono: customTheme.typography.fonts.mono.split(','),
      },
      spacing: customTheme.spacing,
      screens: customTheme.breakpoints,
      animation: {
        'fade-in': 'fadeIn var(--animation-duration-normal) var(--animation-easing-default)',
        'slide-up': 'slideUp var(--animation-duration-normal) var(--animation-easing-default)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
      </tailwind-integration>
    </theme-application>
  </custom-theme-creation>
</theme-customization>
</configuration-system>

<component-integration>
<page-components>
  <hero-section>
    <implementation path="src/components/sections/HeroSection.tsx">
import { HeroSection } from '@lean-cms/framework/components'
import { useConfig } from '@lean-cms/framework/hooks'

export function CustomHeroSection() {
  const config = useConfig()
  
  return (
    &lt;HeroSection
      title={config.siteName}
      subtitle="Creating electronic music experiences"
      backgroundType={config.theme.components.heroStyle}
      backgroundMedia="/hero-bg.jpg"
      ctaText="Listen Now"
      ctaLink="/music"
      socialLinks={config.integrations}
      animation={config.theme.animations}
    /&gt;
  )
}
    </implementation>
    
    <customization-options>
      <background-types>
        <option name="gradient">Animated CSS gradients</option>
        <option name="image">Static or parallax images</option>
        <option name="video">Background video with controls</option>
        <option name="animated">GSAP-powered animations</option>
      </background-types>
      
      <content-variants>
        <variant name="centered">Centered content with CTA</variant>
        <variant name="left-aligned">Left-aligned with media on right</variant>
        <variant name="fullscreen">Full viewport height</variant>
        <variant name="minimal">Text-only minimal design</variant>
      </content-variants>
    </customization-options>
  </hero-section>
  
  <gallery-component>
    <implementation path="src/components/sections/GallerySection.tsx">
import { GallerySection, GalleryItem } from '@lean-cms/framework/components'
import { useGalleryItems } from '@lean-cms/framework/hooks'

export function CustomGallerySection() {
  const { items, loading, categories } = useGalleryItems({
    limit: 12,
    featured: true,
  })
  
  const config = useConfig()
  
  if (loading) return &lt;GallerySkeleton /&gt;
  
  return (
    &lt;GallerySection
      title="Live Moments"
      layout={config.theme.components.galleryLayout}
      items={items}
      categories={categories}
      enableFiltering={true}
      enableLightbox={true}
      loadMore={{
        enabled: true,
        increment: 6,
      }}
    /&gt;
  )
}
    </implementation>
    
    <layout-options>
      <layout name="grid">Uniform grid layout</layout>
      <layout name="masonry">Pinterest-style masonry</layout>
      <layout name="carousel">Horizontal scrolling carousel</layout>
      <layout name="mosaic">Mixed size artistic arrangement</layout>
    </layout-options>
  </gallery-component>
  
  <contact-form>
    <implementation path="src/components/forms/ContactForm.tsx">
import { ContactForm, FormField } from '@lean-cms/framework/components'
import { useContactForm } from '@lean-cms/framework/hooks'

export function CustomContactForm() {
  const { submit, loading, success, error } = useContactForm({
    endpoint: '/api/contact',
    onSuccess: (data) => {
      // Custom success handling
      console.log('Form submitted successfully:', data)
    },
    onError: (error) => {
      // Custom error handling  
      console.error('Form submission failed:', error)
    },
  })
  
  return (
    &lt;ContactForm
      onSubmit={submit}
      loading={loading}
      success={success}
      error={error}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'subject', label: 'Subject', type: 'text', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 5 },
        { name: 'phone', label: 'Phone', type: 'tel', required: false },
      ]}
      submitButton={{
        text: 'Send Message',
        loadingText: 'Sending...',
        successText: 'Message Sent!',
      }}
      validation={{
        name: { minLength: 2, maxLength: 50 },
        email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        subject: { minLength: 5, maxLength: 100 },
        message: { minLength: 10, maxLength: 1000 },
      }}
    /&gt;
  )
}
    </implementation>
  </contact-form>
</page-components>

<cms-integration>
  <content-types>
    <collection name="tours">
      <schema path="src/collections/tours.ts">
import { CollectionConfig } from 'payload/types'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'eventName',
    defaultSort: 'date',
  },
  fields: [
    {
      name: 'eventName',
      type: 'text',
      required: true,
      label: 'Event Name',
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      label: 'Venue',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      label: 'City',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Event Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
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
        },
        {
          name: 'max',
          type: 'number',
          label: 'Maximum Price',
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'GBP', value: 'GBP' },
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Event',
    },
  ],
}
      </schema>
      
      <usage path="src/hooks/useTours.ts">
import { usePayloadData } from '@lean-cms/framework/hooks'
import { TourEvent } from '@lean-cms/framework/types'

export function useTours(options: {
  limit?: number
  featured?: boolean
  upcoming?: boolean
} = {}) {
  const { limit = 10, featured, upcoming } = options
  
  const query = {
    limit,
    where: {
      ...(featured && { featured: { equals: true } }),
      ...(upcoming && { 
        date: { 
          greater_than: new Date().toISOString() 
        } 
      }),
    },
    sort: 'date',
  }
  
  const { data, loading, error, refetch } = usePayloadData&lt;TourEvent[]&gt;('tours', query)
  
  return {
    tours: data || [],
    loading,
    error,
    refetch,
  }
}
      </usage>
    </collection>
    
    <collection name="gallery">
      <schema path="src/collections/gallery.ts">
import { CollectionConfig } from 'payload/types'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'alt',
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        crop: 'center',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1200,
        height: 800,
        crop: 'center',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
    },
    {
      name: 'category',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Live Performance', value: 'live' },
        { label: 'Studio', value: 'studio' },
        { label: 'Acoustic', value: 'acoustic' },
        { label: 'Music Video', value: 'video' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Crowd', value: 'crowd' },
        { label: 'Behind the Scenes', value: 'bts' },
        { label: 'Press', value: 'press' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Item',
    },
  ],
}
      </schema>
    </collection>
  </content-types>
  
  <api-integration>
    <data-fetching path="src/lib/api/gallery.ts">
import { apiClient } from '@lean-cms/framework/api'
import { GalleryItem } from '@lean-cms/framework/types'

export const galleryApi = {
  // Get all gallery items with filtering
  async getItems(filters: {
    category?: string[]
    featured?: boolean
    limit?: number
    page?: number
  } = {}): Promise&lt;{ items: GalleryItem[]; total: number }&gt; {
    const response = await apiClient.get&lt;{ items: GalleryItem[]; total: number }&gt;(
      '/api/gallery',
      { params: filters }
    )
    return response.data
  },
  
  // Get single gallery item
  async getItem(id: string): Promise&lt;GalleryItem&gt; {
    const response = await apiClient.get&lt;GalleryItem&gt;(`/api/gallery/${id}`)
    return response.data
  },
  
  // Create new gallery item (admin)
  async createItem(itemData: Omit&lt;GalleryItem, 'id'&gt;): Promise&lt;GalleryItem&gt; {
    const response = await apiClient.post&lt;GalleryItem&gt;('/api/gallery', itemData)
    return response.data
  },
  
  // Update gallery item (admin)
  async updateItem(id: string, updates: Partial&lt;GalleryItem&gt;): Promise&lt;GalleryItem&gt; {
    const response = await apiClient.put&lt;GalleryItem&gt;(`/api/gallery/${id}`, updates)
    return response.data
  },
  
  // Delete gallery item (admin)
  async deleteItem(id: string): Promise&lt;void&gt; {
    await apiClient.delete(`/api/gallery/${id}`)
  },
}
    </data-fetching>
    
    <react-hooks path="src/hooks/useGallery.ts">
import { useState, useEffect } from 'react'
import { galleryApi } from '../lib/api/gallery'
import { GalleryItem } from '@lean-cms/framework/types'

export function useGalleryItems(filters: {
  category?: string[]
  featured?: boolean
  limit?: number
} = {}) {
  const [items, setItems] = useState&lt;GalleryItem[]&gt;([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState&lt;string | null&gt;(null)
  const [total, setTotal] = useState(0)
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await galleryApi.getItems(filters)
        setItems(response.items)
        setTotal(response.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gallery items')
      } finally {
        setLoading(false)
      }
    }
    
    fetchItems()
  }, [JSON.stringify(filters)])
  
  const categories = [...new Set(
    items.flatMap(item => item.category)
  )]
  
  return {
    items,
    loading,
    error,
    total,
    categories,
    refetch: () => {
      // Trigger re-fetch
      setLoading(true)
      // Re-run effect
    },
  }
}

export function useGalleryItem(id: string) {
  const [item, setItem] = useState&lt;GalleryItem | null&gt;(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState&lt;string | null&gt;(null)
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedItem = await galleryApi.getItem(id)
        setItem(fetchedItem)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gallery item')
      } finally {
        setLoading(false)
      }
    }
    
    fetchItem()
  }, [id])
  
  return { item, loading, error }
}
    </react-hooks>
  </api-integration>
</cms-integration>
</component-integration>

<deployment-configuration>
<platform-setup>
  <vercel-deployment>
    <configuration path="vercel.json">
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "PAYLOAD_SECRET": "@payload_secret",
    "SENDGRID_API_KEY": "@sendgrid_api_key"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
    </configuration>
    
    <deployment-script path="scripts/deploy-vercel.sh">
#!/bin/bash

echo "🚀 Deploying LEAN CMS site to Vercel..."

# Environment check
if [ "$NODE_ENV" != "production" ]; then
  echo "❌ NODE_ENV must be set to 'production'"
  exit 1
fi

# Build optimization
echo "📦 Optimizing build..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Post-deployment checks
echo "✅ Deployment complete!"
echo "🔍 Running post-deployment checks..."

# Health check
curl -f https://yourdomain.com/api/health || {
  echo "❌ Health check failed"
  exit 1
}

echo "✅ All checks passed! Site deployed successfully."
    </deployment-script>
  </vercel-deployment>
  
  <netlify-deployment>
    <configuration path="netlify.toml">
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"

[functions]
  directory = ".netlify/functions"
  node_bundler = "esbuild"
    </configuration>
  </netlify-deployment>
</platform-setup>

<database-setup>
  <postgresql-production>
    <providers>
      <provider name="Supabase">
        <setup-steps>
          <step>Create new Supabase project</step>
          <step>Copy database connection string</step>
          <step>Set DATABASE_URL environment variable</step>
          <step>Run `npm run db:migrate` to create tables</step>
        </setup-steps>
        <connection-string>postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres</connection-string>
      </provider>
      
      <provider name="PlanetScale">
        <setup-steps>
          <step>Create PlanetScale database</step>
          <step>Create production and development branches</step>
          <step>Configure connection strings</step>
          <step>Enable SSL mode</step>
        </setup-steps>
        <connection-string>mysql://username:password@host.planetscale.com/database?ssl={"rejectUnauthorized":true}</connection-string>
      </provider>
      
      <provider name="Railway">
        <setup-steps>
          <step>Deploy PostgreSQL service on Railway</step>
          <step>Connect to project via environment variables</step>
          <step>Configure automatic backups</step>
          <step>Set up monitoring</step>
        </setup-steps>
      </provider>
    </providers>
  </postgresql-production>
  
  <migration-commands>
    <command name="db:setup">
      <description>Initialize database with schema and seed data</description>
      <usage>npm run db:setup</usage>
    </command>
    
    <command name="db:migrate">
      <description>Run pending database migrations</description>
      <usage>npm run db:migrate</usage>
    </command>
    
    <command name="db:seed">
      <description>Populate database with sample content</description>
      <usage>npm run db:seed</usage>
    </command>
    
    <command name="db:reset">
      <description>Reset database (destructive operation)</description>
      <usage>npm run db:reset</usage>
    </command>
  </migration-commands>
</database-setup>
</deployment-configuration>

<troubleshooting-guide>
<common-issues>
  <issue name="Build failures">
    <symptoms>
      <symptom>TypeScript compilation errors</symptom>
      <symptom>Missing dependencies during build</symptom>
      <symptom>Environment variable undefined</symptom>
    </symptoms>
    <solutions>
      <solution>Run `npm run type-check` to identify TypeScript issues</solution>
      <solution>Verify all dependencies in package.json</solution>
      <solution>Check environment variables are set correctly</solution>
      <solution>Clear .next directory and rebuild</solution>
    </solutions>
  </issue>
  
  <issue name="CMS connection issues">
    <symptoms>
      <symptom>Cannot access /admin route</symptom>
      <symptom>Database connection errors</symptom>
      <symptom>Authentication failures</symptom>
    </symptoms>
    <solutions>
      <solution>Verify DATABASE_URL is correct and accessible</solution>
      <solution>Check PAYLOAD_SECRET is set and consistent</solution>
      <solution>Ensure database tables exist (run migrations)</solution>
      <solution>Verify admin user credentials</solution>
    </solutions>
  </issue>
  
  <issue name="API endpoint errors">
    <symptoms>
      <symptom>404 errors on API routes</symptom>
      <symptom>CORS issues</symptom>
      <symptom>Validation failures</symptom>
    </symptoms>
    <solutions>
      <solution>Check API route file structure matches Next.js conventions</solution>
      <solution>Verify CORS configuration in next.config.js</solution>
      <solution>Test API endpoints with proper request format</solution>
      <solution>Check request validation schemas</solution>
    </solutions>
  </issue>
  
  <issue name="Theme and styling problems">
    <symptoms>
      <symptom>CSS not loading correctly</symptom>
      <symptom>Theme variables not applying</symptom>
      <symptom>Responsive design breaking</symptom>
    </symptoms>
    <solutions>
      <solution>Verify Tailwind CSS configuration is correct</solution>
      <solution>Check CSS custom properties are defined</solution>
      <solution>Clear browser cache and hard refresh</solution>
      <solution>Validate theme configuration structure</solution>
    </solutions>
  </issue>
</common-issues>

<debugging-tools>
  <development-debugging>
    <tool name="Next.js Debug Mode">
      <command>DEBUG=* npm run dev</command>
      <description>Enable verbose logging for all Next.js operations</description>
    </tool>
    
    <tool name="Payload CMS Debug">
      <command>PAYLOAD_DEBUG=true npm run dev</command>
      <description>Enable detailed CMS operation logging</description>
    </tool>
    
    <tool name="Database Query Logging">
      <environment-var>DATABASE_LOGGING=true</environment-var>
      <description>Log all database queries for debugging</description>
    </tool>
  </development-debugging>
  
  <production-debugging>
    <tool name="Error Boundaries">
      <implementation>React Error Boundaries capture and log component errors</implementation>
      <location>src/components/ErrorBoundary.tsx</location>
    </tool>
    
    <tool name="API Monitoring">
      <integration>Sentry or similar service for error tracking</integration>
      <metrics>Response times, error rates, user sessions</metrics>
    </tool>
    
    <tool name="Performance Monitoring">
      <lighthouse>Regular Lighthouse audits</lighthouse>
      <web-vitals>Real user monitoring with Web Vitals</web-vitals>
    </tool>
  </production-debugging>
</debugging-tools>

<performance-optimization>
  <diagnostics>
    <command name="Bundle Analysis">
      <usage>npm run analyze</usage>
      <description>Analyze bundle size and identify optimization opportunities</description>
    </command>
    
    <command name="Lighthouse Audit">
      <usage>npm run lighthouse</usage>
      <description>Run comprehensive performance, accessibility, and SEO audit</description>
    </command>
    
    <command name="Performance Test">
      <usage>npm run perf-test</usage>
      <description>Run automated performance regression tests</description>
    </command>
  </diagnostics>
  
  <optimization-strategies>
    <strategy name="Code Splitting">
      <implementation>Dynamic imports for heavy components</implementation>
      <impact>Reduce initial bundle size by 30-50%</impact>
    </strategy>
    
    <strategy name="Image Optimization">
      <implementation>Next.js Image component with WebP/AVIF formats</implementation>
      <impact>Reduce image payload by 50-70%</impact>
    </strategy>
    
    <strategy name="Database Optimization">
      <implementation>Connection pooling, query optimization, caching</implementation>
      <impact>Improve API response times by 40-60%</impact>
    </strategy>
    
    <strategy name="CDN Integration">
      <implementation>Static asset delivery via global CDN</implementation>
      <impact>Reduce loading times globally</impact>
    </strategy>
  </optimization-strategies>
</performance-optimization>
</troubleshooting-guide>