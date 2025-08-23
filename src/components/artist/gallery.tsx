'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'
import { galleryAnimations, getOptimizedTransition, prefersReducedMotion, EFFECTS } from '@/lib/animations/electronic-music-animations'

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

interface GalleryProps {
  items: GalleryItem[]
  layout: 'grid' | 'masonry' | 'carousel'
  title: string
  backgroundType?: 'color' | 'gradient' | 'image' | 'video'
  backgroundColor?: string
  backgroundMedia?: {
    url: string
    alt?: string
  }
  className?: string
}

export function Gallery({
  items,
  layout = 'grid',
  title,
  backgroundType = 'color',
  backgroundColor = '#060609',
  backgroundMedia,
  className,
}: GalleryProps) {
  // Input validation for production safety
  if (!items || !Array.isArray(items)) {
    return (
      <div className="py-16 bg-brand-void">
        <div className="max-w-7xl mx-auto px-4">
          <Alert className="bg-brand-charcoal/60 border-brand-electric/30">
            <AlertDescription className="text-brand-text-secondary">No gallery items to display</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'carousel'>(layout)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })

  React.useEffect(() => {
    setIsReducedMotion(prefersReducedMotion())
  }, [])

  // Essential categories for professional presentation
  const essentialCategories = ['live', 'studio', 'behind-scenes', 'press']
  const availableCategories = Array.from(
    new Set(items.flatMap(item => item.category || []))
  )
  // Only show categories that exist in the items and are essential
  const categories = essentialCategories.filter(cat => 
    availableCategories.some(available => available.toLowerCase().includes(cat))
  )

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category?.includes(filter))

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'color':
        return { backgroundColor }
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor} 0%, #1a1a2e 100%)`
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

  // Electronic Music Soundscape Animations
  const containerVariants = {
    ...galleryAnimations.container,
    visible: {
      ...galleryAnimations.container.visible
    },
  }

  const itemVariants = {
    ...galleryAnimations.item,
    visible: {
      ...galleryAnimations.item.visible
    },
    hover: {
      ...galleryAnimations.item.hover
    },
    tap: {
      ...galleryAnimations.item.tap
    },
  }

  const filterVariants = {
    ...galleryAnimations.filter,
    inactive: {
      ...galleryAnimations.filter.inactive
    },
    active: {
      ...galleryAnimations.filter.active
    },
    hover: {
      ...galleryAnimations.filter.hover
    },
  }

  const lightboxVariants = {
    ...galleryAnimations.lightbox,
    visible: {
      ...galleryAnimations.lightbox.visible
    },
    exit: {
      ...galleryAnimations.lightbox.exit
    },
  }

  return (
    <ComponentErrorBoundary 
      componentName="Gallery"
      fallback={
        <div className="py-16 bg-brand-void">
          <div className="max-w-7xl mx-auto px-4">
            <Alert className="bg-brand-charcoal/60 border-brand-coral/50">
              <AlertDescription>
                <div className="flex items-start space-y-2 flex-col">
                  <h3 className="text-lg font-semibold text-brand-coral">Gallery Error</h3>
                  <p className="text-brand-text-secondary">The gallery couldn't load properly.</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      }
    >
      <section
        className={`py-16 lg:py-24 relative overflow-hidden ${className}`}
        style={getBackgroundStyle()}
      >
        {/* Background overlay for better readability */}
        {backgroundType === 'image' && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/20 via-brand-electric/10 to-brand-purple/20 backdrop-blur-sm" />
        )}

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-brand-text-hero">
              {title}
            </h2>

            {/* Electronic Music Layout Controls */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { mode: 'grid', icon: Grid3X3, label: 'Grid', description: 'Frequency Grid' },
                { mode: 'masonry', icon: LayoutGrid, label: 'Masonry', description: 'Waveform Flow' },
                { mode: 'carousel', icon: ChevronRight, label: 'Carousel', description: 'Timeline Scroll' },
              ].map(({ mode, icon: Icon, label, description }) => (
                <motion.div
                  key={mode}
                  variants={filterVariants}
                  animate={layoutMode === mode ? 'active' : 'inactive'}
                  whileHover="hover"
                >
                  <Button
                    variant={layoutMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayoutMode(mode as typeof layoutMode)}
                    className="flex items-center gap-2 relative overflow-hidden group"
                  >
                    {/* Animated background pulse for active state */}
                    {layoutMode === mode && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                        animate={isReducedMotion ? {} : {
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={getOptimizedTransition({
                          duration: 2,
                          repeat: Infinity,
                          ease: [0.25, 0.1, 0.25, 1],
                        })}
                      />
                    )}
                    
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{label}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-brand-charcoal/95 text-brand-text-primary border border-brand-electric/30 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                      {description}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Electronic Music Category Filters */}
            {categories.length > 0 && (
              <motion.div 
                className="flex flex-wrap justify-center gap-2"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {/* All Filter with special styling */}
                <motion.div
                  variants={filterVariants}
                  animate={filter === 'all' ? 'active' : 'inactive'}
                  whileHover="hover"
                >
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="relative overflow-hidden group"
                  >
                    {filter === 'all' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20"
                        animate={isReducedMotion ? {} : {
                          scale: [1, 1.05, 1],
                          transition: {
                            duration: 0.5,
                            ease: [0.68, -0.55, 0.265, 1.55],
                            repeat: Infinity
                          }
                        }}
                      />
                    )}
                    <Zap className="w-3 h-3 mr-1" />
                    <span className="relative z-10">All Tracks</span>
                  </Button>
                </motion.div>
                
                {/* Essential category filters with electronic styling */}
                {categories.map(category => (
                  <motion.div
                    key={category}
                    variants={filterVariants}
                    animate={filter === category ? 'active' : 'inactive'}
                    whileHover="hover"
                  >
                    <Button
                      variant={filter === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(category)}
                      className="relative overflow-hidden capitalize group"
                    >
                      {filter === category && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"
                          animate={isReducedMotion ? {} : {
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={getOptimizedTransition({
                            duration: 1.5,
                            repeat: Infinity,
                            ease: [0.23, 1, 0.32, 1], // Filter sweep curve
                          })}
                        />
                      )}
                      <span className="relative z-10">{category.replace('-', ' ')}</span>
                      
                      {/* Genre indicator */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-neon rounded-full opacity-0 group-hover:opacity-80 transition-opacity" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Electronic Music Gallery Content */}
          <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Background frequency visualization */}
            {!isReducedMotion && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-gradient-to-t from-transparent via-purple-500/5 to-transparent"
                    style={{
                      left: `${(i / 20) * 100}%`,
                      width: '1px',
                      height: '100%',
                    }}
                    animate={{
                      scaleY: [0.3, 0.8 + Math.random() * 0.4, 0.3],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 2,
                      repeat: Infinity,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
            {layoutMode === 'carousel' ? (
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {filteredItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-shrink-0 w-80 will-change-transform"
                    >
                      <GalleryItemCard
                        item={item}
                        onSelect={setSelectedItem}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`${layoutMode === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''} will-change-transform`}
                    style={{
                      // Add subtle perspective for depth
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <GalleryItemCard
                      item={item}
                      onSelect={setSelectedItem}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Electronic Music Lightbox Dialog */}
          <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-none bg-black/95 backdrop-blur-xl">
              {/* Enhanced close button */}
              <motion.button
                className="absolute right-4 top-4 z-50 bg-black/80 text-white hover:bg-black/90 rounded-full p-3 group"
                onClick={() => setSelectedItem(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                
                {/* Close button glow */}
                <div className="absolute inset-0 rounded-full bg-red-500/20 scale-0 group-hover:scale-150 transition-transform duration-300" />
              </motion.button>
              
              {selectedItem && (
                <motion.div 
                  className="relative"
                  variants={lightboxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {selectedItem.type === 'video' ? (
                    <video
                      src={selectedItem.url}
                      controls
                      autoPlay
                      className="w-full h-full rounded-lg shadow-2xl"
                      style={{
                        boxShadow: '0 0 50px rgba(147, 51, 234, 0.3), 0 0 100px rgba(59, 130, 246, 0.2)',
                      }}
                    />
                  ) : (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.altText || selectedItem.caption || 'Gallery item'}
                      className="w-full h-full object-contain rounded-lg shadow-2xl"
                      style={{
                        boxShadow: '0 0 50px rgba(147, 51, 234, 0.3), 0 0 100px rgba(59, 130, 246, 0.2)',
                      }}
                    />
                  )}
                  
                  {/* Enhanced caption with electronic styling */}
                  {selectedItem.caption && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 rounded-b-lg border-t border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <p className="text-white text-lg font-light tracking-wide">
                        {selectedItem.caption}
                      </p>
                      
                      {/* Category tags */}
                      {selectedItem.category && (
                        <div className="flex gap-2 mt-3">
                          {selectedItem.category.map(cat => (
                            <span
                              key={cat}
                              className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Animated accent line */}
                      <motion.div
                        className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-4"
                        animate={isReducedMotion ? {} : {
                          scaleX: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </ComponentErrorBoundary>
  )
}

// Gallery Item Card Component
function GalleryItemCard({
  item,
  onSelect,
}: {
  item: GalleryItem
  onSelect: (item: GalleryItem) => void
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-brand-navy/90 via-brand-dark/80 to-brand-charcoal/90"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          {imageError ? (
            <div className="flex flex-col items-center justify-center h-full bg-brand-charcoal/60">
              <AlertCircle className="w-8 h-8 text-brand-text-muted mb-2" />
              <p className="text-brand-text-secondary text-sm">Image failed to load</p>
            </div>
          ) : (
            <div className="relative">
              {imageLoading && (
                <div className="absolute inset-0 bg-brand-navy/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-brand-electric/30 border-t-brand-neon rounded-full animate-spin" />
                </div>
              )}
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.altText || item.caption || 'Gallery item'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            </div>
          )}
          
          {/* Play button for videos */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
              <div className="w-16 h-16 bg-brand-neon/90 group-hover:bg-brand-neon rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-brand-neon/30">
                <Play className="w-6 h-6 text-brand-void ml-1" />
              </div>
            </div>
          )}

          {/* Featured badge */}
          {item.featured && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Overlay with caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium">
              {item.caption}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}