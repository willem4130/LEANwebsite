'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X, ChevronLeft, ChevronRight, Grid3X3, LayoutGrid, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'

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
  // Input validation for production safety
  if (!items || !Array.isArray(items)) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Alert>
            <AlertDescription>No gallery items to display</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry' | 'carousel'>(layout)

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
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <ComponentErrorBoundary 
      componentName="Gallery"
      fallback={
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <Alert>
              <AlertDescription>
                <div className="flex items-start space-y-2 flex-col">
                  <h3 className="text-lg font-semibold text-red-800">Gallery Error</h3>
                  <p className="text-red-700">The gallery couldn't load properly.</p>
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
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        )}

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center space-y-8 mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {title}
            </h2>

            {/* Layout Controls */}
            <div className="flex flex-wrap justify-center gap-2">
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
              <div className="flex flex-wrap justify-center gap-2">
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
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {filteredItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      variants={itemVariants}
                      className="flex-shrink-0 w-80"
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
                    className={layoutMode === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''}
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

          {/* Lightbox Dialog */}
          <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <DialogClose className="absolute right-4 top-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full p-2">
                <X className="w-4 h-4" />
              </DialogClose>
              {selectedItem && (
                <div className="relative">
                  {selectedItem.type === 'video' ? (
                    <video
                      src={selectedItem.url}
                      controls
                      autoPlay
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.altText || selectedItem.caption || 'Gallery item'}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  )}
                  
                  {selectedItem.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                      <p className="text-white text-lg">{selectedItem.caption}</p>
                    </div>
                  )}
                </div>
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
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          {imageError ? (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
              <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Image failed to load</p>
            </div>
          ) : (
            <div className="relative">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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
              <div className="w-16 h-16 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <Play className="w-6 h-6 text-gray-800 ml-1" />
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