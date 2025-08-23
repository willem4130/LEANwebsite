'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { heroAnimations, getOptimizedTransition, prefersReducedMotion } from '@/lib/animations/electronic-music-animations'
import { createHeroAnimations } from '@/lib/gsap-animations'

interface SocialProof {
  monthlyListeners?: string
  venueCount?: string  
  pressFeature?: string
  festivals?: string[]
}

interface SecondaryCta {
  text: string
  link: string
}

interface ProfessionalInfo {
  venueTypes?: string
  availability?: string
  bookingStatus?: string
}

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
  secondaryCta?: SecondaryCta
  socialProof?: SocialProof
  professionalInfo?: ProfessionalInfo
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
  secondaryCta,
  socialProof,
  professionalInfo,
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
    // Delay loading state to allow for smooth entrance
    const loadTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 200)
    
    setIsReducedMotion(prefersReducedMotion())
    
    // Initialize GSAP background animations only
    const animTimer = setTimeout(() => {
      if (!prefersReducedMotion()) {
        createHeroAnimations()
      }
    }, 300)
    
    return () => {
      clearTimeout(loadTimer)
      clearTimeout(animTimer)
    }
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

  // Optimized animation variants with proper sequencing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.6,
        delayChildren: 0.4,
      },
    },
  }

  const artistNameVariants = {
    hidden: { 
      opacity: 0,
      y: 40,
      scale: 0.9,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: getOptimizedTransition({
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 25,
        stiffness: 120,
      }),
    },
  }

  const taglineVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: getOptimizedTransition({
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }),
    },
  }

  const ctaVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: getOptimizedTransition({
        duration: 0.6,
        ease: [0.68, -0.55, 0.265, 1.55],
      }),
    },
    hover: {
      scale: 1.05,
      transition: getOptimizedTransition({
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }),
    },
    tap: {
      scale: 0.98,
      transition: getOptimizedTransition({
        duration: 0.1,
      }),
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
      

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Artist Name/Logo with Electronic Music Entrance */}
        <motion.h1
          className="hero-artist-name text-artist-name mb-6 text-shadow-glow"
          style={{ 
            color: textColor,
            textShadow: `0 0 20px ${textColor}40, 0 0 40px ${textColor}20`,
          }}
          variants={artistNameVariants}
        >
          {artistName}
        </motion.h1>

        {/* Tagline with Filter Sweep Effect */}
        {tagline && (
          <motion.p
            className="hero-tagline font-display-secondary text-h3-mobile sm:text-h3-tablet lg:text-h3-desktop mb-8 opacity-90 text-shadow font-medium"
            style={{ 
              color: textColor,
              textShadow: `0 0 10px ${textColor}30`,
            }}
            variants={taglineVariants}
          >
            {tagline}
          </motion.p>
        )}

        {/* Social Media Links */}
        {socialProof && (
          <motion.div 
            className="hero-social-links flex flex-wrap justify-center items-center gap-3 mb-8"
            variants={{
              ...heroAnimations.tagline,
              visible: {
                ...heroAnimations.tagline.visible,
                transition: { ...getOptimizedTransition(heroAnimations.tagline.visible!.transition!), delay: 1.2 }
              }
            }}
          >
            <motion.a
              href="https://open.spotify.com/artist/arianova"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-neon/10 border border-brand-neon/20 text-brand-neon hover:bg-brand-neon/20 hover:border-brand-neon/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-4 h-4 rounded-full bg-brand-neon flex items-center justify-center">
                <span className="text-xs text-black font-bold">♪</span>
              </div>
              <span className="text-sm font-medium">Spotify</span>
            </motion.a>
            
            <motion.a
              href="https://instagram.com/arianova"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-electric/10 border border-brand-electric/20 text-brand-electric hover:bg-brand-electric/20 hover:border-brand-electric/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-4 h-4 rounded-full bg-brand-electric flex items-center justify-center">
                <span className="text-xs text-black font-bold">IG</span>
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </motion.a>

            <motion.a
              href="https://youtube.com/@arianova"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 hover:border-brand-purple/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-4 h-4 rounded-full bg-brand-purple flex items-center justify-center">
                <span className="text-xs text-black font-bold">▶</span>
              </div>
              <span className="text-sm font-medium">YouTube</span>
            </motion.a>
          </motion.div>
        )}

        {/* Single Centered CTA */}
        <motion.div 
          className="hero-cta flex justify-center items-center mb-8"
          variants={ctaVariants}
        >
          <motion.div whileHover="hover" whileTap="tap">
            <Button
              variant="premium"
              size="xl"
              asChild
              className={cn(
                "text-shadow hover:shadow-2xl min-w-48",
                "transition-all duration-300",
                "hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]",
                "focus:outline-none focus:ring-2 focus:ring-brand-neon/50"
              )}
            >
              <a href={secondaryCta?.link || "mailto:booking@arianova.com"} rel="noopener noreferrer">
                {secondaryCta?.text || "Contact Us"}
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Newsletter Subscription - UX Best Practices */}
        <motion.div 
          className="hero-newsletter max-w-md mx-auto"
          variants={{
            ...heroAnimations.cta,
            visible: {
              ...heroAnimations.cta.visible,
              transition: { ...getOptimizedTransition(heroAnimations.cta.visible!.transition!), delay: 1.8 }
            }
          }}
        >
          <div className="text-center mb-4">
            <p className="text-brand-text-secondary text-sm mb-2">
              Get exclusive updates & new releases
            </p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className={cn(
                "flex-1 px-4 py-3 rounded-full bg-brand-void/50 border border-brand-neon/20",
                "text-brand-text-primary placeholder-brand-text-secondary/70",
                "focus:outline-none focus:border-brand-neon/50 focus:ring-2 focus:ring-brand-neon/20",
                "transition-all duration-300 backdrop-blur-sm"
              )}
            />
            <Button
              variant="outline"
              size="default"
              className={cn(
                "px-6 border-brand-neon/40 text-brand-neon rounded-full",
                "hover:bg-brand-neon/10 hover:border-brand-neon",
                "focus:outline-none focus:ring-2 focus:ring-brand-neon/30",
                "transition-all duration-300 whitespace-nowrap"
              )}
            >
              Subscribe
            </Button>
          </div>
          
          <p className="text-xs text-brand-text-secondary/60 text-center mt-3">
            No spam, unsubscribe anytime. Privacy policy applies.
          </p>
        </motion.div>

      </motion.div>
    </section>
    </ComponentErrorBoundary>
  )
}