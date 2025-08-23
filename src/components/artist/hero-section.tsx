'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'color':
        return { backgroundColor }
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor} 0%, #667eea 100%)`
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
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
          "relative min-h-screen flex items-center justify-center overflow-hidden",
          className
        )}
        style={getBackgroundStyle()}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Artist Name/Logo */}
        <motion.h1
          className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 text-shadow"
          style={{ color: textColor }}
          variants={logoVariants}
        >
          {artistName}
        </motion.h1>

        {/* Tagline */}
        {tagline && (
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl mb-8 opacity-90 text-shadow"
            style={{ color: textColor }}
            variants={itemVariants}
          >
            {tagline}
          </motion.p>
        )}

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Button
            variant="artist"
            size="xl"
            asChild
            className="text-shadow hover:shadow-2xl"
          >
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              {ctaText}
            </a>
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          variants={itemVariants}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{
                y: [0, 12, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
    </ComponentErrorBoundary>
  )
}