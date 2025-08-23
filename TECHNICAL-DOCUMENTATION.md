<metadata>
purpose: Comprehensive technical documentation for Aria Nova electronic music artist website
type: web-application
language: TypeScript
framework: Next.js 14.2.32
dependencies: React 18.3.1, shadcn/ui, GSAP 3.13.0, Framer Motion 12.23.12, Tailwind CSS 3.4.17
last-updated: 2025-08-23
</metadata>

<overview>
Professional electronic music artist website for Aria Nova featuring spectacular GSAP animations, responsive design, and booking-focused user experience. Built with Next.js 14, TypeScript, and modern animation libraries for high-performance electronic music branding.
</overview>

<architecture>
<stack>
  <framework name="Next.js" version="14.2.32" stability="LTS">App Router, RSC, SSG optimization</framework>
  <runtime name="React" version="18.3.1" stability="LTS">Concurrent features, Suspense boundaries</runtime>
  <styling name="Tailwind CSS" version="3.4.17">Electronic music design system, custom color palette</styling>
  <ui-library name="shadcn/ui" version="latest">Accessible component system, Radix primitives</ui-library>
  <animations name="GSAP" version="3.13.0">ScrollTrigger, spectacular hero transitions</animations>
  <animations-react name="Framer Motion" version="12.23.12">React-native animations, gesture support</animations-react>
  <icons name="Lucide React" version="0.541.0">Consistent icon system</icons>
</stack>

<file-structure>
/src
├── /app                     # Next.js 14 App Router
│   ├── layout.tsx          # Global layout, font loading
│   ├── page.tsx            # Homepage with hero section
│   ├── demo/page.tsx       # Demo page for development
│   └── admin/page.tsx      # CMS admin interface
├── /components
│   ├── /artist             # Artist-specific components
│   │   ├── hero-section.tsx        # Main hero with Framer Motion
│   │   ├── gallery.tsx             # Masonry gallery (150 lines, 73% reduction)
│   │   ├── contact-social.tsx      # Contact and social links
│   │   └── two-column-layout.tsx   # Responsive layout component
│   ├── /ui                 # shadcn/ui component system
│   │   ├── button.tsx      # Premium button variants
│   │   ├── card.tsx        # Gallery cards, content containers
│   │   ├── dialog.tsx      # Lightbox, modal dialogs
│   │   └── alert.tsx       # Error states, notifications
│   └── ErrorBoundary.tsx   # Global error handling
├── /lib
│   ├── /animations
│   │   └── electronic-music-animations.ts  # Framer Motion configs
│   ├── gsap-animations.ts           # GSAP ScrollTrigger effects (600+ lines)
│   └── utils.ts                     # Utility functions
└── /styles
    └── globals.css         # Global styles, CSS variables
</file-structure>
</architecture>

<development-phases>
<phase number="1" name="Hero Section Optimizations" status="completed" date="2025-08-20">
  <objective>Improve hero section for professional booking appeal</objective>
  <changes>
    <change type="removal">Removed "Listen Now" button - not suitable for booking focus</change>
    <change type="layout">Centered contact CTA as primary action</change>
    <change type="addition">Added social media buttons (Spotify, Instagram, YouTube)</change>
    <change type="addition">Added newsletter subscription with optimized proportions</change>
  </changes>
  <technical-impact>
    <performance>No performance impact</performance>
    <bundle-size>Minimal increase (~2KB)</bundle-size>
    <accessibility>Improved focus management for CTAs</accessibility>
  </technical-impact>
</phase>

<phase number="2" name="Navigation FOUC Fix" status="completed" date="2025-08-21">
  <objective>Eliminate flash of unstyled content during navigation load</objective>
  <problem>Navigation elements appearing with default browser styles before GSAP initialization</problem>
  <solution>
    <approach>gsap.set() initialization for immediate styling</approach>
    <implementation>Set initial opacity, transform values before animation timeline</implementation>
    <timing>Execute before React component mount</timing>
  </solution>
  <code-example>
    <input>gsap.set('.nav-item', { opacity: 0, y: -20 })</input>
    <result>Navigation elements hidden until animation ready</result>
  </code-example>
  <validation>Visual regression testing confirmed smooth load experience</validation>
</phase>

<phase number="3" name="Gallery Complete Rewrite" status="completed" date="2025-08-22">
  <objective>Reduce complexity, improve performance, implement artistic masonry layout</objective>
  <metrics>
    <before>559 lines of code</before>
    <after>150 lines of code</after>
    <reduction>73% code reduction</reduction>
    <performance-gain>Faster rendering, reduced bundle size</performance-gain>
  </metrics>
  <architectural-changes>
    <simplification>Removed over-engineered state management</simplification>
    <optimization>Implemented artistic masonry with CSS Grid</optimization>
    <accessibility>Added proper ARIA labels, keyboard navigation</accessibility>
    <error-handling>Enhanced error boundaries for media loading</error-handling>
  </architectural-changes>
  <layout-implementation>
    <grid-system>CSS Grid with variable row spans</grid-system>
    <responsive>Mobile-first breakpoints (sm, lg, xl, 2xl)</responsive>
    <loading-states>Skeleton loading, error fallbacks</loading-states>
  </layout-implementation>
</phase>

<phase number="4" name="UI Proportions Research" status="completed" date="2025-08-22">
  <objective>Apply 2024/2025 design best practices for modern visual proportions</objective>
  <research-findings>
    <border-radius>rounded-2xl (16px) for modern card aesthetics</border-radius>
    <button-height>h-12 (48px) for optimal touch targets</button-height>
    <spacing>gap-3 (12px) for visual breathing room</spacing>
    <typography>Responsive scale with mobile-first approach</typography>
  </research-findings>
  <implementation>
    <buttons>Updated all button variants to h-12 with rounded-2xl</buttons>
    <cards>Gallery cards use rounded-2xl, proper shadow hierarchy</cards>
    <forms>Input fields consistent h-12, improved visual alignment</forms>
    <spacing>Systematic gap-3 implementation across components</spacing>
  </implementation>
</phase>

<phase number="5" name="Spectacular Hero Animation" status="completed" date="2025-08-23">
  <objective>Create cinematic hero-to-section transition for electronic music branding</objective>
  <animation-effects>
    <effect name="Matrix Rain" duration="2s">Digital columns falling from top</effect>
    <effect name="Lightning Flash" duration="0.1s">Screen flash with shake effect</effect>
    <effect name="Holographic Scan Lines" duration="1.5s">Multi-colored scanning effect</effect>
    <effect name="Energy Orb Explosion" duration="1.5s">Radial energy burst</effect>
    <effect name="Iris Reveal" duration="2.5s">Circular section reveal with filter effects</effect>
    <effect name="Glitch Finale" duration="0.5s">Digital glitch sequence</effect>
  </animation-effects>
  <technical-implementation>
    <approach>GSAP ScrollTrigger with dynamic DOM element creation</approach>
    <performance>Will-change properties, GPU acceleration</performance>
    <cleanup>Automatic DOM element removal after animation</cleanup>
    <accessibility>Respects prefers-reduced-motion user preference</accessibility>
  </technical-implementation>
  <function name="createSpectacularHeroTransition">
    <signature>createSpectacularHeroTransition() -> void</signature>
    <location>/src/lib/gsap-animations.ts</location>
    <triggers>ScrollTrigger on first section entrance</triggers>
    <performance>GPU-accelerated transforms, batched DOM operations</performance>
  </function>
</phase>

<phase number="6" name="Color Contrast Improvements" status="in-progress" date="2025-08-23">
  <objective>Fix harsh white color contrast in GSAP animations causing eye strain</objective>
  <problem>Pure white (#ffffff) colors in animations create visual discomfort</problem>
  <current-palette>
    <primary>#00ffff (Pure cyan neon)</primary>
    <secondary>#00d4ff (Electric blue)</secondary>
    <accent>#8b5cf6 (Purple)</accent>
    <background-void>#060609 (Deep void)</background-void>
    <background-dark>#0a0a0f (Dark space)</background-dark>
    <background-navy>#1a1a2e (Electronic navy)</background-navy>
  </current-palette>
  <solution-strategy>
    <research>shadcn color combinations for softer contrasts</research>
    <target-function>createSpectacularHeroTransition() in /src/lib/gsap-animations.ts</target-function>
    <approach>Replace harsh whites with softer brand-compliant colors</approach>
  </solution-strategy>
</phase>
</development-phases>

<animation-system>
<gsap-configuration>
  <plugins>ScrollTrigger</plugins>
  <registration>Client-side only with window check</registration>
  <performance>GPU acceleration, will-change properties</performance>
  <accessibility>prefers-reduced-motion support</accessibility>
</gsap-configuration>

<framer-motion-configuration>
  <variants>Electronic music themed variants</variants>
  <transitions>Optimized easing curves for electronic feel</transitions>
  <gestures>Hover, tap, focus interactions</gestures>
  <performance>Layout animations disabled for performance</performance>
</framer-motion-configuration>

<animation-functions>
<function name="createHeroAnimations">
  <signature>createHeroAnimations() -> gsap.core.Timeline</signature>
  <purpose>Background entrance animation for hero section</purpose>
  <parameters>None</parameters>
  <returns>GSAP timeline instance for chaining</returns>
  <performance>Targets .hero-background class only</performance>
  <coordination>Works with Framer Motion for text elements</coordination>
</function>

<function name="createSpectacularHeroTransition">
  <signature>createSpectacularHeroTransition() -> void</signature>
  <purpose>Cinematic hero-to-section transition with multiple effects</purpose>
  <scroll-trigger>
    <start>top 100% (first section trigger)</start>
    <end>top 20%</end>
    <scrub>true (performance optimized)</scrub>
  </scroll-trigger>
  <effects>
    <matrix-rain>20 column elements, gradient colors</matrix-rain>
    <lightning-flash>Screen flash with body shake</lightning-flash>
    <holographic-scans>3 scan lines with different colors</holographic-scans>
    <energy-orb>Radial explosion effect</energy-orb>
    <iris-reveal>Circular clip-path animation</iris-reveal>
    <glitch-finale>5-frame glitch sequence</glitch-finale>
  </effects>
  <dom-management>
    <creation>Dynamic element creation for effects</creation>
    <cleanup>Automatic removal after completion</cleanup>
    <z-index>Proper layering (z-40 to z-50)</z-index>
  </dom-management>
</function>

<function name="createAdvancedSectionTransitions">
  <signature>createAdvancedSectionTransitions() -> void</signature>
  <purpose>Section-by-section reveal animations with electronic effects</purpose>
  <features>
    <section-reveals>Clip-path polygon animations</section-reveals>
    <circuit-traces>SVG path animations with gradients</circuit-traces>
    <scan-lines>Smooth scanning effects</scan-lines>
    <particle-fields>Optimized particle animations</particle-fields>
  </features>
  <performance>
    <optimization>8 particles max per section</optimization>
    <will-change>Transform properties marked</will-change>
    <gpu-acceleration>3D transforms for GPU usage</gpu-acceleration>
  </performance>
</function>
</animation-functions>
</animation-system>

<color-system>
<brand-palette>
  <core-backgrounds>
    <void>#060609 (Ultimate dark background)</void>
    <dark>#0a0a0f (Primary background)</dark>
    <navy>#1a1a2e (Secondary background)</navy>
    <charcoal>#2a2a3e (Elevated surfaces)</charcoal>
  </core-backgrounds>
  
  <electric-accents>
    <neon>#00ffff (Pure cyan neon - primary)</neon>
    <electric>#00d4ff (Bright electric blue - secondary)</electric>
    <pulse>#0099cc (Pulse blue - interactions)</pulse>
  </electric-accents>
  
  <energy-gradients>
    <coral>#ff6b6b (Warm coral energy)</coral>
    <purple>#8b5cf6 (Deep purple energy)</purple>
    <magenta>#e91e63 (Electric magenta highlight)</magenta>
  </energy-gradients>
  
  <text-hierarchy>
    <hero>#ffffff (Pure white - artist name)</hero>
    <primary>#e2e8f0 (Light gray - primary content)</primary>
    <secondary>#94a3b8 (Medium gray - supporting)</secondary>
    <muted>#475569 (Muted gray - subtle text)</muted>
    <accent>#00ffff (Neon cyan - CTA text)</accent>
  </text-hierarchy>
</brand-palette>

<accessibility-considerations>
  <contrast-ratios>All text combinations meet WCAG AA standards</contrast-ratios>
  <motion-sensitivity>prefers-reduced-motion media query respected</motion-sensitivity>
  <focus-indicators>Visible focus rings on interactive elements</focus-indicators>
  <color-independence>No information conveyed by color alone</color-independence>
</accessibility-considerations>
</color-system>

<performance-optimization>
<bundle-analysis>
  <first-load-js>87.1 kB (Excellent - under 100 kB target)</first-load-js>
  <build-time>Fast compilation with zero errors</build-time>
  <dependencies>39 essential packages (reduced from 140+)</dependencies>
</bundle-analysis>

<animation-performance>
  <gpu-acceleration>transform3d() usage for GPU layer creation</gpu-acceleration>
  <will-change>Strategic will-change property application</will-change>
  <reduced-motion>Automatic animation disabling for accessibility</reduced-motion>
  <cleanup>Automatic ScrollTrigger and timeline cleanup</cleanup>
</animation-performance>

<optimization-techniques>
  <lazy-loading>Image loading="lazy" for gallery items</lazy-loading>
  <code-splitting>Dynamic imports for heavy animation code</code-splitting>
  <tree-shaking>ES modules for optimal bundling</tree-shaking>
  <css-optimization>Tailwind CSS purging enabled</css-optimization>
</optimization-techniques>
</performance-optimization>

<current-issues>
<issue priority="high" status="in-progress">
  <title>Color Contrast in Spectacular Animation</title>
  <description>Harsh white colors in GSAP animations cause eye strain</description>
  <location>/src/lib/gsap-animations.ts - createSpectacularHeroTransition()</location>
  <solution>Replace white colors with softer shadcn-compliant palette</solution>
  <timeline>Current phase, in progress</timeline>
</issue>

<issue priority="medium" status="pending">
  <title>Navigation Missing 'Riders' Link</title>
  <description>Professional booking navigation needs 'Riders' section</description>
  <location>Navigation component</location>
  <solution>Add 'Riders' link to navigation system</solution>
  <dependencies>Requires file server page creation</dependencies>
</issue>

<issue priority="low" status="planned">
  <title>File Server for Press Materials</title>
  <description>Need downloadable press kit, bio, and rider documents</description>
  <implementation>Create /press route with downloadable resources</implementation>
  <file-types>PDF riders, high-res photos, artist bio, press kit</file-types>
</issue>
</current-issues>

<deployment-status>
<production-readiness>
  <build-status>✅ Compiled successfully</build-status>
  <routes-available>4 routes (/, /demo, /admin, /_not-found)</routes-available>
  <performance-score>87.1 kB first load JS - Excellent</performance-score>
  <security>All security headers maintained</security>
  <seo>Static page generation working</seo>
</production-readiness>

<hosting-requirements>
  <node-version>18.x LTS or higher</node-version>
  <memory>512MB minimum for build process</memory>
  <storage>~200MB for application and dependencies</storage>
  <cdn>Static assets suitable for CDN deployment</cdn>
</hosting-requirements>
</deployment-status>

<maintenance-procedures>
<dependency-updates>
  <schedule>Monthly security updates, quarterly feature updates</schedule>
  <lts-strategy>Maintain LTS versions of React and Next.js</lts-strategy>
  <testing>Full regression testing required for animation updates</testing>
</dependency-updates>

<animation-maintenance>
  <performance-monitoring>Monitor FCP, LCP metrics for animation impact</performance-monitoring>
  <browser-testing>Test animations across major browsers quarterly</browser-testing>
  <accessibility-testing>Verify prefers-reduced-motion handling</accessibility-testing>
</animation-maintenance>
</maintenance-procedures>