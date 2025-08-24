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
      <section className={cn("relative min-h-screen", className)} style={{ backgroundColor, margin: 0, padding: 0 }}>
        {/* ZERO spacing, ZERO padding - MAXIMUM image presence */}
        <div className="w-full h-full" style={{ margin: 0, padding: 0 }}>
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

          {/* ABSOLUTE FULLSCREEN Grid - ZERO BACKGROUND VISIBLE */}
          <motion.div
            className="w-full min-h-screen"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ 
              margin: 0, 
              padding: 0,
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 0
            }}
          >
            {items.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative w-full cursor-pointer group overflow-hidden"
                style={{ 
                  margin: 0, 
                  padding: 0, 
                  border: 'none',
                  height: '100vh',
                  minHeight: '100vh'
                }}
                whileHover={{ 
                  scale: 1.01,
                  zIndex: 10,
                  transition: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1.0] }
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0.0, 0.2, 1.0]
                }}
                onClick={() => setSelectedImage(item)}
              >
                {/* MAXIMUM COVERAGE Image/Video - NO BACKGROUND VISIBLE */}
                <div className="absolute inset-0" style={{ margin: 0, padding: 0 }}>
                  {item.type === 'video' ? (
                    <>
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.altText || item.caption || ''}
                        className="transition-transform duration-500 group-hover:scale-105"
                        style={{ 
                          display: 'block',
                          width: '100%',
                          height: '100vh',
                          minHeight: '100vh',
                          margin: 0, 
                          padding: 0,
                          border: 'none',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0
                        }}
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="w-20 h-20 text-white drop-shadow-2xl" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.altText || item.caption || ''}
                      className="transition-transform duration-500 group-hover:scale-105"
                      style={{ 
                        display: 'block',
                        width: '100%',
                        height: '100vh',
                        minHeight: '100vh',
                        margin: 0, 
                        padding: 0,
                        border: 'none',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                      }}
                      loading="eager"
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