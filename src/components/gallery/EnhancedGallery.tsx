'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Download, 
  ExternalLink, 
  Heart, 
  Share2,
  Grid3x3,
  List,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: string
  title: string
  description: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
  category: string
  tags: string[]
  date: string
  likes: number
  featured?: boolean
}

interface EnhancedGalleryProps {
  items: GalleryItem[]
  title?: string
  backgroundColor?: string
  className?: string
}

export function EnhancedGallery({ 
  items = [], 
  title = "Media Gallery", 
  backgroundColor = "#1a1a2e",
  className 
}: EnhancedGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'featured'>('grid')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))]
  
  // Filter items based on category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory)

  // Featured items for hero carousel
  const featuredItems = items.filter(item => item.featured)

  const handleCardHover = (element: HTMLElement, isEntering: boolean) => {
    gsap.to(element, {
      y: isEntering ? -10 : 0,
      scale: isEntering ? 1.05 : 1,
      rotationY: isEntering ? 5 : 0,
      duration: 0.4,
      ease: "power2.out",
      force3D: true
    })
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <Card 
            className="group cursor-pointer bg-gradient-to-br from-brand-dark/80 to-brand-navy/60 border-brand-neon/20 hover:border-brand-neon/40 backdrop-blur-sm transition-all duration-300 overflow-hidden"
            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
            onClick={() => setSelectedItem(item)}
          >
            {/* Media Preview */}
            <div className="relative aspect-video overflow-hidden">
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  muted
                />
              ) : (
                <img
                  src={item.thumbnail || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              
              {/* Overlay with play button for videos */}
              {item.type === 'video' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-brand-neon/20">
                    <Play className="w-8 h-8" />
                  </Button>
                </div>
              )}
              
              {/* Type badge */}
              <Badge 
                className="absolute top-3 left-3 bg-brand-neon/20 text-brand-neon border-brand-neon/30"
              >
                {item.type}
              </Badge>
              
              {/* Featured badge */}
              {item.featured && (
                <Badge 
                  className="absolute top-3 right-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30"
                >
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white group-hover:text-brand-neon transition-colors">
                {item.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag}
                    variant="outline" 
                    className="text-xs border-brand-electric/30 text-brand-electric"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>{item.likes}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-brand-neon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-brand-neon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const ListView = () => (
    <div className="space-y-4">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <Card className="flex flex-row bg-gradient-to-r from-brand-dark/80 to-brand-navy/60 border-brand-neon/20 hover:border-brand-neon/40 backdrop-blur-sm transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedItem(item)}>
            {/* Media thumbnail */}
            <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-l-xl">
              <img
                src={item.thumbnail || item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-brand-neon transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{item.date}</p>
                </div>
                <Badge className="bg-brand-neon/20 text-brand-neon border-brand-neon/30">
                  {item.category}
                </Badge>
              </div>
              
              <p className="text-gray-300 mb-4">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {item.tags.slice(0, 4).map(tag => (
                    <Badge 
                      key={tag}
                      variant="outline" 
                      className="text-xs border-brand-electric/30 text-brand-electric"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-brand-neon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-brand-neon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  return (
    <section 
      ref={galleryRef}
      className={cn("py-20 relative overflow-hidden", className)}
      style={{ backgroundColor }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-neon/5 via-transparent to-brand-purple/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-brand-neon to-brand-purple bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore our collection of music, videos, and visual content
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList className="bg-brand-dark/80 border border-brand-neon/20">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-brand-neon/20 data-[state=active]:text-brand-neon"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Gallery Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${selectedCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {viewMode === 'grid' ? <GridView /> : <ListView />}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {filteredItems.length > 12 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-brand-neon to-brand-electric hover:from-brand-neon/80 hover:to-brand-electric/80 text-brand-dark font-semibold px-8"
            >
              Load More Content
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}