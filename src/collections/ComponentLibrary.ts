import type { CollectionConfig } from 'payload'

/**
 * Component Library Collection - Reusable UI Components
 * ===================================================
 * 
 * Manages a library of reusable UI components that can be:
 * - Inserted into any page section
 * - Customized per instance
 * - Shared across multiple websites
 * - Version controlled
 * - A/B tested
 * 
 * Future-ready for:
 * - Visual component editor
 * - Component marketplace
 * - Third-party integrations
 */

export const ComponentLibrary: CollectionConfig = {
  slug: 'component-library',
  admin: {
    useAsTitle: 'componentName',
    group: 'Development',
    defaultColumns: ['componentName', 'category', 'version', 'status', 'updatedAt'],
    description: 'Reusable UI components for dynamic website building',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Component Definition',
          fields: [
            {
              name: 'componentName',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Unique component name (PascalCase recommended)',
              },
            },
            {
              name: 'displayName',
              type: 'text',
              required: true,
              admin: {
                description: 'Human-readable name for the admin interface',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'What this component does and when to use it',
              },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              options: [
                { label: 'Layout', value: 'layout' },
                { label: 'Navigation', value: 'navigation' },
                { label: 'Content Display', value: 'content' },
                { label: 'Interactive', value: 'interactive' },
                { label: 'Media', value: 'media' },
                { label: 'Forms', value: 'forms' },
                { label: 'E-commerce', value: 'ecommerce' },
                { label: 'Social', value: 'social' },
                { label: 'Analytics', value: 'analytics' },
                { label: 'Third-party', value: 'third-party' },
                { label: 'Custom', value: 'custom' },
              ],
              admin: {
                description: 'Component category for organization',
              },
            },
            {
              name: 'tags',
              type: 'text',
              admin: {
                description: 'Searchable tags (comma separated)',
              },
            },
            {
              name: 'version',
              type: 'text',
              required: true,
              defaultValue: '1.0.0',
              admin: {
                description: 'Semantic version (e.g., 1.0.0)',
              },
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              options: [
                { label: 'Development', value: 'development' },
                { label: 'Testing', value: 'testing' },
                { label: 'Stable', value: 'stable' },
                { label: 'Deprecated', value: 'deprecated' },
              ],
              defaultValue: 'development',
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Component Code',
          fields: [
            {
              name: 'implementation',
              type: 'group',
              fields: [
                {
                  name: 'framework',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'React/Next.js', value: 'react' },
                    { label: 'Vue/Nuxt', value: 'vue' },
                    { label: 'Svelte/SvelteKit', value: 'svelte' },
                    { label: 'HTML/CSS/JS', value: 'vanilla' },
                    { label: 'Web Component', value: 'web-component' },
                  ],
                  defaultValue: 'react',
                },
                {
                  name: 'sourceCode',
                  type: 'code',
                  required: true,
                  admin: {
                    language: 'typescript',
                    description: 'Main component source code',
                  },
                },
                {
                  name: 'styles',
                  type: 'code',
                  admin: {
                    language: 'css',
                    description: 'Component styles (CSS/SCSS)',
                  },
                },
                {
                  name: 'dependencies',
                  type: 'array',
                  fields: [
                    {
                      name: 'package',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'NPM package name',
                      },
                    },
                    {
                      name: 'version',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Version or version range',
                      },
                    },
                    {
                      name: 'required',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                  ],
                  admin: {
                    description: 'External dependencies required by this component',
                  },
                },
              ],
            },
            {
              name: 'propsSchema',
              type: 'json',
              required: true,
              admin: {
                description: 'JSON Schema defining component props/configuration',
              },
            },
            {
              name: 'defaultProps',
              type: 'json',
              admin: {
                description: 'Default prop values (JSON format)',
              },
            },
            {
              name: 'exampleUsage',
              type: 'code',
              admin: {
                language: 'typescript',
                description: 'Example of how to use this component',
              },
            },
          ],
        },
        {
          label: 'Visual & UX',
          fields: [
            {
              name: 'preview',
              type: 'group',
              fields: [
                {
                  name: 'screenshot',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: {
                    description: 'Visual preview of the component',
                  },
                },
                {
                  name: 'thumbnails',
                  type: 'array',
                  maxRows: 5,
                  fields: [
                    {
                      name: 'variant',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Variant name (e.g., "Dark Mode", "Mobile")',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                  admin: {
                    description: 'Screenshots of different component variants',
                  },
                },
                {
                  name: 'liveDemo',
                  type: 'text',
                  validate: (value: any) => {
                    if (value && !/^https?:\/\//.test(value)) {
                      return 'URL must start with http:// or https://'
                    }
                    return true
                  },
                  admin: {
                    description: 'URL to live demo/Storybook',
                  },
                },
              ],
            },
            {
              name: 'accessibility',
              type: 'group',
              fields: [
                {
                  name: 'wcagLevel',
                  type: 'select',
                  options: [
                    { label: 'A', value: 'A' },
                    { label: 'AA', value: 'AA' },
                    { label: 'AAA', value: 'AAA' },
                    { label: 'Not Tested', value: 'not-tested' },
                  ],
                  defaultValue: 'not-tested',
                },
                {
                  name: 'keyboardNavigation',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Supports keyboard navigation',
                  },
                },
                {
                  name: 'screenReaderSupport',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Tested with screen readers',
                  },
                },
                {
                  name: 'colorContrastCompliant',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Meets color contrast requirements',
                  },
                },
                {
                  name: 'ariaLabels',
                  type: 'json',
                  admin: {
                    description: 'Required ARIA labels and their default values',
                  },
                },
              ],
            },
            {
              name: 'responsive',
              type: 'group',
              fields: [
                {
                  name: 'breakpoints',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'Mobile (320px+)', value: 'mobile' },
                    { label: 'Tablet (768px+)', value: 'tablet' },
                    { label: 'Desktop (1024px+)', value: 'desktop' },
                    { label: 'Large Desktop (1440px+)', value: 'large' },
                  ],
                  defaultValue: ['mobile', 'tablet', 'desktop'],
                  admin: {
                    description: 'Supported breakpoints',
                  },
                },
                {
                  name: 'mobileOptimized',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Specifically optimized for mobile devices',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Configuration',
          fields: [
            {
              name: 'configuration',
              type: 'group',
              fields: [
                {
                  name: 'configurable',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Can users configure this component?',
                  },
                },
                {
                  name: 'configSchema',
                  type: 'json',
                  admin: {
                    condition: (data, siblingData) => siblingData.configurable,
                    description: 'JSON Schema for user configuration options',
                  },
                },
                {
                  name: 'adminInterface',
                  type: 'select',
                  options: [
                    { label: 'Form Fields', value: 'form' },
                    { label: 'Visual Editor', value: 'visual' },
                    { label: 'Code Editor', value: 'code' },
                    { label: 'JSON Editor', value: 'json' },
                  ],
                  defaultValue: 'form',
                  admin: {
                    condition: (data, siblingData) => siblingData.configurable,
                    description: 'How users configure this component',
                  },
                },
                {
                  name: 'presets',
                  type: 'array',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                    {
                      name: 'config',
                      type: 'json',
                      required: true,
                    },
                    {
                      name: 'preview',
                      type: 'upload',
                      relationTo: 'media',
                    },
                  ],
                  admin: {
                    description: 'Pre-configured component presets',
                  },
                },
              ],
            },
            {
              name: 'integrations',
              type: 'group',
              fields: [
                {
                  name: 'cmsFields',
                  type: 'json',
                  admin: {
                    description: 'CMS fields this component can display',
                  },
                },
                {
                  name: 'apiEndpoints',
                  type: 'array',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'endpoint',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'method',
                      type: 'select',
                      options: [
                        { label: 'GET', value: 'GET' },
                        { label: 'POST', value: 'POST' },
                        { label: 'PUT', value: 'PUT' },
                        { label: 'DELETE', value: 'DELETE' },
                      ],
                      defaultValue: 'GET',
                    },
                    {
                      name: 'required',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                  admin: {
                    description: 'API endpoints this component interacts with',
                  },
                },
                {
                  name: 'thirdPartyServices',
                  type: 'array',
                  fields: [
                    {
                      name: 'service',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'purpose',
                      type: 'textarea',
                    },
                    {
                      name: 'apiKeyRequired',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'configFields',
                      type: 'json',
                    },
                  ],
                  admin: {
                    description: 'Third-party services this component uses',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Performance & SEO',
          fields: [
            {
              name: 'performance',
              type: 'group',
              fields: [
                {
                  name: 'bundleSize',
                  type: 'number',
                  admin: {
                    description: 'Approximate bundle size in KB',
                  },
                },
                {
                  name: 'renderTime',
                  type: 'number',
                  admin: {
                    description: 'Average render time in milliseconds',
                  },
                },
                {
                  name: 'cacheStrategy',
                  type: 'select',
                  options: [
                    { label: 'Static', value: 'static' },
                    { label: 'Dynamic', value: 'dynamic' },
                    { label: 'ISR (Incremental)', value: 'isr' },
                    { label: 'No Cache', value: 'no-cache' },
                  ],
                  admin: {
                    description: 'Recommended caching strategy',
                  },
                },
                {
                  name: 'lazyLoading',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Supports lazy loading',
                  },
                },
                {
                  name: 'serverSideRendering',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Can be server-side rendered',
                  },
                },
              ],
            },
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'seoFriendly',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Generates SEO-friendly markup',
                  },
                },
                {
                  name: 'structuredData',
                  type: 'json',
                  admin: {
                    description: 'Schema.org structured data generated',
                  },
                },
                {
                  name: 'metaTags',
                  type: 'json',
                  admin: {
                    description: 'Meta tags this component can generate',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Documentation',
          fields: [
            {
              name: 'documentation',
              type: 'group',
              fields: [
                {
                  name: 'readme',
                  type: 'richText',
                  admin: {
                    description: 'Detailed component documentation',
                  },
                },
                {
                  name: 'installation',
                  type: 'code',
                  admin: {
                    language: 'bash',
                    description: 'Installation instructions',
                  },
                },
                {
                  name: 'apiDocs',
                  type: 'json',
                  admin: {
                    description: 'API documentation (props, methods, events)',
                  },
                },
                {
                  name: 'examples',
                  type: 'array',
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
                      name: 'code',
                      type: 'code',
                      admin: {
                        language: 'typescript',
                      },
                    },
                    {
                      name: 'liveDemo',
                      type: 'text',
                    },
                  ],
                  admin: {
                    description: 'Usage examples and tutorials',
                  },
                },
                {
                  name: 'changelog',
                  type: 'array',
                  fields: [
                    {
                      name: 'version',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                    },
                    {
                      name: 'changes',
                      type: 'richText',
                      required: true,
                    },
                    {
                      name: 'breakingChanges',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
            {
              name: 'testing',
              type: 'group',
              fields: [
                {
                  name: 'testCoverage',
                  type: 'number',
                  min: 0,
                  max: 100,
                  admin: {
                    description: 'Test coverage percentage',
                  },
                },
                {
                  name: 'testFiles',
                  type: 'code',
                  admin: {
                    language: 'typescript',
                    description: 'Component test files',
                  },
                },
                {
                  name: 'e2eTests',
                  type: 'code',
                  admin: {
                    language: 'typescript',
                    description: 'End-to-end test scenarios',
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
        // Auto-generate display name if not provided
        if (!data.displayName && data.componentName) {
          data.displayName = data.componentName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str: string) => str.toUpperCase())
            .trim()
        }
        return data
      },
    ],
  },
}