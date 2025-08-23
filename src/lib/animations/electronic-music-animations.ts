/**
 * Electronic Music Animation System
 * Specialized motion design for electronic music artist websites
 * Built on Framer Motion with performance optimization and accessibility
 */

import { Variants, Transition } from 'framer-motion'

// Electronic Music Timing Constants (based on typical BPM ranges 120-140)
export const TIMING = {
  // Ultra-fast micro-interactions (1/16 beat at 128 BPM = ~117ms)
  MICRO: 0.12,
  
  // Quick UI responses (1/8 beat at 128 BPM = ~234ms)
  QUICK: 0.25,
  
  // Standard transitions (1/4 beat at 128 BPM = ~469ms)
  BEAT: 0.5,
  
  // Measure-based animations (1 bar at 128 BPM = ~1875ms)
  MEASURE: 1.9,
  
  // Extended sequences (2 bars at 128 BPM = ~3750ms)
  SEQUENCE: 3.8,
  
  // Build-up animations (4 bars at 128 BPM = ~7500ms)
  BUILDUP: 7.5,
} as const

// Electronic Music Easing Curves
export const EASING = {
  // Sharp attack, quick decay (like electronic percussion)
  SYNTH_ATTACK: [0.25, 0.46, 0.45, 0.94],
  
  // Smooth filter sweep (like low-pass filter automation)
  FILTER_SWEEP: [0.23, 1, 0.32, 1],
  
  // Bouncy compression (like sidechain compression)
  SIDECHAIN: [0.68, -0.55, 0.265, 1.55],
  
  // Reverse reverb effect
  REVERSE_DELAY: [0.55, 0.085, 0.68, 0.53],
  
  // Analog-style smooth
  ANALOG_SMOOTH: [0.25, 0.1, 0.25, 1],
  
  // Digital step (quantized movement)
  DIGITAL_STEP: [0.5, 0, 0.5, 1],
  
  // Glitch effect (irregular timing)
  GLITCH: [0.55, 0.055, 0.675, 0.19],
} as const

// Performance Optimization Settings
export const PERFORMANCE = {
  // Mobile-optimized durations (30% faster)
  MOBILE_MULTIPLIER: 0.7,
  
  // GPU-accelerated properties only
  GPU_PROPERTIES: ['transform', 'opacity', 'filter'],
  
  // Reduced motion fallbacks
  REDUCED_MOTION_MULTIPLIER: 0.3,
  
  // Will-change optimization
  WILL_CHANGE: {
    TRANSFORM: 'transform',
    OPACITY: 'opacity',
    AUTO: 'auto',
  },
} as const

// Electronic Music Visual Effects
export const EFFECTS = {
  // Frequency analyzer visual representation
  FREQUENCY_BARS: {
    LOW: { scaleY: [1, 1.2, 1], duration: TIMING.BEAT },
    MID: { scaleY: [1, 1.5, 1], duration: TIMING.BEAT * 0.8 },
    HIGH: { scaleY: [1, 1.8, 1], duration: TIMING.BEAT * 0.6 },
  },
  
  // Pulsing beat indicator
  BEAT_PULSE: {
    scale: [1, 1.05, 1],
    duration: TIMING.BEAT,
    ease: EASING.SIDECHAIN,
    repeat: Infinity,
  },
  
  // Waveform visualization
  WAVEFORM: {
    pathLength: [0, 1],
    duration: TIMING.SEQUENCE,
    ease: EASING.ANALOG_SMOOTH,
  },
  
  // Glitch distortion
  GLITCH_DISTORT: {
    x: [0, -2, 3, -1, 0],
    skewX: [0, 1, -1, 0.5, 0],
    duration: TIMING.QUICK,
    ease: EASING.GLITCH,
  },
} as const

/**
 * Hero Section Animations - Electronic Music Entrance
 */
export const heroAnimations = {
  // Container with electronic build-up timing
  container: {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: TIMING.BUILDUP,
        staggerChildren: TIMING.BEAT,
        delayChildren: TIMING.MEASURE,
      },
    },
  } as Variants,

  // Artist name with synth attack
  artistName: {
    hidden: { 
      opacity: 0,
      y: 60,
      scale: 0.9,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: TIMING.SEQUENCE,
        ease: EASING.SYNTH_ATTACK,
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  } as Variants,

  // Tagline with filter sweep effect
  tagline: {
    hidden: { 
      opacity: 0,
      x: -40,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: TIMING.MEASURE,
        ease: EASING.FILTER_SWEEP,
        delay: TIMING.BEAT,
      },
    },
  } as Variants,

  // CTA with sidechain compression bounce
  cta: {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: TIMING.BEAT,
        ease: EASING.SIDECHAIN,
        delay: TIMING.MEASURE,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: TIMING.MICRO,
        ease: EASING.SYNTH_ATTACK,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: TIMING.MICRO * 0.5,
      },
    },
  } as Variants,

  // Animated scroll indicator with electronic pulse
  scrollIndicator: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: TIMING.SEQUENCE,
        duration: TIMING.BEAT,
      },
    },
    pulse: {
      y: [0, 12, 0],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: TIMING.MEASURE,
        repeat: Infinity,
        ease: EASING.ANALOG_SMOOTH,
      },
    },
  } as Variants,
}

/**
 * Gallery Animations - Visual Soundscape
 */
export const galleryAnimations = {
  // Grid container with frequency-based stagger
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: TIMING.QUICK,
        delayChildren: TIMING.BEAT * 0.5,
      },
    },
  } as Variants,

  // Gallery items with soundscape entrance
  item: {
    hidden: {
      opacity: 0,
      scale: 0.9,
      rotateY: 15,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        duration: TIMING.MEASURE,
        ease: EASING.FILTER_SWEEP,
      },
    },
    hover: {
      scale: 1.02,
      y: -8,
      rotateY: 2,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.SYNTH_ATTACK,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: TIMING.MICRO,
      },
    },
  } as Variants,

  // Category filters with beat sync
  filter: {
    inactive: {
      opacity: 0.7,
      scale: 1,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.ANALOG_SMOOTH,
      },
    },
    active: {
      opacity: 1,
      scale: 1.05,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.SYNTH_ATTACK,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: TIMING.MICRO,
      },
    },
  } as Variants,

  // Lightbox with reverse delay effect
  lightbox: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(20px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: TIMING.MEASURE,
        ease: EASING.REVERSE_DELAY,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
      transition: {
        duration: TIMING.BEAT,
        ease: EASING.DIGITAL_STEP,
      },
    },
  } as Variants,
}

/**
 * Contact Form Animations - Booking Confidence
 */
export const contactAnimations = {
  // Form container with professional timing
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: TIMING.BEAT * 0.3,
        delayChildren: TIMING.BEAT * 0.5,
      },
    },
  } as Variants,

  // Form fields with electronic precision
  formField: {
    hidden: {
      opacity: 0,
      x: -30,
      filter: 'blur(2px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: TIMING.MEASURE,
        ease: EASING.ANALOG_SMOOTH,
      },
    },
    focus: {
      scale: 1.02,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.SYNTH_ATTACK,
      },
    },
    error: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        duration: TIMING.BEAT,
        ease: EASING.GLITCH,
      },
    },
  } as Variants,

  // Submit button with confidence-building animation
  submitButton: {
    idle: {
      scale: 1,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.ANALOG_SMOOTH,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.SYNTH_ATTACK,
      },
    },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        duration: TIMING.BEAT,
        repeat: Infinity,
        ease: EASING.SIDECHAIN,
      },
    },
    success: {
      scale: [1, 1.1, 1],
      transition: {
        duration: TIMING.MEASURE,
        ease: EASING.SIDECHAIN,
      },
    },
  } as Variants,

  // Social links with electronic grid pattern
  socialGrid: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: TIMING.MICRO,
        delayChildren: TIMING.BEAT,
      },
    },
  } as Variants,

  socialItem: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateZ: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      transition: {
        duration: TIMING.BEAT,
        ease: EASING.SIDECHAIN,
      },
    },
    hover: {
      scale: 1.1,
      rotateZ: -2,
      transition: {
        duration: TIMING.QUICK,
        ease: EASING.SYNTH_ATTACK,
      },
    },
  } as Variants,
}

/**
 * Scroll-Based Storytelling Animations
 */
export const scrollAnimations = {
  // Section reveal with parallax effect
  sectionReveal: {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: TIMING.SEQUENCE,
        ease: EASING.FILTER_SWEEP,
      },
    },
  } as Variants,

  // Parallax layers for depth
  parallaxSlow: {
    y: [0, -50],
    transition: {
      duration: TIMING.BUILDUP,
      ease: "linear",
    },
  },

  parallaxFast: {
    y: [0, -100],
    transition: {
      duration: TIMING.BUILDUP,
      ease: "linear",
    },
  },
}

/**
 * Accessibility and Performance Helpers
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check if device is mobile for performance optimization
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Get optimized transition based on device and accessibility preferences
export const getOptimizedTransition = (transition: Transition): Transition => {
  const isReduced = prefersReducedMotion()
  const isMobile = isMobileDevice()

  if (isReduced) {
    return {
      ...transition,
      duration: typeof transition.duration === 'number' 
        ? transition.duration * PERFORMANCE.REDUCED_MOTION_MULTIPLIER 
        : transition.duration,
    }
  }

  if (isMobile && typeof transition.duration === 'number') {
    return {
      ...transition,
      duration: transition.duration * PERFORMANCE.MOBILE_MULTIPLIER,
    }
  }

  return transition
}

// Apply will-change optimization
export const applyWillChange = (element: HTMLElement, properties: string[]) => {
  element.style.willChange = properties.join(', ')
}

// Remove will-change after animation
export const removeWillChange = (element: HTMLElement) => {
  element.style.willChange = PERFORMANCE.WILL_CHANGE.AUTO
}

/**
 * Electronic Music Genre-Specific Presets
 */
export const genrePresets = {
  // Ambient/Downtempo - Slower, flowing movements
  ambient: {
    timingMultiplier: 1.5,
    easing: EASING.ANALOG_SMOOTH,
    effects: 'subtle',
  },

  // Techno/House - Sharp, rhythmic movements
  techno: {
    timingMultiplier: 0.8,
    easing: EASING.SYNTH_ATTACK,
    effects: 'strong',
  },

  // Experimental/IDM - Glitch and irregular timing
  experimental: {
    timingMultiplier: 1.2,
    easing: EASING.GLITCH,
    effects: 'complex',
  },

  // Trance - Building, sweeping movements
  trance: {
    timingMultiplier: 1.0,
    easing: EASING.FILTER_SWEEP,
    effects: 'buildup',
  },
} as const