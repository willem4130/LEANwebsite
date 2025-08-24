# 🖼️ Gallery System

The LEAN framework features a sophisticated gallery system designed specifically for music artists. It supports images and videos, multiple layout options, category filtering, and smooth animations powered by GSAP.

## Overview

The gallery system consists of:
- **Responsive layouts**: Grid, masonry, and carousel views
- **Media support**: Images and videos with optimized loading
- **Category filtering**: Professional organization system
- **Lightbox viewer**: Full-screen media experience  
- **Performance optimization**: Lazy loading and animation control
- **Electronic music theming**: Neon effects and animated elements

## Basic Usage

### Simple Gallery Setup

```typescript
import { Gallery } from '@/components/artist/gallery'

const galleryItems = [
  {
    id: '1',
    type: 'image',
    url: '/images/gallery/show-1.jpg',
    caption: 'Live at Electric Warehouse - Miami 2024',
    category: ['live'],
    featured: true,
    altText: 'Live performance with laser lights'
  },
  {
    id: '2', 
    type: 'video',
    url: '/videos/studio-session.mp4',
    thumbnailUrl: '/images/gallery/studio-thumb.jpg',
    caption: 'Creating "Neon Dreams" in the studio',
    category: ['studio'],
    featured: false,
    altText: 'Studio recording session'
  }
]

export function MyGallery() {
  return (
    <Gallery
      items={galleryItems}
      layout="grid"
      title="Latest Work"
      backgroundType="gradient"
    />
  )
}
```

## Gallery Item Properties

### GalleryItem Interface

```typescript
interface GalleryItem {
  id: string                    // Unique identifier
  type: 'image' | 'video'      // Media type
  url: string                  // Full resolution URL
  thumbnailUrl?: string        // Optional thumbnail (auto-generated if not provided)
  caption?: string             // Display caption
  category?: string[]          // Categories for filtering
  featured: boolean            // Featured status (adds badge)
  altText?: string            // Accessibility description
}
```

### Required Properties

- `id` - Unique string identifier for each item
- `type` - Either 'image' or 'video'  
- `url` - Path to the media file
- `featured` - Boolean flag for special highlighting

### Optional Properties

- `thumbnailUrl` - Smaller preview image (especially useful for videos)
- `caption` - Text description shown in lightbox
- `category` - Array of category strings for filtering
- `altText` - Screen reader description

## Layout Options

### Grid Layout (Default)

Perfect for uniform presentation:

```typescript
<Gallery
  items={galleryItems}
  layout="grid"
  title="Photo Gallery"
/>
```

**Best for:**
- Professional press photos
- Album artwork
- Performance shots with consistent aspect ratios

### Masonry Layout

Dynamic, Pinterest-style layout:

```typescript
<Gallery
  items={galleryItems}
  layout="masonry"
  title="Behind the Scenes"
/>
```

**Best for:**
- Mixed content types
- Varying image dimensions  
- Creative, artistic presentation

### Carousel Layout

Horizontal scrolling experience:

```typescript
<Gallery
  items={galleryItems}
  layout="carousel"
  title="Latest Releases"
/>
```

**Best for:**
- Mobile viewing
- Linear storytelling
- Featured content highlights

## Category System

### Setting Up Categories

Categories help organize your content for professional presentation:

```typescript
const galleryItems = [
  {
    id: '1',
    type: 'image',
    url: '/images/gallery/festival-main.jpg',
    caption: 'Headlining Electric Paradise Festival',
    category: ['live', 'festivals'], // Multiple categories
    featured: true
  },
  {
    id: '2',
    type: 'video', 
    url: '/videos/studio-workflow.mp4',
    caption: 'Production workflow walkthrough',
    category: ['studio', 'behind-scenes'],
    featured: false
  }
]
```

### Professional Category Names

Use these industry-standard categories:

- `live` - Live performances and shows
- `studio` - Recording sessions and production
- `behind-scenes` - Behind-the-scenes content
- `press` - Press photos and materials
- `festivals` - Festival performances
- `collaborations` - Artist collaborations
- `music-videos` - Official music videos
- `interviews` - Media interviews

### Custom Category Styling

Each category gets unique visual treatment:

```typescript
// The system automatically applies different colors to categories
const categoryColors = {
  'live': 'brand-electric',      // Electric blue
  'studio': 'brand-purple',      // Purple
  'press': 'brand-coral',        // Coral 
  'behind-scenes': 'brand-neon'  // Neon cyan
}
```

## Background Customization

### Gradient Background (Default)

```typescript
<Gallery
  items={galleryItems}
  backgroundType="gradient"
  backgroundColor="#060609" // Base color for gradient
/>
```

### Color Background

```typescript
<Gallery
  items={galleryItems}
  backgroundType="color"
  backgroundColor="#1a1a2e"
/>
```

### Image Background

```typescript
<Gallery
  items={galleryItems}
  backgroundType="image"
  backgroundMedia={{
    url: '/images/backgrounds/studio-wide.jpg',
    alt: 'Studio background'
  }}
/>
```

### Video Background

```typescript
<Gallery
  items={galleryItems}
  backgroundType="video"
  backgroundMedia={{
    url: '/videos/performance-loop.mp4',
    alt: 'Performance background video'
  }}
/>
```

## Advanced Features

### Featured Items

Highlight important content with the featured system:

```typescript
{
  id: 'feature-1',
  type: 'image',
  url: '/images/gallery/album-cover.jpg',
  caption: 'New Album: "Electric Dreams" - Out Now',
  category: ['press', 'releases'],
  featured: true // Adds special styling and badge
}
```

Featured items get:
- Special "Featured" badge
- Enhanced hover effects
- Priority positioning in layouts

### Performance Optimization

The gallery system includes several performance optimizations:

#### Lazy Loading

```typescript
// Images load only when visible
<img
  src={item.url}
  loading="lazy"
  onLoad={handleImageLoad}
  onError={handleImageError}
/>
```

#### Reduced Motion Support

```typescript
// Respects user's motion preferences
const [isReducedMotion, setIsReducedMotion] = useState(false)

useEffect(() => {
  setIsReducedMotion(prefersReducedMotion())
}, [])

// Animations automatically adjust based on preference
```

#### Optimized Animations

```typescript
// GPU-accelerated transforms
.will-change-transform {
  will-change: transform;
}

// Hardware acceleration
force3D: true
```

## Customization Examples

### Music Producer Gallery

```typescript
const producerGallery = [
  {
    id: 'prod-1',
    type: 'video',
    url: '/videos/beat-making.mp4',
    thumbnailUrl: '/images/thumbs/beat-making.jpg',
    caption: 'Creating beats in Logic Pro',
    category: ['studio', 'production'],
    featured: true
  },
  {
    id: 'prod-2',
    type: 'image',
    url: '/images/gallery/mixing-console.jpg',
    caption: 'SSL Console - Where the magic happens',
    category: ['studio', 'equipment'],
    featured: false
  }
]

<Gallery
  items={producerGallery}
  layout="masonry"
  title="Studio Life"
  backgroundType="gradient"
/>
```

### DJ Performance Gallery

```typescript
const djGallery = [
  {
    id: 'dj-1',
    type: 'image',
    url: '/images/gallery/crowd-shot.jpg',
    caption: 'Electric crowd at Warehouse 23',
    category: ['live', 'clubs'],
    featured: true
  },
  {
    id: 'dj-2',
    type: 'video',
    url: '/videos/dj-set-highlights.mp4',
    caption: 'Festival set highlights - Summer 2024',
    category: ['live', 'festivals'],
    featured: true
  }
]

<Gallery
  items={djGallery}
  layout="grid"
  title="Live Performances"
/>
```

### Press & Media Gallery

```typescript
const pressGallery = [
  {
    id: 'press-1',
    type: 'image',
    url: '/images/press/official-2024.jpg',
    caption: 'Official press photo 2024',
    category: ['press'],
    featured: true,
    altText: 'Professional headshot in studio lighting'
  },
  {
    id: 'press-2',
    type: 'video',
    url: '/videos/interview-highlights.mp4',
    caption: 'Radio interview highlights',
    category: ['press', 'interviews'],
    featured: false
  }
]

<Gallery
  items={pressGallery}
  layout="carousel"
  title="Press Materials"
/>
```

## Responsive Behavior

The gallery system automatically adapts to different screen sizes:

### Desktop (1200px+)
- Grid: 4 columns
- Masonry: 4 columns with varying heights
- Carousel: 3-4 items visible with smooth scrolling

### Tablet (768px - 1199px)
- Grid: 3 columns
- Masonry: 3 columns
- Carousel: 2-3 items visible

### Mobile (< 768px)
- Grid: 2 columns
- Masonry: 2 columns  
- Carousel: 1-2 items visible with touch scrolling

## Lightbox Features

### Image Lightbox

- Full-screen viewing
- High-resolution display
- Caption overlay with category tags
- Smooth animations with electronic effects
- Keyboard navigation (ESC to close)

### Video Lightbox

- Native video controls
- Autoplay on open
- Full-screen support
- Professional video player styling

## Error Handling

The gallery system includes comprehensive error handling:

### Image Loading Errors

```typescript
const [imageError, setImageError] = useState(false)

const handleImageError = () => {
  setImageError(true)
  setImageLoading(false)
}

// Shows fallback UI if image fails to load
{imageError ? (
  <div className="error-state">
    <AlertCircle />
    <p>Image failed to load</p>
  </div>
) : (
  <img src={item.url} onError={handleImageError} />
)}
```

### Invalid Data Handling

```typescript
// Validates gallery items before rendering
if (!items || !Array.isArray(items)) {
  return (
    <Alert>
      <AlertDescription>No gallery items to display</AlertDescription>
    </Alert>
  )
}
```

## Integration with CMS

### Payload CMS Integration

If using the full LEAN framework with Payload CMS:

```typescript
// Collection definition
const Gallery = {
  slug: 'gallery',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'category',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Live', value: 'live' },
        { label: 'Studio', value: 'studio' },
        { label: 'Press', value: 'press' },
        { label: 'Behind Scenes', value: 'behind-scenes' }
      ]
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false
    }
  ]
}
```

## Performance Tips

### Image Optimization

1. **Use appropriate formats**:
   - WebP for modern browsers
   - JPEG for photos
   - PNG for graphics with transparency

2. **Optimize file sizes**:
   - Gallery images: < 200KB each
   - Thumbnails: < 50KB each
   - Video thumbnails: < 30KB each

3. **Provide multiple sizes**:
   ```typescript
   const galleryItem = {
     id: '1',
     type: 'image',
     url: '/images/gallery/show-1-large.jpg',      // 1920x1080
     thumbnailUrl: '/images/gallery/show-1-thumb.jpg', // 400x300
     altText: 'Live performance'
   }
   ```

### Animation Performance

1. **Use transform and opacity**:
   - These properties are GPU-accelerated
   - Avoid animating width, height, top, left

2. **Enable hardware acceleration**:
   ```css
   .gallery-item {
     will-change: transform;
     transform: translateZ(0);
   }
   ```

3. **Respect reduced motion**:
   ```typescript
   const animations = useReducedMotion() ? {} : {
     scale: [1, 1.05, 1],
     rotateY: [0, 5, 0]
   }
   ```

## Accessibility Features

### Screen Reader Support

- Proper alt text for all images
- Semantic HTML structure
- Keyboard navigation support
- Focus management in lightbox

### ARIA Labels

```typescript
<div 
  role="img" 
  aria-label={item.altText || item.caption}
  tabIndex={0}
>
  <img src={item.url} alt={item.altText} />
</div>
```

### Keyboard Controls

- **Space/Enter**: Open lightbox
- **Escape**: Close lightbox  
- **Arrow keys**: Navigate categories (future feature)

## Troubleshooting

### Common Issues

**Gallery items not displaying:**
- Check that items array is properly formatted
- Ensure all required properties are present
- Verify image URLs are accessible

**Animations not working:**
- Check if user has reduced motion enabled
- Verify GSAP is properly installed
- Ensure components are properly mounted

**Images not loading:**
- Verify image paths are correct
- Check file permissions
- Ensure images are optimized and not too large

**Performance issues:**
- Reduce image file sizes
- Enable lazy loading
- Check for memory leaks in animation cleanup

### Debug Mode

Enable debug logging:

```typescript
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('Gallery items:', items)
  console.log('Layout mode:', layout)
  console.log('Filtered items:', filteredItems)
}
```

---

**🎯 Your gallery system is now ready to showcase your music career!**

*Next: [Learn about the animation system →](animations.md)*