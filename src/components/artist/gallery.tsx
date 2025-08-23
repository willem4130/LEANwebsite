'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  backgroundColor = '#f8fafc',
  backgroundMedia,
  className,
}: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'carousel'>(layout)
  const carouselRef = useRef<HTMLDivElement>(null)

  const categories = Array.from(
    new Set(items.flatMap(item => item.category || []))
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
          background: `linear-gradient(135deg, ${backgroundColor} 0%, #e2e8f0 100%)`
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

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320
      const currentScroll = carouselRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      className={cn("py-16 lg:py-24 relative overflow-hidden", className)}
      style={getBackgroundStyle()}
    >
      {/* Background overlay for better readability */}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>

          {/* Layout Controls */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Button
              variant={layoutMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutMode('grid')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Grid
            </Button>
            <Button
              variant={layoutMode === 'masonry' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutMode('masonry')}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              Masonry
            </Button>
            <Button
              variant={layoutMode === 'carousel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayoutMode('carousel')}
              className="flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              Carousel
            </Button>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filter === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {layoutMode === 'carousel' ? (
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex-shrink-0 w-80 snap-start"
                  >
                    <GalleryItemCard
                      item={item}
                      onSelect={setSelectedItem}
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                onClick={() => scrollCarousel('left')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                onClick={() => scrollCarousel('right')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                layoutMode === 'grid'
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={cn(
                    layoutMode === 'masonry' && index % 3 === 0 && "sm:row-span-2"
                  )}
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

        {/* Lightbox Modal */}
        {selectedItem && (
          <GalleryLightbox
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </section>
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
  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={item.thumbnailUrl || item.url}
          alt={item.altText || item.caption || 'Gallery item'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Play button for videos */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>
        )}

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Featured
          </div>
        )}

        {/* Overlay with caption */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium">
            {item.caption}
          </p>
        </div>
      </div>
    </div>
  )
}

// Lightbox Component
function GalleryLightbox({
  item,
  onClose,
}: {
  item: GalleryItem
  onClose: () => void
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="w-full h-full rounded-lg"
          />
        ) : (
          <img
            src={item.url}
            alt={item.altText || item.caption || 'Gallery item'}
            className="w-full h-full object-contain rounded-lg"
          />
        )}
        
        {item.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
            <p className="text-white text-lg">{item.caption}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}