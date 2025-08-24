import { CollectionConfig } from 'payload/types'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'status', 'publishedDate', 'featured'],
    description: 'Blog posts, news updates, and announcements',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public can only see published posts
      return {
        and: [
          { status: { equals: 'published' } },
          { publishedDate: { less_than_equal: new Date() } }
        ]
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
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Blog post title',
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
                { label: 'Private', value: 'private' },
                { label: 'Archived', value: 'archived' },
              ],
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              required: true,
              defaultValue: () => new Date(),
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'When to publish this post',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature on homepage and blog highlights',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 300,
              admin: {
                description: 'Brief summary for previews (max 300 characters)',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              admin: {
                description: 'Full blog post content',
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main image for the blog post',
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
              required: true,
              options: [
                { label: 'News & Updates', value: 'news' },
                { label: 'New Music', value: 'new-music' },
                { label: 'Tour Announcements', value: 'tour' },
                { label: 'Behind the Scenes', value: 'bts' },
                { label: 'Studio Updates', value: 'studio' },
                { label: 'Collaborations', value: 'collaborations' },
                { label: 'Fan Stories', value: 'fan-stories' },
                { label: 'Reviews & Press', value: 'press' },
                { label: 'Interviews', value: 'interviews' },
                { label: 'Technical/Gear', value: 'technical' },
                { label: 'Personal', value: 'personal' },
                { label: 'Industry Insights', value: 'industry' },
                { label: 'Announcements', value: 'announcements' },
              ],
              admin: {
                description: 'Primary category for this post',
              },
            },
            {
              name: 'tags',
              type: 'text',
              admin: {
                description: 'Tags for this post (comma separated)',
              },
            },
            {
              name: 'relatedRelease',
              type: 'relationship',
              relationTo: 'releases',
              admin: {
                description: 'Link to related music release if applicable',
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
              name: 'relatedGallery',
              type: 'relationship',
              relationTo: 'gallery',
              hasMany: true,
              admin: {
                description: 'Link to related gallery items',
              },
            },
          ],
        },
        {
          label: 'Author & Credits',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              admin: {
                description: 'Post author',
              },
            },
            {
              name: 'coAuthors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              admin: {
                description: 'Additional authors or contributors',
              },
            },
            {
              name: 'guestAuthor',
              type: 'group',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  admin: {
                    description: 'Guest author name (if not a user)',
                  },
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  admin: {
                    description: 'Guest author bio',
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
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'lastModified',
              type: 'date',
              admin: {
                readOnly: true,
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Content Options',
          fields: [
            {
              name: 'contentType',
              type: 'select',
              required: true,
              options: [
                { label: 'Standard Post', value: 'standard' },
                { label: 'Photo Story', value: 'photo-story' },
                { label: 'Video Post', value: 'video' },
                { label: 'Audio/Podcast', value: 'audio' },
                { label: 'Gallery Post', value: 'gallery' },
                { label: 'Link/External', value: 'link' },
                { label: 'Quote', value: 'quote' },
              ],
              defaultValue: 'standard',
              admin: {
                description: 'Type of content for special formatting',
              },
            },
            {
              name: 'embedCode',
              type: 'textarea',
              admin: {
                condition: (data) => ['video', 'audio'].includes(data.contentType),
                description: 'Embed code for video/audio content',
              },
            },
            {
              name: 'externalLink',
              type: 'text',
              validate: (value, { data }) => {
                if (data.contentType === 'link' && !value) {
                  return 'External link is required for link posts'
                }
                if (value && !/^https?:\/\//.test(value)) {
                  return 'URL must start with http:// or https://'
                }
                return true
              },
              admin: {
                condition: (data) => data.contentType === 'link',
                description: 'External link URL',
              },
            },
            {
              name: 'quote',
              type: 'group',
              admin: {
                condition: (data) => data.contentType === 'quote',
              },
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Quote text',
                  },
                },
                {
                  name: 'attribution',
                  type: 'text',
                  admin: {
                    description: 'Who said this quote',
                  },
                },
                {
                  name: 'source',
                  type: 'text',
                  admin: {
                    description: 'Source of the quote',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Engagement',
          fields: [
            {
              name: 'allowComments',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Allow comments on this post',
              },
            },
            {
              name: 'commentsModerated',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Require comment moderation',
              },
            },
            {
              name: 'socialSharing',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable social sharing buttons',
                  },
                },
                {
                  name: 'customMessage',
                  type: 'text',
                  admin: {
                    description: 'Custom sharing message (optional)',
                  },
                },
              ],
            },
            {
              name: 'newsletter',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Include in newsletter digest',
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
                    description: 'SEO title (defaults to post title)',
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
                    description: 'Custom Open Graph image (defaults to featured image)',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this post',
                  },
                },
              ],
            },
            {
              name: 'readingTime',
              type: 'number',
              admin: {
                readOnly: true,
                description: 'Estimated reading time in minutes (auto-calculated)',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Set last modified date
        data.lastModified = new Date()

        // Calculate reading time (approximate: 200 words per minute)
        if (data.content) {
          const wordCount = data.content.reduce((count, node) => {
            if (node.type === 'paragraph' && node.children) {
              return count + node.children.reduce((nodeCount, child) => {
                return nodeCount + (child.text ? child.text.split(/\s+/).length : 0)
              }, 0)
            }
            return count
          }, 0)
          data.readingTime = Math.ceil(wordCount / 200)
        }

        // Auto-generate SEO fields if not provided
        if (!data.seo?.title && data.title) {
          data.seo = {
            ...data.seo,
            title: data.title,
          }
        }
        if (!data.seo?.description && data.excerpt) {
          data.seo = {
            ...data.seo,
            description: data.excerpt,
          }
        }

        return data
      },
    ],
  },
}