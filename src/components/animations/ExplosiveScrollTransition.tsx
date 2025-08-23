'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ExplosiveScrollTransitionProps {
  heroId?: string
  nextSectionId?: string
}

export function ExplosiveScrollTransition({ 
  heroId = 'hero', 
  nextSectionId = 'shows' 
}: ExplosiveScrollTransitionProps) {
  const transitionRef = useRef<HTMLDivElement>(null)
  const fragmentsRef = useRef<HTMLDivElement>(null)
  const explosionRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Performance defaults
      gsap.defaults({ force3D: true, lazy: false })

      // Create fragment grid for screen-splitting effect
      if (fragmentsRef.current) {
        const gridSize = 8
        const fragments: HTMLDivElement[] = []
        
        for (let i = 0; i < gridSize * gridSize; i++) {
          const fragment = document.createElement('div')
          fragment.className = 'hero-fragment'
          fragment.style.cssText = `
            position: absolute;
            width: ${100 / gridSize}%;
            height: ${100 / gridSize}%;
            left: ${(i % gridSize) * (100 / gridSize)}%;
            top: ${Math.floor(i / gridSize) * (100 / gridSize)}%;
            background: linear-gradient(45deg, 
              rgba(0, 255, 255, 0.1) ${Math.random() * 100}%, 
              rgba(139, 92, 246, 0.1) ${Math.random() * 100}%);
            border: 1px solid rgba(0, 255, 255, 0.2);
            backdrop-filter: blur(2px);
            transform-origin: center;
            pointer-events: none;
            opacity: 0;
          `
          fragmentsRef.current?.appendChild(fragment)
          fragments.push(fragment)
        }

        // EXPLOSIVE SCREEN SPLIT TRANSITION - SCROLL TRIGGERED ONLY
        ScrollTrigger.create({
          trigger: `#${nextSectionId}`,
          start: "top 80%", // Trigger when second section is 80% down from top
          end: "top 50%",
          toggleActions: "play none none reverse", // Only play on scroll down
          once: true, // Only trigger once
          onEnter: () => {
            // HERO EXPLOSION - Screen splits into fragments
            fragments.forEach((fragment, i) => {
                const angle = (i / fragments.length) * Math.PI * 2
                const distance = 800 + Math.random() * 400
                const rotationX = Math.random() * 720 - 360
                const rotationY = Math.random() * 720 - 360
                const rotationZ = Math.random() * 720 - 360
                
                gsap.set(fragment, { opacity: 1 })
                
                gsap.to(fragment, {
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  rotationX: rotationX,
                  rotationY: rotationY,
                  rotationZ: rotationZ,
                  scale: Math.random() * 0.5 + 0.2,
                  opacity: 0,
                  duration: 2.5,
                  delay: Math.random() * 0.3,
                  ease: "power3.out",
                  force3D: true
                })
              })
              
              // SCREEN SHAKE EFFECT
              gsap.to('body', {
                x: '+=10',
                duration: 0.05,
                repeat: 15,
                yoyo: true,
                ease: "power2.inOut"
              })
              gsap.to('body', {
                y: '+=8',
                duration: 0.07,
                delay: 0.1,
                repeat: 12,
                yoyo: true,
                ease: "power2.inOut"
              })
              
              // Clean up shake
              gsap.to('body', {
                x: 0,
                y: 0,
                duration: 0.5,
                delay: 2,
                ease: "power2.out"
              })
          }
        })
      }

      // MASSIVE HERO DESTRUCTION with 3D perspective
      ScrollTrigger.create({
        trigger: `#${heroId}`,
        start: "bottom center",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Hero section 3D transformation and destruction
          gsap.set(`#${heroId}`, {
            perspective: 1000,
            rotationX: progress * 45,
            rotationY: progress * 20,
            scale: 1 - progress * 0.3,
            z: -progress * 500,
            opacity: 1 - progress * 1.2,
            filter: `blur(${progress * 8}px) contrast(${1 + progress * 0.5})`,
            transformOrigin: "center center"
          })
        }
      })

      // PORTAL WORMHOLE EFFECT
      if (portalRef.current) {
        const portalRings: HTMLDivElement[] = []
        for (let i = 0; i < 12; i++) {
          const ring = document.createElement('div')
          ring.className = 'portal-ring'
          ring.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${(i + 1) * 60}px;
            height: ${(i + 1) * 60}px;
            border: 2px solid rgba(0, 255, 255, ${0.8 - i * 0.06});
            border-radius: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: portalSpin ${3 + i * 0.5}s linear infinite;
          `
          portalRef.current?.appendChild(ring)
          portalRings.push(ring)
        }
        
        ScrollTrigger.create({
          trigger: `#${nextSectionId}`,
          start: "top 75%", // Trigger slightly after fragment explosion
          end: "top center",
          toggleActions: "play none none reverse",
          once: true,
          onEnter: () => {
            // Portal emergence
              portalRings.forEach((ring, i) => {
                gsap.to(ring, {
                  opacity: 1,
                  scale: 1.5,
                  duration: 2,
                  delay: i * 0.1,
                  ease: "power2.out"
                })
                gsap.to(ring, {
                  opacity: 0,
                  scale: 0.5,
                  duration: 1,
                  delay: 2 + i * 0.05,
                  ease: "power2.in"
                })
              })
          }
        })
      }

      // EXPLOSIVE PARTICLE SYSTEM
      if (explosionRef.current) {
        const particles: HTMLDivElement[] = []
        for (let i = 0; i < 150; i++) {
          const particle = document.createElement('div')
          particle.className = 'explosion-particle'
          particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: ${Math.random() > 0.5 ? 'linear-gradient(45deg, #00ffff, #ffffff)' : 'linear-gradient(45deg, #8b5cf6, #ff6b6b)'};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            box-shadow: 0 0 10px currentColor;
          `
          explosionRef.current?.appendChild(particle)
          particles.push(particle)
        }
        
        ScrollTrigger.create({
          trigger: `#${nextSectionId}`,
          start: "top 85%",
          toggleActions: "play none none reverse",
          once: true,
          onEnter: () => {
            particles.forEach((particle, i) => {
                const angle = (i / particles.length) * Math.PI * 2 + Math.random() * 0.5
                const distance = 200 + Math.random() * 600
                const startX = window.innerWidth * 0.5
                const startY = window.innerHeight * 0.6
                
                gsap.set(particle, {
                  x: startX,
                  y: startY,
                  opacity: 1,
                  scale: 0
                })
                
                gsap.to(particle, {
                  x: startX + Math.cos(angle) * distance,
                  y: startY + Math.sin(angle) * distance + Math.random() * 200,
                  scale: Math.random() * 1.5 + 0.5,
                  opacity: 0,
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.4,
                  ease: "power2.out",
                  force3D: true
                })
              })
          }
        })
      }

      // DRAMATIC NEXT SECTION EMERGENCE with zoom
      ScrollTrigger.create({
        trigger: `#${nextSectionId}`,
        start: "top bottom",
        end: "top center",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Next section dramatic entrance
          gsap.set(`#${nextSectionId}`, {
            scale: 0.4 + progress * 0.6,
            opacity: progress,
            rotationX: (1 - progress) * 30,
            y: (1 - progress) * 200,
            filter: `blur(${(1 - progress) * 10}px)`,
            transformOrigin: "center top"
          })
        }
      })

      // REALITY TEAR EFFECT
      const canvas = document.createElement('canvas')
      canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
      `
      document.body.appendChild(canvas)
      const canvasCtx = canvas.getContext('2d')
      
      const canvasTrigger = ScrollTrigger.create({
        trigger: `#${nextSectionId}`,
        start: "top 90%",
        end: "top 70%",
        onUpdate: (self) => {
          if (canvasCtx && canvas) {
            const progress = self.progress
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            
            // Reality tear effect
            canvasCtx.globalAlpha = progress
            canvasCtx.strokeStyle = '#00ffff'
            canvasCtx.lineWidth = 3
            canvasCtx.shadowBlur = 20
            canvasCtx.shadowColor = '#00ffff'
            
            // Draw zigzag tear
            canvasCtx.beginPath()
            const centerY = window.innerHeight * 0.5
            for (let x = 0; x < window.innerWidth; x += 20) {
              const y = centerY + Math.sin(x * 0.02 + progress * 10) * 50 * progress
              if (x === 0) canvasCtx.moveTo(x, y)
              else canvasCtx.lineTo(x, y)
            }
            canvasCtx.stroke()
            
            canvas.style.opacity = (progress > 0.5 ? (1 - progress) * 2 : progress * 2).toString()
          }
        }
      })
      
      // Clean up canvas after animation
      setTimeout(() => {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      }, 5000)

    }, transitionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [heroId, nextSectionId])

  return (
    <div ref={transitionRef} className="fixed inset-0 pointer-events-none z-50">
      {/* Fragment Container for Screen Splitting */}
      <div ref={fragmentsRef} className="absolute inset-0" />
      
      {/* Explosion Particle Container */}
      <div ref={explosionRef} className="absolute inset-0" />
      
      {/* Portal Effect Container */}
      <div ref={portalRef} className="absolute inset-0 flex items-center justify-center" />
      
      {/* Portal Animation Keyframes */}
      <style jsx>{`
        @keyframes portalSpin {
          0% { 
            transform: translate(-50%, -50%) rotate(0deg) scale(0.5);
            border-color: rgba(0, 255, 255, 0.8);
          }
          50% { 
            transform: translate(-50%, -50%) rotate(180deg) scale(1.2);
            border-color: rgba(139, 92, 246, 0.8);
          }
          100% { 
            transform: translate(-50%, -50%) rotate(360deg) scale(0.5);
            border-color: rgba(0, 255, 255, 0.8);
          }
        }
        
        .portal-ring {
          filter: drop-shadow(0 0 10px currentColor);
        }
        
        .hero-fragment {
          transition: all 0.3s ease;
        }
        
        .explosion-particle {
          filter: drop-shadow(0 0 5px currentColor);
        }
      `}</style>
    </div>
  )
}