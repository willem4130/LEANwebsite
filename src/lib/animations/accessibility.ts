/**
 * Accessibility Support for Electronic Music Animations
 * Ensures WCAG compliance and respects user preferences
 */

import React from 'react'
import { Variants, Transition } from 'framer-motion'
import { TIMING, EASING } from './electronic-music-animations'

// Accessibility Preferences Detection
export class AccessibilityManager {
  private static instance: AccessibilityManager
  private preferences: AccessibilityPreferences
  private mediaQueryListeners: MediaQueryList[] = []
  
  private constructor() {
    this.preferences = this.detectPreferences()
    this.setupMediaQueryListeners()
  }
  
  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager()
    }
    return AccessibilityManager.instance
  }
  
  private detectPreferences(): AccessibilityPreferences {
    if (typeof window === 'undefined') {
      return {
        prefersReducedMotion: false,
        prefersReducedData: false,
        prefersHighContrast: false,
        prefersReducedTransparency: false,
        colorScheme: 'light',
        forcedColors: 'none',
      }
    }
    
    return {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      forcedColors: window.matchMedia('(forced-colors: active)').matches ? 'active' : 'none',
    }
  }
  
  private setupMediaQueryListeners() {
    if (typeof window === 'undefined') return
    
    const queries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-reduced-data: reduce)',
      '(prefers-contrast: high)',
      '(prefers-reduced-transparency: reduce)',
      '(prefers-color-scheme: dark)',
      '(forced-colors: active)',
    ]
    
    queries.forEach(query => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', () => {
        this.preferences = this.detectPreferences()
        this.notifyPreferenceChange()
      })
      this.mediaQueryListeners.push(mql)
    })
  }
  
  private notifyPreferenceChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('accessibilityPreferencesChanged', {
        detail: this.preferences
      }))
    }
  }
  
  getPreferences(): AccessibilityPreferences {
    return this.preferences
  }
  
  shouldReduceMotion(): boolean {
    return this.preferences.prefersReducedMotion
  }
  
  shouldReduceData(): boolean {
    return this.preferences.prefersReducedData
  }
  
  shouldIncreaseContrast(): boolean {
    return this.preferences.prefersHighContrast || this.preferences.forcedColors === 'active'
  }
  
  shouldReduceTransparency(): boolean {
    return this.preferences.prefersReducedTransparency
  }
  
  getOptimalAnimationLevel(): AnimationLevel {
    if (this.shouldReduceMotion()) return 'minimal'
    if (this.shouldReduceData()) return 'reduced'
    return 'full'
  }
  
  cleanup() {
    this.mediaQueryListeners.forEach(mql => {
      mql.removeEventListener('change', () => {})
    })
    this.mediaQueryListeners = []
  }
}

// Types
interface AccessibilityPreferences {
  prefersReducedMotion: boolean
  prefersReducedData: boolean
  prefersHighContrast: boolean
  prefersReducedTransparency: boolean
  colorScheme: 'light' | 'dark'
  forcedColors: 'active' | 'none'
}

type AnimationLevel = 'minimal' | 'reduced' | 'full'

// Accessible Animation Variants
export const accessibleAnimations = {
  // Minimal motion variants (respects prefers-reduced-motion)
  minimal: {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: TIMING.QUICK, ease: 'easeOut' }
      },
    } as Variants,
    
    slideUp: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: TIMING.QUICK, ease: 'easeOut' }
      },
    } as Variants,
    
    scaleIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: TIMING.QUICK, ease: 'easeOut' }
      },
    } as Variants,
  },
  
  // Reduced motion variants (simplified but still some movement)
  reduced: {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: TIMING.BEAT * 0.5, ease: 'easeOut' }
      },
    } as Variants,
    
    slideUp: {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1,
        y: 0,
        transition: { duration: TIMING.BEAT * 0.5, ease: 'easeOut' }
      },
    } as Variants,
    
    scaleIn: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: { 
        opacity: 1,
        scale: 1,
        transition: { duration: TIMING.BEAT * 0.5, ease: 'easeOut' }
      },
    } as Variants,
  },
  
  // Full motion variants (for users who don't prefer reduced motion)
  full: {
    // These would use the full electronic music animations
    // (already defined in electronic-music-animations.ts)
  },
}

// Accessibility-Aware Animation Helper
export function getAccessibleVariant(
  variantName: keyof typeof accessibleAnimations.minimal,
  fullVariant?: Variants
): Variants {
  const manager = AccessibilityManager.getInstance()
  const level = manager.getOptimalAnimationLevel()
  
  switch (level) {
    case 'minimal':
      return accessibleAnimations.minimal[variantName]
    case 'reduced':
      return accessibleAnimations.reduced[variantName]
    case 'full':
      return fullVariant || accessibleAnimations.reduced[variantName]
    default:
      return accessibleAnimations.minimal[variantName]
  }
}

// High Contrast Mode Adaptations
export const highContrastStyles = {
  // Button styles for high contrast
  button: {
    normal: {
      border: '2px solid currentColor',
      backgroundColor: 'transparent',
      color: 'currentColor',
    },
    hover: {
      backgroundColor: 'currentColor',
      color: 'CanvasText',
    },
    focus: {
      outline: '3px solid Highlight',
      outlineOffset: '2px',
    },
  },
  
  // Card styles for high contrast
  card: {
    normal: {
      border: '1px solid currentColor',
      backgroundColor: 'Canvas',
      color: 'CanvasText',
    },
    hover: {
      borderWidth: '2px',
      backgroundColor: 'Canvas',
    },
  },
  
  // Link styles for high contrast
  link: {
    normal: {
      color: 'LinkText',
      textDecoration: 'underline',
    },
    visited: {
      color: 'VisitedText',
    },
    hover: {
      color: 'LinkText',
      backgroundColor: 'Highlight',
    },
    focus: {
      outline: '2px solid Highlight',
      outlineOffset: '1px',
    },
  },
}

// Focus Management for Screen Readers
export class FocusManager {
  private static instance: FocusManager
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')
  
  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager()
    }
    return FocusManager.instance
  }
  
  // Announce changes to screen readers
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (typeof document === 'undefined') return
    
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Clean up after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }
  
  // Trap focus within a container (for modals, etc.)
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(this.focusableSelectors)
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    
    // Focus first element
    firstFocusable?.focus()
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }
  
  // Restore focus to previously focused element
  restoreFocus(previousElement: HTMLElement | null) {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }
  
  // Skip to main content (for keyboard navigation)
  skipToMainContent() {
    const mainContent = document.querySelector('main, [role="main"], #main-content')
    if (mainContent instanceof HTMLElement) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Animation Performance Monitor for Accessibility
export class AccessibilityPerformanceMonitor {
  private frameDropCount = 0
  private animationCount = 0
  private isMonitoring = false
  
  startMonitoring() {
    if (this.isMonitoring) return
    this.isMonitoring = true
    this.monitorAnimations()
  }
  
  stopMonitoring() {
    this.isMonitoring = false
  }
  
  private monitorAnimations() {
    if (!this.isMonitoring) return
    
    let lastTime = performance.now()
    
    const checkFrame = (currentTime: number) => {
      if (!this.isMonitoring) return
      
      const deltaTime = currentTime - lastTime
      
      // If frame took longer than 16.67ms (60fps), it's a dropped frame
      if (deltaTime > 16.67) {
        this.frameDropCount++
        
        // If too many frames are dropped, suggest reducing animations
        if (this.frameDropCount > 10 && this.animationCount > 5) {
          this.suggestAccessibilityMode()
        }
      }
      
      lastTime = currentTime
      requestAnimationFrame(checkFrame)
    }
    
    requestAnimationFrame(checkFrame)
  }
  
  private suggestAccessibilityMode() {
    if (typeof window === 'undefined') return
    
    // Dispatch event suggesting reduced motion for performance
    window.dispatchEvent(new CustomEvent('suggestReducedMotion', {
      detail: {
        reason: 'performance',
        frameDropCount: this.frameDropCount,
        animationCount: this.animationCount
      }
    }))
    
    // Announce to screen readers
    FocusManager.getInstance().announceToScreenReader(
      'Animations have been simplified for better performance',
      'polite'
    )
  }
  
  incrementAnimationCount() {
    this.animationCount++
  }
  
  decrementAnimationCount() {
    this.animationCount = Math.max(0, this.animationCount - 1)
  }
}

// React Hook for Accessibility Preferences
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = React.useState<AccessibilityPreferences>(() => {
    return AccessibilityManager.getInstance().getPreferences()
  })
  
  React.useEffect(() => {
    const manager = AccessibilityManager.getInstance()
    
    const handlePreferenceChange = (event: CustomEvent) => {
      setPreferences(event.detail)
    }
    
    window.addEventListener('accessibilityPreferencesChanged', handlePreferenceChange as EventListener)
    
    return () => {
      window.removeEventListener('accessibilityPreferencesChanged', handlePreferenceChange as EventListener)
    }
  }, [])
  
  return preferences
}

// Export singleton instances
export const accessibilityManager = AccessibilityManager.getInstance()
export const focusManager = FocusManager.getInstance()
export const performanceMonitor = new AccessibilityPerformanceMonitor()

// Utility function to create accessible animation variants
export function createAccessibleVariant(
  fullVariant: Variants,
  reducedVariant?: Partial<Variants>,
  minimalVariant?: Partial<Variants>
): Variants {
  const manager = AccessibilityManager.getInstance()
  const level = manager.getOptimalAnimationLevel()
  
  switch (level) {
    case 'minimal':
      return { ...fullVariant, ...minimalVariant } as Variants
    case 'reduced':
      return { ...fullVariant, ...reducedVariant } as Variants
    case 'full':
    default:
      return fullVariant
  }
}