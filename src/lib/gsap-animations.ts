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
 * Spectacular Hero-to-Section Transition
 */
export const createSpectacularHeroTransition = () => {
  const heroSection = document.querySelector('#hero')
  const firstSection = document.querySelector('.section-container:first-of-type')
  
  if (!heroSection || !firstSection) return

  // Create the spectacular transition effects
  ScrollTrigger.create({
    trigger: firstSection,
    start: 'top 100%',
    end: 'top 20%',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress
      
      // Hero section fade and scale
      gsap.set(heroSection, {
        opacity: 1 - progress * 0.7,
        scale: 1 - progress * 0.1,
        y: -progress * 100,
        filter: `blur(${progress * 20}px) brightness(${1 - progress * 0.3})`
      })
    }
  })

  // Spectacular entrance animation for first section
  ScrollTrigger.create({
    trigger: firstSection,
    start: 'top 120%',
    end: 'top 50%',
    onEnter: () => {
      // Create multiple dramatic effects
      const timeline = gsap.timeline()
      
      // 1. Lightning flash effect
      const flash = document.createElement('div')
      flash.className = 'lightning-flash fixed inset-0 pointer-events-none z-40'
      flash.style.background = 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)'
      flash.style.opacity = '0'
      document.body.appendChild(flash)
      
      // 2. Electric surge lines (multiple)
      const surgeContainer = document.createElement('div')
      surgeContainer.className = 'electric-surges fixed inset-0 pointer-events-none z-50'
      surgeContainer.innerHTML = `
        <div class="surge-line-1 absolute top-1/3 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent opacity-0 shadow-md shadow-teal-400/30"></div>
        <div class="surge-line-2 absolute top-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 shadow-md shadow-cyan-400/30"></div>
        <div class="surge-line-3 absolute top-2/3 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-0 shadow-md shadow-purple-400/30"></div>
      `
      document.body.appendChild(surgeContainer)
      
      // 3. Particle burst effect
      const particles = document.createElement('div')
      particles.className = 'particle-burst fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-45'
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div')
        particle.className = 'absolute w-2 h-2 bg-teal-400/60 rounded-full opacity-0'
        particle.style.left = '0px'
        particle.style.top = '0px'
        particles.appendChild(particle)
      }
      document.body.appendChild(particles)

      // Execute spectacular sequence - UNIQUE HERO TRANSITION
      timeline
        // 1. Digital Matrix Rain Effect
        .add(() => {
          const matrix = document.createElement('div')
          matrix.className = 'matrix-rain fixed inset-0 pointer-events-none z-45'
          for (let i = 0; i < 20; i++) {
            const column = document.createElement('div')
            column.className = 'absolute top-0 opacity-0'
            column.style.left = `${i * 5}%`
            column.style.width = '2px'
            column.style.height = '100%'
            column.style.background = `linear-gradient(to bottom, transparent, ${['rgba(20, 184, 166, 0.4)', 'rgba(34, 211, 238, 0.4)', 'rgba(168, 85, 247, 0.4)'][i % 3]}, transparent)`
            matrix.appendChild(column)
          }
          document.body.appendChild(matrix)
          
          gsap.to(matrix.children, {
            opacity: 0.7,
            y: '100vh',
            duration: 2,
            ease: 'none',
            stagger: 0.1,
            onComplete: () => matrix.remove()
          })
        })
        
        // 2. Lightning flash with screen shake
        .to(flash, { opacity: 1, duration: 0.1 })
        .add(() => {
          gsap.to('body', {
            x: '+=5',
            yoyo: true,
            repeat: 3,
            duration: 0.1
          })
        }, '-=0.1')
        .to(flash, { opacity: 0, duration: 0.3 })
        
        // 3. Holographic Scan Lines (different from circuit traces)
        .add(() => {
          const scanLines = document.createElement('div')
          scanLines.className = 'holographic-scan fixed inset-0 pointer-events-none z-50'
          scanLines.innerHTML = `
            <div class="scan-1 absolute w-full h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent top-1/4 opacity-0 shadow-sm shadow-teal-400/20"></div>
            <div class="scan-2 absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent top-1/2 opacity-0 shadow-sm shadow-cyan-400/20"></div>
            <div class="scan-3 absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent top-3/4 opacity-0 shadow-sm shadow-purple-400/20"></div>
          `
          document.body.appendChild(scanLines)
          
          gsap.timeline()
            .to('.scan-1', { opacity: 1, duration: 0.2 })
            .to('.scan-1', { scaleX: 5, duration: 0.8, ease: 'power2.out' }, '+=0.1')
            .to('.scan-2', { opacity: 1, duration: 0.2 }, '-=0.5')
            .to('.scan-2', { scaleX: 5, duration: 1.0, ease: 'power2.out' }, '+=0.1')
            .to('.scan-3', { opacity: 1, duration: 0.2 }, '-=0.7')
            .to('.scan-3', { scaleX: 5, duration: 0.9, ease: 'power2.out' }, '+=0.1')
            .call(() => scanLines.remove(), [], '+=1')
        }, '-=0.2')
        
        // 4. Energy Orb Explosion (instead of particle burst)
        .add(() => {
          const orb = document.createElement('div')
          orb.className = 'energy-orb fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-45'
          orb.style.width = '20px'
          orb.style.height = '20px'
          orb.style.background = `
            radial-gradient(circle at 30% 30%, rgba(110, 231, 183, 0.8) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.6) 0%, transparent 60%),
            radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 80%)
          `
          orb.style.borderRadius = '50%'
          orb.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)'
          orb.style.opacity = '0'
          document.body.appendChild(orb)
          
          gsap.timeline()
            .to(orb, { opacity: 1, scale: 1, duration: 0.3 })
            .to(orb, { scale: 15, opacity: 0, duration: 1.5, ease: 'power2.out' })
            .call(() => orb.remove())
        }, '-=1')
        
        // 5. Section Iris Reveal (completely different entrance)
        .fromTo(firstSection, 
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
          }, '-=1.5')
        
        // 6. Glitch Effect Finale
        .add(() => {
          const glitchCount = 5
          for (let i = 0; i < glitchCount; i++) {
            gsap.delayedCall(i * 0.1, () => {
              gsap.to(firstSection, {
                x: Math.random() * 10 - 5,
                filter: `hue-rotate(${Math.random() * 360}deg) saturate(2)`,
                duration: 0.05,
                yoyo: true,
                repeat: 1
              })
            })
          }
        }, '-=0.5')
        
        // Cleanup
        .call(() => {
          setTimeout(() => {
            flash.remove()
            surgeContainer.remove()
            particles.remove()
          }, 1000)
        })
    },
    
    // Reverse animation when scrolling back up
    onLeave: () => {
      gsap.to(firstSection, {
        opacity: 0.7,
        y: 50,
        scale: 0.95,
        filter: 'blur(5px)',
        duration: 1,
        ease: 'power2.inOut'
      })
    },
    
    onEnterBack: () => {
      // Quick re-entrance when scrolling back down
      gsap.to(firstSection, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out'
      })
    },
    
    onLeaveBack: () => {
      // Hero comes back when scrolling up
      gsap.to(heroSection, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px) brightness(1)',
        duration: 0.6,
        ease: 'power2.out'
      })
      
      gsap.to(firstSection, {
        opacity: 0,
        y: 100,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power2.in'
      })
    }
  })
}

/**
 * Advanced Electronic Music Section Transitions  
 */
export const createAdvancedSectionTransitions = () => {
  // Create the spectacular hero transition first
  createSpectacularHeroTransition()
  
  // Enhanced Section Reveals for remaining sections
  gsap.utils.toArray('.section-container:not(:first-child)').forEach((section: any, index) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 140%',
      end: 'bottom 20%',
      onEnter: () => {
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
            duration: 3.5,
            ease: 'power3.out'
          }
        )
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