'use client'

import React, { ReactElement } from 'react'
import DynamicComponent from './DynamicComponent'

interface ComponentVariant {
  id: string
  componentId: string
  props: Record<string, any>
  weight: number
  active: boolean
}

interface ABTestComponentProps {
  testId: string
  userId: string
  children?: ReactElement[]
  fallback?: ReactElement
}

// Simple client-side A/B testing logic
function getABTestVariant(testId: string, userId: string): ComponentVariant | null {
  // This is a simplified A/B testing implementation
  // In a real application, you'd integrate with a proper A/B testing service
  
  const hash = hashString(`${testId}-${userId}`)
  const bucket = hash % 100
  
  // Simple 50/50 split example
  return {
    id: bucket < 50 ? 'variant-a' : 'variant-b',
    componentId: bucket < 50 ? 'hero-section-a' : 'hero-section-b',
    props: {
      variant: bucket < 50 ? 'a' : 'b'
    },
    weight: 50,
    active: true
  }
}

// Simple hash function for consistent bucketing
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export function ABTestComponent({ 
  testId, 
  userId, 
  children, 
  fallback 
}: ABTestComponentProps): ReactElement {
  const [variant, setVariant] = React.useState<ComponentVariant | null>(null)

  React.useEffect(() => {
    const testVariant = getABTestVariant(testId, userId)
    setVariant(testVariant)

    // Track impression (in a real app, send to analytics)
    console.log('A/B Test Impression:', {
      testId,
      userId,
      variantId: testVariant?.id,
    })

    // You could emit this to an analytics service here
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_impression', {
        test_id: testId,
        variant_id: testVariant?.id,
        user_id: userId,
      })
    }
  }, [testId, userId])

  if (!variant) {
    return fallback || <div className="animate-pulse">Loading test...</div>
  }

  return (
    <DynamicComponent
      componentId={variant.componentId}
      {...variant.props}
      fallback={fallback}
    />
  )
}

export default ABTestComponent