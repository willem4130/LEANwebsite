# 🎬 Animation System

The LEAN framework features a sophisticated dual animation system specifically designed for electronic music artists. It combines Framer Motion for component-level animations with GSAP for complex scroll-based effects, creating cinematic experiences that match the energy of electronic music.

## Overview

The animation system consists of two complementary engines:

### **Framer Motion Engine** - Component Animations
- Hero section entrances
- Gallery item interactions  
- Button hover effects
- Form field animations
- Mobile-optimized gestures

### **GSAP Engine** - Cinematic Effects
- Scroll-triggered section transitions
- Matrix rain effects
- Lightning flash sequences
- Holographic scan lines
- Energy orb explosions
- Circuit trace animations

## Electronic Music Timing System

### BPM-Based Animation Timing

The framework uses electronic music timing constants based on typical EDM BPM (120-140):

```typescript
export const TIMING = {
  MICRO: 0.12,        // 1/16 beat at 128 BPM (~117ms)
  QUICK: 0.25,        // 1/8 beat at 128 BPM (~234ms)  
  BEAT: 0.5,          // 1/4 beat at 128 BPM (~469ms)
  MEASURE: 1.9,       // 1 bar at 128 BPM (~1875ms)
  SEQUENCE: 3.8,      // 2 bars at 128 BPM (~3750ms)
  BUILDUP: 7.5        // 4 bars at 128 BPM (~7500ms)
}
```

### Electronic Music Easing Curves

```typescript
export const EASING = {
  SYNTH_ATTACK: [0.25, 0.46, 0.45, 0.94],      // Sharp attack, quick decay
  FILTER_SWEEP: [0.23, 1, 0.32, 1],            // Smooth filter automation
  SIDECHAIN: [0.68, -0.55, 0.265, 1.55],       // Bouncy compression
  REVERSE_DELAY: [0.55, 0.085, 0.68, 0.53],    // Reverse reverb effect
  ANALOG_SMOOTH: [0.25, 0.1, 0.25, 1],         // Analog-style smooth
  DIGITAL_STEP: [0.5, 0, 0.5, 1],              // Digital/quantized
  GLITCH: [0.55, 0.055, 0.675, 0.19]           // Irregular glitch timing
}
```

## Hero Section Animations

### Basic Hero Setup

```typescript
import { HeroSection } from '@/components/artist/hero-section'

<HeroSection
  artistName="Your Artist Name"
  tagline="Electronic Music Producer & DJ"
  backgroundType="gradient"
  animationDuration={4}  // Controls entrance timing
  ctaText="Book Now"
  ctaLink="mailto:booking@yourname.com"
/>
```

### Hero Animation Sequence

The hero section uses a carefully choreographed entrance:

1. **Background Effects** (0-1s) - GSAP background animations
2. **Artist Name** (1-2.5s) - Framer Motion with spring physics
3. **Tagline** (2-3s) - Filter sweep effect
4. **Social Links** (2.5-3.5s) - Staggered entrance
5. **CTA Button** (3-4s) - Sidechain compression bounce

### Customizing Hero Animations

#### Animation Speed Control

```typescript
// Faster, snappier animations
<HeroSection
  animationDuration={2}
  // Other props...
/>

// Slower, more dramatic
<HeroSection  
  animationDuration={6}
  // Other props...
/>
```

#### Custom Animation Variants

```typescript
// Create custom hero animations
const customHeroVariants = {
  artistName: {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotateY: 45,
      filter: 'blur(20px)'
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        duration: TIMING.SEQUENCE,
        ease: EASING.SYNTH_ATTACK
      }
    }
  }
}
```

## Gallery Animations

### Animation Variants

The gallery system includes multiple animation presets:

#### Grid Layout Animations

```typescript
const galleryItemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    rotateY: 15,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: {
      duration: TIMING.MEASURE,
      ease: EASING.FILTER_SWEEP
    }
  },
  hover: {
    scale: 1.02,
    y: -8,
    rotateY: 2,
    transition: {
      duration: TIMING.QUICK,
      ease: EASING.SYNTH_ATTACK
    }
  }
}
```

#### Masonry Layout Animations

```typescript
// Staggered entrance with varying delays
<Gallery
  items={galleryItems}
  layout="masonry"
  title="Visual Soundscape"
/>

// Items animate in with musical timing
transition: {
  staggerChildren: TIMING.QUICK,
  delayChildren: TIMING.BEAT * 0.5
}
```

### Lightbox Animations

```typescript
const lightboxVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(20px)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: TIMING.MEASURE,
      ease: EASING.REVERSE_DELAY  // Unique reverse reverb effect
    }
  }
}
```

## Scroll-Triggered Animations

### GSAP Cinematic Effects

The framework includes spectacular scroll-triggered transitions:

#### Matrix Rain Effect

```typescript
// Triggered on first scroll
const createMatrixEffect = () => {
  const matrix = document.createElement('div')
  matrix.className = 'matrix-rain fixed inset-0 pointer-events-none z-45'
  
  for (let i = 0; i < 20; i++) {
    const column = document.createElement('div')
    column.className = 'absolute top-0 opacity-0'
    column.style.left = `${i * 5}%`
    column.style.background = `linear-gradient(to bottom, transparent, rgba(20, 184, 166, 0.4), transparent)`
    matrix.appendChild(column)
  }
  
  gsap.to(matrix.children, {
    opacity: 0.7,
    y: '100vh',
    duration: 2,
    ease: 'none',
    stagger: 0.1
  })
}
```

#### Lightning Flash Sequence

```typescript
// Screen-wide flash with shake effect
const lightningFlash = () => {
  const flash = document.createElement('div')
  flash.style.background = 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)'
  
  gsap.timeline()
    .to(flash, { opacity: 1, duration: 0.1 })
    .to('body', { x: '+=5', yoyo: true, repeat: 3, duration: 0.1 }, '-=0.1')
    .to(flash, { opacity: 0, duration: 0.3 })
}
```

#### Holographic Scan Lines

```typescript
// Multi-colored scanning sequence
const createScanLines = () => {
  const scanLines = document.createElement('div')
  scanLines.innerHTML = `
    <div class="scan-1 absolute w-full h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"></div>
    <div class="scan-2 absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
    <div class="scan-3 absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
  `
  
  gsap.timeline()
    .to('.scan-1', { opacity: 1, scaleX: 5, duration: 0.8, ease: 'power2.out' })
    .to('.scan-2', { opacity: 1, scaleX: 5, duration: 1.0, ease: 'power2.out' }, '-=0.5')
    .to('.scan-3', { opacity: 1, scaleX: 5, duration: 0.9, ease: 'power2.out' }, '-=0.7')
}
```

#### Energy Orb Explosion

```typescript
// Radial burst transition between sections
const createEnergyOrb = () => {
  const orb = document.createElement('div')
  orb.style.background = `
    radial-gradient(circle at 30% 30%, rgba(110, 231, 183, 0.8) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.6) 0%, transparent 60%),
    radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 80%)
  `
  
  gsap.timeline()
    .to(orb, { opacity: 1, scale: 1, duration: 0.3 })
    .to(orb, { scale: 15, opacity: 0, duration: 1.5, ease: 'power2.out' })
}
```

#### Iris Reveal Effect

```typescript
// Circular reveal with filter effects
const irisReveal = (element) => {
  gsap.fromTo(element, 
    {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
      scale: 1.1,
      filter: 'blur(20px) brightness(0.3) hue-rotate(180deg)'
    },
    {
      clipPath: 'circle(100% at 50% 50%)',
      opacity: 1,
      scale: 1,
      filter: 'blur(0px) brightness(1) hue-rotate(0deg)',
      duration: 2.5,
      ease: 'power3.out'
    }
  )
}
```

### Circuit Trace Animations

```typescript
// Electronic circuit trace effects
const createCircuitTrace = (section, index) => {
  const circuitLine = document.createElement('div')
  circuitLine.innerHTML = `
    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="circuit-gradient-${index}">
          <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0" />
          <stop offset="50%" style="stop-color:#00d4ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0" />
        </linearGradient>
      </defs>
      <path class="circuit-path" 
            d="M0,10 Q25,5 50,15 Q75,25 100,10" 
            stroke="url(#circuit-gradient-${index})" 
            stroke-width="3" 
            pathLength="100"
            stroke-dasharray="100"
            stroke-dashoffset="100"/>
    </svg>
  `
  
  // Animate circuit activation
  gsap.timeline()
    .to('.circuit-path', {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out'
    })
    .to('.circuit-path', {
      strokeDashoffset: 0,
      duration: 4,
      ease: 'power1.inOut'
    }, '-=0.5')
}
```

## Performance Optimization

### Mobile Optimization

```typescript
// Automatic mobile optimization
export const getOptimizedTransition = (transition) => {
  const isMobile = window.innerWidth < 768
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (isReduced) {
    return {
      ...transition,
      duration: transition.duration * PERFORMANCE.REDUCED_MOTION_MULTIPLIER
    }
  }

  if (isMobile) {
    return {
      ...transition,
      duration: transition.duration * PERFORMANCE.MOBILE_MULTIPLIER  // 30% faster
    }
  }

  return transition
}
```

### GPU Acceleration

```typescript
// Force GPU acceleration for smooth animations
gsap.defaults({ 
  force3D: true, 
  lazy: false 
})

// Use transform and opacity for best performance
const gpuOptimizedAnimation = {
  x: 100,        // Better than changing left/right
  y: 50,         // Better than changing top/bottom  
  scale: 1.1,    // Better than width/height changes
  opacity: 0.5,  // Always performant
  rotation: 45   // GPU accelerated
}
```

### Will-Change Optimization

```typescript
// Apply will-change optimization before animations
export const applyWillChange = (element, properties) => {
  element.style.willChange = properties.join(', ')
}

// Remove after animation completes
export const removeWillChange = (element) => {
  element.style.willChange = 'auto'
}

// Usage
applyWillChange(element, ['transform', 'opacity'])
// ... run animation
removeWillChange(element)
```

## Accessibility Features

### Reduced Motion Support

```typescript
// Automatic reduced motion detection
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Usage in components
const [isReducedMotion, setIsReducedMotion] = useState(false)

useEffect(() => {
  setIsReducedMotion(prefersReducedMotion())
}, [])

// Conditional animations
const animations = isReducedMotion ? {} : {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity }
}
```

### Focus Management

```typescript
// Proper focus handling in animated components
const handleAnimationComplete = () => {
  // Focus the first interactive element after animation
  const firstFocusable = element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  firstFocusable?.focus()
}
```

## Genre-Specific Presets

### Electronic Music Genre Customization

```typescript
export const genrePresets = {
  // Ambient/Downtempo - Slower, flowing movements
  ambient: {
    timingMultiplier: 1.5,
    easing: EASING.ANALOG_SMOOTH,
    effects: 'subtle'
  },

  // Techno/House - Sharp, rhythmic movements  
  techno: {
    timingMultiplier: 0.8,
    easing: EASING.SYNTH_ATTACK,
    effects: 'strong'
  },

  // Experimental/IDM - Glitch and irregular timing
  experimental: {
    timingMultiplier: 1.2,
    easing: EASING.GLITCH,
    effects: 'complex'
  },

  // Trance - Building, sweeping movements
  trance: {
    timingMultiplier: 1.0,
    easing: EASING.FILTER_SWEEP,
    effects: 'buildup'
  }
}

// Apply genre preset
const applyGenrePreset = (genre) => {
  const preset = genrePresets[genre]
  
  // Modify global timing
  Object.keys(TIMING).forEach(key => {
    TIMING[key] *= preset.timingMultiplier
  })
  
  // Apply genre-specific effects
  switch(preset.effects) {
    case 'subtle':
      // Reduce animation intensity
      break
    case 'strong':  
      // Increase animation intensity
      break
    case 'complex':
      // Add glitch effects
      break
  }
}
```

## Custom Animation Creation

### Creating Custom Framer Motion Variants

```typescript
// Your custom animation variants
export const customVariants = {
  // Vinyl record spin effect
  vinylSpin: {
    hidden: { 
      opacity: 0, 
      rotate: -180, 
      scale: 0.8 
    },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: TIMING.SEQUENCE,
        ease: EASING.ANALOG_SMOOTH,
        rotate: {
          type: "spring",
          damping: 15,
          stiffness: 100
        }
      }
    },
    hover: {
      rotate: 360,
      transition: { 
        duration: 2, 
        ease: "linear", 
        repeat: Infinity 
      }
    }
  },

  // Frequency bars visualization
  frequencyBar: {
    idle: { scaleY: 1 },
    active: {
      scaleY: [1, 1.8, 1.2, 1.5, 1],
      transition: {
        duration: TIMING.BEAT,
        repeat: Infinity,
        ease: EASING.SYNTH_ATTACK
      }
    }
  },

  // Waveform path animation
  waveform: {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: TIMING.BUILDUP,
        ease: EASING.FILTER_SWEEP
      }
    }
  }
}
```

### Creating Custom GSAP Effects

```typescript
// Custom GSAP effects for your brand
export const createCustomGSAPEffect = (trigger, options = {}) => {
  ScrollTrigger.create({
    trigger,
    start: 'top 80%',
    onEnter: () => {
      // Your custom effect
      const timeline = gsap.timeline()
      
      // Example: Custom glitch transition
      timeline
        .to(trigger, {
          x: () => Math.random() * 20 - 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true
        })
        .to(trigger, {
          filter: `hue-rotate(${Math.random() * 360}deg) saturate(2)`,
          duration: 0.1,
          repeat: 3,
          yoyo: true
        }, '-=0.3')
        .to(trigger, {
          x: 0,
          filter: 'none',
          duration: 0.5,
          ease: 'power2.out'
        })
    }
  })
}
```

## Integration Guide

### Setting Up Animations in Your Project

1. **Import animation utilities:**

```typescript
import { 
  heroAnimations, 
  galleryAnimations,
  getOptimizedTransition,
  prefersReducedMotion 
} from '@/lib/animations/electronic-music-animations'

import { 
  initializeGSAPAnimations,
  cleanupGSAPAnimations 
} from '@/lib/gsap-animations'
```

2. **Initialize in your layout:**

```typescript
// app/layout.tsx
useEffect(() => {
  initializeGSAPAnimations()
  
  return () => {
    cleanupGSAPAnimations()
  }
}, [])
```

3. **Apply to components:**

```typescript
// Your component
export function MyComponent() {
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  
  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion())
  }, [])

  return (
    <motion.div
      variants={heroAnimations.artistName}
      initial="hidden"
      animate="visible"
    >
      Your content
    </motion.div>
  )
}
```

### CSS Classes for GSAP Targeting

```css
/* Add these classes to elements for GSAP animations */
.hero-background { /* Hero background animations */ }
.section-container { /* Section reveal animations */ }  
.gallery-item { /* Gallery item animations */ }
.contact-section { /* Contact form animations */ }
.gsap-button { /* Button hover effects */ }
.parallax-bg { /* Parallax backgrounds */ }
```

## Troubleshooting

### Common Animation Issues

**Animations not running:**
- Check if elements have proper class names for GSAP targeting
- Verify ScrollTrigger is properly registered
- Ensure animations respect reduced motion preferences

**Performance issues:**
- Use `will-change` property before animations
- Stick to transform and opacity properties
- Clean up animations after completion
- Test on actual mobile devices

**GSAP conflicts with Framer Motion:**
- The framework separates concerns: Framer Motion for components, GSAP for scroll effects
- Never animate the same element with both libraries simultaneously
- Use GSAP for complex scroll triggers, Framer Motion for component states

### Debug Mode

Enable animation debugging:

```typescript
// Debug animations in development
if (process.env.NODE_ENV === 'development') {
  // Log animation states
  console.log('Animation state:', animationState)
  
  // Show animation boundaries
  ScrollTrigger.create({
    trigger: '.section-container',
    markers: true, // Shows start/end markers
    start: 'top 80%',
    end: 'bottom 20%'
  })
}
```

### Performance Monitoring

```typescript
// Monitor animation performance
const measureAnimationPerformance = () => {
  const start = performance.now()
  
  // Your animation code
  
  const end = performance.now()
  if (end - start > 16) { // 60fps = 16.67ms per frame
    console.warn(`Animation took ${end - start}ms - consider optimization`)
  }
}
```

---

**🎬 Your electronic music website now has cinematic animations that match your sound!**

*The animation system creates an immersive experience that converts visitors into fans and impresses industry professionals.*