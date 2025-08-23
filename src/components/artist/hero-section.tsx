'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { heroAnimations, getOptimizedTransition, prefersReducedMotion } from '@/lib/animations/electronic-music-animations'
import { createHeroAnimations } from '@/lib/gsap-animations'

interface HeroSectionProps {
  artistName: string
  tagline?: string
  backgroundType: 'color' | 'gradient' | 'image' | 'video'
  backgroundColor?: string
  backgroundMedia?: {
    url: string
    alt?: string
  }
  animationDuration: number | string
  ctaText: string
  ctaLink: string
  textColor?: string
  className?: string
}

export function HeroSection({
  artistName,
  tagline,
  backgroundType,
  backgroundColor = '#000000',
  backgroundMedia,
  animationDuration = 4,
  ctaText,
  ctaLink,
  textColor = '#ffffff',
  className,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [mediaLoading, setMediaLoading] = useState(true)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Input validation
  if (!artistName || !ctaText || !ctaLink) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">Hero section missing required information</p>
        </div>
      </div>
    )
  }

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    setIsReducedMotion(prefersReducedMotion())
    
    // Initialize GSAP animations after component mounts
    const timer = setTimeout(() => {
      if (!prefersReducedMotion()) {
        createHeroAnimations()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'color':
        return { backgroundColor }
      case 'gradient':
        return {
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #060609 0%, #0a0a0f 25%, #1a1a2e 75%, #2a2a3e 100%)
          `
        }
      case 'image':
        return backgroundMedia?.url
          ? {
              backgroundImage: `url(${backgroundMedia.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : { backgroundColor }
      case 'video':
        return { backgroundColor: '#000' }
      default:
        return { backgroundColor }
    }
  }

  // Use electronic music-specific animations with accessibility optimization
  const containerVariants = {
    ...heroAnimations.container,
    visible: {
      ...heroAnimations.container.visible,
      transition: getOptimizedTransition(heroAnimations.container.visible!.transition!),
    },
  }

  const artistNameVariants = {
    ...heroAnimations.artistName,
    visible: {
      ...heroAnimations.artistName.visible,
      transition: getOptimizedTransition(heroAnimations.artistName.visible!.transition!),
    },
  }

  const taglineVariants = {
    ...heroAnimations.tagline,
    visible: {
      ...heroAnimations.tagline.visible,
      transition: getOptimizedTransition(heroAnimations.tagline.visible!.transition!),
    },
  }

  const ctaVariants = {
    ...heroAnimations.cta,
    visible: {
      ...heroAnimations.cta.visible,
      transition: getOptimizedTransition(heroAnimations.cta.visible!.transition!),
    },
    hover: {
      ...heroAnimations.cta.hover,
      transition: getOptimizedTransition(heroAnimations.cta.hover!.transition!),
    },
    tap: {
      ...heroAnimations.cta.tap,
      transition: getOptimizedTransition(heroAnimations.cta.tap!.transition!),
    },
  }

  const scrollIndicatorVariants = {
    ...heroAnimations.scrollIndicator,
    visible: {
      ...heroAnimations.scrollIndicator.visible,
      transition: getOptimizedTransition(heroAnimations.scrollIndicator.visible!.transition!),
    },
    pulse: {
      ...heroAnimations.scrollIndicator.pulse,
      transition: getOptimizedTransition(heroAnimations.scrollIndicator.pulse!.transition!),
    },
  }

  return (
    <ComponentErrorBoundary 
      componentName="Hero Section"
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Hero Section Error</h3>
            <p className="text-gray-300 mb-4">The hero section couldn't load properly.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      }
    >
      <section
        className={cn(
          "hero-background relative min-h-screen flex items-center justify-center overflow-hidden",
          className
        )}
        style={getBackgroundStyle()}
        ref={heroRef}
      >
      {/* Video Background */}
      {backgroundType === 'video' && backgroundMedia?.url && !mediaError && (
        <>
          {mediaLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setMediaError(true)}
            onLoadStart={() => setMediaLoading(true)}
            onCanPlay={() => setMediaLoading(false)}
          >
            <source src={backgroundMedia.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}

      {/* Media Error Fallback */}
      {mediaError && backgroundType === 'video' && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Video failed to load</p>
          </div>
        </div>
      )}

      {/* Advanced Atmospheric Overlay System */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      
      {/* Floating Particle Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-neon/30 rounded-full animate-parallax-float" 
             style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-brand-electric/40 rounded-full animate-parallax-float" 
             style={{ animationDelay: '2s', animationDuration: '12s' }} />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-brand-purple/20 rounded-full animate-parallax-float" 
             style={{ animationDelay: '4s', animationDuration: '10s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-brand-coral/30 rounded-full animate-parallax-float" 
             style={{ animationDelay: '6s', animationDuration: '14s' }} />
      </div>
      
      {/* Pulsing Energy Ring */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-brand-neon/10 rounded-full animate-pulse" 
               style={{ animationDuration: '4s' }} />
          <div className="absolute inset-4 border border-brand-electric/5 rounded-full animate-pulse" 
               style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Artist Name/Logo with Electronic Music Entrance */}
        <motion.h1
          className="hero-artist-name text-artist-name mb-6 text-shadow-glow will-change-transform"
          style={{ 
            color: textColor,
            textShadow: `0 0 20px ${textColor}40, 0 0 40px ${textColor}20`,
          }}
          variants={artistNameVariants}
          onAnimationStart={() => {
            // Apply will-change for performance
            const element = document.querySelector('h1')
            if (element instanceof HTMLElement) {
              element.style.willChange = 'transform, opacity, filter'
            }
          }}
          onAnimationComplete={() => {
            // Remove will-change after animation
            const element = document.querySelector('h1')
            if (element instanceof HTMLElement) {
              element.style.willChange = 'auto'
            }
          }}
        >
          {artistName}
        </motion.h1>

        {/* Tagline with Filter Sweep Effect */}
        {tagline && (
          <motion.p
            className="hero-tagline font-display-secondary text-h3-mobile sm:text-h3-tablet lg:text-h3-desktop mb-8 opacity-90 text-shadow font-medium will-change-transform"
            style={{ 
              color: textColor,
              textShadow: `0 0 10px ${textColor}30`,
            }}
            variants={taglineVariants}
          >
            {tagline}
          </motion.p>
        )}

        {/* Premium CTA Buttons for Booking Agent Appeal */}
        <motion.div 
          className="hero-cta flex justify-center items-center"
          variants={ctaVariants}
        >
          <motion.div whileHover="hover" whileTap="tap">
            <Button
              variant="premium"
              size="xl"
              asChild
              className={cn(
                "text-shadow hover:shadow-2xl will-change-transform min-w-48",
                "transition-all duration-300",
                "hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]",
                "focus:outline-none focus:ring-2 focus:ring-brand-neon/50"
              )}
            >
              <a href="mailto:booking@arianova.com" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Electronic Music Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          variants={scrollIndicatorVariants}
          animate="pulse"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center relative overflow-hidden">
            {/* Outer glow effect */}
            <div 
              className="absolute inset-0 rounded-full" 
              style={{
                boxShadow: `0 0 20px ${textColor}20, inset 0 0 10px ${textColor}10`,
              }}
            />
            
            {/* Animated dot with electronic timing */}
            <motion.div
              className="w-1.5 h-3 bg-white rounded-full mt-2"
              style={{
                boxShadow: `0 0 8px ${textColor}, 0 0 16px ${textColor}80`,
              }}
              animate={isReducedMotion ? {} : {
                y: [0, 12, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={getOptimizedTransition({
                duration: 1.9, // Based on electronic music measure timing
                repeat: Infinity,
                ease: [0.25, 0.1, 0.25, 1], // Analog smooth curve
              })}
            />
            
            {/* Frequency visualization lines */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-px">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-px bg-white/30 rounded-full"
                  animate={isReducedMotion ? {} : {
                    height: [2, 6, 2],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={getOptimizedTransition({
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    ease: [0.25, 0.46, 0.45, 0.94], // Synth attack curve
                    delay: i * 0.1,
                  })}
                />
              ))}
            </div>
          </div>
          
          {/* Subtle "Scroll" text hint */}
          <motion.p
            className="text-xs text-white/50 mt-2 font-mono tracking-wider"
            animate={isReducedMotion ? {} : {
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={getOptimizedTransition({
              duration: 3.8,
              repeat: Infinity,
              ease: "linear",
            })}
          >
            SCROLL
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
    </ComponentErrorBoundary>
  )
}