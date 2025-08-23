'use client'

import { Metadata } from 'next'
import { HeroSection } from '@/components/artist/hero-section'
import { TwoColumnLayout } from '@/components/artist/two-column-layout'
import { Gallery } from '@/components/artist/gallery'
import { ContactSocial } from '@/components/artist/contact-social'
import { NavSwitcher } from '@/components/ui/nav-switcher'

// Mock data for demonstration
const mockTourEvents = [
  {
    id: '1',
    eventName: 'Summer Festival 2024',
    venue: 'Red Rocks Amphitheatre',
    city: 'Morrison, CO',
    date: '2024-08-15',
    ticketUrl: 'https://example.com/tickets',
    soldOut: false,
    featured: true,
  },
  {
    id: '2',
    eventName: 'Club Night',
    venue: 'The Fillmore',
    city: 'San Francisco, CA',
    date: '2024-08-22',
    ticketUrl: 'https://example.com/tickets',
    soldOut: true,
    featured: false,
  },
  {
    id: '3',
    eventName: 'Acoustic Session',
    venue: 'Blue Note',
    city: 'New York, NY',
    date: '2024-09-05',
    ticketUrl: 'https://example.com/tickets',
    soldOut: false,
    featured: false,
  },
]

const mockGalleryItems = [
  {
    id: '1',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    caption: 'Live performance at Summer Festival',
    category: ['live'],
    featured: true,
    altText: 'Aria Nova performing live on stage',
  },
  {
    id: '2',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    caption: 'Studio session for new album',
    category: ['studio'],
    featured: false,
    altText: 'Recording studio session',
  },
  {
    id: '3',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1520155707862-5b32e0e7d4c8?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520155707862-5b32e0e7d4c8?w=400&h=300&fit=crop',
    caption: 'Behind the scenes at music video shoot',
    category: ['video'],
    featured: true,
    altText: 'Music video production behind the scenes',
  },
  {
    id: '4',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    caption: 'Intimate acoustic performance',
    category: ['live', 'acoustic'],
    featured: false,
    altText: 'Acoustic guitar performance',
  },
  {
    id: '5',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&h=300&fit=crop',
    caption: 'Electronic equipment and synthesizers',
    category: ['studio', 'equipment'],
    featured: false,
    altText: 'Electronic music production equipment',
  },
  {
    id: '6',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=300&fit=crop',
    caption: 'Crowd enjoying the show',
    category: ['live', 'crowd'],
    featured: false,
    altText: 'Concert crowd enjoying live music',
  },
]

const mockSocialLinks = [
  {
    platform: 'instagram' as const,
    url: 'https://instagram.com/arianova',
    username: 'arianova',
  },
  {
    platform: 'facebook' as const,
    url: 'https://facebook.com/arianovamusicofficial',
    username: 'arianovamusicofficial',
  },
  {
    platform: 'youtube' as const,
    url: 'https://youtube.com/@arianova',
    username: 'arianova',
  },
  {
    platform: 'spotify' as const,
    url: 'https://open.spotify.com/artist/arianova',
  },
  {
    platform: 'soundcloud' as const,
    url: 'https://soundcloud.com/arianova',
    username: 'arianova',
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <NavSwitcher />
      
      {/* Hero Section with gradient background */}
      <HeroSection
        artistName="ARIA NOVA"
        tagline="Electronic Soundscapes • Live Performances • Original Compositions"
        backgroundType="gradient"
        backgroundColor="#1a1a2e"
        animationDuration={4}
        ctaText="Listen Now"
        ctaLink="https://open.spotify.com/artist/demo"
        textColor="#ffffff"
      />

      {/* Two Column Layout with image background */}
      <TwoColumnLayout
        tourEvents={mockTourEvents}
        bioTitle="About Aria Nova"
        bioContent={`
          <p>Aria Nova is an electronic music producer and live performer known for creating immersive soundscapes that blend ambient textures with driving beats. Drawing inspiration from both organic and synthetic worlds, Aria crafts music that tells stories without words.</p>
          
          <p>With over a decade of experience in electronic music production, Aria has performed at major festivals across North America and Europe. Their debut album "Digital Horizons" reached #3 on the electronic charts and has been featured in documentaries and art installations worldwide.</p>
          
          <p>When not touring, Aria works from a solar-powered studio nestled in the mountains of Colorado, where the natural environment continues to inspire new sonic explorations.</p>
        `}
        bioImage={{
          url: 'https://images.unsplash.com/photo-1594736797933-d0981ba5fbf6?w=600&h=400&fit=crop',
          alt: 'Aria Nova in the studio',
        }}
        backgroundType="color"
        backgroundColor="#f8fafc"
      />

      {/* Gallery with masonry layout */}
      <Gallery
        items={mockGalleryItems}
        layout="masonry"
        title="Gallery"
        backgroundType="color"
        backgroundColor="#ffffff"
      />

      {/* Contact & Social with dark gradient */}
      <ContactSocial
        socialLinks={mockSocialLinks}
        contactEmail="booking@arianova.com"
        backgroundType="gradient"
        backgroundColor="#0f0f23"
      />
    </div>
  )
}