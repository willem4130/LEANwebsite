'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Electronic Music Hero Animations
 * Creates a professional entrance sequence for electronic music artists
 */
export const createHeroAnimations = () => {
  const tl = gsap.timeline()
  
  // Set initial states
  gsap.set('.hero-artist-name', { 
    opacity: 0, 
    scale: 0.8, 
    y: 100,
    filter: 'blur(20px)'
  })
  
  gsap.set('.hero-tagline', { 
    opacity: 0, 
    y: 50,
    filter: 'blur(10px)'
  })
  
  gsap.set('.hero-cta', { 
    opacity: 0, 
    scale: 0.9,
    y: 30
  })
  
  gsap.set('.hero-background', {
    scale: 1.1,
    opacity: 0.7
  })

  // Background entrance
  tl.to('.hero-background', {
    duration: 2,
    scale: 1,
    opacity: 1,
    ease: 'power2.out'
  })
  
  // Artist name dramatic entrance
  .to('.hero-artist-name', {
    duration: 1.5,
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    ease: 'back.out(1.7)',
  }, '-=1')
  
  // Add electric glow effect
  .to('.hero-artist-name', {
    duration: 0.8,
    textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff',
    ease: 'power2.inOut',
    repeat: 1,
    yoyo: true
  }, '-=0.5')
  
  // Tagline smooth entrance
  .to('.hero-tagline', {
    duration: 1,
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    ease: 'power2.out'
  }, '-=0.5')
  
  // CTA button with bounce
  .to('.hero-cta', {
    duration: 0.8,
    opacity: 1,
    scale: 1,
    y: 0,
    ease: 'back.out(1.4)'
  }, '-=0.3')
  
  // Floating animation loop for artist name
  .to('.hero-artist-name', {
    duration: 4,
    y: -10,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  }, '+=0.5')

  return tl
}

/**
 * Scroll-triggered section animations
 * Creates smooth transitions between sections
 */
export const createScrollAnimations = () => {
  // Section fade-in animations
  gsap.utils.toArray('.section-container').forEach((section: any, index) => {
    gsap.set(section, { 
      opacity: 0, 
      y: 100,
      scale: 0.95 
    })
    
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
      },
      onEnterBack: () => {
        gsap.to(section, {
          duration: 1,
          opacity: 1,
          scale: 1,
          ease: 'power2.out'
        })
      }
    })
  })

  // Gallery items stagger animation
  gsap.utils.toArray('.gallery-item').forEach((item: any, index) => {
    gsap.set(item, { 
      opacity: 0, 
      scale: 0.8,
      rotation: -5
    })
    
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(item, {
          duration: 0.8,
          opacity: 1,
          scale: 1,
          rotation: 0,
          ease: 'back.out(1.4)',
          delay: index * 0.1
        })
      }
    })
  })

  // Contact form elegant entrance
  ScrollTrigger.create({
    trigger: '.contact-section',
    start: 'top 70%',
    onEnter: () => {
      const tl = gsap.timeline()
      
      tl.fromTo('.contact-title', 
        { opacity: 0, y: 50 },
        { duration: 1, opacity: 1, y: 0, ease: 'power2.out' }
      )
      .fromTo('.contact-form input, .contact-form textarea', 
        { opacity: 0, x: -30 },
        { 
          duration: 0.6, 
          opacity: 1, 
          x: 0, 
          ease: 'power2.out',
          stagger: 0.1 
        }, '-=0.5'
      )
      .fromTo('.contact-form button', 
        { opacity: 0, scale: 0.8 },
        { 
          duration: 0.8, 
          opacity: 1, 
          scale: 1, 
          ease: 'back.out(1.4)' 
        }, '-=0.3'
      )
    }
  })
}

/**
 * Enhanced button hover animations
 */
export const createButtonAnimations = () => {
  gsap.utils.toArray('.gsap-button').forEach((button: any) => {
    const originalScale = 1
    
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        duration: 0.3,
        scale: 1.05,
        y: -2,
        boxShadow: '0 10px 25px rgba(0, 212, 255, 0.3)',
        ease: 'power2.out'
      })
    })
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        duration: 0.3,
        scale: originalScale,
        y: 0,
        boxShadow: '0 4px 15px rgba(0, 212, 255, 0.1)',
        ease: 'power2.out'
      })
    })
    
    button.addEventListener('mousedown', () => {
      gsap.to(button, {
        duration: 0.1,
        scale: 0.95,
        ease: 'power2.out'
      })
    })
    
    button.addEventListener('mouseup', () => {
      gsap.to(button, {
        duration: 0.1,
        scale: 1.05,
        ease: 'power2.out'
      })
    })
  })
}

/**
 * Parallax scroll effects for backgrounds
 */
export const createParallaxAnimations = () => {
  gsap.utils.toArray('.parallax-bg').forEach((bg: any) => {
    ScrollTrigger.create({
      trigger: bg,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(bg, {
          y: progress * -100,
          opacity: 1 - progress * 0.3
        })
      }
    })
  })
}

/**
 * Initialize all GSAP animations
 */
export const initializeGSAPAnimations = () => {
  if (typeof window === 'undefined') return

  // Clear existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  
  // Initialize animations
  setTimeout(() => {
    createHeroAnimations()
    createScrollAnimations()
    createButtonAnimations()
    createParallaxAnimations()
  }, 100)
}

/**
 * Clean up GSAP animations
 */
export const cleanupGSAPAnimations = () => {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    gsap.globalTimeline.clear()
  }
}