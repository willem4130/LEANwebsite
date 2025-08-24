import type { CollectionConfig } from 'payload'

export const Releases: CollectionConfig = {
  slug: 'releases',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'type', 'releaseDate', 'featured', 'status'],
    description: 'Music releases - albums, EPs, singles, and mixtapes',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public can only see published releases
      return {
        status: { equals: 'published' }
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Release title (album, EP, single name)',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                position: 'sidebar',
                description: 'URL-friendly version (auto-generated)',
              },
              hooks: {
                beforeValidate: [
                  ({ data, operation }) => {
                    if (operation === 'create' && data?.title && !data?.slug) {
                      return data.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    }
                    return data?.slug
                  },
                ],
              },
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Archived', value: 'archived' },
              ],
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'Single', value: 'single' },
                { label: 'EP', value: 'ep' },
                { label: 'Album', value: 'album' },
                { label: 'LP', value: 'lp' },
                { label: 'Mixtape', value: 'mixtape' },
                { label: 'Compilation', value: 'compilation' },
                { label: 'Live Album', value: 'live' },
                { label: 'Remix', value: 'remix' },
                { label: 'Demo', value: 'demo' },
              ],
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'releaseDate',
              type: 'date',
              required: true,
              admin: {
                position: 'sidebar',
                description: 'Official release date',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature on homepage and gallery',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              admin: {
                position: 'sidebar',
                description: 'Display order (lower numbers first)',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'artwork',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Album/single artwork (square format recommended)',
              },
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'Detailed description of the release',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              maxLength: 200,
              admin: {
                description: 'Brief description for cards (max 200 characters)',
              },
            },
            {
              name: 'lyrics',
              type: 'richText',
              admin: {
                condition: (data) => ['single'].includes(data.type),
                description: 'Song lyrics (for singles)',
              },
            },
            {
              name: 'credits',
              type: 'array',
              fields: [
                {
                  name: 'person',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'Artist', value: 'artist' },
                    { label: 'Producer', value: 'producer' },
                    { label: 'Songwriter', value: 'songwriter' },
                    { label: 'Composer', value: 'composer' },
                    { label: 'Mixer', value: 'mixer' },
                    { label: 'Mastering Engineer', value: 'mastering' },
                    { label: 'Recording Engineer', value: 'recording' },
                    { label: 'Instrumentalist', value: 'instrumentalist' },
                    { label: 'Vocalist', value: 'vocalist' },
                    { label: 'Backing Vocals', value: 'backing-vocals' },
                    { label: 'Featured Artist', value: 'featured' },
                  ],
                  required: true,
                },
                {
                  name: 'instrument',
                  type: 'text',
                  admin: {
                    description: 'Specific instrument (if applicable)',
                  },
                },
              ],
              admin: {
                description: 'Production credits and collaborators',
              },
            },
          ],
        },
        {
          label: 'Tracks',
          fields: [
            {
              name: 'tracks',
              type: 'array',
              admin: {
                condition: (data) => !['single'].includes(data.type),
              },
              fields: [
                {
                  name: 'trackNumber',
                  type: 'number',
                  required: true,
                  min: 1,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    description: 'Track duration (e.g., 3:45)',
                  },
                },
                {
                  name: 'featured',
                  type: 'text',
                  admin: {
                    description: 'Featured artists (if any)',
                  },
                },
                {
                  name: 'preview',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Audio preview file',
                  },
                },
                {
                  name: 'lyrics',
                  type: 'richText',
                  admin: {
                    description: 'Track lyrics',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Streaming & Purchase',
          fields: [
            {
              name: 'streamingLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple-music' },
                    { label: 'YouTube Music', value: 'youtube-music' },
                    { label: 'Amazon Music', value: 'amazon-music' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Bandcamp', value: 'bandcamp' },
                    { label: 'Tidal', value: 'tidal' },
                    { label: 'Deezer', value: 'deezer' },
                    { label: 'Pandora', value: 'pandora' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: (value: any) => {
                    if (!value) return 'URL is required'
                    if (!/^https?:\/\//.test(value)) {
                      return 'URL must start with http:// or https://'
                    }
                    return true
                  },
                },
                {
                  name: 'embedCode',
                  type: 'textarea',
                  admin: {
                    description: 'Optional embed code for the platform',
                  },
                },
              ],
              admin: {
                description: 'Streaming platform links',
              },
            },
            {
              name: 'purchaseLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'iTunes/Apple Music', value: 'itunes' },
                    { label: 'Amazon Music', value: 'amazon' },
                    { label: 'Bandcamp', value: 'bandcamp' },
                    { label: 'Official Store', value: 'official' },
                    { label: 'Physical CD', value: 'cd' },
                    { label: 'Vinyl Record', value: 'vinyl' },
                    { label: 'Digital Download', value: 'digital' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: (value: any) => {
                    if (!value) return 'URL is required'
                    if (!/^https?:\/\//.test(value)) {
                      return 'URL must start with http:// or https://'
                    }
                    return true
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  admin: {
                    description: 'Price (e.g., $9.99, Free)',
                  },
                },
              ],
              admin: {
                description: 'Purchase and download links',
              },
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              name: 'genres',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Rock', value: 'rock' },
                { label: 'Pop', value: 'pop' },
                { label: 'Hip Hop', value: 'hip-hop' },
                { label: 'Electronic', value: 'electronic' },
                { label: 'Dance', value: 'dance' },
                { label: 'R&B', value: 'rnb' },
                { label: 'Country', value: 'country' },
                { label: 'Jazz', value: 'jazz' },
                { label: 'Classical', value: 'classical' },
                { label: 'Folk', value: 'folk' },
                { label: 'Reggae', value: 'reggae' },
                { label: 'Punk', value: 'punk' },
                { label: 'Metal', value: 'metal' },
                { label: 'Alternative', value: 'alternative' },
                { label: 'Indie', value: 'indie' },
              ],
              admin: {
                description: 'Musical genres for this release',
              },
            },
            {
              name: 'tags',
              type: 'text',
              admin: {
                description: 'Additional tags (comma separated)',
              },
            },
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'SEO title (defaults to release title)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  maxLength: 160,
                  admin: {
                    description: 'SEO meta description (max 160 characters)',
                  },
                },
                {
                  name: 'keywords',
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
                    description: 'Custom Open Graph image (defaults to artwork)',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate SEO fields if not provided
        if (!data.seo?.title && data.title) {
          data.seo = {
            ...data.seo,
            title: data.title,
          }
        }
        if (!data.seo?.description && data.shortDescription) {
          data.seo = {
            ...data.seo,
            description: data.shortDescription,
          }
        }
        return data
      },
    ],
  },
}