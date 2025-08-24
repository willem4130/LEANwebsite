import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'altText', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: () => true, // Public access for media files
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'card',
        width: 640,
        height: 640,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 90,
          },
        },
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
    ],
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility. Describe what the image shows.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption displayed with the media',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photo/video credit (photographer, videographer, etc.)',
      },
    },
    {
      name: 'category',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Live Performance', value: 'live' },
        { label: 'Studio Session', value: 'studio' },
        { label: 'Behind the Scenes', value: 'bts' },
        { label: 'Press/Promo', value: 'press' },
        { label: 'Album Artwork', value: 'artwork' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Venue/Location', value: 'venue' },
        { label: 'Fan Photos', value: 'fan' },
        { label: 'Social Media', value: 'social' },
      ],
      admin: {
        description: 'Categorize media for easier organization',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured for homepage/gallery highlights',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        condition: (data) => ['video', 'audio'].some(type => data.mimeType?.startsWith(type)),
      },
      fields: [
        {
          name: 'duration',
          type: 'number',
          admin: {
            description: 'Duration in seconds (for video/audio)',
          },
        },
        {
          name: 'artist',
          type: 'text',
          admin: {
            description: 'Artist name (for audio files)',
          },
        },
        {
          name: 'album',
          type: 'text',
          admin: {
            description: 'Album name (for audio files)',
          },
        },
        {
          name: 'track',
          type: 'number',
          admin: {
            description: 'Track number (for audio files)',
          },
        },
      ],
    },
    {
      name: 'seoData',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title for this media file',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO description for this media file',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma separated)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate SEO title if not provided
        if (!data.seoData?.title && data.altText) {
          data.seoData = {
            ...data.seoData,
            title: data.altText,
          }
        }
        return data
      },
    ],
  },
}