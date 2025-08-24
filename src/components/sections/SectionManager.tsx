/**
 * Section Manager - Complete Website Section Control
 * ================================================
 * 
 * React component that provides complete control over website sections:
 * - Dynamic section rendering
 * - Real-time content updates
 * - A/B testing support
 * - Analytics integration
 * - Performance optimization
 * 
 * Enterprise features:
 * - Section preloading
 * - Conditional rendering
 * - Error boundaries
 * - Analytics tracking
 */

'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import { useEnhancedApi } from '@/lib/enhanced-api-framework'
import { dynamicRenderer, componentRegistry } from '@/lib/dynamic-renderer'
import type { PageSection, ThemeSettings } from '@/lib/enhanced-api-framework'

interface SectionManagerProps {
  page: string
  theme?: ThemeSettings
  enableAnalytics?: boolean
  enableABTesting?: boolean
  className?: string
  loadingFallback?: React.ComponentType
  errorFallback?: React.ComponentType<{ error?: Error }>
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  page,
  theme,
  enableAnalytics = false,
  enableABTesting = false,
  className,
  loadingFallback: LoadingFallback,
  errorFallback: ErrorFallback,
}) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  // Fetch sections for the page with real-time updates
  const { data: sections, loading, error, cached } = useEnhancedApi<PageSection[]>(
    `/page-sections?page=${page}`,
    {
      realtime: true,
      cache: true,
      ttl: 300000, // 5 minutes
    }
  )

  // Filter and sort sections
  const filteredSections = useMemo(() => {
    if (!sections) return []
    
    return sections
      .filter(section => 
        section.enabled && 
        (section.page.includes(page) || section.page.includes('global'))
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [sections, page])

  // Handle A/B testing variant selection
  useEffect(() => {
    if (!enableABTesting || !filteredSections) return

    const variants: Record<string, string> = {}
    
    filteredSections.forEach(section => {
      if (section.abTesting?.enabled && section.abTesting.variants?.length > 0) {
        // Simple random variant selection (in production, use proper A/B testing logic)
        const totalWeight = section.abTesting.variants.reduce((sum, v) => sum + (v.weight || 0), 0)
        const random = Math.random() * totalWeight
        let currentWeight = 0
        
        for (const variant of section.abTesting.variants) {
          currentWeight += variant.weight || 0
          if (random <= currentWeight) {
            variants[section.id] = variant.name
            break
          }
        }
      }
    })
    
    setSelectedVariants(variants)
  }, [filteredSections, enableABTesting])

  // Set theme on renderer
  useEffect(() => {
    if (theme) {
      dynamicRenderer.setTheme(theme)
    }
  }, [theme])

  // Track page view for analytics
  useEffect(() => {
    if (enableAnalytics && sections) {
      // Track page view with section count
      console.log('Analytics: Page view', {
        page,
        sectionCount: filteredSections.length,
        cached,
        timestamp: Date.now(),
      })
    }
  }, [page, sections, enableAnalytics, cached, filteredSections.length])

  if (loading) {
    return LoadingFallback ? <LoadingFallback /> : <SectionLoadingSkeleton />
  }

  if (error) {
    return ErrorFallback ? 
      <ErrorFallback error={new Error(error)} /> : 
      <SectionErrorFallback error={error} />
  }

  if (!filteredSections || filteredSections.length === 0) {
    return <EmptySectionsMessage page={page} />
  }

  return (
    <div className={`section-manager ${className || ''}`} data-page={page}>
      {filteredSections.map((section) => (
        <SectionWrapper
          key={section.id}
          section={section}
          variant={selectedVariants[section.id]}
          theme={theme}
          enableAnalytics={enableAnalytics}
        />
      ))}
    </div>
  )
}

// ================================
// SECTION WRAPPER COMPONENT
// ================================

interface SectionWrapperProps {
  section: PageSection
  variant?: string
  theme?: ThemeSettings
  enableAnalytics?: boolean
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  section,
  variant,
  theme,
  enableAnalytics,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasRendered, setHasRendered] = useState(false)

  // Intersection Observer for lazy loading and analytics
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          
          if (!hasRendered && enableAnalytics) {
            // Track section view
            console.log('Analytics: Section view', {
              sectionId: section.id,
              sectionName: section.sectionName,
              sectionType: section.sectionType,
              variant,
              timestamp: Date.now(),
            })
            setHasRendered(true)
          }
        }
      },
      {
        rootMargin: '50px', // Load sections 50px before they come into view
        threshold: 0.1,
      }
    )

    const element = document.getElementById(section.sectionId)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [section.id, section.sectionId, section.sectionName, section.sectionType, variant, enableAnalytics, hasRendered])

  // Apply A/B testing variant
  const sectionWithVariant = useMemo(() => {
    if (!variant || !section.abTesting?.variants) return section
    
    const selectedVariant = section.abTesting.variants.find(v => v.name === variant)
    if (!selectedVariant?.contentOverride) return section
    
    // Merge variant content override
    return {
      ...section,
      content: {
        ...section.content,
        ...selectedVariant.contentOverride,
      },
    }
  }, [section, variant])

  // Render section with error boundary and analytics
  return (
    <Suspense fallback={<SectionLoadingSkeleton />}>
      <SectionErrorBoundary 
        sectionId={section.id}
        sectionName={section.sectionName}
        onError={(error) => {
          if (enableAnalytics) {
            console.error('Analytics: Section error', {
              sectionId: section.id,
              sectionName: section.sectionName,
              error: error.message,
              timestamp: Date.now(),
            })
          }
        }}
      >
        {dynamicRenderer.renderSection(sectionWithVariant, {
          theme,
          enableAnalytics,
          onRender: enableAnalytics ? (componentName, props) => {
            console.log('Analytics: Component render', {
              sectionId: section.id,
              componentName,
              timestamp: Date.now(),
            })
          } : undefined,
        })}
      </SectionErrorBoundary>
    </Suspense>
  )
}

// ================================
// SECTION ERROR BOUNDARY
// ================================

interface SectionErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface SectionErrorBoundaryProps {
  sectionId: string
  sectionName: string
  children: React.ReactNode
  onError?: (error: Error) => void
}

class SectionErrorBoundary extends React.Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Section Error [${this.props.sectionName}]:`, {
      error: error.message,
      sectionId: this.props.sectionId,
      componentStack: errorInfo.componentStack,
    })
    
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-error p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">
            Section Error: {this.props.sectionName}
          </h3>
          <p className="text-red-600 text-sm">
            {this.state.error?.message || 'An error occurred while rendering this section.'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-red-600 text-xs cursor-pointer">Details</summary>
              <pre className="text-xs text-red-500 mt-1 overflow-auto">
                Section ID: {this.props.sectionId}
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// ================================
// FALLBACK COMPONENTS
// ================================

const SectionLoadingSkeleton: React.FC = () => (
  <div className="section-loading animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
)

const SectionErrorFallback: React.FC<{ error: string }> = ({ error }) => (
  <div className="section-error p-6 bg-red-50 border border-red-200 rounded-lg text-center">
    <h3 className="text-red-800 font-semibold mb-2">Unable to Load Sections</h3>
    <p className="text-red-600 text-sm mb-4">{error}</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Reload Page
    </button>
  </div>
)

const EmptySectionsMessage: React.FC<{ page: string }> = ({ page }) => (
  <div className="empty-sections p-8 text-center">
    <h3 className="text-gray-600 font-semibold mb-2">No Sections Found</h3>
    <p className="text-gray-500 text-sm">
      No sections are configured for the "{page}" page.
    </p>
    {process.env.NODE_ENV === 'development' && (
      <p className="text-gray-400 text-xs mt-2">
        Add sections in the CMS admin panel to display content here.
      </p>
    )}
  </div>
)

// ================================
// PRELOADER COMPONENT
// ================================

interface SectionPreloaderProps {
  sections: PageSection[]
  priority?: 'high' | 'medium' | 'low'
}

export const SectionPreloader: React.FC<SectionPreloaderProps> = ({ 
  sections, 
  priority = 'medium' 
}) => {
  useEffect(() => {
    if (!sections?.length) return

    const preloadSections = async () => {
      const componentNames = sections
        .filter(section => section.content?.customContent?.componentName)
        .map(section => section.content.customContent.componentName)
        .filter(Boolean)

      // Preload components based on priority
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 500
      
      setTimeout(async () => {
        await Promise.allSettled(
          componentNames.map(name => componentRegistry.preload(name))
        )
      }, delay)
    }

    preloadSections()
  }, [sections, priority])

  return null // This component doesn't render anything
}

// ================================
// HOOKS
// ================================

export function useSectionAnalytics(sectionId: string, enabled: boolean = false) {
  const [metrics, setMetrics] = useState({
    views: 0,
    interactions: 0,
    timeSpent: 0,
  })

  useEffect(() => {
    if (!enabled) return

    let startTime = Date.now()
    let isVisible = false

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        startTime = Date.now()
        setMetrics(prev => ({ ...prev, views: prev.views + 1 }))
      } else if (startTime) {
        const timeSpent = Date.now() - startTime
        setMetrics(prev => ({ ...prev, timeSpent: prev.timeSpent + timeSpent }))
      }
    })

    const element = document.getElementById(sectionId)
    if (element) {
      observer.observe(element)

      // Track interactions
      const handleInteraction = () => {
        if (isVisible) {
          setMetrics(prev => ({ ...prev, interactions: prev.interactions + 1 }))
        }
      }

      element.addEventListener('click', handleInteraction)
      element.addEventListener('scroll', handleInteraction)

      return () => {
        observer.disconnect()
        element.removeEventListener('click', handleInteraction)
        element.removeEventListener('scroll', handleInteraction)
      }
    }
  }, [sectionId, enabled])

  return metrics
}

// ================================
// EXPORTS
// ================================

export default SectionManager
export type { SectionManagerProps, SectionWrapperProps }