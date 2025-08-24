<metadata>
purpose: Standardized project setup for rapid music artist website development
type: template-guide
scope: project-scaffolding
technology-stack: ["Next.js 15", "React 19", "Tailwind CSS", "shadcn/ui", "TypeScript"]
last-updated: 2025-01-23
</metadata>

<overview>
This project template provides a standardized foundation for rapidly developing music artist websites. It includes pre-configured tools, common components, and established patterns that enable consistent delivery while maintaining flexibility for client customization.
</overview>

<project-structure>
<directory-tree>
/project-root/
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── videos/                 # Video assets
│   ├── favicon.ico            # Site favicon
│   └── robots.txt             # SEO robots file
├── src/                       # Source code
│   ├── app/                   # Next.js app router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Homepage
│   │   ├── about/             # About page
│   │   ├── music/             # Music/discography
│   │   ├── shows/             # Tour dates
│   │   └── contact/           # Contact page
│   ├── components/            # Reusable components
│   │   ├── ui/                # Base UI components (shadcn/ui)
│   │   ├── artist/            # Artist-specific components
│   │   ├── layout/            # Layout components
│   │   └── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── lib/                   # Utility functions
│   │   ├── utils.ts           # General utilities
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── constants.ts       # Application constants
│   └── styles/                # Additional styles
├── docs/                      # Project documentation
│   ├── SETUP.md               # Setup instructions
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── CUSTOMIZATION.md       # Customization guide
├── tests/                     # Testing files
│   ├── __mocks__/             # Mock files
│   ├── components/            # Component tests
│   └── utils/                 # Utility tests
├── .env.local.example         # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project README
</directory-tree>
</project-structure>

<required-dependencies>
<core-dependencies>
  <dependency name="next" version="^15.0.0">
    <purpose>React framework with app router and server-side rendering</purpose>
    <configuration>App router enabled, TypeScript support, optimized builds</configuration>
  </dependency>
  
  <dependency name="react" version="^19.0.0">
    <purpose>UI library with latest concurrent features</purpose>
    <features>Server components, suspense, concurrent rendering</features>
  </dependency>
  
  <dependency name="typescript" version="^5.0.0">
    <purpose>Type safety and enhanced developer experience</purpose>
    <configuration>Strict mode enabled, path mapping configured</configuration>
  </dependency>
  
  <dependency name="tailwindcss" version="^3.4.0">
    <purpose>Utility-first CSS framework for rapid styling</purpose>
    <configuration>Custom design tokens, responsive breakpoints</configuration>
  </dependency>
</core-dependencies>

<ui-dependencies>
  <dependency name="@radix-ui/react-*" version="^1.0.0">
    <purpose>Accessible UI primitives for complex components</purpose>
    <components>Dialog, Dropdown, Tooltip, Accordion, Tabs</components>
  </dependency>
  
  <dependency name="lucide-react" version="^0.540.0">
    <purpose>Consistent icon library with React components</purpose>
    <usage>Navigation icons, social media icons, decorative elements</usage>
  </dependency>
  
  <dependency name="framer-motion" version="^12.0.0">
    <purpose>Production-ready animation library</purpose>
    <features>Page transitions, component animations, scroll-based effects</features>
  </dependency>
  
  <dependency name="class-variance-authority" version="^0.7.0">
    <purpose>Type-safe component variants and styling</purpose>
    <usage>Button variants, text styles, component theming</usage>
  </dependency>
</ui-dependencies>

<development-dependencies>
  <dependency name="eslint" version="^8.0.0">
    <purpose>Code linting and quality enforcement</purpose>
    <configuration>Next.js rules, TypeScript rules, accessibility rules</configuration>
  </dependency>
  
  <dependency name="prettier" version="^3.0.0">
    <purpose>Code formatting and style consistency</purpose>
    <configuration>Tailwind CSS plugin, import sorting</configuration>
  </dependency>
  
  <dependency name="jest" version="^29.0.0">
    <purpose>Unit testing framework</purpose>
    <setup>React Testing Library integration, TypeScript support</setup>
  </dependency>
  
  <dependency name="playwright" version="^1.40.0">
    <purpose>End-to-end testing and browser automation</purpose>
    <configuration>Cross-browser testing, visual regression tests</configuration>
  </dependency>
</development-dependencies>
</required-dependencies>

<configuration-files>
<file name="next.config.js">
  <purpose>Next.js framework configuration</purpose>
  <settings>
    <setting name="experimental.serverActions">Enable server actions for form handling</setting>
    <setting name="images.domains">Configure allowed image domains</setting>
    <setting name="compiler.removeConsole">Remove console logs in production</setting>
    <setting name="output">Static export configuration for hosting</setting>
  </settings>
  <template>
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Uncomment for static export
  // output: 'export',
  // trailingSlash: true,
  // distDir: 'dist'
}

module.exports = nextConfig
  </template>
</file>

<file name="tailwind.config.js">
  <purpose>Tailwind CSS framework configuration</purpose>
  <customizations>
    <customization>Brand colors and design tokens</customization>
    <customization>Typography scale and font families</customization>
    <customization>Custom component variants</customization>
    <customization>Animation and transition presets</customization>
  </customizations>
  <template>
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Artist brand colors
        artist: {
          50: '#faf7ff',
          100: '#f3edff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
  </template>
</file>

<file name="tsconfig.json">
  <purpose>TypeScript compiler configuration</purpose>
  <features>
    <feature>Strict type checking enabled</feature>
    <feature>Path mapping for clean imports</feature>
    <feature>Next.js optimizations</feature>
    <feature>ESNext target for modern features</feature>
  </features>
  <template>
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
  </template>
</file>

<file name=".env.local.example">
  <purpose>Environment variables template</purpose>
  <variables>
    <variable name="NEXT_PUBLIC_SITE_URL">Public site URL for metadata</variable>
    <variable name="NEXT_PUBLIC_GA_ID">Google Analytics tracking ID</variable>
    <variable name="CONTACT_EMAIL_TO">Email address for contact form submissions</variable>
    <variable name="SMTP_HOST">SMTP server for email sending</variable>
    <variable name="SPOTIFY_CLIENT_ID">Spotify API integration (optional)</variable>
  </variables>
  <template>
# Public environment variables (exposed to browser)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Private environment variables (server-side only)
CONTACT_EMAIL_TO=contact@artistname.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional integrations
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
  </template>
</file>
</configuration-files>

<standard-components>
<component name="Layout Components" category="structure">
  <component-list>
    <component name="Header">
      <purpose>Site navigation and branding</purpose>
      <features>Responsive menu, logo, social links, dark mode toggle</features>
      <props>logo, navItems, socialLinks, theme</props>
    </component>
    
    <component name="Footer">
      <purpose>Site footer with links and copyright</purpose>
      <features>Multi-column layout, newsletter signup, social media</features>
      <props>links, socialMedia, copyrightText, newsletter</props>
    </component>
    
    <component name="PageLayout">
      <purpose>Consistent page structure and SEO metadata</purpose>
      <features>SEO optimization, structured data, analytics</features>
      <props>title, description, keywords, children</props>
    </component>
  </component-list>
</component>

<component name="Artist Components" category="content">
  <component-list>
    <component name="HeroSection">
      <purpose>Above-the-fold artist introduction</purpose>
      <features>Multiple backgrounds, animations, CTA buttons</features>
      <props>artistName, tagline, backgroundType, ctaText, ctaLink</props>
    </component>
    
    <component name="Biography">
      <purpose>Artist story and background information</purpose>
      <features>Rich text content, image integration, social proof</features>
      <props>title, content, image, highlights</props>
    </component>
    
    <component name="Discography">
      <purpose>Music releases and streaming links</purpose>
      <features>Album artwork, track listings, platform integration</features>
      <props>releases, streamingLinks, featuredRelease</props>
    </component>
    
    <component name="TourDates">
      <purpose>Upcoming shows and ticket information</purpose>
      <features>Event listings, ticket links, sold-out indicators</features>
      <props>events, ticketProvider, pastEventsToggle</props>
    </component>
  </component-list>
</component>

<component name="Interactive Components" category="engagement">
  <component-list>
    <component name="ContactForm">
      <purpose>Fan contact and booking inquiries</purpose>
      <features>Form validation, email sending, spam protection</features>
      <props>formFields, emailEndpoint, successMessage</props>
    </component>
    
    <component name="NewsletterSignup">
      <purpose>Email list subscription</purpose>
      <features>Email validation, provider integration, confirmation</features>
      <props>provider, listId, confirmationMessage</props>
    </component>
    
    <component name="SocialMedia">
      <purpose>Social media integration and feeds</purpose>
      <features>Platform icons, feed embedding, follower counts</features>
      <props>platforms, feedType, displayCount</props>
    </component>
    
    <component name="MusicPlayer">
      <purpose>Embedded music playback (optional)</purpose>
      <features>Track preview, playlist support, platform integration</features>
      <props>tracks, autoplay, provider</props>
    </component>
  </component-list>
</component>
</standard-components>

<development-workflow>
<setup-process duration="30-minutes">
  <step number="1" name="project-initialization">
    <command>npx create-next-app@latest artist-website --typescript --tailwind --eslint --app</command>
    <action>Initialize Next.js project with TypeScript and Tailwind</action>
  </step>
  
  <step number="2" name="dependency-installation">
    <command>npm install @radix-ui/react-dialog @radix-ui/react-slot framer-motion lucide-react class-variance-authority</command>
    <action>Install UI and animation dependencies</action>
  </step>
  
  <step number="3" name="shadcn-ui-setup">
    <command>npx shadcn-ui@latest init</command>
    <action>Initialize shadcn/ui component library</action>
    <follow-up>npx shadcn-ui@latest add button card input textarea</follow-up>
  </step>
  
  <step number="4" name="directory-structure">
    <action>Create standard directory structure</action>
    <commands>
      <command>mkdir -p src/components/{ui,artist,layout}</command>
      <command>mkdir -p src/lib</command>
      <command>mkdir -p docs tests</command>
    </commands>
  </step>
  
  <step number="5" name="configuration-files">
    <action>Copy configuration files from template</action>
    <files>next.config.js, tailwind.config.js, .env.local.example</files>
  </step>
  
  <step number="6" name="core-components">
    <action>Install core artist website components</action>
    <components>HeroSection, Biography, ContactForm, Layout components</components>
  </step>
</setup-process>

<customization-process duration="2-4-hours">
  <step number="1" name="brand-configuration">
    <action>Update brand colors, fonts, and design tokens</action>
    <files>tailwind.config.js, globals.css, brand constants</files>
  </step>
  
  <step number="2" name="content-integration">
    <action>Replace placeholder content with artist information</action>
    <areas>Bio text, tour dates, social media links, contact info</areas>
  </step>
  
  <step number="3" name="asset-optimization">
    <action>Add and optimize artist images, videos, and media</action>
    <requirements>WebP/AVIF formats, responsive images, lazy loading</requirements>
  </step>
  
  <step number="4" name="seo-configuration">
    <action>Configure SEO metadata and structured data</action>
    <elements>Title tags, meta descriptions, Open Graph, JSON-LD</elements>
  </step>
  
  <step number="5" name="integration-setup">
    <action>Configure third-party integrations</action>
    <services>Analytics, email providers, streaming platforms, social media</services>
  </step>
</customization-process>

<testing-workflow>
  <unit-testing>
    <command>npm run test</command>
    <coverage>Components, utilities, business logic</coverage>
    <requirements>≥90% test coverage for critical components</requirements>
  </unit-testing>
  
  <integration-testing>
    <command>npm run test:e2e</command>
    <scope>User workflows, form submissions, navigation</scope>
    <browsers>Chrome, Firefox, Safari (via Playwright)</browsers>
  </integration-testing>
  
  <performance-testing>
    <tools>Lighthouse CI, Core Web Vitals monitoring</tools>
    <benchmarks>
      <benchmark>Performance score ≥90</benchmark>
      <benchmark>Accessibility score ≥95</benchmark>
      <benchmark>Best practices score ≥90</benchmark>
      <benchmark>SEO score ≥95</benchmark>
    </benchmarks>
  </performance-testing>
</testing-workflow>
</development-workflow>

<deployment-configuration>
<static-hosting platforms="vercel,netlify,github-pages">
  <vercel>
    <setup>Connect GitHub repository, auto-deploy on push</setup>
    <features>Preview deployments, environment variables, analytics</features>
    <configuration>vercel.json for redirects and headers</configuration>
  </vercel>
  
  <netlify>
    <setup>GitHub integration, build command configuration</setup>
    <features>Form handling, edge functions, split testing</features>
    <configuration>netlify.toml for build settings and redirects</configuration>
  </netlify>
  
  <github-pages>
    <setup>GitHub Actions workflow for static export</setup>
    <limitations>Static export only, no server-side features</limitations>
    <configuration>Static export in next.config.js</configuration>
  </github-pages>
</static-hosting>

<custom-domain>
  <dns-configuration>
    <record type="A">Point apex domain to hosting provider</record>
    <record type="CNAME">Point www subdomain to hosting provider</record>
    <record type="TXT">Domain verification and security headers</record>
  </dns-configuration>
  
  <ssl-setup>
    <provider>Let's Encrypt automatic SSL via hosting platform</provider>
    <configuration>HTTPS redirect and HSTS headers</configuration>
  </ssl-setup>
</custom-domain>

<performance-optimization>
  <image-optimization>
    <formats>WebP, AVIF with JPEG fallback</formats>
    <sizing>Responsive images with srcset</sizing>
    <loading>Lazy loading for below-the-fold images</loading>
  </image-optimization>
  
  <code-splitting>
    <strategy>Route-based splitting with Next.js app router</strategy>
    <dynamic-imports>Heavy components loaded on demand</dynamic-imports>
  </code-splitting>
  
  <caching-strategy>
    <static-assets>Long-term caching with versioned filenames</static-assets>
    <api-responses>Appropriate cache headers for dynamic content</api-responses>
  </caching-strategy>
</performance-optimization>
</deployment-configuration>

<maintenance-checklist>
<monthly-tasks>
  <task>Update dependencies and security patches</task>
  <task>Review analytics and performance metrics</task>
  <task>Test contact forms and email delivery</task>
  <task>Validate external links and integrations</task>
  <task>Backup site data and configurations</task>
</monthly-tasks>

<quarterly-tasks>
  <task>Comprehensive security audit and updates</task>
  <task>Performance optimization review</task>
  <task>Content strategy review and updates</task>
  <task>SEO analysis and improvements</task>
  <task>User experience testing and improvements</task>
</quarterly-tasks>

<annual-tasks>
  <task>Major framework and dependency updates</task>
  <task>Design refresh and modernization</task>
  <task>Feature roadmap planning</task>
  <task>Hosting and domain renewals</task>
  <task>Comprehensive backup and disaster recovery testing</task>
</annual-tasks>
</maintenance-checklist>