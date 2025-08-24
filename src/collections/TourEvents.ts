import { CollectionConfig } from 'payload/types'

export const TourEvents: CollectionConfig = {
  slug: 'tour-events',
  admin: {
    useAsTitle: 'eventName',
    group: 'Content',
    defaultColumns: ['eventName', 'venue', 'city', 'date', 'soldOut', 'featured'],
    description: 'Tour dates, concerts, and live events',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public can only see published events
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
          label: 'Event Details',
          fields: [
            {
              name: 'eventName',
              type: 'text',
              required: true,
              admin: {
                description: 'Name of the event or tour',
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
                    if (operation === 'create' && data?.eventName && !data?.slug) {
                      return data.eventName
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
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Postponed', value: 'postponed' },
                { label: 'Rescheduled', value: 'rescheduled' },
              ],
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'eventType',
              type: 'select',
              required: true,
              options: [
                { label: 'Concert', value: 'concert' },
                { label: 'Festival', value: 'festival' },
                { label: 'Tour Date', value: 'tour' },
                { label: 'Private Event', value: 'private' },
                { label: 'Acoustic Set', value: 'acoustic' },
                { label: 'DJ Set', value: 'dj-set' },
                { label: 'Live Stream', value: 'livestream' },
                { label: 'Meet & Greet', value: 'meet-greet' },
                { label: 'Album Release Party', value: 'release-party' },
                { label: 'Workshop', value: 'workshop' },
              ],
              defaultValue: 'concert',
            },
            {
              name: 'date',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Event start date and time',
              },
            },
            {
              name: 'endDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Event end date/time (for multi-day events)',
              },
            },
            {
              name: 'doors',
              type: 'text',
              admin: {
                description: 'Doors open time (e.g., 7:00 PM)',
              },
            },
            {
              name: 'showTime',
              type: 'text',
              admin: {
                description: 'Show start time (e.g., 8:00 PM)',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature on homepage',
              },
            },
            {
              name: 'soldOut',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Mark as sold out',
              },
            },
          ],
        },
        {
          label: 'Venue Information',
          fields: [
            {
              name: 'venue',
              type: 'text',
              required: true,
              admin: {
                description: 'Venue name',
              },
            },
            {
              name: 'venueAddress',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'state',
                  type: 'text',
                  admin: {
                    description: 'State/Province',
                  },
                },
                {
                  name: 'zipCode',
                  type: 'text',
                },
                {
                  name: 'country',
                  type: 'text',
                  required: true,
                  defaultValue: 'United States',
                },
              ],
            },
            {
              name: 'venueWebsite',
              type: 'text',
              validate: (value) => {
                if (value && !/^https?:\/\//.test(value)) {
                  return 'URL must start with http:// or https://'
                }
                return true
              },
              admin: {
                description: 'Venue website URL',
              },
            },
            {
              name: 'venuePhone',
              type: 'text',
              admin: {
                description: 'Venue phone number',
              },
            },
            {
              name: 'ageRestriction',
              type: 'select',
              options: [
                { label: 'All Ages', value: 'all-ages' },
                { label: '18+', value: '18plus' },
                { label: '21+', value: '21plus' },
                { label: 'VIP Only', value: 'vip-only' },
              ],
              defaultValue: 'all-ages',
            },
            {
              name: 'capacity',
              type: 'number',
              admin: {
                description: 'Venue capacity (number of people)',
              },
            },
            {
              name: 'venueImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Venue photo',
              },
            },
          ],
        },
        {
          label: 'Event Content',
          fields: [
            {
              name: 'description',
              type: 'richText',
              admin: {
                description: 'Event description and details',
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
              name: 'eventImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Event poster or promotional image',
              },
            },
            {
              name: 'supportingActs',
              type: 'array',
              maxRows: 5,
              fields: [
                {
                  name: 'artistName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'setTime',
                  type: 'text',
                  admin: {
                    description: 'Performance time slot',
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
                },
              ],
              admin: {
                description: 'Opening acts and supporting artists',
              },
            },
            {
              name: 'setlist',
              type: 'array',
              fields: [
                {
                  name: 'songTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'order',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'notes',
                  type: 'text',
                  admin: {
                    description: 'Special notes (e.g., acoustic, cover, etc.)',
                  },
                },
              ],
              admin: {
                description: 'Planned or actual setlist (optional)',
              },
            },
          ],
        },
        {
          label: 'Tickets & Pricing',
          fields: [
            {
              name: 'ticketing',
              type: 'group',
              fields: [
                {
                  name: 'ticketUrl',
                  type: 'text',
                  validate: (value) => {
                    if (value && !/^https?:\/\//.test(value)) {
                      return 'URL must start with http:// or https://'
                    }
                    return true
                  },
                  admin: {
                    description: 'Primary ticket purchase URL',
                  },
                },
                {
                  name: 'presaleUrl',
                  type: 'text',
                  validate: (value) => {
                    if (value && !/^https?:\/\//.test(value)) {
                      return 'URL must start with http:// or https://'
                    }
                    return true
                  },
                  admin: {
                    description: 'Presale ticket URL',
                  },
                },
                {
                  name: 'presaleCode',
                  type: 'text',
                  admin: {
                    description: 'Presale access code',
                  },
                },
                {
                  name: 'presaleStart',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    description: 'Presale start date/time',
                  },
                },
                {
                  name: 'publicSaleStart',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    description: 'Public sale start date/time',
                  },
                },
              ],
            },
            {
              name: 'pricing',
              type: 'array',
              fields: [
                {
                  name: 'tierName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Ticket tier (e.g., General Admission, VIP)',
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'Price in dollars',
                  },
                },
                {
                  name: 'currency',
                  type: 'text',
                  defaultValue: 'USD',
                },
                {
                  name: 'fees',
                  type: 'text',
                  admin: {
                    description: 'Additional fees info',
                  },
                },
                {
                  name: 'benefits',
                  type: 'textarea',
                  admin: {
                    description: 'What\'s included with this ticket tier',
                  },
                },
                {
                  name: 'available',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
              admin: {
                description: 'Ticket pricing tiers',
              },
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              name: 'tags',
              type: 'text',
              admin: {
                description: 'Event tags (comma separated)',
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
                    description: 'SEO title (defaults to event name)',
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
        if (!data.seo?.title && data.eventName && data.venue) {
          data.seo = {
            ...data.seo,
            title: `${data.eventName} at ${data.venue}`,
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