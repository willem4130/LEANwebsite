'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
  animationDuration: number
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
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
        delay: 0.5,
      },
    },
  }

  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className
      )}
      style={getBackgroundStyle()}
    >
      {/* Video Background */}
      {backgroundType === 'video' && backgroundMedia?.url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundMedia.url} type="video/mp4" />
        </video>
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
  )
}