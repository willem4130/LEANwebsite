'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'
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

interface ArtisticGalleryProps {
  items: GalleryItem[]
  title?: string
  backgroundColor?: string
  className?: string
}

export function ArtisticGallery({
  items,
  title,
  backgroundColor = '#1a1a2e',
  className,
}: ArtisticGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  // Create artistic masonry layout with different heights
  const getItemHeight = (index: number) => {
    const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-88']
    return heights[index % heights.length]
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-16 bg-card" style={{ backgroundColor }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">No images to display</p>
        </div>
      </div>
    )
  }

  return (
    <ComponentErrorBoundary componentName="Artistic Gallery">
      <section className={cn("relative min-h-screen", className)} style={{ backgroundColor }}>
        {/* No padding, no max-width - full screen */}
        <div className="w-full h-full">
          {title && (
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white text-center py-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h2>
          )}

          {/* FULLSCREEN Grid - WAY BIGGER IMAGES */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-screen"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative h-screen md:h-[50vh] lg:h-[33.33vh] cursor-pointer group overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  zIndex: 10,
                  transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1.0] }
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.4, 0.0, 0.2, 1.0]
                }}
                onClick={() => setSelectedImage(item)}
              >
                {/* MASSIVE Image/Video filling entire space */}
                <div className="absolute inset-0">
                  {item.type === 'video' ? (
                    <>
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.altText || item.caption || ''}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Play className="w-24 h-24 text-white drop-shadow-2xl" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.altText || item.caption || ''}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Caption Overlay */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white text-xl font-bold drop-shadow-2xl">{item.caption}</p>
                  </div>
                )}

                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
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
                  className="absolute -top-12 right-0 text-white hover:bg-white/20"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>

                {selectedImage.type === 'video' ? (
                  <video
                    src={selectedImage.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                ) : (
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.altText || selectedImage.caption || ''}
                    className="max-w-full max-h-[80vh] rounded-lg"
                  />
                )}

                {selectedImage.caption && (
                  <div className="mt-4 text-center">
                    <p className="text-white text-lg">{selectedImage.caption}</p>
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