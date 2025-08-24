import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import collection definitions
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SiteConfig } from './collections/SiteConfig'
import { Artists } from './collections/Artists'
import { Releases } from './collections/Releases'
import { TourEvents } from './collections/TourEvents'
import { Gallery } from './collections/Gallery'
import { Posts } from './collections/Posts'

// Import enhanced collections
import { PageSections } from './collections/PageSections'
import { ComponentLibrary } from './collections/ComponentLibrary'
import { ThemeSettings } from './collections/ThemeSettings'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-development',
  
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- LEAN CMS',
    },
  },
  
  editor: slateEditor({
    admin: {
      elements: [
        'blockquote',
        'h2',
        'h3',
        'h4',
        'link',
        'ol',
        'ul',
        'indent',
        'relationship',
        'upload',
      ],
      leaves: [
        'bold',
        'code',
        'italic',
        'strikethrough',
        'underline',
      ],
    },
  }),

  collections: [
    Users,
    Media,
    SiteConfig,
    Artists,
    Releases,
    TourEvents,
    Gallery,
    Posts,
    
    // Enhanced collections for complete website control
    PageSections,
    ComponentLibrary,
    ThemeSettings,
  ],

  globals: [
    {
      slug: 'navigation',
      access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'primaryNavigation',
          type: 'array',
          maxRows: 8,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Internal Link', value: 'internal' },
                { label: 'External Link', value: 'external' },
                { label: 'Section Anchor', value: 'anchor' },
              ],
              defaultValue: 'internal',
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: {
                description: 'For internal: /releases, For external: https://..., For anchor: #section-id',
              },
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (data) => data.type === 'external',
              },
            },
          ],
        },
        {
          name: 'socialLinks',
          type: 'array',
          maxRows: 10,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Spotify', value: 'spotify' },
                { label: 'Apple Music', value: 'apple-music' },
                { label: 'SoundCloud', value: 'soundcloud' },
                { label: 'Bandcamp', value: 'bandcamp' },
                { label: 'Twitter/X', value: 'twitter' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'Discord', value: 'discord' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              validate: (value: string | string[] | null | undefined) => {
                if (!value) return 'URL is required'
                const stringValue = typeof value === 'string' ? value : (Array.isArray(value) ? value[0] : '')
                if (!stringValue || !/^https?:\/\//.test(stringValue)) {
                  return 'URL must start with http:// or https://'
                }
                return true
              },
            },
            {
              name: 'username',
              type: 'text',
              admin: {
                description: 'Optional: Display name or username',
              },
            },
          ],
        },
      ],
    },
    {
      slug: 'homepage',
      access: {
        read: () => true,
        update: ({ req: { user } }) => !!user,
      },
      fields: [
        {
          name: 'hero',
          type: 'group',
          fields: [
            {
              name: 'artistName',
              type: 'text',
              required: true,
              admin: {
                description: 'Main artist/band name for hero section',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'Subtitle or tagline (optional)',
              },
            },
            {
              name: 'backgroundType',
              type: 'select',
              required: true,
              options: [
                { label: 'Solid Color', value: 'color' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' },
              ],
              defaultValue: 'color',
            },
            {
              name: 'backgroundColor',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData.backgroundType === 'color',
                description: 'Hex color code (e.g., #000000)',
              },
              defaultValue: '#000000',
            },
            {
              name: 'gradientStart',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData.backgroundType === 'gradient',
                description: 'Start color for gradient',
              },
            },
            {
              name: 'gradientEnd',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData.backgroundType === 'gradient',
                description: 'End color for gradient',
              },
            },
            {
              name: 'gradientDirection',
              type: 'select',
              options: [
                { label: 'Top to Bottom', value: 'to-b' },
                { label: 'Left to Right', value: 'to-r' },
                { label: 'Top-Left to Bottom-Right', value: 'to-br' },
                { label: 'Top-Right to Bottom-Left', value: 'to-bl' },
              ],
              defaultValue: 'to-b',
              admin: {
                condition: (data, siblingData) => siblingData.backgroundType === 'gradient',
              },
            },
            {
              name: 'backgroundMedia',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => ['image', 'video'].includes(siblingData.backgroundType),
              },
            },
            {
              name: 'ctaButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Listen Now',
                },
                {
                  name: 'href',
                  type: 'text',
                  defaultValue: '#releases',
                },
                {
                  name: 'style',
                  type: 'select',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Ghost', value: 'ghost' },
                  ],
                  defaultValue: 'primary',
                },
              ],
            },
          ],
        },
        {
          name: 'featuredSection',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Latest Release',
            },
            {
              name: 'featuredRelease',
              type: 'relationship',
              relationTo: 'releases',
              admin: {
                condition: (data, siblingData) => siblingData.enabled,
              },
            },
          ],
        },
      ],
    },
  ],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },

  cors: [
    process.env.FRONTEND_SERVER_URL || 'http://localhost:3000',
  ],

  csrf: [
    process.env.FRONTEND_SERVER_URL || 'http://localhost:3000',
  ],

  // Upload configuration
  upload: {
    limits: {
      fileSize: 50000000, // 50MB
    },
  },


  // Localization (if needed for multi-language sites)
  localization: {
    locales: ['en', 'es', 'fr', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
})