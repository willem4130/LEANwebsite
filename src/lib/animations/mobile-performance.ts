/**
 * Mobile Performance Optimization for Electronic Music Animations
 * Ensures smooth 60fps performance on mobile devices while maintaining visual impact
 */

import { Transition, Variants } from 'framer-motion'
import { TIMING, EASING, PERFORMANCE } from './electronic-music-animations'

// Device Detection and Performance Metrics
export class MobilePerformanceManager {
  private static instance: MobilePerformanceManager
  private deviceInfo: DeviceInfo
  private performanceLevel: PerformanceLevel
  
  private constructor() {
    this.deviceInfo = this.detectDevice()
    this.performanceLevel = this.assessPerformance()
  }
  
  static getInstance(): MobilePerformanceManager {
    if (!MobilePerformanceManager.instance) {
      MobilePerformanceManager.instance = new MobilePerformanceManager()
    }
    return MobilePerformanceManager.instance
  }
  
  private detectDevice(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        devicePixelRatio: 1,
        hasTouch: false,
        isLowEnd: false,
      }
    }
    
    const width = window.innerWidth
    const dpr = window.devicePixelRatio || 1
    const hasTouch = 'ontouchstart' in window
    
    // Memory estimation (rough)
    const memory = (navigator as any).deviceMemory || 4
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      screenWidth: width,
      devicePixelRatio: dpr,
      hasTouch,
      isLowEnd: memory <= 2 || hardwareConcurrency <= 2,
    }
  }
  
  private assessPerformance(): PerformanceLevel {
    const { isLowEnd, isMobile, devicePixelRatio } = this.deviceInfo
    
    if (isLowEnd || (isMobile && devicePixelRatio > 2)) {
      return 'low'
    } else if (isMobile) {
      return 'medium'
    } else {
      return 'high'
    }
  }
  
  getDeviceInfo(): DeviceInfo {
    return this.deviceInfo
  }
  
  getPerformanceLevel(): PerformanceLevel {
    return this.performanceLevel
  }
  
  optimizeTransition(transition: Transition): Transition {
    const multiplier = this.getTimingMultiplier()
    const optimized = { ...transition }
    
    if (typeof optimized.duration === 'number') {
      optimized.duration *= multiplier
    }
    
    // Simplify easing for low-end devices
    if (this.performanceLevel === 'low') {
      optimized.ease = 'easeOut'
    }
    
    return optimized
  }
  
  optimizeVariants(variants: Variants): Variants {
    const optimized: Variants = {}
    
    Object.keys(variants).forEach(key => {
      const variant = variants[key]
      if (variant && typeof variant === 'object' && 'transition' in variant) {
        optimized[key] = {
          ...variant,
          transition: this.optimizeTransition(variant.transition as Transition),
        }
      } else {
        optimized[key] = variant
      }
    })
    
    return optimized
  }
  
  private getTimingMultiplier(): number {
    switch (this.performanceLevel) {
      case 'low':
        return 0.5 // 50% faster animations
      case 'medium':
        return 0.7 // 30% faster animations
      case 'high':
        return 1.0 // Full animation timing
      default:
        return 1.0
    }
  }
  
  shouldUseReducedAnimations(): boolean {
    if (typeof window === 'undefined') return false
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return prefersReduced || this.performanceLevel === 'low'
  }
  
  getOptimalStagger(): number {
    switch (this.performanceLevel) {
      case 'low':
        return TIMING.QUICK * 0.5
      case 'medium':
        return TIMING.QUICK * 0.7
      case 'high':
        return TIMING.QUICK
      default:
        return TIMING.QUICK
    }
  }
}

// Types
interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  devicePixelRatio: number
  hasTouch: boolean
  isLowEnd: boolean
}

type PerformanceLevel = 'low' | 'medium' | 'high'

// Mobile-Optimized Animation Presets
export const mobileOptimizedAnimations = {
  // Hero section for mobile
  mobileHero: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: TIMING.SEQUENCE * PERFORMANCE.MOBILE_MULTIPLIER,
          staggerChildren: TIMING.BEAT * PERFORMANCE.MOBILE_MULTIPLIER,
        },
      },
    } as Variants,
    
    title: {
      hidden: { 
        opacity: 0, 
        y: 30, // Reduced from 60 for mobile
        scale: 0.95, // Less scaling for mobile
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: TIMING.MEASURE * PERFORMANCE.MOBILE_MULTIPLIER,
          ease: EASING.ANALOG_SMOOTH, // Simpler easing for mobile
        },
      },
    } as Variants,
  },
  
  // Gallery for mobile with touch optimization
  mobileGallery: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: TIMING.MICRO, // Very quick stagger on mobile
        },
      },
    } as Variants,
    
    item: {
      hidden: { opacity: 0, scale: 0.95 }, // Minimal scale change
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: TIMING.BEAT * PERFORMANCE.MOBILE_MULTIPLIER,
          ease: EASING.ANALOG_SMOOTH,
        },
      },
      // Touch-optimized hover (actually tap)
      tap: { 
        scale: 0.98, 
        transition: { duration: TIMING.MICRO * 0.5 } 
      },
    } as Variants,
  },
  
  // Contact form for mobile
  mobileContact: {
    field: {
      hidden: { opacity: 0, x: -15 }, // Reduced movement
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: TIMING.BEAT * PERFORMANCE.MOBILE_MULTIPLIER,
          ease: EASING.ANALOG_SMOOTH,
        },
      },
      focus: { 
        scale: 1.01, // Minimal scale on mobile
        transition: { duration: TIMING.QUICK * 0.5 } 
      },
    } as Variants,
  },
}

// Touch-Optimized Interaction Variants
export const touchOptimizedVariants = {
  // Button press feedback
  touchButton: {
    idle: { scale: 1, opacity: 1 },
    pressed: { 
      scale: 0.96, 
      opacity: 0.9,
      transition: { duration: TIMING.MICRO } 
    },
    released: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: TIMING.MICRO,
        type: "spring",
        stiffness: 500,
      } 
    },
  } as Variants,
  
  // Card tap feedback
  touchCard: {
    idle: { scale: 1 },
    pressed: { 
      scale: 0.98,
      transition: { duration: TIMING.MICRO } 
    },
    released: { 
      scale: 1,
      transition: { 
        duration: TIMING.QUICK,
        type: "spring",
        stiffness: 300,
      } 
    },
  } as Variants,
  
  // Social media touch feedback
  touchSocial: {
    idle: { scale: 1, rotate: 0 },
    pressed: { 
      scale: 0.95, 
      rotate: 2,
      transition: { duration: TIMING.MICRO } 
    },
    released: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: TIMING.QUICK,
        type: "spring",
        stiffness: 400,
      } 
    },
  } as Variants,
}

// Performance Monitoring and Adaptive Quality
export class PerformanceMonitor {
  private frameRate: number = 60
  private frameCount: number = 0
  private lastTime: number = 0
  private monitoring: boolean = false
  
  startMonitoring() {
    if (this.monitoring) return
    
    this.monitoring = true
    this.lastTime = performance.now()
    this.monitorFrame()
  }
  
  stopMonitoring() {
    this.monitoring = false
  }
  
  private monitorFrame = () => {
    if (!this.monitoring) return
    
    const now = performance.now()
    const delta = now - this.lastTime
    this.frameCount++
    
    // Calculate FPS every 60 frames
    if (this.frameCount >= 60) {
      this.frameRate = Math.round(1000 / (delta / 60))
      this.frameCount = 0
      
      // Adaptive quality based on performance
      if (this.frameRate < 30) {
        this.suggestReducedAnimations()
      }
    }
    
    this.lastTime = now
    requestAnimationFrame(this.monitorFrame)
  }
  
  private suggestReducedAnimations() {
    // Dispatch custom event for components to reduce animation complexity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reduceAnimations', {
        detail: { frameRate: this.frameRate }
      }))
    }
  }
  
  getCurrentFPS(): number {
    return this.frameRate
  }
}

// Utility Functions
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const getMobileOptimizedAnimation = (animationName: keyof typeof mobileOptimizedAnimations): Variants => {
  const manager = MobilePerformanceManager.getInstance()
  const baseAnimation = mobileOptimizedAnimations[animationName]
  
  if (manager.shouldUseReducedAnimations()) {
    // Return simplified version for reduced motion
    return simplifyVariants(baseAnimation)
  }
  
  return manager.optimizeVariants(baseAnimation) as Variants
}

const simplifyVariants = (variants: any): Variants => {
  const simplified: Variants = {}
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key]
    if (variant && typeof variant === 'object') {
      // Remove complex transformations for reduced motion
      simplified[key] = {
        opacity: variant.opacity !== undefined ? variant.opacity : 1,
        transition: {
          duration: TIMING.QUICK,
          ease: 'easeOut',
        },
      }
    } else {
      simplified[key] = variant
    }
  })
  
  return simplified
}

// Scroll Performance Optimization
export const optimizedScrollAnimations = {
  // Use intersection observer for better performance
  scrollReveal: (threshold: number = 0.1) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: TIMING.BEAT * PERFORMANCE.MOBILE_MULTIPLIER,
        ease: EASING.ANALOG_SMOOTH,
      },
    },
    viewport: { once: true, amount: threshold },
  }),
  
  // Optimized parallax with transform3d
  parallax: (speed: number = 0.5) => ({
    y: [0, -50 * speed],
    transition: {
      ease: 'linear',
      duration: 0, // Controlled by scroll position
    },
    style: {
      willChange: 'transform',
      transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
    },
  }),
}

// Export singleton instance
export const mobileManager = MobilePerformanceManager.getInstance()
export const performanceMonitor = new PerformanceMonitor()