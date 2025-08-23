'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, cn } from '@/lib/utils'
import { scrollAnimations, getOptimizedTransition, prefersReducedMotion, TIMING } from '@/lib/animations/electronic-music-animations'

interface TourEvent {
  id: string
  eventName: string
  venue: string
  city: string
  date: string
  ticketUrl?: string
  soldOut: boolean
  featured: boolean
}

interface TwoColumnLayoutProps {
  tourEvents: TourEvent[]
  bioTitle: string
  bioContent: string
  bioImage?: {
    url: string
    alt?: string
  }
  backgroundType?: 'color' | 'gradient' | 'image' | 'video'
  backgroundColor?: string
  backgroundMedia?: {
    url: string
    alt?: string
  }
  className?: string
}

export function TwoColumnLayout({
  tourEvents,
  bioTitle,
  bioContent,
  bioImage,
  backgroundType = 'color',
  backgroundColor = '#ffffff',
  backgroundMedia,
  className,
}: TwoColumnLayoutProps) {
  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'color':
        return { backgroundColor }
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor} 0%, #f3f4f6 100%)`
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
      default:
        return { backgroundColor }
    }
  }

  // Electronic Music Storytelling Animations
  const containerVariants = {
    ...scrollAnimations.sectionReveal,
    visible: {
      ...scrollAnimations.sectionReveal.visible,
      transition: getOptimizedTransition({
        staggerChildren: TIMING.QUICK,
        delayChildren: 0.2,
      }),
    },
  }

  const bioVariants = {
    hidden: { 
      opacity: 0, 
      x: -60, 
      filter: 'blur(4px)' 
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: getOptimizedTransition({
        duration: 1.2,
        ease: [0.23, 1, 0.32, 1], // Filter sweep easing
      }),
    },
  }

  const tourVariants = {
    hidden: { 
      opacity: 0, 
      x: 60, 
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: getOptimizedTransition({
        duration: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94], // Synth attack easing
        staggerChildren: 0.15,
      }),
    },
  }

  const tourEventVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      rotateX: 15 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: getOptimizedTransition({
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Analog smooth
      }),
    },
    hover: {
      y: -5,
      rotateX: -2,
      scale: 1.02,
      transition: getOptimizedTransition({
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }),
    },
  }

  return (
    <section
      className={cn("py-16 lg:py-24 relative overflow-hidden", className)}
      style={getBackgroundStyle()}
    >
      {/* Background overlay for better text readability */}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/20 via-brand-electric/10 to-brand-purple/20 backdrop-blur-sm" />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, margin: "-100px" }}
        >
          {/* Left Column - Tour Dates */}
          <motion.div variants={tourVariants} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-hero mb-2">
                Upcoming Shows
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-brand-neon to-brand-electric rounded-full mb-6"></div>
              
              {tourEvents.length > 0 ? (
                <div className="space-y-4">
                  {tourEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      variants={tourEventVariants}
                      className={cn(
                        "group relative p-6 rounded-lg border transition-all duration-300 hover:shadow-xl backdrop-blur-sm",
                        event.featured
                          ? "bg-gradient-to-r from-brand-navy/90 via-brand-dark/80 to-brand-charcoal/90 border-brand-neon/40 shadow-lg shadow-brand-neon/10 hover:shadow-brand-neon/20"
                          : "bg-brand-charcoal/60 border-brand-electric/30 hover:border-brand-electric/60 hover:shadow-brand-electric/10",
                        event.soldOut && "opacity-75"
                      )}
                    >
                      {event.featured && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-brand-neon to-brand-electric text-brand-void text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-glow-pulse">
                          Featured
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-brand-text-hero">
                            {event.eventName}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-brand-text-secondary">
                            <MapPin className="w-4 h-4 text-brand-electric" />
                            <span>{event.venue}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-brand-text-secondary">
                            <Calendar className="w-4 h-4 text-brand-purple" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-brand-text-muted">
                            <Clock className="w-4 h-4 text-brand-coral" />
                            <span>{event.city}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {event.soldOut ? (
                            <div className="px-4 py-2 bg-brand-charcoal/80 text-brand-text-muted rounded-lg font-semibold border border-brand-muted/30">
                              Sold Out
                            </div>
                          ) : event.ticketUrl ? (
                            <Button
                              variant="professional"
                              size="sm"
                              asChild
                              className="group-hover:shadow-lg group-hover:shadow-brand-neon/20"
                            >
                              <a
                                href={event.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                Tickets
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          ) : (
                            <div className="px-4 py-2 bg-gradient-to-r from-brand-electric/20 to-brand-purple/20 text-brand-electric rounded-lg font-semibold border border-brand-electric/30">
                              Coming Soon
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-brand-text-secondary">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No upcoming shows scheduled</p>
                  <p className="text-sm">Check back soon for new dates!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Bio */}
          <motion.div variants={tourVariants} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-section-header text-brand-text-hero">
                {bioTitle}
              </h2>
              
              {bioImage && (
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={bioImage.url}
                    alt={bioImage.alt || 'Artist'}
                    className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              
              <div
                className="prose prose-lg prose-invert max-w-none text-brand-text-primary"
                dangerouslySetInnerHTML={{ __html: bioContent }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}