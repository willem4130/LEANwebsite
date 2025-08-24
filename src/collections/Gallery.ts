import { CollectionConfig } from 'payload/types'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'featured', 'type', 'updatedAt'],
    description: 'Photo and video gallery items',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public can only see published gallery items
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
                description: 'Gallery item title or caption',
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
                { label: 'Private', value: 'private' },
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
                { label: 'Photo', value: 'photo' },
                { label: 'Video', value: 'video' },
                { label: 'Album/Collection', value: 'album' },
                { label: 'GIF', value: 'gif' },
              ],
              defaultValue: 'photo',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature on homepage and gallery highlights',
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
          label: 'Media Content',
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Primary photo or video file',
              },
            },
            {
              name: 'thumbnailOverride',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.type === 'video',
                description: 'Custom thumbnail for video (optional)',
              },
            },
            {
              name: 'additionalMedia',
              type: 'array',
              maxRows: 20,
              admin: {
                condition: (data) => data.type === 'album',
                description: 'Additional photos for albums/collections',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  admin: {
                    description: 'Individual photo caption',
                  },
                },
                {
                  name: 'order',
                  type: 'number',
                  defaultValue: 0,
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'Detailed description or story behind the media',
              },
            },
            {
              name: 'caption',
              type: 'textarea',
              admin: {
                description: 'Short caption for display',
              },
            },
            {
              name: 'altText',
              type: 'text',
              required: true,
              admin: {
                description: 'Alt text for accessibility (describe what\'s shown)',
              },
            },
          ],
        },
        {
          label: 'Categorization',
          fields: [
            {
              name: 'category',
              type: 'select',
              hasMany: true,
              required: true,
              options: [
                { label: 'Live Performance', value: 'live' },
                { label: 'Studio Session', value: 'studio' },
                { label: 'Behind the Scenes', value: 'bts' },
                { label: 'Press & Promo', value: 'press' },
                { label: 'Music Video', value: 'music-video' },
                { label: 'Equipment & Gear', value: 'equipment' },
                { label: 'Acoustic Performance', value: 'acoustic' },
                { label: 'Fan Photos', value: 'fan' },
                { label: 'Crowd Shots', value: 'crowd' },
                { label: 'Venue & Location', value: 'venue' },
                { label: 'Travel & Tour', value: 'travel' },
                { label: 'Collaboration', value: 'collaboration' },
                { label: 'Awards & Events', value: 'awards' },
                { label: 'Personal/Lifestyle', value: 'personal' },
                { label: 'Album Artwork', value: 'artwork' },
              ],
              admin: {
                description: 'Categorize for filtering and organization',
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
              name: 'relatedRelease',
              type: 'relationship',
              relationTo: 'releases',
              admin: {
                description: 'Link to related album/single if applicable',
              },
            },
            {
              name: 'relatedEvent',
              type: 'relationship',
              relationTo: 'tour-events',
              admin: {
                description: 'Link to related tour event if applicable',
              },
            },
            {
              name: 'location',
              type: 'group',
              fields: [
                {
                  name: 'venue',
                  type: 'text',
                  admin: {
                    description: 'Venue or location name',
                  },
                },
                {
                  name: 'city',
                  type: 'text',
                  admin: {
                    description: 'City where photo/video was taken',
                  },
                },
                {
                  name: 'state',
                  type: 'text',
                  admin: {
                    description: 'State/Province',
                  },
                },
                {
                  name: 'country',
                  type: 'text',
                  admin: {
                    description: 'Country',
                  },
                },
              ],
            },
            {
              name: 'datePhotographed',
              type: 'date',
              admin: {
                description: 'When the photo/video was taken (if different from upload)',
              },
            },
          ],
        },
        {
          label: 'Credits & Rights',
          fields: [
            {
              name: 'photographer',
              type: 'text',
              admin: {
                description: 'Photographer or videographer name',
              },
            },
            {
              name: 'photographerWebsite',
              type: 'text',
              validate: (value) => {
                if (value && !/^https?:\/\//.test(value)) {
                  return 'URL must start with http:// or https://'
                }
                return true
              },
              admin: {
                description: 'Photographer\'s website or social media',
              },
            },
            {
              name: 'creditRequired',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Require photo credit when displayed?',
              },
            },
            {
              name: 'rights',
              type: 'select',
              required: true,
              options: [
                { label: 'Full Rights', value: 'full' },
                { label: 'Licensed for Website Use', value: 'licensed' },
                { label: 'Fair Use', value: 'fair-use' },
                { label: 'Permission Required', value: 'permission' },
                { label: 'Copyright Protected', value: 'copyright' },
              ],
              defaultValue: 'full',
              admin: {
                description: 'Usage rights for this media',
              },
            },
            {
              name: 'copyrightNotice',
              type: 'text',
              admin: {
                description: 'Copyright notice text (optional)',
              },
            },
          ],
        },
        {
          label: 'Display Options',
          fields: [
            {
              name: 'displaySettings',
              type: 'group',
              fields: [
                {
                  name: 'showInMainGallery',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show in main gallery view',
                  },
                },
                {
                  name: 'showOnHomepage',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Show on homepage gallery section',
                  },
                },
                {
                  name: 'allowDownload',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Allow visitors to download this media',
                  },
                },
                {
                  name: 'showMetadata',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show camera/technical metadata if available',
                  },
                },
              ],
            },
            {
              name: 'galleryStyle',
              type: 'select',
              options: [
                { label: 'Grid View', value: 'grid' },
                { label: 'Masonry Layout', value: 'masonry' },
                { label: 'Carousel/Slider', value: 'carousel' },
                { label: 'Lightbox Only', value: 'lightbox' },
                { label: 'Full Width', value: 'full-width' },
              ],
              defaultValue: 'grid',
              admin: {
                description: 'How this item should display in gallery',
              },
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'SEO title (defaults to gallery item title)',
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
                    description: 'Custom Open Graph image (defaults to main media)',
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
        if (!data.seo?.description && data.caption) {
          data.seo = {
            ...data.seo,
            description: data.caption,
          }
        }
        return data
      },
    ],
  },
}