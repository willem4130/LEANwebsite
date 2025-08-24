/**
 * Payload CMS REST API Integration Layer
 * ====================================
 * 
 * Type-safe integration layer for Payload CMS REST API endpoints
 * Built on top of the existing LEAN API Framework
 */

import { z } from 'zod'
import { ApiClient, ApiResponse, PaginatedResponse } from './api-framework'

// ================================
// 1. PAYLOAD CMS TYPE DEFINITIONS
// ================================

// Base Payload document structure
export interface PayloadDocument {
  id: string
  createdAt: string
  updatedAt: string
}

// Media/Upload type
export const PayloadMediaSchema = z.object({
  id: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  filesize: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  url: z.string().url(),
  altText: z.string(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  category: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sizes: z.record(z.string(), z.object({
    url: z.string().url(),
    width: z.number(),
    height: z.number(),
    filename: z.string(),
  })).optional(),
})

export type PayloadMedia = z.infer<typeof PayloadMediaSchema> & PayloadDocument

// Site Configuration
export const SiteConfigPayloadSchema = z.object({
  siteName: z.string(),
  siteDescription: z.string(),
  siteUrl: z.string().url(),
  contactEmail: z.string().email(),
  timezone: z.string(),
  logo: z.union([z.string(), PayloadMediaSchema]).optional(),
  logoLight: z.union([z.string(), PayloadMediaSchema]).optional(),
  favicon: z.union([z.string(), PayloadMediaSchema]).optional(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string().optional(),
  fontFamily: z.string(),
  seoTitle: z.string().optional(),
  seoKeywords: z.string().optional(),
  ogImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  twitterHandle: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  features: z.object({
    enableBlog: z.boolean(),
    enableGallery: z.boolean(),
    enableTourDates: z.boolean(),
    enableContactForm: z.boolean(),
    enableNewsletter: z.boolean(),
    enableCommerce: z.boolean(),
  }).optional(),
  spotifyArtistId: z.string().optional(),
  appleMusicArtistId: z.string().optional(),
  youtubeMusicArtistId: z.string().optional(),
  bandcampUrl: z.string().optional(),
  soundcloudUrl: z.string().optional(),
  discordInviteCode: z.string().optional(),
})

export type SiteConfigPayload = z.infer<typeof SiteConfigPayloadSchema> & PayloadDocument

// Artist Profile
export const ArtistPayloadSchema = z.object({
  name: z.string(),
  slug: z.string(),
  role: z.array(z.string()),
  featured: z.boolean(),
  order: z.number(),
  profileImage: z.union([z.string(), PayloadMediaSchema]),
  bio: z.any(), // Rich text content
  shortBio: z.string().optional(),
  birthdate: z.string().optional(),
  hometown: z.string().optional(),
  currentLocation: z.string().optional(),
  genres: z.array(z.string()).optional(),
  influences: z.string().optional(),
  yearsActive: z.object({
    start: z.number(),
    end: z.number().optional(),
  }).optional(),
  equipment: z.array(z.object({
    item: z.string(),
    brand: z.string().optional(),
    model: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    username: z.string().optional(),
  })).optional(),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  }).optional(),
})

export type ArtistPayload = z.infer<typeof ArtistPayloadSchema> & PayloadDocument

// Music Release
export const ReleasePayloadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  type: z.enum(['single', 'ep', 'album', 'lp', 'mixtape', 'compilation', 'live', 'remix', 'demo']),
  releaseDate: z.string(),
  featured: z.boolean(),
  order: z.number(),
  artwork: z.union([z.string(), PayloadMediaSchema]),
  description: z.any().optional(), // Rich text
  shortDescription: z.string().optional(),
  lyrics: z.any().optional(), // Rich text
  credits: z.array(z.object({
    person: z.string(),
    role: z.array(z.string()),
    instrument: z.string().optional(),
  })).optional(),
  tracks: z.array(z.object({
    trackNumber: z.number(),
    title: z.string(),
    duration: z.string().optional(),
    featured: z.string().optional(),
    preview: z.union([z.string(), PayloadMediaSchema]).optional(),
    lyrics: z.any().optional(), // Rich text
  })).optional(),
  streamingLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    embedCode: z.string().optional(),
  })).optional(),
  purchaseLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    price: z.string().optional(),
  })).optional(),
  genres: z.array(z.string()).optional(),
  tags: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  }).optional(),
})

export type ReleasePayload = z.infer<typeof ReleasePayloadSchema> & PayloadDocument

// Tour Event
export const TourEventPayloadSchema = z.object({
  eventName: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'cancelled', 'postponed', 'rescheduled']),
  eventType: z.enum(['concert', 'festival', 'tour', 'private', 'acoustic', 'dj-set', 'livestream', 'meet-greet', 'release-party', 'workshop']),
  date: z.string(),
  endDate: z.string().optional(),
  doors: z.string().optional(),
  showTime: z.string().optional(),
  featured: z.boolean(),
  soldOut: z.boolean(),
  venue: z.string(),
  venueAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string(),
  }),
  venueWebsite: z.string().url().optional(),
  venuePhone: z.string().optional(),
  ageRestriction: z.enum(['all-ages', '18plus', '21plus', 'vip-only']).optional(),
  capacity: z.number().optional(),
  venueImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  description: z.any().optional(), // Rich text
  shortDescription: z.string().optional(),
  eventImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  supportingActs: z.array(z.object({
    artistName: z.string(),
    setTime: z.string().optional(),
    website: z.string().url().optional(),
  })).optional(),
  setlist: z.array(z.object({
    songTitle: z.string(),
    order: z.number(),
    notes: z.string().optional(),
  })).optional(),
  ticketing: z.object({
    ticketUrl: z.string().url().optional(),
    presaleUrl: z.string().url().optional(),
    presaleCode: z.string().optional(),
    presaleStart: z.string().optional(),
    publicSaleStart: z.string().optional(),
  }).optional(),
  pricing: z.array(z.object({
    tierName: z.string(),
    price: z.number(),
    currency: z.string(),
    fees: z.string().optional(),
    benefits: z.string().optional(),
    available: z.boolean(),
  })).optional(),
  tags: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  }).optional(),
})

export type TourEventPayload = z.infer<typeof TourEventPayloadSchema> & PayloadDocument

// Gallery Item
export const GalleryItemPayloadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'private', 'archived']),
  type: z.enum(['photo', 'video', 'album', 'gif']),
  featured: z.boolean(),
  order: z.number(),
  media: z.union([z.string(), PayloadMediaSchema]),
  thumbnailOverride: z.union([z.string(), PayloadMediaSchema]).optional(),
  additionalMedia: z.array(z.object({
    image: z.union([z.string(), PayloadMediaSchema]),
    caption: z.string().optional(),
    order: z.number(),
  })).optional(),
  description: z.any().optional(), // Rich text
  caption: z.string().optional(),
  altText: z.string(),
  category: z.array(z.string()),
  tags: z.string().optional(),
  relatedRelease: z.union([z.string(), ReleasePayloadSchema]).optional(),
  relatedEvent: z.union([z.string(), TourEventPayloadSchema]).optional(),
  location: z.object({
    venue: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  datePhotographed: z.string().optional(),
  photographer: z.string().optional(),
  photographerWebsite: z.string().url().optional(),
  creditRequired: z.boolean(),
  rights: z.enum(['full', 'licensed', 'fair-use', 'permission', 'copyright']),
  copyrightNotice: z.string().optional(),
  displaySettings: z.object({
    showInMainGallery: z.boolean(),
    showOnHomepage: z.boolean(),
    allowDownload: z.boolean(),
    showMetadata: z.boolean(),
  }).optional(),
  galleryStyle: z.enum(['grid', 'masonry', 'carousel', 'lightbox', 'full-width']).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  }).optional(),
})

export type GalleryItemPayload = z.infer<typeof GalleryItemPayloadSchema> & PayloadDocument

// Blog Post
export const PostPayloadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'scheduled', 'private', 'archived']),
  publishedDate: z.string(),
  featured: z.boolean(),
  excerpt: z.string(),
  content: z.any(), // Rich text
  featuredImage: z.union([z.string(), PayloadMediaSchema]).optional(),
  category: z.enum(['news', 'new-music', 'tour', 'bts', 'studio', 'collaborations', 'fan-stories', 'press', 'interviews', 'technical', 'personal', 'industry', 'announcements']),
  tags: z.string().optional(),
  relatedRelease: z.union([z.string(), ReleasePayloadSchema]).optional(),
  relatedEvent: z.union([z.string(), TourEventPayloadSchema]).optional(),
  relatedGallery: z.array(z.union([z.string(), GalleryItemPayloadSchema])).optional(),
  author: z.string(), // User ID
  coAuthors: z.array(z.string()).optional(), // User IDs
  guestAuthor: z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional(),
    avatar: z.union([z.string(), PayloadMediaSchema]).optional(),
  }).optional(),
  lastModified: z.string().optional(),
  contentType: z.enum(['standard', 'photo-story', 'video', 'audio', 'gallery', 'link', 'quote']),
  embedCode: z.string().optional(),
  externalLink: z.string().url().optional(),
  quote: z.object({
    text: z.string().optional(),
    attribution: z.string().optional(),
    source: z.string().optional(),
  }).optional(),
  allowComments: z.boolean(),
  commentsModerated: z.boolean(),
  socialSharing: z.object({
    enabled: z.boolean(),
    customMessage: z.string().optional(),
  }).optional(),
  newsletter: z.boolean(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    ogImage: z.union([z.string(), PayloadMediaSchema]).optional(),
    noIndex: z.boolean().optional(),
  }).optional(),
  readingTime: z.number().optional(),
})

export type PostPayload = z.infer<typeof PostPayloadSchema> & PayloadDocument

// Global Navigation
export const NavigationPayloadSchema = z.object({
  primaryNavigation: z.array(z.object({
    label: z.string(),
    type: z.enum(['internal', 'external', 'anchor']),
    href: z.string(),
    openInNewTab: z.boolean().optional(),
  })).optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(['instagram', 'facebook', 'youtube', 'spotify', 'apple-music', 'soundcloud', 'bandcamp', 'twitter', 'tiktok', 'discord']),
    url: z.string().url(),
    username: z.string().optional(),
  })).optional(),
})

export type NavigationPayload = z.infer<typeof NavigationPayloadSchema>

// Homepage Global
export const HomepagePayloadSchema = z.object({
  hero: z.object({
    artistName: z.string(),
    tagline: z.string().optional(),
    backgroundType: z.enum(['color', 'gradient', 'image', 'video']),
    backgroundColor: z.string().optional(),
    gradientStart: z.string().optional(),
    gradientEnd: z.string().optional(),
    gradientDirection: z.enum(['to-b', 'to-r', 'to-br', 'to-bl']).optional(),
    backgroundMedia: z.union([z.string(), PayloadMediaSchema]).optional(),
    ctaButton: z.object({
      text: z.string().optional(),
      href: z.string().optional(),
      style: z.enum(['primary', 'secondary', 'outline', 'ghost']).optional(),
    }).optional(),
  }),
  featuredSection: z.object({
    enabled: z.boolean(),
    title: z.string().optional(),
    featuredRelease: z.union([z.string(), ReleasePayloadSchema]).optional(),
  }).optional(),
})

export type HomepagePayload = z.infer<typeof HomepagePayloadSchema>

// ================================
// 2. PAYLOAD API CLIENT
// ================================

export class PayloadApiClient {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    this.apiKey = apiKey
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      headers['Authorization'] = `users API-Key ${this.apiKey}`
    }
    
    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Payload API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Generic collection methods
  async getCollection<T>(
    collection: string,
    params?: {
      where?: Record<string, any>
      sort?: string
      limit?: number
      page?: number
      depth?: number
    }
  ): Promise<{ docs: T[], totalDocs: number, limit: number, page: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean }> {
    const searchParams = new URLSearchParams()
    
    if (params?.where) {
      searchParams.set('where', JSON.stringify(params.where))
    }
    if (params?.sort) {
      searchParams.set('sort', params.sort)
    }
    if (params?.limit) {
      searchParams.set('limit', params.limit.toString())
    }
    if (params?.page) {
      searchParams.set('page', params.page.toString())
    }
    if (params?.depth) {
      searchParams.set('depth', params.depth.toString())
    }

    const queryString = searchParams.toString()
    const endpoint = `/${collection}${queryString ? `?${queryString}` : ''}`
    
    return this.request<{ docs: T[], totalDocs: number, limit: number, page: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean }>(endpoint)
  }

  async getById<T>(collection: string, id: string, depth?: number): Promise<T> {
    const params = depth ? `?depth=${depth}` : ''
    return this.request<T>(`/${collection}/${id}${params}`)
  }

  async getBySlug<T>(collection: string, slug: string, depth?: number): Promise<T[]> {
    return this.getCollection<T>(collection, {
      where: { slug: { equals: slug } },
      limit: 1,
      depth,
    }).then(result => result.docs)
  }

  async getGlobal<T>(global: string): Promise<T> {
    return this.request<T>(`/globals/${global}`)
  }

  // Specific collection methods with type safety
  async getSiteConfig(): Promise<SiteConfigPayload> {
    const result = await this.getCollection<SiteConfigPayload>('site-config', { limit: 1 })
    return result.docs[0]
  }

  async getArtists(params?: { featured?: boolean; limit?: number }): Promise<ArtistPayload[]> {
    const where: Record<string, any> = {}
    if (params?.featured !== undefined) {
      where.featured = { equals: params.featured }
    }
    
    const result = await this.getCollection<ArtistPayload>('artists', {
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: 'order',
      limit: params?.limit,
    })
    
    return result.docs
  }

  async getArtistBySlug(slug: string): Promise<ArtistPayload | null> {
    const result = await this.getBySlug<ArtistPayload>('artists', slug)
    return result[0] || null
  }

  async getReleases(params?: { 
    featured?: boolean; 
    status?: string; 
    limit?: number;
    type?: string;
  }): Promise<ReleasePayload[]> {
    const where: Record<string, any> = {}
    if (params?.featured !== undefined) {
      where.featured = { equals: params.featured }
    }
    if (params?.status) {
      where.status = { equals: params.status }
    }
    if (params?.type) {
      where.type = { equals: params.type }
    }
    
    const result = await this.getCollection<ReleasePayload>('releases', {
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: '-releaseDate',
      limit: params?.limit,
    })
    
    return result.docs
  }

  async getReleaseBySlug(slug: string): Promise<ReleasePayload | null> {
    const result = await this.getBySlug<ReleasePayload>('releases', slug)
    return result[0] || null
  }

  async getTourEvents(params?: { 
    upcoming?: boolean; 
    featured?: boolean; 
    limit?: number;
  }): Promise<TourEventPayload[]> {
    const where: Record<string, any> = {}
    if (params?.featured !== undefined) {
      where.featured = { equals: params.featured }
    }
    if (params?.upcoming) {
      where.date = { greater_than: new Date().toISOString() }
    }
    
    const result = await this.getCollection<TourEventPayload>('tour-events', {
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: 'date',
      limit: params?.limit,
    })
    
    return result.docs
  }

  async getTourEventBySlug(slug: string): Promise<TourEventPayload | null> {
    const result = await this.getBySlug<TourEventPayload>('tour-events', slug)
    return result[0] || null
  }

  async getGalleryItems(params?: { 
    featured?: boolean; 
    category?: string[]; 
    type?: string;
    limit?: number;
  }): Promise<GalleryItemPayload[]> {
    const where: Record<string, any> = {}
    if (params?.featured !== undefined) {
      where.featured = { equals: params.featured }
    }
    if (params?.category && params.category.length > 0) {
      where.category = { in: params.category }
    }
    if (params?.type) {
      where.type = { equals: params.type }
    }
    
    const result = await this.getCollection<GalleryItemPayload>('gallery', {
      where: Object.keys(where).length > 0 ? where : undefined,
      sort: '-updatedAt',
      limit: params?.limit,
    })
    
    return result.docs
  }

  async getGalleryItemBySlug(slug: string): Promise<GalleryItemPayload | null> {
    const result = await this.getBySlug<GalleryItemPayload>('gallery', slug)
    return result[0] || null
  }

  async getPosts(params?: { 
    featured?: boolean; 
    category?: string;
    status?: string;
    limit?: number;
  }): Promise<PostPayload[]> {
    const where: Record<string, any> = {}
    if (params?.featured !== undefined) {
      where.featured = { equals: params.featured }
    }
    if (params?.category) {
      where.category = { equals: params.category }
    }
    if (params?.status) {
      where.status = { equals: params.status }
    } else {
      // Default to published posts only
      where.status = { equals: 'published' }
      where.publishedDate = { less_than_equal: new Date().toISOString() }
    }
    
    const result = await this.getCollection<PostPayload>('posts', {
      where,
      sort: '-publishedDate',
      limit: params?.limit,
    })
    
    return result.docs
  }

  async getPostBySlug(slug: string): Promise<PostPayload | null> {
    const result = await this.getBySlug<PostPayload>('posts', slug)
    return result[0] || null
  }

  async getNavigation(): Promise<NavigationPayload> {
    return this.getGlobal<NavigationPayload>('navigation')
  }

  async getHomepage(): Promise<HomepagePayload> {
    return this.getGlobal<HomepagePayload>('homepage')
  }
}

// Default client instance
export const payloadApi = new PayloadApiClient()

// Client with API key for server-side operations
export const createPayloadApiClient = (apiKey?: string) => {
  return new PayloadApiClient('/api', apiKey)
}