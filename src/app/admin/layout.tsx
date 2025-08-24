/**
 * Payload CMS Admin Layout
 * ========================
 * 
 * Layout component for the Payload CMS admin interface
 * Provides proper metadata and structure for the admin panel
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LEAN CMS - Admin Dashboard',
  description: 'Content management system for music artist websites',
  robots: 'noindex, nofollow', // Prevent search engine indexing
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="payload-admin-layout">
      {children}
    </div>
  )
}