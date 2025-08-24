# 🚀 Complete Setup Guide

Get your LEAN music website running from zero to live in under 10 minutes.

## Prerequisites

Before starting, ensure you have:

- **Node.js 18.x LTS or newer** - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **Code Editor** - VS Code recommended with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer

### Verify Installation

```bash
# Check Node.js version (should be 18.x or higher)
node --version

# Check npm version
npm --version

# Check Git installation  
git --version
```

## Step 1: Clone the Framework

Create your new music website project:

```bash
# Clone the framework (replace 'your-artist-name' with your actual name)
git clone https://github.com/yourusername/lean-music-framework.git your-artist-name

# Navigate to your project
cd your-artist-name

# Remove the original git history and start fresh
rm -rf .git
git init
```

## Step 2: Install Dependencies

Install all required packages:

```bash
# Install all dependencies (this may take 2-3 minutes)
npm install

# Verify installation was successful
npm list --depth=0
```

You should see output showing all installed packages including:
- next@14.2.32
- react@18.3.1
- gsap@3.13.0
- tailwindcss@3.4.17

## Step 3: Initial Configuration

### Environment Setup

Create your environment file:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your details:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Your Artist Name"
NEXT_PUBLIC_SITE_URL="https://yoursite.com"
NEXT_PUBLIC_CONTACT_EMAIL="booking@yourname.com"

# Social Media (optional - leave blank to hide)
NEXT_PUBLIC_SPOTIFY_URL="https://open.spotify.com/artist/your-id"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/yourusername"
NEXT_PUBLIC_YOUTUBE_URL="https://youtube.com/@yourusername"

# Analytics (optional)
NEXT_PUBLIC_GA_ID=""
```

### Package.json Updates

Update your `package.json` with your project details:

```json
{
  "name": "your-artist-name-website",
  "version": "1.0.0",
  "description": "Professional website for [Your Artist Name]",
  "author": "Your Name <your@email.com>",
  "homepage": "https://yoursite.com"
}
```

## Step 4: First Run

Start the development server:

```bash
# Start development mode
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

You should see:
- ✅ LEAN framework loading screen
- ✅ Hero section with placeholder content  
- ✅ Gallery system working
- ✅ Contact section with social links
- ✅ Smooth GSAP animations

## Step 5: Basic Content Setup

### Update Hero Section

Edit `/src/app/page.tsx` to customize your hero:

```typescript
export default function Home() {
  return (
    <main>
      <HeroSection
        artistName="Your Artist Name"
        tagline="Electronic Music Producer & DJ"
        backgroundType="gradient"
        ctaText="Book Now"
        ctaLink="mailto:booking@yourname.com"
      />
      {/* Other components... */}
    </main>
  )
}
```

### Add Your Gallery Content

Update `/src/lib/gallery-data.ts`:

```typescript
export const galleryItems = [
  {
    id: 1,
    type: 'image',
    url: '/images/gallery/show-1.jpg',
    title: 'Live at Club XYZ',
    description: 'Epic night in Miami'
  },
  {
    id: 2,
    type: 'video',
    url: '/videos/studio-session.mp4',
    title: 'Studio Session',
    description: 'Creating new tracks'
  }
  // Add more items...
]
```

### Update Navigation

Edit `/src/components/ui/navigation.tsx`:

```typescript
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Music', href: '#music' },
  { name: 'Shows', href: '#shows' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' }
]
```

## Step 6: Add Your Assets

### Images

Create the following directories and add your images:

```
/public/images/
├── hero/
│   ├── hero-bg.jpg (1920x1080 recommended)
│   └── artist-photo.jpg (500x500 recommended)
├── gallery/
│   ├── show-1.jpg
│   ├── show-2.jpg
│   └── studio-1.jpg
└── press/
    ├── press-photo-1.jpg
    └── press-photo-2.jpg
```

### Audio/Video

```
/public/media/
├── audio/
│   ├── track-preview-1.mp3
│   └── track-preview-2.mp3
└── video/
    ├── live-performance.mp4
    └── studio-session.mp4
```

## Step 7: Test Everything

Run through this checklist:

```bash
# Build for production to catch any errors
npm run build

# If build succeeds, test production mode
npm run start
```

### Manual Testing Checklist

- [ ] Hero section displays your content
- [ ] Animations work smoothly  
- [ ] Gallery loads your images/videos
- [ ] Social links work correctly
- [ ] Contact form/email links function
- [ ] Mobile responsiveness works
- [ ] All pages load without errors

## Step 8: Version Control

Initialize your git repository:

```bash
# Add all files
git add .

# Make your initial commit
git commit -m "Initial setup: LEAN music framework for [Your Artist Name]"

# Add your remote repository (create on GitHub first)
git remote add origin https://github.com/yourusername/your-artist-name-website.git

# Push to your repository
git push -u origin main
```

## Troubleshooting

### Common Issues

**❌ "Module not found" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**❌ Port 3000 already in use:**
```bash
# Use a different port
npm run dev -- -p 3001
```

**❌ Build errors:**
```bash
# Check your TypeScript and fix errors
npm run lint
```

**❌ Images not loading:**
- Ensure images are in `/public/images/` directory
- Check file paths in your components
- Verify image formats (jpg, png, webp supported)

### Getting Help

If you're stuck:

1. **Check the logs** - errors are shown in terminal and browser console
2. **Compare with examples** - reference the demo site source code  
3. **Search issues** - check GitHub issues for similar problems
4. **Ask for help** - create a new issue with detailed information

## Next Steps

Your LEAN music framework is now running! Continue with:

- **[Customization Guide](customization.md)** - Personalize colors, fonts, and animations
- **[Deployment Guide](deployment.md)** - Go live on the internet
- **[Gallery System](../components/gallery.md)** - Advanced gallery features

---

**🎉 Congratulations! Your music website foundation is ready.**

*Next: [Customize your branding and content →](customization.md)*