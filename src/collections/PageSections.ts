import type { CollectionConfig } from 'payload'

/**
 * Page Sections Collection - Complete Website Section Control
 * ========================================================
 * 
 * Allows users to manage all website sections with complete flexibility:
 * - Hero sections with various layouts and media types
 * - About sections with rich content
 * - Services/Features sections 
 * - Testimonials and social proof
 * - Call-to-action sections
 * - Custom HTML/Component sections
 * 
 * Enterprise-level features:
 * - Dynamic component rendering
 * - A/B testing variants
 * - Conditional display rules
 * - Responsive design controls
 */

export const PageSections: CollectionConfig = {
  slug: 'page-sections',
  admin: {
    useAsTitle: 'sectionName',
    group: 'Website Management',
    defaultColumns: ['sectionName', 'sectionType', 'page', 'enabled', 'order'],
    description: 'Manage all website sections with complete control over content, design, and functionality',
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
          label: 'Section Identity',
          fields: [
            {
              name: 'sectionName',
              type: 'text',
              required: true,
              admin: {
                description: 'Internal name for this section (for admin use)',
              },
            },
            {
              name: 'sectionId',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Unique ID for anchor links and CSS targeting',
              },
              hooks: {
                beforeValidate: [
                  ({ data, operation }) => {
                    if (operation === 'create' && data?.sectionName && !data?.sectionId) {
                      return data.sectionName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    }
                    return data?.sectionId
                  },
                ],
              },
            },
            {
              name: 'sectionType',
              type: 'select',
              required: true,
              options: [
                { label: 'Hero Section', value: 'hero' },
                { label: 'About Section', value: 'about' },
                { label: 'Services/Features', value: 'services' },
                { label: 'Gallery Showcase', value: 'gallery' },
                { label: 'Testimonials', value: 'testimonials' },
                { label: 'Contact Section', value: 'contact' },
                { label: 'Call-to-Action', value: 'cta' },
                { label: 'Music/Releases', value: 'music' },
                { label: 'Tour/Events', value: 'events' },
                { label: 'Team/Artists', value: 'team' },
                { label: 'Blog/News', value: 'blog' },
                { label: 'Statistics/Numbers', value: 'stats' },
                { label: 'FAQ Section', value: 'faq' },
                { label: 'Newsletter Signup', value: 'newsletter' },
                { label: 'Social Media Feed', value: 'social' },
                { label: 'Custom Component', value: 'custom' },
                { label: 'HTML Content', value: 'html' },
              ],
              admin: {
                description: 'Type determines available layout options and content fields',
              },
            },
            {
              name: 'page',
              type: 'select',
              required: true,
              hasMany: true,
              options: [
                { label: 'Homepage', value: 'homepage' },
                { label: 'About Page', value: 'about' },
                { label: 'Music/Releases', value: 'music' },
                { label: 'Gallery', value: 'gallery' },
                { label: 'Tour/Events', value: 'tour' },
                { label: 'Contact', value: 'contact' },
                { label: 'Blog/News', value: 'blog' },
                { label: 'All Pages (Global)', value: 'global' },
              ],
              admin: {
                description: 'Which pages should display this section',
              },
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
                description: 'Show/hide this section',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              admin: {
                position: 'sidebar',
                description: 'Display order on page (lower numbers first)',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            // Hero Section Content
            {
              name: 'heroContent',
              type: 'group',
              admin: {
                condition: (data) => data.sectionType === 'hero',
              },
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  options: [
                    { label: 'Centered Text + Media', value: 'centered' },
                    { label: 'Left Text + Right Media', value: 'split-left' },
                    { label: 'Right Text + Left Media', value: 'split-right' },
                    { label: 'Full Background Media', value: 'full-bg' },
                    { label: 'Video Background', value: 'video-bg' },
                    { label: 'Animated Text Only', value: 'text-only' },
                  ],
                  defaultValue: 'centered',
                },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'subheadline',
                  type: 'textarea',
                },
                {
                  name: 'description',
                  type: 'richText',
                },
                {
                  name: 'ctaButtons',
                  type: 'array',
                  maxRows: 3,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
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
                    {
                      name: 'newTab',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  name: 'backgroundMedia',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'heroMedia',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => !['full-bg', 'video-bg', 'text-only'].includes(siblingData.layout),
                  },
                },
              ],
            },
            
            // About Section Content
            {
              name: 'aboutContent',
              type: 'group',
              admin: {
                condition: (data) => data.sectionType === 'about',
              },
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  options: [
                    { label: 'Text + Image Side-by-Side', value: 'split' },
                    { label: 'Text Above Image', value: 'stacked' },
                    { label: 'Multi-Column Text', value: 'columns' },
                    { label: 'Timeline Format', value: 'timeline' },
                  ],
                  defaultValue: 'split',
                },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'content',
                  type: 'richText',
                  required: true,
                },
                {
                  name: 'images',
                  type: 'array',
                  maxRows: 5,
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
                    },
                  ],
                },
                {
                  name: 'highlights',
                  type: 'array',
                  maxRows: 6,
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      admin: {
                        description: 'Icon name (e.g., "music", "heart", "star")',
                      },
                    },
                  ],
                },
              ],
            },
            
            // Services/Features Section
            {
              name: 'servicesContent',
              type: 'group',
              admin: {
                condition: (data) => data.sectionType === 'services',
              },
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  options: [
                    { label: 'Grid Layout', value: 'grid' },
                    { label: 'List Layout', value: 'list' },
                    { label: 'Card Layout', value: 'cards' },
                    { label: 'Tabbed Interface', value: 'tabs' },
                  ],
                  defaultValue: 'grid',
                },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'services',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'richText',
                      required: true,
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      admin: {
                        description: 'Icon name or emoji',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'link',
                      type: 'group',
                      fields: [
                        {
                          name: 'url',
                          type: 'text',
                        },
                        {
                          name: 'text',
                          type: 'text',
                          defaultValue: 'Learn More',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            
            // Call-to-Action Section
            {
              name: 'ctaContent',
              type: 'group',
              admin: {
                condition: (data) => data.sectionType === 'cta',
              },
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  options: [
                    { label: 'Centered', value: 'centered' },
                    { label: 'Split (Text + Button)', value: 'split' },
                    { label: 'Full Width Banner', value: 'banner' },
                    { label: 'Card Style', value: 'card' },
                  ],
                  defaultValue: 'centered',
                },
                {
                  name: 'headline',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'button',
                  type: 'group',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'style',
                      type: 'select',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Accent', value: 'accent' },
                      ],
                      defaultValue: 'primary',
                    },
                  ],
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            
            // Custom HTML/Component Content
            {
              name: 'customContent',
              type: 'group',
              admin: {
                condition: (data) => ['custom', 'html'].includes(data.sectionType),
              },
              fields: [
                {
                  name: 'componentName',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => data.sectionType === 'custom',
                    description: 'React component name to render',
                  },
                },
                {
                  name: 'props',
                  type: 'json',
                  admin: {
                    condition: (data, siblingData) => data.sectionType === 'custom',
                    description: 'Props to pass to the component (JSON format)',
                  },
                },
                {
                  name: 'htmlContent',
                  type: 'code',
                  admin: {
                    condition: (data, siblingData) => data.sectionType === 'html',
                    language: 'html',
                    description: 'Custom HTML content',
                  },
                },
                {
                  name: 'customCSS',
                  type: 'code',
                  admin: {
                    language: 'css',
                    description: 'Custom CSS for this section',
                  },
                },
                {
                  name: 'customJS',
                  type: 'code',
                  admin: {
                    language: 'javascript',
                    description: 'Custom JavaScript (use with caution)',
                  },
                },
              ],
            },
            
            // Dynamic Content for Other Types
            {
              name: 'dynamicContent',
              type: 'json',
              admin: {
                condition: (data) => !['hero', 'about', 'services', 'cta', 'custom', 'html'].includes(data.sectionType),
                description: 'Flexible content structure (JSON format)',
              },
            },
          ],
        },
        {
          label: 'Design & Layout',
          fields: [
            {
              name: 'styling',
              type: 'group',
              fields: [
                {
                  name: 'containerWidth',
                  type: 'select',
                  options: [
                    { label: 'Full Width', value: 'full' },
                    { label: 'Wide Container', value: 'wide' },
                    { label: 'Standard Container', value: 'container' },
                    { label: 'Narrow Container', value: 'narrow' },
                  ],
                  defaultValue: 'container',
                },
                {
                  name: 'padding',
                  type: 'group',
                  fields: [
                    {
                      name: 'top',
                      type: 'select',
                      options: [
                        { label: 'None', value: 'none' },
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                        { label: 'X-Large', value: 'xl' },
                      ],
                      defaultValue: 'md',
                    },
                    {
                      name: 'bottom',
                      type: 'select',
                      options: [
                        { label: 'None', value: 'none' },
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                        { label: 'X-Large', value: 'xl' },
                      ],
                      defaultValue: 'md',
                    },
                  ],
                },
                {
                  name: 'backgroundColor',
                  type: 'select',
                  options: [
                    { label: 'Transparent', value: 'transparent' },
                    { label: 'White', value: 'white' },
                    { label: 'Gray Light', value: 'gray-light' },
                    { label: 'Gray Dark', value: 'gray-dark' },
                    { label: 'Primary Color', value: 'primary' },
                    { label: 'Secondary Color', value: 'secondary' },
                    { label: 'Accent Color', value: 'accent' },
                    { label: 'Custom', value: 'custom' },
                  ],
                  defaultValue: 'transparent',
                },
                {
                  name: 'customBackgroundColor',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData.backgroundColor === 'custom',
                    description: 'Custom background color (hex, rgb, etc.)',
                  },
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'textColor',
                  type: 'select',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'White', value: 'white' },
                    { label: 'Black', value: 'black' },
                    { label: 'Primary', value: 'primary' },
                    { label: 'Custom', value: 'custom' },
                  ],
                  defaultValue: 'default',
                },
                {
                  name: 'customTextColor',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData.textColor === 'custom',
                  },
                },
              ],
            },
            {
              name: 'animations',
              type: 'group',
              fields: [
                {
                  name: 'entranceAnimation',
                  type: 'select',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Fade In', value: 'fadeIn' },
                    { label: 'Slide Up', value: 'slideUp' },
                    { label: 'Slide Down', value: 'slideDown' },
                    { label: 'Slide Left', value: 'slideLeft' },
                    { label: 'Slide Right', value: 'slideRight' },
                    { label: 'Scale In', value: 'scaleIn' },
                    { label: 'Bounce In', value: 'bounceIn' },
                  ],
                  defaultValue: 'fadeIn',
                },
                {
                  name: 'animationDelay',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    description: 'Animation delay in milliseconds',
                  },
                },
                {
                  name: 'animationDuration',
                  type: 'number',
                  defaultValue: 600,
                  admin: {
                    description: 'Animation duration in milliseconds',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Advanced Settings',
          fields: [
            {
              name: 'conditions',
              type: 'group',
              admin: {
                description: 'Advanced display conditions',
              },
              fields: [
                {
                  name: 'deviceVisibility',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'Desktop', value: 'desktop' },
                    { label: 'Tablet', value: 'tablet' },
                    { label: 'Mobile', value: 'mobile' },
                  ],
                  defaultValue: ['desktop', 'tablet', 'mobile'],
                },
                {
                  name: 'userRoles',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'All Visitors', value: 'public' },
                    { label: 'Logged In Users', value: 'user' },
                    { label: 'Admin Only', value: 'admin' },
                  ],
                  defaultValue: ['public'],
                },
                {
                  name: 'dateRange',
                  type: 'group',
                  fields: [
                    {
                      name: 'startDate',
                      type: 'date',
                      admin: {
                        description: 'Show section starting from this date',
                      },
                    },
                    {
                      name: 'endDate',
                      type: 'date',
                      admin: {
                        description: 'Hide section after this date',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'seoTitle',
                  type: 'text',
                  admin: {
                    description: 'SEO title for this section (if it has its own page)',
                  },
                },
                {
                  name: 'seoDescription',
                  type: 'textarea',
                  maxLength: 160,
                },
                {
                  name: 'structuredData',
                  type: 'json',
                  admin: {
                    description: 'Schema.org structured data (JSON-LD format)',
                  },
                },
              ],
            },
            {
              name: 'analytics',
              type: 'group',
              fields: [
                {
                  name: 'trackingEvents',
                  type: 'array',
                  fields: [
                    {
                      name: 'eventType',
                      type: 'select',
                      options: [
                        { label: 'View', value: 'view' },
                        { label: 'Click', value: 'click' },
                        { label: 'Scroll Into View', value: 'scroll' },
                        { label: 'Form Submit', value: 'submit' },
                      ],
                    },
                    {
                      name: 'eventName',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'eventCategory',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'A/B Testing',
          fields: [
            {
              name: 'abTesting',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'testName',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                  },
                },
                {
                  name: 'variants',
                  type: 'array',
                  maxRows: 5,
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'weight',
                      type: 'number',
                      min: 0,
                      max: 100,
                      defaultValue: 50,
                      admin: {
                        description: 'Traffic percentage for this variant',
                      },
                    },
                    {
                      name: 'contentOverride',
                      type: 'json',
                      admin: {
                        description: 'Content changes for this variant',
                      },
                    },
                  ],
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
        // Auto-generate section ID if not provided
        if (!data.sectionId && data.sectionName) {
          data.sectionId = data.sectionName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}