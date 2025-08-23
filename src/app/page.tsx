'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Play, Settings, Zap } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const techStackRef = useRef<HTMLDivElement>(null)
  const backgroundGradientRef = useRef<HTMLDivElement>(null)
  const backgroundOverlayRef = useRef<HTMLDivElement>(null)
  const backgroundCircle1Ref = useRef<HTMLDivElement>(null)
  const backgroundCircle2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Set initial states using refs only
    gsap.set([badgeRef.current, titleRef.current, descriptionRef.current, buttonsRef.current, noteRef.current], {
      opacity: 0,
      y: 50
    })
    
    gsap.set(featuresRef.current?.children || [], {
      opacity: 0,
      y: 100,
      scale: 0.8
    })

    gsap.set(techStackRef.current?.children || [], {
      opacity: 0,
      y: 50
    })

    // Set background elements initial state
    gsap.set([backgroundGradientRef.current, backgroundOverlayRef.current], {
      opacity: 0
    })

    gsap.set([backgroundCircle1Ref.current, backgroundCircle2Ref.current], {
      opacity: 0,
      scale: 0
    })

    // Simplified but effective animation sequence
    const tl = gsap.timeline()

    // Stage 1: Background effects (0-3s)
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    })
    .to(backgroundGradientRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out"
    })
    .to(backgroundOverlayRef.current, {
      opacity: 1,
      duration: 2,
      ease: "power2.out"
    }, "-=1")
    .to([backgroundCircle1Ref.current, backgroundCircle2Ref.current], {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.5
    }, "-=1")

    // Stage 2: Badge entrance (3-5s)
    .to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(2)"
    })

    // Stage 3: Title entrance (5-8s)
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      onStart: () => {
        // Animate each word separately
        const words = titleRef.current?.children
        if (words) {
          gsap.fromTo(words, 
            {
              opacity: 0,
              y: 50,
              rotationX: 45
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(2)"
            }
          )
        }
      }
    })

    // Stage 4: Description and buttons (8-12s)
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    })
    .to(buttonsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.5)"
    })
    .to(noteRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    })

    // Stage 5: Feature cards (12-16s)
    .to(featuresRef.current?.children || [], {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: "back.out(1.5)"
    })

    // Stage 6: Tech stack (16-18s)
    .to(techStackRef.current?.children || [], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out"
    })

    return () => {
      tl.kill()
    }
  }, [])

  // Advanced hover interactions
  const handleCardHover = (element: HTMLElement, enter: boolean) => {
    gsap.to(element, {
      scale: enter ? 1.08 : 1,
      rotationY: enter ? 5 : 0,
      z: enter ? 50 : 0,
      duration: 0.4,
      ease: "power2.out"
    })
  }

  const handleButtonHover = (element: HTMLElement, enter: boolean) => {
    gsap.to(element, {
      scale: enter ? 1.1 : 1,
      rotationX: enter ? 10 : 0,
      y: enter ? -5 : 0,
      duration: 0.3,
      ease: "back.out(2)"
    })
  }
  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black relative overflow-hidden" style={{opacity: 0}}>
      {/* Animated background elements */}
      <div ref={backgroundGradientRef} className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
      <div ref={backgroundOverlayRef} className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
      <div ref={backgroundCircle1Ref} className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
      <div ref={backgroundCircle2Ref} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-8 relative z-10 min-h-screen flex flex-col justify-center">
        <div ref={heroRef} className="text-center flex-1 flex flex-col justify-center">
          <div 
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm shadow-lg shadow-cyan-500/25 cursor-pointer"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.1,
                boxShadow: "0 0 40px rgba(34, 211, 238, 0.6)",
                duration: 0.3
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                boxShadow: "0 8px 25px rgba(34, 211, 238, 0.25)",
                duration: 0.3
              })
            }}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">Framework Ready</span>
          </div>
          
          <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4 leading-tight">
            <span>Music</span> <span>Artist</span> <span>Website</span>
          </h1>
          <p ref={descriptionRef} className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional music artist platform built with <span className="text-cyan-400 font-semibold">Next.js 14</span>, 
            <span className="text-purple-400 font-semibold"> Payload CMS</span>, and 
            <span className="text-pink-400 font-semibold"> shadcn/ui</span>.
          </p>
          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
              onMouseEnter={(e) => handleButtonHover(e.currentTarget as HTMLElement, true)}
              onMouseLeave={(e) => handleButtonHover(e.currentTarget as HTMLElement, false)}
            >
              <Link href="/demo" className="flex items-center gap-2 px-8 py-3">
                <Play className="w-5 h-5" />
                <span className="font-semibold">View Live Demo</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-200 shadow-lg shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm"
              onMouseEnter={(e) => handleButtonHover(e.currentTarget as HTMLElement, true)}
              onMouseLeave={(e) => handleButtonHover(e.currentTarget as HTMLElement, false)}
            >
              <Link href="/admin" className="flex items-center gap-2 px-8 py-3">
                <Settings className="w-5 h-5" />
                <span className="font-semibold">CMS Admin</span>
              </Link>
            </Button>
          </div>
          
          <p ref={noteRef} className="text-gray-400 text-sm mb-8 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 inline-block">
            <span className="text-amber-400">⚡</span> CMS requires database setup - see .env.example for configuration
          </p>
        </div>

        {/* Feature Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm shadow-lg shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
            onMouseEnter={(e) => handleCardHover(e.currentTarget as HTMLElement, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget as HTMLElement, false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-200 mb-2">Hero Animations</h3>
            <p className="text-gray-300 text-sm mb-3">
              Precise timing controls and background customization
            </p>
            <div className="text-xs text-cyan-400 font-medium">✓ Ready</div>
          </div>
          
          <div 
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm shadow-lg shadow-purple-500/10 transition-all duration-300 cursor-pointer"
            onMouseEnter={(e) => handleCardHover(e.currentTarget as HTMLElement, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget as HTMLElement, false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Dynamic Layouts</h3>
            <p className="text-gray-300 text-sm mb-3">
              Tour dates and bio with independent controls
            </p>
            <div className="text-xs text-purple-400 font-medium">✓ Ready</div>
          </div>
          
          <div 
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm shadow-lg shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
            onMouseEnter={(e) => handleCardHover(e.currentTarget as HTMLElement, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget as HTMLElement, false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
              <Play className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Media Gallery</h3>
            <p className="text-gray-300 text-sm mb-3">
              Grid, masonry layouts with category filtering
            </p>
            <div className="text-xs text-emerald-400 font-medium">✓ Ready</div>
          </div>
          
          <div 
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm shadow-lg shadow-amber-500/10 transition-all duration-300 cursor-pointer"
            onMouseEnter={(e) => handleCardHover(e.currentTarget as HTMLElement, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget as HTMLElement, false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-amber-200 mb-2">Contact System</h3>
            <p className="text-gray-300 text-sm mb-3">
              Validated forms with social media integration
            </p>
            <div className="text-xs text-amber-400 font-medium">✓ Ready</div>
          </div>
        </div>

        {/* Technical Stack */}
        <div ref={techStackRef} className="text-center mt-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">Built With Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              { name: 'Next.js 14', color: 'from-blue-400 to-cyan-400', border: 'border-cyan-400/50', text: 'text-cyan-300' },
              { name: 'shadcn/ui', color: 'from-purple-400 to-pink-400', border: 'border-purple-400/50', text: 'text-purple-300' },
              { name: 'Framer Motion', color: 'from-pink-400 to-red-400', border: 'border-pink-400/50', text: 'text-pink-300' },
              { name: 'TypeScript', color: 'from-blue-400 to-indigo-400', border: 'border-blue-400/50', text: 'text-blue-300' },
              { name: 'Tailwind CSS', color: 'from-teal-400 to-emerald-400', border: 'border-teal-400/50', text: 'text-teal-300' },
              { name: 'Radix UI', color: 'from-amber-400 to-orange-400', border: 'border-amber-400/50', text: 'text-amber-300' }
            ].map((tech) => (
              <div 
                key={tech.name} 
                className={`bg-gradient-to-r ${tech.color}/10 border ${tech.border} backdrop-blur-sm px-4 py-2 rounded-full ${tech.text} font-medium shadow-lg transition-all duration-300 cursor-pointer`}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.15,
                    y: -5,
                    rotationZ: Math.random() * 10 - 5,
                    boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)",
                    duration: 0.3,
                    ease: "back.out(2)"
                  })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    y: 0,
                    rotationZ: 0,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                  })
                }}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}