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
  params: {
    segments: string[]
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

// Import map function for PayloadCMS
async function getImportMap() {
  try {
    // Use dynamic import for ESM compatibility
    const importMapModule = await import('../../(payload)/admin/importMap.js')
    return importMapModule.importMap || importMapModule.default || {}
  } catch (error) {
    console.warn('ImportMap not found or failed to load:', error.message)
    return {}
  }
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default async function AdminPage({ params, searchParams }: Args) {
  const importMap = await getImportMap()
  return RootPage({ config, importMap, params, searchParams })
}