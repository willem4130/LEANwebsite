# 🚀 Deployment Guide

Get your LEAN music website live on the internet with professional hosting platforms. This guide covers the most popular deployment options with step-by-step instructions.

## Pre-Deployment Checklist

Before deploying, ensure your site is ready:

```bash
# 1. Build your site successfully
npm run build

# 2. Test production build locally
npm run start

# 3. Check for any console errors in browser
# 4. Verify all images and videos load correctly
# 5. Test on mobile device
# 6. Confirm all external links work
```

### Environment Variables Setup

Ensure your `.env` file is properly configured:

```bash
# Required for production
NEXT_PUBLIC_SITE_NAME="Your Artist Name"
NEXT_PUBLIC_SITE_URL="https://yoursite.com"
NEXT_PUBLIC_CONTACT_EMAIL="booking@yourname.com"

# Social media links
NEXT_PUBLIC_SPOTIFY_URL="https://open.spotify.com/artist/your-id"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/yourusername"
NEXT_PUBLIC_YOUTUBE_URL="https://youtube.com/@yourusername"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## Option 1: Vercel (Recommended)

**Best for**: Next.js sites, fastest deployment, excellent performance

Vercel is built by the creators of Next.js and offers the best integration.

### Step 1: Prepare Your Repository

```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy with Vercel

**Method A: Vercel CLI (Fastest)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy your site (follow prompts)
vercel

# For production deployment
vercel --prod
```

**Method B: Vercel Dashboard**

1. Visit [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your repository
4. Configure settings:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
5. Add environment variables in the Vercel dashboard
6. Click "Deploy"

### Step 3: Configure Custom Domain

```bash
# Add your domain in Vercel dashboard
# Point your domain's DNS to Vercel:
# Type: CNAME
# Name: @ (or www)
# Value: cname.vercel-dns.com
```

## Option 2: Netlify

**Best for**: Static sites, great build features, easy rollbacks

### Step 1: Build Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  environment = { NODE_ENV = "production" }
```

### Step 2: Deploy with Netlify

**Method A: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy your site
netlify deploy --prod --dir=.next
```

**Method B: Netlify Dashboard**

1. Visit [netlify.com](https://netlify.com) and sign up
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
5. Add environment variables in Site Settings > Environment Variables
6. Click "Deploy site"

### Step 3: Custom Domain Setup

```bash
# In Netlify dashboard:
# Site settings > Domain management > Add custom domain
# Follow DNS configuration instructions
```

## Option 3: Digital Ocean App Platform

**Best for**: More control, competitive pricing, developer-friendly

### Step 1: Create App Specification

Create `.do/app.yaml`:

```yaml
name: your-artist-name-website
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/your-artist-name-website
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_SITE_NAME
    value: Your Artist Name
  - key: NEXT_PUBLIC_SITE_URL
    value: https://your-app-name.ondigitalocean.app
```

### Step 2: Deploy to Digital Ocean

1. Visit [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure your app using the YAML above
5. Add environment variables
6. Review and create

### Step 3: Custom Domain

```bash
# In DO dashboard:
# Settings > Domains > Add Domain
# Update your DNS records as instructed
```

## Option 4: Railway

**Best for**: Simple deployment, reasonable pricing, good performance

### Step 1: Deploy with Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy your project
railway init
railway up
```

### Step 2: Environment Variables

```bash
# Set environment variables via CLI
railway variables set NEXT_PUBLIC_SITE_NAME="Your Artist Name"
railway variables set NEXT_PUBLIC_SITE_URL="https://yoursite.railway.app"

# Or use Railway dashboard to add variables
```

## Option 5: Traditional VPS Hosting

**Best for**: Maximum control, custom server needs, cost optimization

### Step 1: Server Setup

```bash
# Connect to your VPS
ssh root@your-server-ip

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install nginx for reverse proxy
sudo apt update
sudo apt install nginx
```

### Step 2: Deploy Your Application

```bash
# Clone your repository
git clone https://github.com/yourusername/your-artist-name-website.git
cd your-artist-name-website

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "music-site" -- start
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/your-artist-name`:

```nginx
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/your-artist-name /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install snapd
sudo snap install --classic certbot

# Get SSL certificate
sudo certbot --nginx -d yoursite.com -d www.yoursite.com
```

## Custom Domain Setup

### DNS Configuration

For any hosting provider, configure your DNS:

```bash
# At your domain registrar (GoDaddy, Namecheap, etc.)
# Add these DNS records:

# For root domain (yoursite.com)
Type: A
Name: @
Value: [Your hosting provider's IP]

# For www subdomain
Type: CNAME  
Name: www
Value: [Your hosting provider's domain or IP]

# For Vercel specifically:
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### SSL Certificate

Most modern hosting platforms provide free SSL certificates:

- **Vercel**: Automatic SSL
- **Netlify**: Automatic SSL  
- **Digital Ocean**: One-click SSL
- **Railway**: Automatic SSL

## Performance Optimization

### Image Optimization

Ensure your images are optimized before deployment:

```bash
# Install image optimization tool
npm install -g imagemin-cli imagemin-webp

# Optimize images
imagemin public/images/*.jpg --out-dir=public/images/optimized --plugin=webp
```

### Bundle Analysis

Check your bundle size before deployment:

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to package.json scripts:
"analyze": "ANALYZE=true npm run build"

# Run analysis
npm run analyze
```

### Caching Strategy

Configure caching headers in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## Analytics Setup

### Google Analytics 4

Add GA4 to your site:

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  })
}
```

Add to `app/layout.tsx`:

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_location: window.location.href,
                page_title: document.title,
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
```

## Monitoring & Maintenance

### Error Monitoring

Set up error tracking with Sentry:

```bash
npm install @sentry/nextjs
```

### Uptime Monitoring

Use services to monitor your site:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**

### Regular Updates

Set up a maintenance schedule:

```bash
# Monthly dependency updates
npm update

# Check for security vulnerabilities
npm audit

# Update Node.js version as needed
```

## Troubleshooting Deployment Issues

### Common Build Errors

**Memory issues:**
```bash
# Increase memory allocation
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**TypeScript errors:**
```bash
# Fix type errors before deployment
npm run type-check
```

**Missing environment variables:**
```bash
# Ensure all required env vars are set in production
echo $NEXT_PUBLIC_SITE_NAME
```

### Performance Issues

**Slow loading:**
- Optimize images and videos
- Enable compression on server
- Use CDN for static assets

**Animation lag:**
- Check console for GSAP errors
- Reduce animation complexity on mobile
- Enable GPU acceleration

### DNS Issues

**Domain not resolving:**
- Check DNS propagation (use dnschecker.org)
- Verify DNS records are correct
- Wait 24-48 hours for full propagation

## Security Best Practices

### Environment Variables

Never commit sensitive data:

```bash
# .gitignore should include:
.env
.env.local
.env.production
.env.staging
```

### Content Security Policy

Add CSP headers in `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
```

## Going Live Checklist

Before announcing your site:

- [ ] Test all links and buttons
- [ ] Verify contact forms work
- [ ] Check mobile responsiveness
- [ ] Test site speed (aim for <3 seconds load time)
- [ ] Verify SSL certificate is active
- [ ] Set up Google Analytics
- [ ] Add site to Google Search Console
- [ ] Test social media link previews
- [ ] Backup your site files
- [ ] Set up monitoring

---

**🎉 Your music website is now live!**

Share your new professional online presence with the world.

*Next: [Learn about the gallery system →](../components/gallery.md)*