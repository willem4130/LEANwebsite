# LEAN Framework - Payload CMS Integration Guide

## Overview

This guide provides comprehensive instructions for setting up, configuring, and customizing the Payload CMS integration within the LEAN website framework. This system is designed for rapid deployment of professional music artist websites with full content management capabilities.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Installation & Setup](#installation--setup)
3. [Configuration](#configuration)
4. [Collections Reference](#collections-reference)
5. [Frontend Integration](#frontend-integration)
6. [Customization Guide](#customization-guide)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

### System Components

```
LEAN Framework + Payload CMS Integration
├── Backend (Payload CMS)
│   ├── Collections (Content Types)
│   ├── Media Management
│   ├── User Authentication
│   └── REST API
├── API Layer (Type-Safe Integration)
│   ├── Zod Schemas
│   ├── API Client
│   └── Error Handling
├── Frontend (Next.js + React)
│   ├── React Hooks
│   ├── Components
│   └── Pages
└── Admin Panel (Customized UI)
    ├── Content Management
    ├── Media Library
    └── User Management
```

### Core Features

- **Type-Safe API Integration**: Full TypeScript support with Zod validation
- **Music-Focused Collections**: Releases, tour events, gallery, artist profiles
- **Media Management**: Optimized image/video handling with multiple sizes
- **SEO Optimization**: Built-in SEO fields for all content types
- **Multi-Language Support**: Ready for international artists
- **Role-Based Access**: Admin, Editor, and Contributor roles
- **Production Ready**: Security, performance, and error handling

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Next.js 14+ project

### Step 1: Environment Configuration

Create or update your `.env` file:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/music_artist_website

# Payload CMS (Required)
PAYLOAD_SECRET=your-secure-payload-secret-key-here
PAYLOAD_CONFIG_PATH=src/payload.config.ts

# Next.js (Required)
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Media Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

### Step 2: Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE music_artist_website;
```

2. Payload will automatically handle table creation on first run.

### Step 3: Install Dependencies

The required dependencies are already included in package.json:
- `payload@^3.53.0`
- `@payloadcms/db-postgres@^3.53.0`
- `@payloadcms/next@^3.53.0`
- `@payloadcms/richtext-slate@^3.53.0`

### Step 4: Generate Types

Run Payload to generate TypeScript types:

```bash
npm run payload generate:types
```

### Step 5: Create Initial Admin User

Start the development server and navigate to `/admin` to create your first admin user:

```bash
npm run dev
```

Visit `http://localhost:3000/admin` and follow the setup wizard.

## Configuration

### Main Configuration File

The main Payload config is located at `src/payload.config.ts`. This file includes:

- **Collections**: All content types (Users, Media, Artists, etc.)
- **Globals**: Site-wide settings (Navigation, Homepage)
- **Admin Panel**: Customization and branding
- **Database**: PostgreSQL adapter configuration
- **Security**: CORS, CSRF, rate limiting

### Key Configuration Options

```typescript
// Example customization in payload.config.ts
export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Your Artist Name CMS',
      favicon: '/your-favicon.ico',
    },
  },
  
  // Your collections
  collections: [/* ... */],
  
  // Site-specific globals
  globals: [/* ... */],
  
  // Database connection
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
})
```

## Collections Reference

### Core Collections

#### 1. **Users** (`users`)
- Admin panel authentication
- Role-based permissions (Admin, Editor, Contributor)
- Profile management

#### 2. **Media** (`media`)
- File uploads (images, videos, audio)
- Automatic image resizing and optimization
- Metadata and categorization
- Copyright management

#### 3. **Site Config** (`site-config`)
- Global site settings
- Branding and colors
- SEO defaults
- Feature toggles

#### 4. **Artists** (`artists`)
- Artist/band member profiles
- Biography and background
- Equipment and influences
- Social media links

#### 5. **Releases** (`releases`)
- Albums, EPs, singles, mixtapes
- Track listings and credits
- Streaming/purchase links
- Artwork and metadata

#### 6. **Tour Events** (`tour-events`)
- Concert and event listings
- Venue information
- Ticket sales integration
- Supporting acts

#### 7. **Gallery** (`gallery`)
- Photo and video galleries
- Categorization and tagging
- Related content linking
- Display preferences

#### 8. **Posts** (`posts`)
- Blog posts and news
- Rich content editing
- Category organization
- Author attribution

### Global Collections

#### 1. **Navigation** (`navigation`)
- Primary site navigation
- Social media links
- External link management

#### 2. **Homepage** (`homepage`)
- Hero section configuration
- Featured content selection
- Layout preferences

## Frontend Integration

### API Client Usage

```typescript
import { payloadApi } from '@/lib/payload-api'

// Get all published releases
const releases = await payloadApi.getReleases({ 
  status: 'published',
  limit: 10 
})

// Get artist by slug
const artist = await payloadApi.getArtistBySlug('artist-name')

// Get upcoming tour events
const events = await payloadApi.getTourEvents({ 
  upcoming: true,
  limit: 5 
})
```

### React Hooks Usage

```typescript
import { 
  useReleases, 
  useUpcomingTourEvents,
  useFeaturedGalleryItems 
} from '@/hooks/usePayloadCMS'

function ArtistPage() {
  // Get latest releases
  const { data: releases, loading, error } = useReleases({
    status: 'published',
    limit: 6
  })
  
  // Get upcoming shows
  const { data: events } = useUpcomingTourEvents(3)
  
  // Get featured gallery items
  const { data: gallery } = useFeaturedGalleryItems({ limit: 8 })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {/* Your component JSX */}
    </div>
  )
}
```

### Composite Hooks for Complex Pages

```typescript
import { useHomepageData } from '@/hooks/usePayloadCMS'

function HomePage() {
  const {
    siteConfig,
    navigation,
    featuredRelease,
    upcomingEvents,
    featuredGallery,
    latestPosts,
    loading,
    error,
    refetchAll
  } = useHomepageData()
  
  // All homepage data loaded with single hook
}
```

## Customization Guide

### Adding New Collections

1. **Create Collection File**:
```typescript
// src/collections/Merchandise.ts
import { CollectionConfig } from 'payload/types'

export const Merchandise: CollectionConfig = {
  slug: 'merchandise',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    // Add more fields as needed
  ],
}
```

2. **Add to Main Config**:
```typescript
// src/payload.config.ts
import { Merchandise } from './collections/Merchandise'

export default buildConfig({
  collections: [
    // ... existing collections
    Merchandise,
  ],
})
```

3. **Create API Integration**:
```typescript
// Add to src/lib/payload-api.ts
export const MerchandiseSchema = z.object({
  name: z.string(),
  price: z.number(),
  // ... other fields
})

export type MerchandisePayload = z.infer<typeof MerchandiseSchema> & PayloadDocument

// Add methods to PayloadApiClient class
async getMerchandise(): Promise<MerchandisePayload[]> {
  const result = await this.getCollection<MerchandisePayload>('merchandise')
  return result.docs
}
```

4. **Create React Hook**:
```typescript
// Add to src/hooks/usePayloadCMS.ts
export function useMerchandise(options: UsePayloadListOptions = {}) {
  return usePayloadList<MerchandisePayload>(
    () => payloadApi.getMerchandise(),
    options
  )
}
```

### Customizing Admin Interface

#### Brand Colors and Styling

Edit `src/admin/styles.css`:

```css
:root {
  --theme-primary: #your-brand-color;
  --theme-secondary: #your-secondary-color;
  /* ... other variables */
}
```

#### Custom Field Components

```typescript
// src/admin/components/CustomField.tsx
import React from 'react'
import { TextField } from 'payload/components/forms'

const CustomField: React.FC = () => {
  return (
    <div className="custom-field-wrapper">
      <TextField 
        name="customField"
        label="Custom Field"
        required={true}
      />
    </div>
  )
}

export default CustomField
```

#### Adding Custom Views

```typescript
// src/admin/views/CustomDashboard.tsx
import React from 'react'
import { AdminView } from 'payload/config'

const CustomDashboard: AdminView = () => {
  return (
    <div className="custom-dashboard">
      <h1>Artist Dashboard</h1>
      {/* Custom dashboard content */}
    </div>
  )
}

export default CustomDashboard
```

### Multi-Artist Setup

For managing multiple artists in one installation:

1. **Add Artist Selection Field** to relevant collections:
```typescript
{
  name: 'artist',
  type: 'relationship',
  relationTo: 'artists',
  required: true,
  admin: {
    position: 'sidebar',
  },
}
```

2. **Filter by Artist** in API calls:
```typescript
const releases = await payloadApi.getReleases({
  status: 'published',
  // Add custom where clause for artist filtering
})
```

3. **Role-Based Access** by artist:
```typescript
access: {
  read: ({ req: { user } }) => {
    if (user?.role === 'admin') return true
    
    // Filter by user's assigned artists
    return {
      artist: {
        in: user?.assignedArtists || []
      }
    }
  }
}
```

## Deployment

### Environment Variables for Production

```env
# Production Database
DATABASE_URL=postgresql://user:pass@production-db:5432/artist_site

# Security
PAYLOAD_SECRET=your-very-secure-production-secret
NEXTAUTH_SECRET=your-production-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com

# Optional: CDN for Media
CLOUDINARY_CLOUD_NAME=your-production-cloudinary
```

### Build Process

```bash
# Generate types
npm run payload generate:types

# Build application
npm run build

# Start production server
npm start
```

### Database Migration

For production deployment with existing data:

```bash
# Run Payload migrations
npm run payload migrate

# Optional: Seed initial data
npm run payload seed
```

### Security Checklist

- [ ] Strong `PAYLOAD_SECRET` (32+ characters)
- [ ] Database connection over SSL
- [ ] File upload size limits configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Admin panel behind authentication
- [ ] Media files served via CDN

## Troubleshooting

### Common Issues

#### 1. **Database Connection Errors**

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Check PostgreSQL is running and `DATABASE_URL` is correct.

#### 2. **Type Generation Failures**

```bash
Error: Cannot find module './payload-types'
```

**Solution**: Run `npm run payload generate:types` before building.

#### 3. **Admin Panel 404**

**Solution**: Ensure admin routes are properly configured in Next.js routing.

#### 4. **Media Upload Issues**

**Solutions**:
- Check file size limits
- Verify upload directory permissions
- Configure Cloudinary if using external storage

#### 5. **API Integration Errors**

```typescript
// Debug API calls
const payloadApiWithLogging = new PayloadApiClient('/api', apiKey)

// Add error logging
.catch(error => {
  console.error('Payload API Error:', error)
  // Handle error appropriately
})
```

### Performance Optimization

#### 1. **Database Indexing**

Add indexes for commonly queried fields:

```sql
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_featured ON releases(featured);
CREATE INDEX idx_events_date ON tour_events(date);
```

#### 2. **API Caching**

Implement caching for frequently accessed data:

```typescript
// Example with React Query
import { useQuery } from '@tanstack/react-query'

function useReleasesWithCache() {
  return useQuery({
    queryKey: ['releases'],
    queryFn: () => payloadApi.getReleases(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

#### 3. **Image Optimization**

Configure responsive images:

```typescript
// In Media collection
imageSizes: [
  {
    name: 'mobile',
    width: 480,
    height: undefined,
    formatOptions: {
      format: 'webp',
      options: { quality: 80 }
    }
  },
  {
    name: 'tablet',
    width: 768,
    height: undefined,
    formatOptions: {
      format: 'webp',
      options: { quality: 85 }
    }
  },
  {
    name: 'desktop',
    width: 1200,
    height: undefined,
    formatOptions: {
      format: 'webp',
      options: { quality: 90 }
    }
  }
]
```

### Monitoring and Maintenance

#### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { payloadApi } from '@/lib/payload-api'

export async function GET() {
  try {
    // Test database connection
    await payloadApi.getSiteConfig()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        cms: 'operational'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 })
  }
}
```

#### Backup Strategy

1. **Database Backups**: Automated PostgreSQL backups
2. **Media Backups**: Sync uploaded files to cloud storage  
3. **Configuration Backup**: Version control all config files

---

## Quick Start Checklist

For new artist website deployment:

- [ ] Clone LEAN framework repository
- [ ] Configure environment variables
- [ ] Set up PostgreSQL database
- [ ] Run `npm install`
- [ ] Generate Payload types: `npm run payload generate:types`
- [ ] Start development server: `npm run dev`
- [ ] Create admin user at `/admin`
- [ ] Configure site settings in CMS
- [ ] Add artist profile and content
- [ ] Customize branding and colors
- [ ] Test all functionality
- [ ] Deploy to production
- [ ] Set up monitoring and backups

This integration provides a complete, production-ready content management system specifically designed for music artists, with all the flexibility needed for customization while maintaining simplicity for end users.