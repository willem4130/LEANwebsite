# 🎨 Customization Guide

Transform the LEAN framework into your unique music brand. This guide covers everything from colors and fonts to animations and content.

## Brand Identity Setup

### 1. Color System Customization

The framework uses a sophisticated electronic music color palette. Customize it in `/tailwind.config.ts`:

```typescript
// Your Brand Color System
brand: {
  // Core Background Hierarchy - Dark to Light
  void: "#your-darkest-color",     // Ultimate background
  dark: "#your-primary-bg",        // Main background  
  navy: "#your-secondary-bg",      // Card backgrounds
  charcoal: "#your-elevated-bg",   // Elevated surfaces
  
  // Your Signature Electric Colors
  neon: "#your-primary-accent",    // Main brand color
  electric: "#your-secondary-accent", // Supporting accent
  pulse: "#your-subtle-accent",    // Hover states
  
  // Energy Colors for Variety
  coral: "#your-warm-accent",      // Secondary CTAs
  purple: "#your-cool-accent",     // Special highlights
  magenta: "#your-premium-accent", // Premium elements
}
```

### 2. Typography System

Update your fonts in `/src/app/layout.tsx`:

```typescript
// Import your fonts
import { Inter, Orbitron, Exo_2, Space_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron' // For your artist name
})

// Add to your body className
className={`${inter.variable} ${orbitron.variable} font-body-primary`}
```

**Font Usage:**
- `font-display-primary` - Artist name, major headings (sci-fi style)
- `font-display-secondary` - Section titles, hero taglines
- `font-body-primary` - Content, descriptions, body text
- `font-body-accent` - Monospace for technical elements

### 3. Artist Information

Update your core artist information in environment variables:

```bash
# .env file
NEXT_PUBLIC_SITE_NAME="Your Artist Name"
NEXT_PUBLIC_SITE_URL="https://yoursite.com"
NEXT_PUBLIC_CONTACT_EMAIL="booking@yourname.com"

# Social Media Links
NEXT_PUBLIC_SPOTIFY_URL="https://open.spotify.com/artist/your-id"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/yourusername"
NEXT_PUBLIC_YOUTUBE_URL="https://youtube.com/@yourusername"
NEXT_PUBLIC_SOUNDCLOUD_URL="https://soundcloud.com/yourusername"
NEXT_PUBLIC_BANDCAMP_URL="https://yourusername.bandcamp.com"
```

## Content Customization

### 1. Hero Section

Edit your hero section in `/src/app/page.tsx`:

```typescript
<HeroSection
  artistName="Your Artist Name"
  tagline="Your Genre • Your Location • Your Unique Hook"
  backgroundType="gradient" // 'gradient', 'image', 'video', 'color'
  backgroundMedia={{
    url: "/images/hero/your-background.jpg", // Optional
    alt: "Your artist visual"
  }}
  ctaText="Book Now" // Primary call-to-action
  ctaLink="mailto:booking@yourname.com"
  secondaryCta={{
    text: "Listen Now",
    link: "https://open.spotify.com/artist/your-id"
  }}
  socialProof={{
    monthlyListeners: "50K+", // Optional
    venueCount: "100+",       // Optional  
    pressFeature: "Featured in XYZ Magazine" // Optional
  }}
/>
```

### 2. Navigation Menu

Customize your navigation in `/src/components/ui/navigation.tsx`:

```typescript
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Music', href: '#music' },
  { name: 'Shows', href: '#shows' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Press', href: '#press' },
  { name: 'Contact', href: '#contact' }
]
```

### 3. Gallery Content

Add your media in `/src/lib/gallery-data.ts`:

```typescript
export const galleryItems = [
  {
    id: 1,
    type: 'image',
    url: '/images/gallery/live-show-1.jpg',
    title: 'Electric Night at Club XYZ',
    description: 'Miami Beach - March 2024',
    category: 'live-shows'
  },
  {
    id: 2,
    type: 'video',
    url: '/videos/studio-session.mp4',
    title: 'Studio Session: Creating "New Track"',
    description: 'Behind the scenes in the studio',
    category: 'studio'
  },
  {
    id: 3,
    type: 'image',
    url: '/images/gallery/press-photo-1.jpg',
    title: 'Press Photo 2024',
    description: 'High-resolution press image',
    category: 'press'
  }
]

// Gallery categories for filtering
export const galleryCategories = [
  { id: 'all', name: 'All', color: 'brand-neon' },
  { id: 'live-shows', name: 'Live Shows', color: 'brand-electric' },
  { id: 'studio', name: 'Studio', color: 'brand-purple' },
  { id: 'press', name: 'Press', color: 'brand-coral' }
]
```

## Visual Assets

### 1. Image Specifications

Create these directories and add your images:

```
/public/images/
├── hero/
│   ├── hero-bg.jpg (1920×1080, optimized <200KB)
│   └── artist-photo.jpg (800×800, square format)
├── gallery/
│   ├── live-show-1.jpg (1200×800, landscape)
│   ├── studio-1.jpg (1200×800, landscape) 
│   └── press-photo-1.jpg (1200×1600, portrait)
├── press/
│   ├── press-kit-photo-1.jpg (high-res, 300 DPI)
│   └── logo-variations/ (PNG with transparency)
└── favicon.ico (32×32)
```

**Image Optimization Tips:**
- Use WebP format when possible for better compression
- Compress images to <200KB for fast loading
- Provide multiple sizes: mobile (800px), tablet (1200px), desktop (1920px)
- Always include alt text for accessibility

### 2. Video Assets

```
/public/videos/
├── hero-background.mp4 (1920×1080, <5MB, 10-15 seconds loop)
├── studio-session.mp4 (720p or 1080p, <20MB)
└── live-performance-highlights.mp4 (720p, <30MB)
```

**Video Optimization:**
- Use H.264 codec for compatibility
- Keep hero background videos under 5MB
- Include poster images as fallbacks
- Provide multiple formats (MP4, WebM)

## Animation Customization

### 1. Hero Animation Speed

Adjust animation timing in your hero section:

```typescript
<HeroSection
  animationDuration={3} // Seconds - default is 4
  // Shorter = snappier, Longer = more dramatic
/>
```

### 2. Custom Animation Triggers

Modify `/src/lib/gsap-animations.ts` for custom effects:

```typescript
// Your custom entrance animation
export const createCustomHeroAnimation = () => {
  const tl = gsap.timeline()
  
  tl.from('.hero-artist-name', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    scale: 0.9,
    ease: "power3.out"
  })
  .from('.hero-tagline', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: "power2.out"
  }, "-=0.5")
  
  return tl
}
```

### 3. Scroll Animation Customization

Edit scroll triggers in `/src/lib/animations/`:

```typescript
// Customize when animations trigger
ScrollTrigger.create({
  trigger: '.gallery-section',
  start: 'top 80%', // Animation starts when section is 80% in view
  end: 'bottom 20%',
  animation: yourGalleryAnimation,
  toggleActions: 'play none none reverse'
})
```

## Layout & Content Sections

### 1. Adding New Sections

Create a new section component in `/src/components/sections/`:

```typescript
// your-new-section.tsx
export function YourNewSection() {
  return (
    <section className="py-20 bg-brand-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-h2-mobile sm:text-h2-tablet lg:text-h2-desktop text-brand-text-hero mb-8">
          Your Section Title
        </h2>
        {/* Your content */}
      </div>
    </section>
  )
}
```

Then add it to your main page:

```typescript
// page.tsx
import { YourNewSection } from '@/components/sections/your-new-section'

export default function Home() {
  return (
    <main>
      <HeroSection {...heroProps} />
      <YourNewSection />
      <Gallery {...galleryProps} />
    </main>
  )
}
```

### 2. Music Player Integration

Add a music section with embedded players:

```typescript
// music-section.tsx
export function MusicSection() {
  const tracks = [
    {
      title: "Your Track Name",
      spotify: "https://open.spotify.com/embed/track/your-track-id",
      soundcloud: "https://w.soundcloud.com/player/?url=your-track-url"
    }
  ]

  return (
    <section className="py-20 bg-brand-navy">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12">Latest Releases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((track, index) => (
            <div key={index} className="bg-brand-dark rounded-xl p-6">
              <h3 className="text-xl mb-4">{track.title}</h3>
              <iframe 
                src={track.spotify}
                width="100%" 
                height="152"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 3. Shows/Events Section

Create an events display:

```typescript
// shows-section.tsx
interface Show {
  date: string
  venue: string
  city: string
  ticketUrl?: string
  soldOut?: boolean
}

const upcomingShows: Show[] = [
  {
    date: "2024-03-15",
    venue: "Electric Warehouse",
    city: "Miami, FL", 
    ticketUrl: "https://tickets.com/your-show"
  }
]
```

## SEO & Meta Tags

Update your metadata in `/src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Artist Name - Electronic Music Producer & DJ',
  description: 'Official website of [Your Artist Name]. Book shows, listen to latest tracks, and get press materials.',
  keywords: ['electronic music', 'DJ', 'producer', 'your genre', 'your city'],
  authors: [{ name: 'Your Artist Name' }],
  creator: 'Your Artist Name',
  publisher: 'Your Artist Name',
  openGraph: {
    title: 'Your Artist Name - Electronic Music',
    description: 'Official website with latest music, show bookings, and more',
    url: 'https://yoursite.com',
    siteName: 'Your Artist Name',
    images: [{
      url: 'https://yoursite.com/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Your Artist Name'
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Artist Name - Electronic Music',
    description: 'Official website with latest music and show bookings',
    creator: '@yourusername',
    images: ['https://yoursite.com/images/og-image.jpg'],
  }
}
```

## Advanced Customization

### 1. Custom Button Variants

Add new button styles in `/src/components/ui/button.tsx`:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        // Your custom variant
        "electric": "bg-gradient-to-r from-brand-neon to-brand-electric text-brand-dark hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] font-semibold",
        "neon-outline": "border-2 border-brand-neon text-brand-neon hover:bg-brand-neon hover:text-brand-dark"
      }
    }
  }
)
```

### 2. Custom Animations

Create your signature animation in `/src/lib/animations/custom-animations.ts`:

```typescript
export const createSignatureEffect = () => {
  return gsap.timeline()
    .to('.signature-element', {
      duration: 1,
      rotateY: 360,
      scale: 1.1,
      ease: "power2.inOut"
    })
    .to('.signature-element', {
      duration: 0.5,
      scale: 1,
      ease: "bounce.out"
    })
}
```

### 3. Dark/Light Mode Toggle

Add theme switching capability:

```typescript
// theme-provider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext<{
  theme: 'dark' | 'light'
  toggleTheme: () => void
}>({
  theme: 'dark',
  toggleTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## Performance Optimization

### 1. Image Loading Strategy

Implement lazy loading and optimization:

```typescript
import Image from 'next/image'

// Optimized image component
<Image
  src="/images/gallery/show-1.jpg"
  alt="Live performance"
  width={1200}
  height={800}
  loading="lazy" // Lazy load for better performance
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw..."
/>
```

### 2. Bundle Analysis

Check your bundle size:

```bash
# Analyze your bundle
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

# Run analysis
ANALYZE=true npm run build
```

### 3. Animation Performance

Optimize animations for smooth 60fps:

```typescript
// Use transform and opacity for best performance
gsap.to('.element', {
  x: 100,        // Better than changing left/right
  y: 50,         // Better than changing top/bottom
  scale: 1.1,    // Better than width/height
  opacity: 0.5,  // Always performant
  rotation: 45,  // Better than transform rotate
})
```

## Testing Your Customizations

### 1. Cross-Device Testing

Test your customizations across devices:

```bash
# Start dev server accessible on network
npm run dev -- --host 0.0.0.0

# Test on your phone using your computer's IP:
# http://192.168.1.100:3000
```

### 2. Performance Testing

Check your site performance:

```bash
# Build and test production version
npm run build
npm run start

# Use Lighthouse in Chrome DevTools:
# Right-click → Inspect → Lighthouse → Generate Report
```

### 3. Accessibility Testing

Ensure your customizations are accessible:

```typescript
// Add proper ARIA labels
<button aria-label="Play track" className="play-button">
  <PlayIcon />
</button>

// Use semantic HTML
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="#music">Music</a></li>
  </ul>
</nav>
```

## Troubleshooting Common Issues

### Build Errors
- **TypeScript errors**: Check prop types match your customizations
- **Import errors**: Verify file paths are correct  
- **CSS conflicts**: Use Tailwind's utility classes consistently

### Animation Issues
- **Choppy animations**: Use `will-change: transform` on animated elements
- **Memory leaks**: Clean up GSAP animations with `cleanup()` functions
- **Mobile performance**: Test animations on actual devices

### Styling Problems
- **Colors not working**: Check Tailwind config is properly formatted
- **Fonts not loading**: Verify font imports in layout.tsx
- **Responsive issues**: Test breakpoints using browser dev tools

---

**🎨 Your LEAN music website is now uniquely yours!**

*Next: [Deploy your customized site →](deployment.md)*