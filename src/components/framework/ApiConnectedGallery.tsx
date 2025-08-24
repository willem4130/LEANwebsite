/**
 * API-Connected Gallery Component
 * ===============================
 * 
 * Demonstrates the LEAN API Framework in action with:
 * - Type-safe API integration
 * - Real-time data fetching
 * - Error handling
 * - Loading states
 * - Responsive design
 */

'use client'

import React from 'react'
import { useApi, GalleryItem } from '@/lib/api-framework'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Filter, Grid, MoreHorizontal } from 'lucide-react'

interface ApiConnectedGalleryProps {
  category?: string
  featuredOnly?: boolean
  limit?: number
  className?: string
}

export function ApiConnectedGallery({ 
  category, 
  featuredOnly = false, 
  limit = 12,
  className = '' 
}: ApiConnectedGalleryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(category || '')
  const [showFeaturedOnly, setShowFeaturedOnly] = React.useState(featuredOnly)
  
  // Build query parameters
  const queryParams = new URLSearchParams()
  if (selectedCategory) queryParams.set('category', selectedCategory)
  if (showFeaturedOnly) queryParams.set('featured', 'true')
  queryParams.set('limit', limit.toString())
  
  // Type-safe API call using our framework
  const { data, loading, error, refetch } = useApi<GalleryItem[]>(
    `/gallery?${queryParams.toString()}`,
    { 
      dependencies: [selectedCategory, showFeaturedOnly, limit] 
    }
  )

  const categories = ['live', 'studio', 'acoustic', 'video', 'equipment', 'crowd', 'bts', 'press']
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span className="text-gray-300">Loading gallery...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`py-8 ${className}`}>
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertDescription className="text-red-300">
            Failed to load gallery: {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="ml-4 border-red-500/50 text-red-300 hover:bg-red-500/20"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const galleryItems = data?.data || []

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-900/30 rounded-lg backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">Filters:</span>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
            className="text-xs"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
        
        {/* Featured Toggle */}
        <Button
          variant={showFeaturedOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
          className="text-xs"
        >
          Featured Only
        </Button>
      </div>

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <div className="text-center py-12">
          <Grid className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No items found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <GalleryItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Load More (if pagination data available) */}
      <div className="text-center pt-6">
        <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Load More
        </Button>
      </div>
    </div>
  )
}

// Individual Gallery Item Component
function GalleryItemCard({ item }: { item: GalleryItem }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={item.thumbnailUrl}
          alt={item.altText}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Featured Badge */}
        {item.featured && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0">
            Featured
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {item.caption && (
          <h3 className="font-medium text-gray-200 mb-2 line-clamp-2">
            {item.caption}
          </h3>
        )}
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {item.category.map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className="text-xs border-gray-600 text-gray-400 capitalize"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div className="p-4 text-white">
          <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0">
            View Full Size
          </Button>
        </div>
      </div>
    </div>
  )
}