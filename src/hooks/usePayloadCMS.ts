/**
 * React Hooks for Payload CMS Data Fetching
 * ==========================================
 * 
 * Type-safe React hooks for fetching and managing CMS data
 * Built on top of the Payload API integration layer
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  PayloadApiClient,
  payloadApi,
  SiteConfigPayload,
  ArtistPayload,
  ReleasePayload,
  TourEventPayload,
  GalleryItemPayload,
  PostPayload,
  NavigationPayload,
  HomepagePayload
} from '@/lib/payload-api'

// ================================
// 1. GENERIC HOOKS
// ================================

export interface UsePayloadState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface UsePayloadListState<T> {
  data: T[]
  loading: boolean
  error: string | null
  total: number
  hasMore: boolean
}

export interface UsePayloadOptions {
  immediate?: boolean
  dependencies?: any[]
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export interface UsePayloadListOptions extends UsePayloadOptions {
  limit?: number
  page?: number
}

// Generic hook for single item fetching
function usePayloadItem<T>(
  fetchFn: () => Promise<T>,
  options: UsePayloadOptions = {}
): UsePayloadState<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFn()
      setData(result)
      options.onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      options.onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, options])

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData()
    }
  }, options.dependencies || [])

  return { data, loading, error, refetch: fetchData }
}

// Generic hook for list fetching
function usePayloadList<T>(
  fetchFn: () => Promise<T[]>,
  options: UsePayloadListOptions = {}
): UsePayloadListState<T> & { refetch: () => Promise<void>; loadMore: () => Promise<void> } {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = useCallback(async (append = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFn()
      
      if (append) {
        setData(prev => [...prev, ...result])
      } else {
        setData(result)
      }
      
      // Note: This assumes the fetchFn returns the full array
      // For pagination, you'd need to modify the API client to return pagination info
      setTotal(result.length)
      setHasMore(false) // Simplified for now
      
      options.onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      options.onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, options])

  const refetch = useCallback(() => fetchData(false), [fetchData])
  const loadMore = useCallback(() => fetchData(true), [fetchData])

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData()
    }
  }, options.dependencies || [])

  return { data, loading, error, total, hasMore, refetch, loadMore }
}

// ================================
// 2. SITE CONFIGURATION HOOKS
// ================================

export function useSiteConfig(options: UsePayloadOptions = {}) {
  return usePayloadItem<SiteConfigPayload>(
    () => payloadApi.getSiteConfig(),
    options
  )
}

export function useNavigation(options: UsePayloadOptions = {}) {
  return usePayloadItem<NavigationPayload>(
    () => payloadApi.getNavigation(),
    options
  )
}

export function useHomepage(options: UsePayloadOptions = {}) {
  return usePayloadItem<HomepagePayload>(
    () => payloadApi.getHomepage(),
    options
  )
}

// ================================
// 3. ARTIST HOOKS
// ================================

export function useArtists(
  params?: { featured?: boolean; limit?: number },
  options: UsePayloadListOptions = {}
) {
  return usePayloadList<ArtistPayload>(
    () => payloadApi.getArtists(params),
    { ...options, dependencies: [params, ...(options.dependencies || [])] }
  )
}

export function useArtist(
  slug: string | undefined,
  options: UsePayloadOptions = {}
) {
  return usePayloadItem<ArtistPayload | null>(
    () => slug ? payloadApi.getArtistBySlug(slug) : Promise.resolve(null),
    { ...options, dependencies: [slug, ...(options.dependencies || [])] }
  )
}

export function useFeaturedArtists(options: UsePayloadListOptions = {}) {
  return useArtists({ featured: true }, options)
}

// ================================
// 4. MUSIC RELEASE HOOKS
// ================================

export function useReleases(
  params?: { 
    featured?: boolean; 
    status?: string; 
    limit?: number;
    type?: string;
  },
  options: UsePayloadListOptions = {}
) {
  return usePayloadList<ReleasePayload>(
    () => payloadApi.getReleases(params),
    { ...options, dependencies: [params, ...(options.dependencies || [])] }
  )
}

export function useRelease(
  slug: string | undefined,
  options: UsePayloadOptions = {}
) {
  return usePayloadItem<ReleasePayload | null>(
    () => slug ? payloadApi.getReleaseBySlug(slug) : Promise.resolve(null),
    { ...options, dependencies: [slug, ...(options.dependencies || [])] }
  )
}

export function useFeaturedReleases(options: UsePayloadListOptions = {}) {
  return useReleases({ featured: true, status: 'published' }, options)
}

export function useLatestRelease(options: UsePayloadOptions = {}) {
  return usePayloadItem<ReleasePayload | null>(
    async () => {
      const releases = await payloadApi.getReleases({ status: 'published', limit: 1 })
      return releases[0] || null
    },
    options
  )
}

export function useReleasesByType(
  type: string,
  options: UsePayloadListOptions = {}
) {
  return useReleases({ type, status: 'published' }, options)
}

// ================================
// 5. TOUR EVENT HOOKS
// ================================

export function useTourEvents(
  params?: { 
    upcoming?: boolean; 
    featured?: boolean; 
    limit?: number;
  },
  options: UsePayloadListOptions = {}
) {
  return usePayloadList<TourEventPayload>(
    () => payloadApi.getTourEvents(params),
    { ...options, dependencies: [params, ...(options.dependencies || [])] }
  )
}

export function useTourEvent(
  slug: string | undefined,
  options: UsePayloadOptions = {}
) {
  return usePayloadItem<TourEventPayload | null>(
    () => slug ? payloadApi.getTourEventBySlug(slug) : Promise.resolve(null),
    { ...options, dependencies: [slug, ...(options.dependencies || [])] }
  )
}

export function useUpcomingTourEvents(
  limit?: number,
  options: UsePayloadListOptions = {}
) {
  return useTourEvents({ upcoming: true, limit }, options)
}

export function useFeaturedTourEvents(options: UsePayloadListOptions = {}) {
  return useTourEvents({ featured: true }, options)
}

export function useNextTourEvent(options: UsePayloadOptions = {}) {
  return usePayloadItem<TourEventPayload | null>(
    async () => {
      const events = await payloadApi.getTourEvents({ upcoming: true, limit: 1 })
      return events[0] || null
    },
    options
  )
}

// ================================
// 6. GALLERY HOOKS
// ================================

export function useGalleryItems(
  params?: { 
    featured?: boolean; 
    category?: string[]; 
    type?: string;
    limit?: number;
  },
  options: UsePayloadListOptions = {}
) {
  return usePayloadList<GalleryItemPayload>(
    () => payloadApi.getGalleryItems(params),
    { ...options, dependencies: [params, ...(options.dependencies || [])] }
  )
}

export function useGalleryItem(
  slug: string | undefined,
  options: UsePayloadOptions = {}
) {
  return usePayloadItem<GalleryItemPayload | null>(
    () => slug ? payloadApi.getGalleryItemBySlug(slug) : Promise.resolve(null),
    { ...options, dependencies: [slug, ...(options.dependencies || [])] }
  )
}

export function useFeaturedGalleryItems(options: UsePayloadListOptions = {}) {
  return useGalleryItems({ featured: true }, options)
}

export function useGalleryByCategory(
  category: string[],
  options: UsePayloadListOptions = {}
) {
  return useGalleryItems({ category }, options)
}

export function useGalleryByType(
  type: string,
  options: UsePayloadListOptions = {}
) {
  return useGalleryItems({ type }, options)
}

// ================================
// 7. BLOG POST HOOKS
// ================================

export function usePosts(
  params?: { 
    featured?: boolean; 
    category?: string;
    status?: string;
    limit?: number;
  },
  options: UsePayloadListOptions = {}
) {
  return usePayloadList<PostPayload>(
    () => payloadApi.getPosts(params),
    { ...options, dependencies: [params, ...(options.dependencies || [])] }
  )
}

export function usePost(
  slug: string | undefined,
  options: UsePayloadOptions = {}
) {
  return usePayloadItem<PostPayload | null>(
    () => slug ? payloadApi.getPostBySlug(slug) : Promise.resolve(null),
    { ...options, dependencies: [slug, ...(options.dependencies || [])] }
  )
}

export function useFeaturedPosts(options: UsePayloadListOptions = {}) {
  return usePosts({ featured: true, status: 'published' }, options)
}

export function useLatestPosts(limit?: number, options: UsePayloadListOptions = {}) {
  return usePosts({ status: 'published', limit }, options)
}

export function usePostsByCategory(
  category: string,
  options: UsePayloadListOptions = {}
) {
  return usePosts({ category, status: 'published' }, options)
}

// ================================
// 8. COMPOSITE HOOKS
// ================================

// Hook for homepage data (combines multiple data sources)
export function useHomepageData() {
  const siteConfig = useSiteConfig()
  const navigation = useNavigation()
  const homepage = useHomepage()
  const featuredRelease = useLatestRelease()
  const upcomingEvents = useUpcomingTourEvents(3)
  const featuredGallery = useFeaturedGalleryItems({ limit: 6 })
  const latestPosts = useLatestPosts(3)

  const loading = siteConfig.loading || 
                 navigation.loading || 
                 homepage.loading || 
                 featuredRelease.loading || 
                 upcomingEvents.loading || 
                 featuredGallery.loading || 
                 latestPosts.loading

  const error = siteConfig.error || 
               navigation.error || 
               homepage.error || 
               featuredRelease.error || 
               upcomingEvents.error || 
               featuredGallery.error || 
               latestPosts.error

  return {
    siteConfig: siteConfig.data,
    navigation: navigation.data,
    homepage: homepage.data,
    featuredRelease: featuredRelease.data,
    upcomingEvents: upcomingEvents.data,
    featuredGallery: featuredGallery.data,
    latestPosts: latestPosts.data,
    loading,
    error,
    refetchAll: () => {
      siteConfig.refetch()
      navigation.refetch()
      homepage.refetch()
      featuredRelease.refetch()
      upcomingEvents.refetch()
      featuredGallery.refetch()
      latestPosts.refetch()
    }
  }
}

// Hook for artist page data
export function useArtistPageData(slug: string) {
  const siteConfig = useSiteConfig()
  const navigation = useNavigation()
  const artist = useArtist(slug)
  const releases = useReleases({ status: 'published' })
  const upcomingEvents = useUpcomingTourEvents()
  const galleryItems = useGalleryItems({ limit: 12 })

  const loading = siteConfig.loading || 
                 navigation.loading || 
                 artist.loading || 
                 releases.loading || 
                 upcomingEvents.loading || 
                 galleryItems.loading

  const error = siteConfig.error || 
               navigation.error || 
               artist.error || 
               releases.error || 
               upcomingEvents.error || 
               galleryItems.error

  return {
    siteConfig: siteConfig.data,
    navigation: navigation.data,
    artist: artist.data,
    releases: releases.data,
    upcomingEvents: upcomingEvents.data,
    galleryItems: galleryItems.data,
    loading,
    error,
  }
}

// ================================
// 9. UTILITY HOOKS
// ================================

// Hook for search functionality
export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    releases: ReleasePayload[]
    events: TourEventPayload[]
    posts: PostPayload[]
    gallery: GalleryItemPayload[]
  }>({
    releases: [],
    events: [],
    posts: [],
    gallery: []
  })
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ releases: [], events: [], posts: [], gallery: [] })
      return
    }

    setLoading(true)
    try {
      // This is a simplified search - in production you'd want to implement
      // server-side search or use a search service like Algolia
      const [releases, events, posts, gallery] = await Promise.all([
        payloadApi.getReleases({ status: 'published' }),
        payloadApi.getTourEvents({}),
        payloadApi.getPosts({ status: 'published' }),
        payloadApi.getGalleryItems({})
      ])

      const searchTerm = searchQuery.toLowerCase()
      
      setResults({
        releases: releases.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.shortDescription?.toLowerCase().includes(searchTerm)
        ),
        events: events.filter(item =>
          item.eventName.toLowerCase().includes(searchTerm) ||
          item.venue.toLowerCase().includes(searchTerm) ||
          item.venueAddress.city.toLowerCase().includes(searchTerm)
        ),
        posts: posts.filter(item =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.excerpt.toLowerCase().includes(searchTerm)
        ),
        gallery: gallery.filter(item =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.caption?.toLowerCase().includes(searchTerm)
        )
      })
    } catch (error) {
      console.error('Search error:', error)
      setResults({ releases: [], events: [], posts: [], gallery: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, search])

  return {
    query,
    setQuery,
    results,
    loading,
    search
  }
}

// Hook for favorites/bookmarks (using localStorage)
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('lean-favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  const addFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = [...prev, id]
      localStorage.setItem('lean-favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(fav => fav !== id)
      localStorage.setItem('lean-favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback((id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }, [isFavorite, addFavorite, removeFavorite])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  }
}