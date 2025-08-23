'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface MassiveScrollTransitionProps {
  heroId?: string
  nextSectionId?: string
}

export function MassiveScrollTransition({ 
  heroId = 'hero', 
  nextSectionId = 'shows' 
}: MassiveScrollTransitionProps) {
  const transitionRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Performance defaults for smooth 60fps
      gsap.defaults({ force3D: true, lazy: false })

      // MASSIVE HERO FADE OUT with dramatic scale
      ScrollTrigger.create({
        trigger: `#${heroId}`,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        animation: gsap.timeline()
          .to(`#${heroId}`, {
            opacity: 0,
            scale: 0.8,
            y: -100,
            filter: "blur(8px)",
            ease: "power2.out",
            force3D: true
          })
          .to(`#${heroId} .hero-bg`, {
            scale: 1.3,
            opacity: 0.3,
            ease: "power1.out"
          }, 0)
      })

      // CINEMATIC NEXT SECTION ENTRANCE
      ScrollTrigger.create({
        trigger: `#${nextSectionId}`,
        start: "top bottom",
        end: "top 20%",
        scrub: 1.5,
        animation: gsap.timeline()
          .fromTo(`#${nextSectionId}`, 
            {
              y: 200,
              opacity: 0,
              scale: 0.9,
              rotationX: 15
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationX: 0,
              ease: "power3.out",
              force3D: true
            }
          )
      })

      // PARALLAX BACKGROUND LAYERS
      ScrollTrigger.create({
        trigger: `#${heroId}`,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        animation: gsap.timeline()
          .to(`#${heroId} .background-layer-1`, {
            yPercent: -30,
            ease: "none"
          })
          .to(`#${heroId} .background-layer-2`, {
            yPercent: -50,
            ease: "none"
          }, 0)
          .to(`#${heroId} .background-layer-3`, {
            yPercent: -70,
            ease: "none"
          }, 0)
      })

      // PARTICLE EXPLOSION EFFECT
      if (particlesRef.current) {
        const particles = Array.from({ length: 50 }, (_, i) => {
          const particle = document.createElement('div')
          particle.className = 'transition-particle'
          particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #00ffff, #8b5cf6);
            border-radius: 50%;
            pointer-events: none;
          `
          particlesRef.current?.appendChild(particle)
          return particle
        })

        ScrollTrigger.create({
          trigger: `#${nextSectionId}`,
          start: "top bottom",
          end: "top center",
          onToggle: (self) => {
            if (self.isActive) {
              // Animate particles
              particles.forEach((particle, i) => {
                gsap.set(particle, {
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight,
                  opacity: 0
                })
                
                gsap.to(particle, {
                  y: -100,
                  opacity: 1,
                  duration: 2 + Math.random() * 2,
                  delay: i * 0.02,
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.to(particle, {
                      opacity: 0,
                      duration: 0.5
                    })
                  }
                })
              })
            }
          }
        })
      }

      // COLOR WAVE TRANSITION
      ScrollTrigger.create({
        trigger: `#${nextSectionId}`,
        start: "top bottom",
        end: "top center",
        scrub: 1,
        animation: gsap.timeline()
          .fromTo('.color-wave', 
            {
              scaleY: 0,
              transformOrigin: "bottom center"
            },
            {
              scaleY: 1,
              ease: "power3.out"
            }
          )
      })

      // DRAMATIC TEXT REVEALS in next section
      ScrollTrigger.batch(`#${nextSectionId} .reveal-text`, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            {
              opacity: 0,
              y: 100,
              rotationX: 45
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: "back.out(1.7)",
              force3D: true
            }
          )
        },
        start: "top 85%"
      })

      // ENERGY PULSE EFFECT
      ScrollTrigger.create({
        trigger: `#${nextSectionId}`,
        start: "top 80%",
        onEnter: () => {
          const pulse = gsap.timeline()
          pulse.to('.energy-pulse', {
            scale: 3,
            opacity: 0,
            duration: 2,
            ease: "power2.out"
          })
        }
      })

    }, transitionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [heroId, nextSectionId])

  return (
    <div ref={transitionRef} className="fixed inset-0 pointer-events-none z-30">
      {/* Particle Container */}
      <div ref={particlesRef} className="absolute inset-0" />
      
      {/* Color Wave Overlay */}
      <div className="color-wave absolute inset-0 bg-gradient-to-t from-brand-neon/10 via-brand-purple/5 to-transparent" />
      
      {/* Energy Pulse */}
      <div className="energy-pulse absolute top-1/2 left-1/2 w-4 h-4 bg-brand-neon rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0" />
      
      {/* Circuit Line Effect */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#00ffff', stopOpacity: 0}} />
            <stop offset="50%" style={{stopColor: '#00d4ff', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0}} />
          </linearGradient>
        </defs>
        <path
          className="circuit-path"
          d="M0,50 Q25,25 50,50 T100,50"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          fill="none"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset="100"
          style={{ 
            animation: 'drawCircuit 4s ease-in-out infinite',
            transformOrigin: 'center'
          }}
        />
      </svg>
      
      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes drawCircuit {
          0% { stroke-dashoffset: 100; opacity: 0; }
          25% { opacity: 1; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          75% { opacity: 1; }
          100% { stroke-dashoffset: -100; opacity: 0; }
        }
      `}</style>
    </div>
  )
}