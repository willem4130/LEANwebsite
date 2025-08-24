'use client'

import React, { ComponentType, ReactElement } from 'react'

// Component Registry interface for client-side use
interface ComponentConfig {
  path: string
  lazy?: boolean
  preload?: boolean
  dependencies?: string[]
  fallback?: ReactElement
}

class ClientComponentRegistry {
  private components = new Map<string, ComponentConfig>()
  private loadedComponents = new Map<string, ComponentType<any>>()
  private loadingPromises = new Map<string, Promise<ComponentType<any> | null>>()

  register(id: string, config: ComponentConfig): void {
    this.components.set(id, config)
  }

  async loadComponent(id: string): Promise<ComponentType<any> | null> {
    // Return cached component if already loaded
    if (this.loadedComponents.has(id)) {
      return this.loadedComponents.get(id) || null
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id) || null
    }

    const config = this.components.get(id)
    if (!config) {
      console.warn(`Component ${id} not found in registry`)
      return null
    }

    // Create loading promise
    const loadingPromise = this.loadComponentFromPath(config.path)
    this.loadingPromises.set(id, loadingPromise)

    try {
      const component = await loadingPromise
      if (component) {
        this.loadedComponents.set(id, component)
      }
      this.loadingPromises.delete(id)
      return component
    } catch (error) {
      this.loadingPromises.delete(id)
      console.error(`Failed to load component ${id}:`, error)
      return null
    }
  }

  private async loadComponentFromPath(path: string): Promise<ComponentType<any> | null> {
    try {
      const module = await import(path)
      return module.default || module
    } catch (error) {
      console.error(`Failed to import component from ${path}:`, error)
      return null
    }
  }
}

// Create client-side registry instance
const clientComponentRegistry = new ClientComponentRegistry()

// Register some common components
clientComponentRegistry.register('hero-section', { path: '/components/sections/HeroSection' })
clientComponentRegistry.register('gallery-grid', { path: '/components/sections/GalleryGrid' })
clientComponentRegistry.register('contact-form', { path: '/components/sections/ContactForm' })

interface DynamicComponentProps {
  componentId: string
  fallback?: ReactElement
  onError?: (error: Error) => void
  [key: string]: any
}

export function DynamicComponent({ 
  componentId, 
  fallback, 
  onError,
  ...props 
}: DynamicComponentProps): ReactElement {
  const [Component, setComponent] = React.useState<ComponentType<any> | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    clientComponentRegistry.loadComponent(componentId)
      .then(component => {
        if (component) {
          setComponent(() => component)
        } else {
          const err = new Error(`Component ${componentId} not found`)
          setError(err)
          onError?.(err)
        }
      })
      .catch(err => {
        setError(err)
        onError?.(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [componentId, onError])

  if (loading) {
    return fallback || <div className="animate-pulse">Loading component...</div>
  }

  if (error || !Component) {
    return fallback || <div className="text-red-500">Failed to load component</div>
  }

  return <Component {...props} />
}

export default DynamicComponent