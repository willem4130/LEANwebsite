# GSAP Animation Integration Guide
## Next.js 14 + GSAP + Framer Motion Electronic Music Website

<metadata>
purpose: Technical guide for integrating GSAP animations with Next.js and Framer Motion
type: integration-guide
language: TypeScript
dependencies: gsap@3.13.0, framer-motion@12.23.12, next@14.2.32
last-updated: 2025-01-23
</metadata>

<overview>
Complete integration guide for adding GSAP animations to a Next.js 14 application already using Framer Motion, specifically designed for premium electronic music artist websites. This guide covers setup, common pitfalls, accessibility considerations, and production-ready implementation patterns.
</overview>

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Animation System Architecture](#animation-system-architecture)
3. [Implementation Process](#implementation-process)
4. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
5. [Best Practices](#best-practices)
6. [Accessibility Guidelines](#accessibility-guidelines)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Performance Optimization](#performance-optimization)

## 🚀 Installation & Setup

### Dependencies Installation

```bash
# Core GSAP package
npm install gsap@3.13.0

# Ensure compatible Framer Motion version
npm install framer-motion@12.23.12
```

### GSAP Plugin Registration

<configuration>
<setting name="gsap-plugins" type="array" default="['ScrollTrigger']">
  Register GSAP plugins in a client-side module to avoid SSR issues
</setting>
</configuration>

```typescript
// src/lib/gsap-animations.ts
'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Critical: Only register plugins client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}
```

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure GSAP works properly with Next.js
  transpilePackages: ['gsap'],
  experimental: {
    optimizePackageImports: ['gsap']
  }
}

module.exports = nextConfig
```

## 🏗️ Animation System Architecture

### Hybrid Animation Strategy

This implementation uses a **dual animation system**:

- **Framer Motion**: Component-level animations, React integration, accessibility
- **GSAP**: Complex timeline animations, scroll triggers, performance-critical effects

```typescript
// Animation System Structure
src/lib/animations/
├── electronic-music-animations.ts  # Framer Motion variants
├── gsap-animations.ts              # GSAP timeline functions
└── animation-utils.ts              # Shared utilities
```

### Electronic Music Animation Constants

```typescript
// Electronic Music Timing System (BPM-based)
export const TIMING = {
  MICRO: 0.12,    // 1/16 beat at 128 BPM
  QUICK: 0.25,    // 1/8 beat
  BEAT: 0.5,      // 1/4 beat
  MEASURE: 1.9,   // 1 bar
  SEQUENCE: 3.8,  // 2 bars
  BUILDUP: 7.5,   // 4 bars
} as const

// Electronic Music Easing Curves
export const EASING = {
  SYNTH_ATTACK: [0.25, 0.46, 0.45, 0.94],
  FILTER_SWEEP: [0.23, 1, 0.32, 1],
  SIDECHAIN: [0.68, -0.55, 0.265, 1.55],
  ANALOG_SMOOTH: [0.25, 0.1, 0.25, 1],
} as const
```

## 🔧 Implementation Process

### Step 1: Hero Section GSAP Integration

<function name="createHeroAnimations">
  <signature>createHeroAnimations() -> GSAPTimeline</signature>
  <purpose>Creates professional entrance sequence for electronic music artists</purpose>
  <parameters>
    <param name="duration" type="number" required="false">Total animation duration in seconds</param>
  </parameters>
  <returns>GSAP Timeline object for further manipulation</returns>
  <examples>
    <example>
      <input>createHeroAnimations()</input>
      <output>Timeline with artist name, tagline, and CTA animations</output>
    </example>
  </examples>
  <errors>
    <error type="ReferenceError">When DOM elements with required classes are not found</error>
  </errors>
</function>

```typescript
export const createHeroAnimations = () => {
  const tl = gsap.timeline()
  
  // Set initial states
  gsap.set('.hero-artist-name', { 
    opacity: 0, 
    scale: 0.8, 
    y: 100,
    filter: 'blur(20px)'
  })
  
  // Background entrance
  tl.to('.hero-background', {
    duration: 2,
    scale: 1,
    opacity: 1,
    ease: 'power2.out'
  })
  
  // Artist name with electric glow effect
  .to('.hero-artist-name', {
    duration: 1.5,
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    ease: 'back.out(1.7)',
  }, '-=1')
  
  return tl
}
```

### Step 2: Component Integration

```typescript
// src/components/artist/hero-section.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { heroAnimations, getOptimizedTransition } from '@/lib/animations/electronic-music-animations'
import { createHeroAnimations } from '@/lib/gsap-animations'

export function HeroSection({ artistName, tagline, ctaText }) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize GSAP animations after component mounts
    const timer = setTimeout(() => {
      if (!prefersReducedMotion()) {
        createHeroAnimations()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.section
      className="hero-background relative min-h-screen"
      variants={heroAnimations.container}
      initial="hidden"
      animate="visible"
      ref={heroRef}
    >
      <motion.h1
        className="hero-artist-name text-artist-name"
        variants={heroAnimations.artistName}
      >
        {artistName}
      </motion.h1>
      
      <motion.p
        className="hero-tagline"
        variants={heroAnimations.tagline}
      >
        {tagline}
      </motion.p>
      
      <motion.div 
        className="hero-cta"
        variants={heroAnimations.cta}
      >
        <Button variant="premium">{ctaText}</Button>
      </motion.div>
    </motion.section>
  )
}
```

### Step 3: Scroll-Triggered Animations

<function name="createScrollAnimations">
  <signature>createScrollAnimations() -> void</signature>
  <purpose>Creates smooth section transitions with ScrollTrigger</purpose>
  <parameters>
    <param name="triggerStart" type="string" required="false">ScrollTrigger start position</param>
    <param name="triggerEnd" type="string" required="false">ScrollTrigger end position</param>
  </parameters>
  <returns>Void - registers ScrollTrigger instances</returns>
  <examples>
    <example>
      <input>createScrollAnimations()</input>
      <output>Registers scroll-triggered animations for all .section-container elements</output>
    </example>
  </examples>
  <errors>
    <error type="Error">When ScrollTrigger plugin is not registered</error>
  </errors>
</function>

```typescript
export const createScrollAnimations = () => {
  gsap.utils.toArray('.section-container').forEach((section: any) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        gsap.to(section, {
          duration: 1.2,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out'
        })
      },
      onLeave: () => {
        gsap.to(section, {
          duration: 0.8,
          opacity: 0.8,
          scale: 0.98,
          ease: 'power2.inOut'
        })
      }
    })
  })
}
```

## ⚠️ Common Pitfalls & Solutions

### Pitfall 1: Animation Variable Imports

**Problem**: `ReferenceError: scrollAnimations is not defined`

**Cause**: Missing import statements for animation variables

**Solution**:
```typescript
// ❌ Wrong - Missing imports
import { heroAnimations } from '@/lib/animations/electronic-music-animations'

// ✅ Correct - Complete imports
import { 
  heroAnimations, 
  scrollAnimations,
  galleryAnimations,
  contactAnimations 
} from '@/lib/animations/electronic-music-animations'
```

### Pitfall 2: SSR Hydration Issues

**Problem**: `ReferenceError: window is not defined`

**Cause**: GSAP code running during server-side rendering

**Solution**:
```typescript
// ❌ Wrong - No SSR check
gsap.registerPlugin(ScrollTrigger)

// ✅ Correct - Client-side only
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}
```

### Pitfall 3: Animation Retriggering

**Problem**: Scroll animations only work once

**Cause**: Framer Motion `once: true` setting

**Solution**:
```typescript
// ❌ Wrong - Single trigger
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
/>

// ✅ Correct - Retriggerable
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false }}
  exit="hidden"
/>
```

### Pitfall 4: Poor Text Contrast

**Problem**: White text on light backgrounds causing readability issues

**Cause**: Insufficient background overlay or gradient design

**Solution**:
```typescript
// ❌ Wrong - Insufficient contrast
background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)

// ✅ Correct - Proper contrast with overlay
background: `
  radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
  linear-gradient(135deg, #060609 0%, #0a0a0f 25%, #1a1a2e 75%, #2a2a3e 100%)
`
```

### Pitfall 5: Button Accessibility Issues

**Problem**: Buttons with poor contrast ratios failing WCAG guidelines

**Cause**: Insufficient color contrast between text and background

**Solution**:
```typescript
// ❌ Wrong - Poor contrast
premium: "bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-600"

// ✅ Correct - WCAG compliant
premium: "bg-gradient-to-r from-brand-neon via-brand-electric to-brand-purple text-black font-bold"
```

## 🎨 Best Practices

### Animation Timing

<patterns>
<pattern name="electronic-music-timing">
  Base all animation durations on musical timing (BPM 120-140) for cohesive feel:
  - Micro-interactions: 0.12s (1/16 beat)
  - UI responses: 0.25s (1/8 beat)  
  - Standard transitions: 0.5s (1/4 beat)
  - Hero entrances: 1.9s (1 bar)
</pattern>
</patterns>

### Performance Optimization

```typescript
// GPU-accelerated properties only
const GPU_PROPERTIES = ['transform', 'opacity', 'filter']

// Apply will-change optimization
const applyWillChange = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity'
}

// Remove after animation
const removeWillChange = (element: HTMLElement) => {
  element.style.willChange = 'auto'
}
```

### Mobile Performance

```typescript
// Optimize for mobile devices
const MOBILE_MULTIPLIER = 0.7

const getOptimizedDuration = (duration: number) => {
  const isMobile = window.innerWidth < 768
  return isMobile ? duration * MOBILE_MULTIPLIER : duration
}
```

## ♿ Accessibility Guidelines

### Reduced Motion Support

<function name="prefersReducedMotion">
  <signature>prefersReducedMotion() -> boolean</signature>
  <purpose>Checks if user prefers reduced motion for accessibility</purpose>
  <parameters></parameters>
  <returns>Boolean indicating reduced motion preference</returns>
  <examples>
    <example>
      <input>prefersReducedMotion()</input>
      <output>true if user has reduced motion enabled</output>
    </example>
  </examples>
  <errors>
    <error type="Error">Returns false if window is undefined (SSR)</error>
  </errors>
</function>

```typescript
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Apply reduced motion
const getOptimizedTransition = (transition: Transition) => {
  const isReduced = prefersReducedMotion()
  
  if (isReduced) {
    return {
      ...transition,
      duration: typeof transition.duration === 'number' 
        ? transition.duration * 0.3 
        : transition.duration,
    }
  }
  
  return transition
}
```

### Color Contrast Requirements

```typescript
// WCAG 2.1 AA compliant color system
brand: {
  // High contrast text combinations
  text: {
    hero: "#ffffff",      // White on dark backgrounds
    primary: "#e2e8f0",   // Light gray - 4.5:1 contrast ratio
    accent: "#00ffff",    // Neon cyan - sufficient contrast
  },
  
  // Button contrast ratios
  buttons: {
    premium: "text-black bg-brand-neon", // 21:1 contrast ratio
    professional: "text-brand-text-hero border-brand-neon", // 4.5:1 minimum
  }
}
```

### Touch Target Sizes

```typescript
// Minimum 44px touch targets for accessibility
size: {
  default: "h-11 px-4 py-2", // 44px height
  sm: "h-11 rounded-md px-3", // Fixed from h-8 (violation)
  icon: "h-11 w-11", // 44px minimum
}
```

## 🔧 Troubleshooting Guide

### Animation Not Playing

**Symptoms**: GSAP animations don't start or appear broken

**Diagnosis Checklist**:
1. Check browser console for JavaScript errors
2. Verify DOM elements exist with correct class names
3. Confirm GSAP plugins are registered client-side
4. Check timing of animation initialization

**Common Fixes**:
```typescript
// Add timing delay for DOM readiness
useEffect(() => {
  const timer = setTimeout(() => {
    createHeroAnimations()
  }, 100)
  
  return () => clearTimeout(timer)
}, [])
```

### ScrollTrigger Not Working

**Symptoms**: Scroll-based animations don't trigger

**Diagnosis**: 
```typescript
// Debug ScrollTrigger registration
console.log('ScrollTriggers:', ScrollTrigger.getAll())

// Check if plugin is registered
console.log('GSAP plugins:', gsap.plugins)
```

**Solution**:
```typescript
// Ensure proper cleanup and re-initialization
useEffect(() => {
  // Clear existing triggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  
  // Re-initialize
  createScrollAnimations()
  
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }
}, [])
```

### Performance Issues

**Symptoms**: Animations lag or cause frame drops

**Solutions**:
```typescript
// 1. Use GPU-accelerated properties only
gsap.to(element, {
  transform: 'translateY(0)', // ✅ GPU accelerated
  y: 0,                      // ✅ GSAP optimized
  top: 0,                    // ❌ Causes layout
})

// 2. Apply will-change property
gsap.set(element, { willChange: 'transform' })

// 3. Use GSAP's force3D
gsap.to(element, { force3D: true, y: 100 })
```

### Build/Deployment Issues

**Symptoms**: Animations work in development but fail in production

**Solutions**:
```typescript
// 1. Check Next.js configuration
// next.config.js
module.exports = {
  transpilePackages: ['gsap']
}

// 2. Ensure client-side only execution
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  gsap.registerPlugin(ScrollTrigger)
}
```

## 🚀 Performance Optimization

### Bundle Size Optimization

```typescript
// Import specific GSAP modules only
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// Avoid importing entire GSAP library
// ❌ import gsap from 'gsap/all'
```

### Memory Management

<function name="cleanupGSAPAnimations">
  <signature>cleanupGSAPAnimations() -> void</signature>
  <purpose>Properly cleanup GSAP animations to prevent memory leaks</purpose>
  <parameters></parameters>
  <returns>Void - cleans up timelines and ScrollTriggers</returns>
  <examples>
    <example>
      <input>cleanupGSAPAnimations()</input>
      <output>All GSAP timelines and ScrollTriggers are killed</output>
    </example>
  </examples>
</function>

```typescript
export const cleanupGSAPAnimations = () => {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    gsap.globalTimeline.clear()
  }
}

// Use in component cleanup
useEffect(() => {
  return () => {
    cleanupGSAPAnimations()
  }
}, [])
```

### Animation Batching

```typescript
// Batch DOM reads and writes
const batchAnimations = (elements: HTMLElement[]) => {
  // Read phase
  const bounds = elements.map(el => el.getBoundingClientRect())
  
  // Write phase
  elements.forEach((el, i) => {
    gsap.set(el, {
      y: bounds[i].top > window.innerHeight ? 100 : 0,
      opacity: bounds[i].top > window.innerHeight ? 0 : 1
    })
  })
}
```

## 📱 Mobile Considerations

### Touch Performance

```typescript
// Optimize for mobile touch devices
const createMobileOptimizedAnimations = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  
  if (isMobile) {
    // Reduce animation complexity
    gsap.defaults({
      duration: 0.3,
      ease: "power2.out"
    })
    
    // Disable complex effects
    gsap.set('.parallax-bg', { display: 'none' })
  }
}
```

### Viewport Considerations

```typescript
// Handle mobile viewport changes
const handleViewportChange = () => {
  ScrollTrigger.refresh()
}

window.addEventListener('orientationchange', handleViewportChange)
window.addEventListener('resize', handleViewportChange)
```

## 🎵 Electronic Music Specific Features

### Genre-Based Animation Presets

<configuration>
<setting name="genrePresets" type="object" default="{ ambient: {...}, techno: {...} }">
  Different animation styles based on electronic music subgenres
</setting>
</configuration>

```typescript
export const genrePresets = {
  ambient: {
    timingMultiplier: 1.5,
    easing: EASING.ANALOG_SMOOTH,
    effects: 'subtle',
  },
  techno: {
    timingMultiplier: 0.8,
    easing: EASING.SYNTH_ATTACK,
    effects: 'strong',
  },
  trance: {
    timingMultiplier: 1.0,
    easing: EASING.FILTER_SWEEP,
    effects: 'buildup',
  },
} as const
```

### BPM-Synchronized Animations

```typescript
// Sync animations to music BPM
const createBPMSyncedAnimation = (bpm: number) => {
  const beatDuration = 60 / bpm // Duration of one beat in seconds
  
  gsap.to('.beat-indicator', {
    scale: [1, 1.1, 1],
    duration: beatDuration,
    ease: 'power2.inOut',
    repeat: -1
  })
}
```

## 📊 Testing Strategy

### Animation Testing

```typescript
// Test animation completion
const testHeroAnimations = async () => {
  const timeline = createHeroAnimations()
  
  return new Promise(resolve => {
    timeline.eventCallback('onComplete', () => {
      console.log('Hero animations completed successfully')
      resolve(true)
    })
  })
}

// Test accessibility compliance
const testReducedMotion = () => {
  // Mock reduced motion preference
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({ matches: true }))
  })
  
  const optimizedTransition = getOptimizedTransition({ duration: 1 })
  expect(optimizedTransition.duration).toBe(0.3)
}
```

### Performance Testing

```typescript
// Monitor animation performance
const monitorAnimationPerformance = () => {
  let frameCount = 0
  let lastTime = performance.now()
  
  const checkFPS = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime - lastTime >= 1000) {
      console.log(`FPS: ${frameCount}`)
      frameCount = 0
      lastTime = currentTime
    }
    
    requestAnimationFrame(checkFPS)
  }
  
  checkFPS()
}
```

## 🏆 Production Deployment Checklist

- [ ] GSAP plugins registered client-side only
- [ ] ScrollTriggers properly cleaned up
- [ ] Reduced motion preferences respected  
- [ ] Color contrast ratios meet WCAG 2.1 AA
- [ ] Touch targets minimum 44px
- [ ] Animation performance tested on mobile
- [ ] Bundle size optimized
- [ ] Error boundaries implemented
- [ ] Fallback animations for older browsers
- [ ] Memory leaks tested and resolved

## 📚 Additional Resources

- [GSAP Official Documentation](https://greensock.com/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Created**: January 2025  
**Version**: 1.0.0  
**Compatibility**: Next.js 14+, GSAP 3.13+, Framer Motion 12+  
**License**: MIT