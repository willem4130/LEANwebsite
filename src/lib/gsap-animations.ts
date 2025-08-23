'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Electronic Music Hero Animations
 * DISABLED: Framer Motion handles hero animations to prevent conflicts
 * Only background effects are managed by GSAP
 */
export const createHeroAnimations = () => {
  const tl = gsap.timeline()
  
  // Only animate background - let Framer Motion handle text elements
  gsap.set('.hero-background', {
    scale: 1.05,
    opacity: 0.9
  })

  // Background entrance only
  tl.to('.hero-background', {
    duration: 2,
    scale: 1,
    opacity: 1,
    ease: 'power2.out'
  })

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
          y: 0,
          scale: 1,
          ease: 'power2.out'
        })
      },
      onLeaveBack: () => {
        gsap.to(section, {
          duration: 0.8,
          opacity: 0,
          y: 100,
          scale: 0.95,
          ease: 'power2.inOut'
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
 * Advanced Electronic Music Section Transitions
 */
export const createAdvancedSectionTransitions = () => {
  // Enhanced Section Reveals with Dramatic Entrance
  gsap.utils.toArray('.section-container').forEach((section: any, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 140%', // Start much earlier
      end: 'bottom 20%',
      onEnter: () => {
        // Dramatic wave reveal with scale and blur effects
        gsap.fromTo(section, 
          { 
            clipPath: 'polygon(0% 110%, 100% 110%, 100% 110%, 0% 110%)',
            opacity: 0.3,
            y: 60,
            scale: 0.95,
            filter: 'blur(8px) brightness(0.7)'
          },
          { 
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px) brightness(1)',
            duration: 3.5, // Even longer for more impact
            ease: 'power3.out'
          }
        )

        // Add electric surge effect for first transition (hero to section 2)
        if (index === 0) {
          const surge = document.createElement('div')
          surge.className = 'electric-surge fixed inset-0 pointer-events-none z-50'
          surge.innerHTML = `
            <div class="w-full h-1 bg-gradient-to-r from-transparent via-brand-neon to-transparent absolute top-1/2 transform -translate-y-1/2 opacity-0 shadow-lg shadow-brand-neon/50"></div>
          `
          document.body.appendChild(surge)
          
          gsap.timeline()
            .set(surge.firstElementChild, { scaleX: 0, opacity: 1 })
            .to(surge.firstElementChild, {
              scaleX: 1,
              duration: 1.5,
              ease: 'power2.out'
            })
            .to(surge.firstElementChild, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.out'
            })
            .call(() => surge.remove(), null, '+=0.5')
        }
      }
    })
  })

  // Enhanced Electric Circuit Trace Effects
  gsap.utils.toArray('.section-container').forEach((section: any, index) => {
    const circuitLine = document.createElement('div')
    circuitLine.className = 'circuit-line absolute inset-0 pointer-events-none z-40 will-change-transform'
    circuitLine.innerHTML = `
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 4px #00d4ff);">
        <defs>
          <linearGradient id="circuit-gradient-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00ffff;stop-opacity:0" />
            <stop offset="20%" style="stop-color:#00ffff;stop-opacity:0.9" />
            <stop offset="50%" style="stop-color:#00d4ff;stop-opacity:1" />
            <stop offset="80%" style="stop-color:#8b5cf6;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0" />
          </linearGradient>
          <filter id="glow-${index}">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path class="circuit-path" 
              d="M0,10 Q25,5 50,15 Q75,25 100,10" 
              stroke="url(#circuit-gradient-${index})" 
              stroke-width="3" 
              fill="none"
              pathLength="100"
              stroke-dasharray="100"
              stroke-dashoffset="100"
              opacity="0"
              filter="url(#glow-${index})"/>
        <path class="circuit-path-secondary" 
              d="M0,90 Q25,85 50,95 Q75,85 100,90" 
              stroke="url(#circuit-gradient-${index})" 
              stroke-width="2" 
              fill="none"
              pathLength="100"
              stroke-dasharray="100"
              stroke-dashoffset="100"
              opacity="0"
              filter="url(#glow-${index})"/>
      </svg>
    `
    
    if (section.parentNode) {
      section.parentNode.insertBefore(circuitLine, section)
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 150%', // Start even earlier for more dramatic effect
      onEnter: () => {
        const paths = circuitLine.querySelectorAll('.circuit-path, .circuit-path-secondary')
        
        // Staggered circuit activation
        gsap.timeline()
          .to(paths, {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            stagger: 0.3
          })
          .to(paths, {
            strokeDashoffset: 0,
            duration: 4, // Even longer for dramatic effect
            ease: 'power1.inOut',
            stagger: 0.2
          }, '-=0.5')
          .to(paths, {
            opacity: 0.3,
            duration: 2,
            ease: 'power2.out'
          }, '+=1')
      }
    })
  })

  // Smooth Holographic Scan Lines
  gsap.utils.toArray('.section-container').forEach((section: any) => {
    const scanLine = document.createElement('div')
    scanLine.className = 'scan-line absolute inset-0 pointer-events-none z-30 will-change-transform'
    scanLine.innerHTML = `
      <div class="w-full h-px bg-gradient-to-r from-transparent via-brand-neon to-transparent opacity-0 absolute top-0 left-0 shadow-sm shadow-brand-neon/30 will-change-transform"></div>
    `
    
    if (section.parentNode) {
      section.parentNode.insertBefore(scanLine, section)
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 110%', // Start earlier
      onEnter: () => {
        const line = scanLine.firstElementChild
        
        // Slower, smoother scan animation
        gsap.timeline()
          .set(line, { opacity: 0.7, top: '0%' })
          .to(line, {
            top: '100%',
            duration: 4.5, // Much slower
            ease: 'none', // Linear for steady scan
          })
          .to(line, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
          }, '-=0.8')
      }
    })
  })

  // Optimized Particle Field Transitions
  gsap.utils.toArray('.section-container').forEach((section: any, index) => {
    const particles = document.createElement('div')
    particles.className = 'particles absolute inset-0 pointer-events-none z-20 will-change-transform'
    
    // Create fewer, more optimized particles
    const particleCount = 8
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle absolute w-0.5 h-0.5 rounded-full opacity-0 will-change-transform'
      particle.style.backgroundColor = ['#00ffff', '#00d4ff', '#8b5cf6'][Math.floor(Math.random() * 3)]
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = (Math.random() * 60 + 20) + '%' // Keep particles in middle area
      particle.style.filter = 'blur(0.5px)'
      particles.appendChild(particle)
    }
    
    if (section.parentNode) {
      section.parentNode.insertBefore(particles, section)
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 140%', // Start much earlier
      onEnter: () => {
        // Gentle, flowing particle animation
        gsap.to(particles.children, {
          opacity: 0.4,
          scale: () => Math.random() * 1.5 + 0.8,
          x: () => (Math.random() - 0.5) * 100,
          y: () => (Math.random() - 0.5) * 80,
          rotation: () => Math.random() * 360,
          duration: 5, // Much longer
          ease: 'sine.inOut', // Smoother easing
          stagger: 0.3, // Slower stagger
          onComplete: () => {
            gsap.to(particles.children, {
              opacity: 0,
              duration: 2,
              ease: 'power2.out',
              stagger: 0.2
            })
          }
        })
      }
    })
  })
}

/**
 * Subtle Digital Enhancement Effects
 */
export const createGlitchTransitions = () => {
  gsap.utils.toArray('.section-container').forEach((section: any, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 100%', // Start earlier
      onEnter: () => {
        // Very subtle digital enhancement
        const tl = gsap.timeline()
        
        tl.to(section, {
          x: 1,
          duration: 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1
        })
        .to(section, {
          filter: 'hue-rotate(2deg) saturate(1.05) brightness(1.02)',
          duration: 0.8,
          ease: 'power1.inOut',
        }, 0)
        .to(section, {
          filter: 'hue-rotate(0deg) saturate(1) brightness(1)',
          duration: 1.2,
          ease: 'power1.out',
          delay: 2
        })
        .to(section, {
          x: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.5')
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
    createAdvancedSectionTransitions()
    createGlitchTransitions()
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