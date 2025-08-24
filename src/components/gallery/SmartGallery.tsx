'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  caption?: string
  category?: string[]
  featured: boolean
  altText?: string
}

interface SmartGalleryProps {
  items: GalleryItem[]
  title?: string
  backgroundColor?: string
  className?: string
}

export function SmartGallery({
  items,
  title,
  backgroundColor = '#1a1a2e',
  className,
}: SmartGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  // Smart sizing - select 5 images with dynamic sizes
  const smartItems = items.slice(0, 5)

  // Dynamic grid layout configurations for non-perfect alignment
  const getGridLayout = () => {
    return {
      gridTemplateAreas: `
        "main main secondary1"
        "main main secondary2"
        "tertiary1 tertiary2 secondary2"
      `,
      gridTemplateColumns: '2fr 2fr 1.5fr',
      gridTemplateRows: '1fr 1fr 1fr',
    }
  }

  // Assign grid areas to items with smart orientation
  const getGridArea = (index: number) => {
    const areas = ['main', 'secondary1', 'secondary2', 'tertiary1', 'tertiary2']
    return areas[index] || 'main'
  }

  // Dynamic aspect ratios for visual variety
  const getAspectRatio = (index: number, gridArea: string) => {
    switch (gridArea) {
      case 'main': return 'aspect-[4/3]'
      case 'secondary1': return 'aspect-square'
      case 'secondary2': return 'aspect-[3/4]'
      case 'tertiary1': return 'aspect-[16/9]'
      case 'tertiary2': return 'aspect-square'
      default: return 'aspect-video'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotate: Math.random() * 6 - 3 // Random slight rotation for organic feel
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as any,
      }
    }
  } as any

  if (!items || items.length === 0) {
    return (
      <div className="py-16 bg-card" style={{ backgroundColor }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">No images to display</p>
        </div>
      </div>
    )
  }

  const gridLayout = getGridLayout()

  return (
    <ComponentErrorBoundary componentName="Smart Gallery">
      <section className={cn("py-20 relative min-h-screen", className)} style={{ backgroundColor }}>
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/5 via-transparent to-brand-purple/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          {title && (
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-brand-neon to-brand-purple bg-clip-text text-transparent mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h2>
          )}

          {/* Smart Grid Layout - Fits Screen with Dynamic Sizing */}
          <motion.div
            className="w-full max-w-6xl mx-auto h-[80vh] grid gap-4"
            style={gridLayout}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {smartItems.map((item, index) => {
              const gridArea = getGridArea(index)
              const aspectRatio = getAspectRatio(index, gridArea)
              
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="relative cursor-pointer group overflow-hidden rounded-lg"
                  style={{ gridArea }}
                  whileHover={{ 
                    scale: 1.02,
                    zIndex: 10,
                    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1.0] }
                  }}
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image/Video Container */}
                  <div className={cn("relative w-full h-full overflow-hidden bg-gradient-to-br from-brand-dark/80 to-brand-navy/60", aspectRatio)}>
                    {item.type === 'video' ? (
                      <>
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.altText || item.caption || ''}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="w-12 h-12 text-white drop-shadow-2xl" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.altText || item.caption || ''}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Caption */}
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white font-semibold drop-shadow-lg text-sm">{item.caption}</p>
                      </div>
                    )}

                    {/* Border glow effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-neon/30 transition-colors duration-300 rounded-lg" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="relative max-w-6xl max-h-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-12 right-0 text-white hover:bg-white/20 hover:text-brand-neon transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {selectedImage.type === 'video' ? (
                  <video
                    src={selectedImage.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.altText || selectedImage.caption || ''}
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                  />
                )}

                {selectedImage.caption && (
                  <div className="mt-4 text-center">
                    <p className="text-white text-lg font-medium">{selectedImage.caption}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </ComponentErrorBoundary>
  )
}