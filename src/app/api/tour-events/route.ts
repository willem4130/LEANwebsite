import { NextRequest } from 'next/server'
import { 
  TourEventSchema, 
  createPaginatedResponse, 
  withErrorHandling,
  addSecurityHeaders 
} from '@/lib/api-framework'

// Mock data - in production this would come from Payload CMS
const mockTourEvents = [
  {
    id: '1',
    eventName: 'Summer Festival 2024',
    venue: 'Red Rocks Amphitheatre',
    city: 'Morrison, CO',
    date: '2024-08-15T20:00:00.000Z',
    ticketUrl: 'https://example.com/tickets/1',
    soldOut: false,
    featured: true,
    price: { min: 45, max: 150, currency: 'USD' }
  },
  {
    id: '2',
    eventName: 'Club Night',
    venue: 'The Fillmore',
    city: 'San Francisco, CA',
    date: '2024-08-22T21:00:00.000Z',
    ticketUrl: 'https://example.com/tickets/2',
    soldOut: true,
    featured: false,
    price: { min: 25, max: 75, currency: 'USD' }
  },
  {
    id: '3',
    eventName: 'Acoustic Session',
    venue: 'Blue Note',
    city: 'New York, NY',
    date: '2024-09-05T19:30:00.000Z',
    ticketUrl: 'https://example.com/tickets/3',
    soldOut: false,
    featured: false,
    price: { min: 35, max: 85, currency: 'USD' }
  }
]

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const featured = searchParams.get('featured') === 'true'
  
  // Filter events
  let filteredEvents = mockTourEvents
  if (featured) {
    filteredEvents = mockTourEvents.filter(event => event.featured)
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex)
  
  // Validate each event
  const validatedEvents = paginatedEvents.map(event => 
    TourEventSchema.parse(event)
  )
  
  const response = createPaginatedResponse(
    validatedEvents,
    page,
    limit,
    filteredEvents.length
  )
  
  return addSecurityHeaders(response)
})