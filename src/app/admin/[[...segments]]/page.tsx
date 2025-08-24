/**
 * Payload CMS Admin Page Handler
 * ==============================
 * 
 * Dynamic route handler for Payload CMS admin interface
 * Handles all admin panel routes and authentication
 */

import config from '@/payload.config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

// Import map function for PayloadCMS
async function getImportMap() {
  try {
    // Use dynamic import for ESM compatibility
    const importMapModule = await import('../../(payload)/admin/importMap.js') as any
    return importMapModule.importMap || {}
  } catch (error) {
    console.warn('ImportMap not found or failed to load:', error instanceof Error ? error.message : String(error))
    return {}
  }
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return generatePageMetadata({ 
    config, 
    params: resolvedParams as any, 
    searchParams: resolvedSearchParams as any 
  })
}

export default async function AdminPage({ params, searchParams }: Args) {
  const [resolvedParams, resolvedSearchParams, importMap] = await Promise.all([
    params,
    searchParams,
    getImportMap()
  ])
  
  return RootPage({ 
    config, 
    importMap, 
    params: resolvedParams as any, 
    searchParams: resolvedSearchParams as any 
  })
}