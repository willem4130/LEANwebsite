import { NextRequest } from 'next/server'
import { 
  GalleryItemSchema, 
  createPaginatedResponse, 
  withErrorHandling,
  addSecurityHeaders 
} from '@/lib/api-framework'

// Mock data - in production this would come from Payload CMS
const mockGalleryItems = [
  {
    id: '1',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop&auto=format&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format&q=80',
    caption: 'Live performance at Summer Festival',
    category: ['live'],
    featured: true,
    altText: 'Aria Nova performing live on stage',
    metadata: { width: 1920, height: 1080 }
  },
  {
    id: '2',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&auto=format&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format&q=80',
    caption: 'Studio session for new album',
    category: ['studio'],
    featured: false,
    altText: 'Recording studio session',
    metadata: { width: 1920, height: 1080 }
  },
  {
    id: '3',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1520155707862-5b32e0e7d4c8?w=1920&h=1080&fit=crop&auto=format&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520155707862-5b32e0e7d4c8?w=800&h=600&fit=crop&auto=format&q=80',
    caption: 'Behind the scenes at music video shoot',
    category: ['video', 'bts'],
    featured: true,
    altText: 'Music video production behind the scenes',
    metadata: { width: 1920, height: 1080 }
  },
  {
    id: '4',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop&auto=format&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=80',
    caption: 'Intimate acoustic performance',
    category: ['live', 'acoustic'],
    featured: false,
    altText: 'Acoustic guitar performance',
    metadata: { width: 1920, height: 1080 }
  },
  {
    id: '5',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1920&h=1080&fit=crop&auto=format&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop&auto=format&q=80',
    caption: 'Electronic equipment and synthesizers',
    category: ['studio', 'equipment'],
    featured: false,
    altText: 'Electronic music production equipment',
    metadata: { width: 1920, height: 1080 }
  }
]

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured') === 'true'
  
  // Filter gallery items
  let filteredItems = mockGalleryItems
  
  if (category) {
    filteredItems = filteredItems.filter(item => 
      item.category.includes(category as any)
    )
  }
  
  if (featured) {
    filteredItems = filteredItems.filter(item => item.featured)
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = filteredItems.slice(startIndex, endIndex)
  
  // Validate each item
  const validatedItems = paginatedItems.map(item => 
    GalleryItemSchema.parse(item)
  )
  
  const response = createPaginatedResponse(
    validatedItems,
    page,
    limit,
    filteredItems.length
  )
  
  return addSecurityHeaders(response)
})