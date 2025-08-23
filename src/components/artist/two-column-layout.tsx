'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, cn } from '@/lib/utils'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const columnVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  const eventVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <section
      className={cn("py-16 lg:py-24 relative overflow-hidden", className)}
      style={getBackgroundStyle()}
    >
      {/* Background overlay for better text readability */}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column - Tour Dates */}
          <motion.div variants={columnVariants} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Upcoming Shows
              </h2>
              
              {tourEvents.length > 0 ? (
                <div className="space-y-4">
                  {tourEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      variants={eventVariants}
                      className={cn(
                        "group relative p-6 rounded-lg border transition-all duration-300 hover:shadow-lg",
                        event.featured
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md"
                          : "bg-white/90 border-gray-200 hover:border-gray-300",
                        event.soldOut && "opacity-75"
                      )}
                    >
                      {event.featured && (
                        <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Featured
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {event.eventName}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{event.city}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {event.soldOut ? (
                            <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-semibold">
                              Sold Out
                            </div>
                          ) : event.ticketUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="group-hover:bg-purple-50 group-hover:border-purple-200"
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
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No upcoming shows scheduled</p>
                  <p className="text-sm">Check back soon for new dates!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Bio */}
          <motion.div variants={columnVariants} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
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
                className="prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: bioContent }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}