import { CollectionConfig } from 'payload/types'

export const SiteConfig: CollectionConfig = {
  slug: 'site-config',
  admin: {
    useAsTitle: 'siteName',
    group: 'Configuration',
    defaultColumns: ['siteName', 'primaryColor', 'updatedAt'],
    description: 'Global site configuration and branding settings',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Settings',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              admin: {
                description: 'The name of your site/artist brand',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Short description for SEO and social sharing',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              validate: (value) => {
                if (!value) return 'Site URL is required'
                if (!/^https?:\/\//.test(value)) {
                  return 'URL must start with http:// or https://'
                }
                return true
              },
              admin: {
                description: 'Full URL of your site (e.g., https://yoursite.com)',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              admin: {
                description: 'Primary contact email for bookings/inquiries',
              },
            },
            {
              name: 'timezone',
              type: 'select',
              required: true,
              options: [
                { label: 'UTC', value: 'UTC' },
                { label: 'Eastern Time (ET)', value: 'America/New_York' },
                { label: 'Central Time (CT)', value: 'America/Chicago' },
                { label: 'Mountain Time (MT)', value: 'America/Denver' },
                { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
                { label: 'Central European Time (CET)', value: 'Europe/Berlin' },
                { label: 'British Time (GMT)', value: 'Europe/London' },
                { label: 'Japan Time (JST)', value: 'Asia/Tokyo' },
                { label: 'Australian Eastern Time (AET)', value: 'Australia/Sydney' },
              ],
              defaultValue: 'America/New_York',
            },
          ],
        },
        {
          label: 'Visual Branding',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main logo (recommended: SVG or high-res PNG)',
              },
            },
            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Logo variant for dark backgrounds',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Favicon (32x32 PNG or ICO file)',
              },
            },
            {
              name: 'primaryColor',
              type: 'text',
              required: true,
              defaultValue: '#000000',
              validate: (value) => {
                if (!/^#[0-9a-f]{6}$/i.test(value)) {
                  return 'Please enter a valid hex color (e.g., #000000)'
                }
                return true
              },
              admin: {
                description: 'Primary brand color (hex format)',
              },
            },
            {
              name: 'secondaryColor',
              type: 'text',
              required: true,
              defaultValue: '#ffffff',
              validate: (value) => {
                if (!/^#[0-9a-f]{6}$/i.test(value)) {
                  return 'Please enter a valid hex color (e.g., #ffffff)'
                }
                return true
              },
              admin: {
                description: 'Secondary brand color (hex format)',
              },
            },
            {
              name: 'accentColor',
              type: 'text',
              defaultValue: '#ff0000',
              validate: (value) => {
                if (value && !/^#[0-9a-f]{6}$/i.test(value)) {
                  return 'Please enter a valid hex color (e.g., #ff0000)'
                }
                return true
              },
              admin: {
                description: 'Accent color for highlights and CTAs (hex format)',
              },
            },
            {
              name: 'fontFamily',
              type: 'select',
              options: [
                { label: 'Inter (Modern Sans)', value: 'inter' },
                { label: 'Roboto (Clean Sans)', value: 'roboto' },
                { label: 'Open Sans (Friendly)', value: 'open-sans' },
                { label: 'Montserrat (Geometric)', value: 'montserrat' },
                { label: 'Playfair Display (Elegant)', value: 'playfair' },
                { label: 'Source Code Pro (Monospace)', value: 'source-code' },
                { label: 'System Default', value: 'system' },
              ],
              defaultValue: 'inter',
            },
          ],
        },
        {
          label: 'SEO & Social',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              admin: {
                description: 'Override site name for SEO title (optional)',
              },
            },
            {
              name: 'seoKeywords',
              type: 'text',
              admin: {
                description: 'SEO keywords (comma separated)',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Default Open Graph image for social sharing (1200x630px recommended)',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              admin: {
                description: 'Twitter handle without @ symbol',
              },
            },
            {
              name: 'googleAnalyticsId',
              type: 'text',
              admin: {
                description: 'Google Analytics ID (e.g., GA4-XXXXXXXXX)',
              },
            },
            {
              name: 'facebookPixelId',
              type: 'text',
              admin: {
                description: 'Facebook Pixel ID for tracking',
              },
            },
          ],
        },
        {
          label: 'Features',
          fields: [
            {
              name: 'features',
              type: 'group',
              fields: [
                {
                  name: 'enableBlog',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable blog/news section',
                  },
                },
                {
                  name: 'enableGallery',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable photo/video gallery',
                  },
                },
                {
                  name: 'enableTourDates',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable tour dates section',
                  },
                },
                {
                  name: 'enableContactForm',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable contact form',
                  },
                },
                {
                  name: 'enableNewsletter',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Enable newsletter signup',
                  },
                },
                {
                  name: 'enableCommerce',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Enable merchandise/music sales',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Integrations',
          fields: [
            {
              name: 'spotifyArtistId',
              type: 'text',
              admin: {
                description: 'Spotify Artist ID for music integration',
              },
            },
            {
              name: 'appleMusicArtistId',
              type: 'text',
              admin: {
                description: 'Apple Music Artist ID',
              },
            },
            {
              name: 'youtubeMusicArtistId',
              type: 'text',
              admin: {
                description: 'YouTube Music Artist ID',
              },
            },
            {
              name: 'bandcampUrl',
              type: 'text',
              admin: {
                description: 'Bandcamp profile URL',
              },
            },
            {
              name: 'soundcloudUrl',
              type: 'text',
              admin: {
                description: 'SoundCloud profile URL',
              },
            },
            {
              name: 'discordInviteCode',
              type: 'text',
              admin: {
                description: 'Discord server invite code',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate SEO title if not provided
        if (!data.seoTitle && data.siteName) {
          data.seoTitle = data.siteName
        }
        return data
      },
    ],
  },
}