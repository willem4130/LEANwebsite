import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'

export default buildConfig({
  admin: {
    user: 'users',
  },
  editor: slateEditor({}),
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false,
        update: () => false,
      },
      fields: [],
    },
    {
      slug: 'site-config',
      admin: {
        useAsTitle: 'siteName',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'siteName',
          type: 'text',
          required: true,
        },
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#000000',
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#ffffff',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      slug: 'hero-sections',
      admin: {
        useAsTitle: 'artistName',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'artistName',
          type: 'text',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
        },
        {
          name: 'backgroundType',
          type: 'select',
          options: [
            { label: 'Color', value: 'color' },
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
            condition: (data) => data.backgroundType === 'color',
          },
          defaultValue: '#000000',
        },
        {
          name: 'backgroundMedia',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data) => ['image', 'video'].includes(data.backgroundType),
          },
        },
        {
          name: 'animationDuration',
          type: 'select',
          options: [
            { label: '3 seconds', value: 3 },
            { label: '4 seconds', value: 4 },
            { label: '5 seconds', value: 5 },
          ],
          defaultValue: 4,
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Listen Now',
        },
        {
          name: 'ctaLink',
          type: 'text',
          defaultValue: '#',
        },
      ],
    },
    {
      slug: 'tour-events',
      admin: {
        useAsTitle: 'eventName',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'eventName',
          type: 'text',
          required: true,
        },
        {
          name: 'venue',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'ticketUrl',
          type: 'text',
        },
        {
          name: 'soldOut',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      slug: 'gallery-items',
      admin: {
        useAsTitle: 'caption',
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'category',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Live Performance', value: 'live' },
            { label: 'Studio', value: 'studio' },
            { label: 'Behind the Scenes', value: 'bts' },
            { label: 'Press', value: 'press' },
          ],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticURL: '/media',
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'tablet',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*', 'video/*'],
      },
      fields: [
        {
          name: 'altText',
          type: 'text',
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
})