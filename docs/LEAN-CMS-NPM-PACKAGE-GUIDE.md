<metadata>
purpose: NPM package structure and deployment guide for LEAN CMS Framework
type: npm-package-documentation
language: TypeScript
framework: Next.js 14 + Payload CMS 3.x
dependencies: React 18, Tailwind CSS, GSAP, Framer Motion
last-updated: 2025-08-24
target-audience: developers
deployment-method: npm-package-distribution
</metadata>

<overview>
Complete guide for transforming the LEAN CMS Framework into a distributable npm package for rapid music artist and business website deployment. Provides package architecture, installation procedures, configuration templates, and dependency management for seamless framework distribution.
</overview>

<package-architecture>
<directory-structure>
  <root-level>
    <file name="package.json">Package metadata and dependencies</file>
    <file name="README.md">Quick start and usage guide</file>
    <file name="LICENSE">MIT or Apache 2.0 license</file>
    <file name="CHANGELOG.md">Version history and updates</file>
    <directory name="dist/">Compiled JavaScript output</directory>
    <directory name="src/">TypeScript source code</directory>
    <directory name="templates/">Website templates and starters</directory>
    <directory name="docs/">Comprehensive documentation</directory>
    <directory name="examples/">Example implementations</directory>
  </root-level>
  
  <source-structure path="src/">
    <directory name="core/">Core framework functionality</directory>
    <directory name="components/">Reusable React components</directory>
    <directory name="api/">API framework and utilities</directory>
    <directory name="cms/">Payload CMS integration</directory>
    <directory name="themes/">Predefined themes and styling</directory>
    <directory name="utils/">Utility functions and helpers</directory>
    <directory name="hooks/">React hooks for common patterns</directory>
    <directory name="types/">TypeScript type definitions</directory>
  </source-structure>
  
  <template-structure path="templates/">
    <directory name="artist-website/">Complete artist website template</directory>
    <directory name="business-website/">Business website template</directory>
    <directory name="portfolio-website/">Portfolio website template</directory>
    <directory name="minimal-starter/">Basic starter template</directory>
  </template-structure>
</directory-structure>

<package-configuration>
  <file name="package.json">
    <field name="name">@lean-cms/framework</field>
    <field name="version">1.0.0</field>
    <field name="description">Rapid deployment framework for music artist and business websites</field>
    <field name="main">dist/index.js</field>
    <field name="types">dist/index.d.ts</field>
    <field name="bin">{ "lean-cms": "bin/cli.js" }</field>
    <field name="files">["dist/", "templates/", "bin/", "README.md", "LICENSE"]</field>
    <field name="engines">{ "node": ">=18.0.0", "npm": ">=8.0.0" }</field>
  </file>
  
  <build-configuration>
    <bundler name="tsup" purpose="Fast TypeScript bundler">
      <entry-points>src/index.ts, src/cli.ts</entry-points>
      <output-formats>ESM, CommonJS</output-formats>
      <declaration-files>true</declaration-files>
      <minification>true</minification>
    </bundler>
    
    <typescript-config>
      <target>ES2022</target>
      <module>ESNext</module>
      <module-resolution>node</module-resolution>
      <strict>true</strict>
      <declaration>true</declaration>
    </typescript-config>
  </build-configuration>
</package-configuration>
</package-architecture>

<dependencies>
<peer-dependencies required="true">
  <dependency name="react" version="^18.0.0">React library for UI components</dependency>
  <dependency name="react-dom" version="^18.0.0">React DOM renderer</dependency>
  <dependency name="next" version="^14.0.0">Next.js framework</dependency>
  <dependency name="typescript" version="^5.0.0">TypeScript compiler</dependency>
</peer-dependencies>

<core-dependencies>
  <dependency name="@payloadcms/next" version="^3.53.0">Payload CMS Next.js integration</dependency>
  <dependency name="@payloadcms/db-postgres" version="^3.53.0">PostgreSQL database adapter</dependency>
  <dependency name="@payloadcms/richtext-slate" version="^3.53.0">Rich text editor</dependency>
  <dependency name="tailwindcss" version="^3.4.0">Utility-first CSS framework</dependency>
  <dependency name="framer-motion" version="^12.0.0">Animation library</dependency>
  <dependency name="gsap" version="^3.13.0">Professional animation library</dependency>
  <dependency name="zod" version="^4.1.0">TypeScript-first schema validation</dependency>
</core-dependencies>

<ui-dependencies>
  <dependency name="@radix-ui/react-dialog" version="^1.1.0">Accessible dialog components</dependency>
  <dependency name="@radix-ui/react-tabs" version="^1.1.0">Tab navigation components</dependency>
  <dependency name="@radix-ui/react-slot" version="^1.2.0">Slot component for composition</dependency>
  <dependency name="lucide-react" version="^0.540.0">Icon library</dependency>
  <dependency name="class-variance-authority" version="^0.7.0">Component variant management</dependency>
  <dependency name="clsx" version="^2.1.0">Conditional className utility</dependency>
  <dependency name="tailwind-merge" version="^3.3.0">Tailwind class merging</dependency>
</ui-dependencies>

<development-dependencies>
  <dependency name="@types/node" version="^20.0.0">Node.js type definitions</dependency>
  <dependency name="@types/react" version="^18.3.0">React type definitions</dependency>
  <dependency name="tsup" version="^8.0.0">TypeScript bundler</dependency>
  <dependency name="changesets" version="^2.27.0">Version and changelog management</dependency>
  <dependency name="eslint" version="^8.57.0">Code linting</dependency>
  <dependency name="prettier" version="^3.0.0">Code formatting</dependency>
</development-dependencies>
</dependencies>

<installation-procedures>
<global-installation>
  <command purpose="Install CLI globally">npm install -g @lean-cms/framework</command>
  <command purpose="Verify installation">lean-cms --version</command>
  <command purpose="View available commands">lean-cms --help</command>
</global-installation>

<project-creation>
  <step-by-step>
    <step number="1">
      <command>lean-cms create my-artist-website --template=artist</command>
      <description>Create new project from artist template</description>
    </step>
    <step number="2">
      <command>cd my-artist-website</command>
      <description>Navigate to project directory</description>
    </step>
    <step number="3">
      <command>npm install</command>
      <description>Install project dependencies</description>
    </step>
    <step number="4">
      <command>cp .env.example .env.local</command>
      <description>Copy environment configuration</description>
    </step>
    <step number="5">
      <command>npm run setup</command>
      <description>Initialize database and CMS</description>
    </step>
    <step number="6">
      <command>npm run dev</command>
      <description>Start development server</description>
    </step>
  </step-by-step>
  
  <template-options>
    <template name="artist" description="Music artist website with tours, gallery, contact">
      <sections>hero, about, discography, tours, gallery, contact</sections>
      <features>booking-form, newsletter, social-links, tour-calendar</features>
    </template>
    
    <template name="business" description="Business website with services and portfolio">
      <sections>hero, services, portfolio, team, testimonials, contact</sections>
      <features>service-booking, lead-forms, case-studies, team-profiles</features>
    </template>
    
    <template name="portfolio" description="Personal portfolio with work showcase">
      <sections>hero, work, about, experience, blog, contact</sections>
      <features>project-gallery, blog, resume, contact-form</features>
    </template>
    
    <template name="minimal" description="Clean starter template">
      <sections>hero, about, contact</sections>
      <features>basic-cms, contact-form</features>
    </template>
  </template-options>
</project-creation>

<manual-installation>
  <existing-project>
    <step number="1">
      <command>npm install @lean-cms/framework</command>
      <description>Add framework to existing Next.js project</description>
    </step>
    <step number="2">
      <description>Import and configure framework in next.config.js</description>
      <code-example>
const { withLeanCMS } = require('@lean-cms/framework')

module.exports = withLeanCMS({
  // Your existing Next.js config
})
      </code-example>
    </step>
    <step number="3">
      <description>Initialize CMS configuration</description>
      <code-example>
// payload.config.ts
import { buildConfig } from '@lean-cms/framework/cms'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
  },
  collections: [
    // Auto-configured collections
  ],
})
      </code-example>
    </step>
  </existing-project>
</manual-installation>
</installation-procedures>

<configuration-templates>
<environment-variables>
  <development-env>
    <variable name="DATABASE_URL">postgresql://user:pass@localhost:5432/leandb</variable>
    <variable name="PAYLOAD_SECRET">your-payload-secret-key-here</variable>
    <variable name="NEXT_PUBLIC_SITE_URL">http://localhost:3000</variable>
    <variable name="PAYLOAD_PUBLIC_SERVER_URL">http://localhost:3000</variable>
    <variable name="SENDGRID_API_KEY">optional-email-service-key</variable>
    <variable name="ANALYTICS_ID">optional-analytics-tracking-id</variable>
  </development-env>
  
  <production-env>
    <variable name="DATABASE_URL">postgresql://prod:secure@db.provider.com:5432/prod</variable>
    <variable name="PAYLOAD_SECRET">strong-production-secret-key</variable>
    <variable name="NEXT_PUBLIC_SITE_URL">https://yourdomain.com</variable>
    <variable name="PAYLOAD_PUBLIC_SERVER_URL">https://yourdomain.com</variable>
    <variable name="SENDGRID_API_KEY">production-email-api-key</variable>
    <variable name="ANALYTICS_ID">production-analytics-id</variable>
  </production-env>
</environment-variables>

<site-configuration>
  <config-file path="lean-cms.config.js">
    <basic-config>
const config = {
  siteName: 'Artist Name',
  theme: 'electronic-neon',
  primaryColor: '#00ffff',
  sections: {
    hero: true,
    tours: true,
    gallery: true,
    contact: true,
  },
  integrations: {
    spotify: 'artist-spotify-id',
    instagram: '@artisthandle',
    analytics: 'GA_MEASUREMENT_ID',
  },
}

module.exports = config
    </basic-config>
  </config-file>
  
  <advanced-config>
const config = {
  siteName: 'Advanced Artist Site',
  theme: {
    id: 'custom-theme',
    colors: {
      primary: '#ff0080',
      secondary: '#8000ff',
      accent: '#00ff80',
      background: '#000000',
      text: '#ffffff',
    },
    fonts: {
      display: 'Orbitron',
      body: 'Inter',
    },
    animations: {
      enabled: true,
      intensity: 'intense',
      duration: 3,
    },
  },
  cms: {
    collections: [
      'pages',
      'tours',
      'gallery',
      'blog-posts',
      'testimonials',
    ],
    admin: {
      autoLogin: process.env.NODE_ENV === 'development',
    },
  },
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    caching: true,
  },
}

module.exports = config
  </advanced-config>
</site-configuration>
</configuration-templates>

<build-process>
<compilation-steps>
  <step name="TypeScript Compilation">
    <command>tsc --noEmit</command>
    <purpose>Type checking without output</purpose>
  </step>
  
  <step name="Bundle Creation">
    <command>tsup src/index.ts --format cjs,esm --dts</command>
    <purpose>Create CommonJS and ESM bundles with declarations</purpose>
  </step>
  
  <step name="Template Preparation">
    <command>cp -r templates/ dist/templates/</command>
    <purpose>Copy template files to distribution</purpose>
  </step>
  
  <step name="Asset Optimization">
    <command>optimize-assets dist/</command>
    <purpose>Compress and optimize assets</purpose>
  </step>
</compilation-steps>

<publishing-workflow>
  <version-management>
    <command>npm run changeset</command>
    <description>Create changelog entry</description>
  </version-management>
  
  <pre-publish-checks>
    <command>npm run lint</command>
    <command>npm run type-check</command>
    <command>npm run test</command>
    <command>npm run build</command>
  </pre-publish-checks>
  
  <publishing>
    <command>npm publish --access=public</command>
    <description>Publish to npm registry</description>
  </publishing>
</publishing-workflow>
</build-process>

<testing-strategy>
<unit-testing>
  <framework>Jest + React Testing Library</framework>
  <coverage-target>85% minimum</coverage-target>
  <test-categories>
    <category>Component rendering and props</category>
    <category>API utilities and validation</category>
    <category>Theme system and configuration</category>
    <category>CMS integration functions</category>
  </test-categories>
</unit-testing>

<integration-testing>
  <framework>Playwright</framework>
  <test-scenarios>
    <scenario>Template creation and setup</scenario>
    <scenario>CMS admin interface</scenario>
    <scenario>API endpoints functionality</scenario>
    <scenario>Performance benchmarks</scenario>
  </test-scenarios>
</integration-testing>

<template-testing>
  <automated-testing>
    <test>Template generation with all options</test>
    <test>Development server startup</test>
    <test>Build process completion</test>
    <test>Deployment readiness</test>
  </automated-testing>
</template-testing>
</testing-strategy>

<distribution-optimization>
<bundle-analysis>
  <size-limits>
    <limit type="main-bundle">100kb gzipped maximum</limit>
    <limit type="template-files">500kb maximum per template</limit>
    <limit type="documentation">50kb maximum</limit>
  </size-limits>
  
  <tree-shaking>
    <esm-modules>Ensure all modules are tree-shakeable</esm-modules>
    <side-effects>Mark side-effect-free modules</side-effects>
    <dynamic-imports>Use dynamic imports for optional features</dynamic-imports>
  </tree-shaking>
</bundle-analysis>

<dependency-management>
  <peer-dependencies-strategy>
    <rationale>Avoid version conflicts with user projects</rationale>
    <core-deps>React, Next.js, TypeScript as peer dependencies</core-deps>
    <optional-deps>Email services, analytics as optional</optional-deps>
  </peer-dependencies-strategy>
  
  <version-constraints>
    <loose-constraints>Use caret ranges for compatibility</loose-constraints>
    <security-updates>Regular security audits and updates</security-updates>
    <lts-alignment>Align with Node.js LTS releases</lts-alignment>
  </version-constraints>
</dependency-management>
</distribution-optimization>

<cli-integration>
<command-structure>
  <command name="create">
    <usage>lean-cms create &lt;name&gt; [options]</usage>
    <options>
      <option name="--template">Template type (artist, business, portfolio, minimal)</option>
      <option name="--theme">Theme selection (electronic-neon, minimal-clean, vintage-warm)</option>
      <option name="--git">Initialize git repository</option>
      <option name="--install">Auto-install dependencies</option>
    </options>
  </command>
  
  <command name="update">
    <usage>lean-cms update [options]</usage>
    <options>
      <option name="--check">Check for available updates</option>
      <option name="--preview">Preview update changes</option>
      <option name="--force">Force update ignoring conflicts</option>
    </options>
  </command>
  
  <command name="theme">
    <usage>lean-cms theme &lt;action&gt; [options]</usage>
    <options>
      <option name="--list">List available themes</option>
      <option name="--apply">Apply theme to current project</option>
      <option name="--customize">Launch theme customizer</option>
    </options>
  </command>
  
  <command name="deploy">
    <usage>lean-cms deploy [platform]</usage>
    <options>
      <option name="--platform">Deployment platform (vercel, netlify)</option>
      <option name="--env">Environment configuration</option>
      <option name="--domain">Custom domain setup</option>
    </options>
  </command>
</command-structure>

<cli-implementation>
  <entry-point path="bin/cli.js">
#!/usr/bin/env node
const { LeanCMSCLI } = require('../dist/cli')

const cli = new LeanCMSCLI()
cli.run(process.argv.slice(2))
  </entry-point>
  
  <configuration-file path="src/cli.ts">
export class LeanCMSCLI {
  constructor(private config: CLIConfig = {}) {}
  
  async run(args: string[]): Promise&lt;void&gt; {
    const command = args[0]
    
    switch (command) {
      case 'create':
        return this.createProject(args.slice(1))
      case 'update':
        return this.updateProject(args.slice(1))
      case 'theme':
        return this.manageTheme(args.slice(1))
      case 'deploy':
        return this.deployProject(args.slice(1))
      default:
        return this.showHelp()
    }
  }
  
  private async createProject(args: string[]): Promise&lt;void&gt; {
    // Project creation logic
  }
}
  </configuration-file>
</cli-implementation>
</cli-integration>

<maintenance-guidelines>
<version-management>
  <semantic-versioning>
    <major>Breaking changes, new architecture</major>
    <minor>New features, backward-compatible</minor>
    <patch>Bug fixes, security updates</patch>
  </semantic-versioning>
  
  <release-schedule>
    <major-releases>Every 6-12 months</major-releases>
    <minor-releases>Monthly feature releases</minor-releases>
    <patch-releases>Weekly bug fixes and security updates</patch-releases>
  </release-schedule>
</version-management>

<compatibility-matrix>
  <node-versions>
    <supported>18.x, 20.x, 21.x</supported>
    <recommended>20.x LTS</recommended>
    <deprecation-policy>Support 2 major versions back</deprecation-policy>
  </node-versions>
  
  <react-versions>
    <supported>18.0+</supported>
    <next-js>14.0+, 15.0 preview support</next-js>
  </react-versions>
</compatibility-matrix>

<documentation-maintenance>
  <update-triggers>
    <api-changes>Update within same release</api-changes>
    <feature-additions>Document before minor release</feature-additions>
    <breaking-changes>Migration guides required</breaking-changes>
  </update-triggers>
  
  <documentation-types>
    <api-reference>Auto-generated from TypeScript</api-reference>
    <tutorials>Manually maintained with examples</tutorials>
    <migration-guides>Version-specific upgrade instructions</migration-guides>
  </documentation-types>
</documentation-maintenance>
</maintenance-guidelines>