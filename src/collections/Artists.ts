import { CollectionConfig } from 'payload/types'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'role', 'featured', 'updatedAt'],
    description: 'Artist profiles and band member information',
  },
  access: {
    read: () => true,
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
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Artist or band member name',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                position: 'sidebar',
                description: 'URL-friendly version of the name (auto-generated)',
              },
              hooks: {
                beforeValidate: [
                  ({ data, operation }) => {
                    if (operation === 'create' && data?.name && !data?.slug) {
                      return data.name
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
              name: 'role',
              type: 'select',
              required: true,
              hasMany: true,
              options: [
                { label: 'Lead Vocals', value: 'lead-vocals' },
                { label: 'Backing Vocals', value: 'backing-vocals' },
                { label: 'Guitar', value: 'guitar' },
                { label: 'Bass', value: 'bass' },
                { label: 'Drums', value: 'drums' },
                { label: 'Keyboards', value: 'keyboards' },
                { label: 'Piano', value: 'piano' },
                { label: 'Synthesizer', value: 'synthesizer' },
                { label: 'Violin', value: 'violin' },
                { label: 'Saxophone', value: 'saxophone' },
                { label: 'Trumpet', value: 'trumpet' },
                { label: 'DJ', value: 'dj' },
                { label: 'Producer', value: 'producer' },
                { label: 'Songwriter', value: 'songwriter' },
                { label: 'Sound Engineer', value: 'sound-engineer' },
                { label: 'Manager', value: 'manager' },
                { label: 'Solo Artist', value: 'solo-artist' },
              ],
              admin: {
                description: 'What instruments/roles does this person handle?',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Show prominently on artist page',
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
          label: 'Profile',
          fields: [
            {
              name: 'profileImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Professional headshot or profile photo',
              },
            },
            {
              name: 'bio',
              type: 'richText',
              required: true,
              admin: {
                description: 'Artist biography (supports rich text formatting)',
              },
            },
            {
              name: 'shortBio',
              type: 'textarea',
              maxLength: 200,
              admin: {
                description: 'Brief bio for cards and previews (max 200 chars)',
              },
            },
            {
              name: 'birthdate',
              type: 'date',
              admin: {
                description: 'Optional: Birth date for age calculation',
              },
            },
            {
              name: 'hometown',
              type: 'text',
              admin: {
                description: 'Where the artist is from',
              },
            },
            {
              name: 'currentLocation',
              type: 'text',
              admin: {
                description: 'Current location/base of operations',
              },
            },
          ],
        },
        {
          label: 'Musical Info',
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
                { label: 'Jazz', value: 'jazz' },
                { label: 'Classical', value: 'classical' },
                { label: 'Folk', value: 'folk' },
                { label: 'Country', value: 'country' },
                { label: 'R&B/Soul', value: 'rnb' },
                { label: 'Reggae', value: 'reggae' },
                { label: 'Punk', value: 'punk' },
                { label: 'Metal', value: 'metal' },
                { label: 'Alternative', value: 'alternative' },
                { label: 'Indie', value: 'indie' },
                { label: 'Experimental', value: 'experimental' },
              ],
              admin: {
                description: 'Musical genres associated with this artist',
              },
            },
            {
              name: 'influences',
              type: 'text',
              admin: {
                description: 'Musical influences (comma separated)',
              },
            },
            {
              name: 'yearsActive',
              type: 'group',
              fields: [
                {
                  name: 'start',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'Year started making music',
                  },
                },
                {
                  name: 'end',
                  type: 'number',
                  admin: {
                    description: 'Year stopped (leave blank if still active)',
                  },
                },
              ],
            },
            {
              name: 'equipment',
              type: 'array',
              maxRows: 10,
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'brand',
                  type: 'text',
                },
                {
                  name: 'model',
                  type: 'text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
              admin: {
                description: 'Instruments and equipment used',
              },
            },
          ],
        },
        {
          label: 'Social & Contact',
          fields: [
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
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple-music' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Bandcamp', value: 'bandcamp' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Personal Website', value: 'website' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  validate: (value) => {
                    if (!value) return 'URL is required'
                    if (!/^https?:\/\//.test(value)) {
                      return 'URL must start with http:// or https://'
                    }
                    return true
                  },
                },
                {
                  name: 'username',
                  type: 'text',
                  admin: {
                    description: 'Display name or handle',
                  },
                },
              ],
              admin: {
                description: 'Artist social media and music platform links',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              admin: {
                description: 'Direct contact email (private)',
              },
            },
            {
              name: 'website',
              type: 'text',
              validate: (value) => {
                if (value && !/^https?:\/\//.test(value)) {
                  return 'URL must start with http:// or https://'
                }
                return true
              },
              admin: {
                description: 'Personal website URL',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'SEO title (defaults to artist name)',
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
                    description: 'Custom Open Graph image for social sharing',
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
        if (!data.seo?.title && data.name) {
          data.seo = {
            ...data.seo,
            title: data.name,
          }
        }
        if (!data.seo?.description && data.shortBio) {
          data.seo = {
            ...data.seo,
            description: data.shortBio,
          }
        }
        return data
      },
    ],
  },
}