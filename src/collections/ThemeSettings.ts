import { CollectionConfig } from 'payload/types'

/**
 * Theme Settings Collection - Complete Visual Control
 * =================================================
 * 
 * Provides enterprise-level theming capabilities:
 * - Design system management
 * - Multiple theme variants
 * - Real-time style generation
 * - CSS custom properties
 * - Responsive breakpoints
 * - Animation preferences
 * - Brand consistency enforcement
 * 
 * Future-ready for:
 * - Visual theme editor
 * - Theme marketplace
 * - Multi-brand management
 * - White-label solutions
 */

export const ThemeSettings: CollectionConfig = {
  slug: 'theme-settings',
  admin: {
    useAsTitle: 'themeName',
    group: 'Design System',
    defaultColumns: ['themeName', 'status', 'isDefault', 'updatedAt'],
    description: 'Complete visual theming and design system management',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Theme Identity',
          fields: [
            {
              name: 'themeName',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Unique theme identifier',
              },
            },
            {
              name: 'displayName',
              type: 'text',
              required: true,
              admin: {
                description: 'Human-readable theme name',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Theme description and use cases',
              },
            },
            {
              name: 'version',
              type: 'text',
              required: true,
              defaultValue: '1.0.0',
              admin: {
                description: 'Theme version (semantic versioning)',
              },
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              options: [
                { label: 'Development', value: 'development' },
                { label: 'Testing', value: 'testing' },
                { label: 'Production', value: 'production' },
                { label: 'Deprecated', value: 'deprecated' },
              ],
              defaultValue: 'development',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'isDefault',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Use as default theme for new sites',
              },
            },
            {
              name: 'previewImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Theme preview screenshot',
              },
            },
          ],
        },
        {
          label: 'Color System',
          fields: [
            {
              name: 'colors',
              type: 'group',
              fields: [
                // Primary Colors
                {
                  name: 'primary',
                  type: 'group',
                  label: 'Primary Colors',
                  fields: [
                    {
                      name: 'main',
                      type: 'text',
                      required: true,
                      defaultValue: '#3b82f6',
                      validate: (value) => {
                        if (!/^#[0-9a-f]{6}$/i.test(value)) {
                          return 'Please enter a valid hex color'
                        }
                        return true
                      },
                      admin: {
                        description: 'Primary brand color',
                      },
                    },
                    {
                      name: 'light',
                      type: 'text',
                      defaultValue: '#60a5fa',
                      validate: (value) => {
                        if (value && !/^#[0-9a-f]{6}$/i.test(value)) {
                          return 'Please enter a valid hex color'
                        }
                        return true
                      },
                    },
                    {
                      name: 'dark',
                      type: 'text',
                      defaultValue: '#1d4ed8',
                      validate: (value) => {
                        if (value && !/^#[0-9a-f]{6}$/i.test(value)) {
                          return 'Please enter a valid hex color'
                        }
                        return true
                      },
                    },
                    {
                      name: 'contrast',
                      type: 'text',
                      defaultValue: '#ffffff',
                      validate: (value) => {
                        if (value && !/^#[0-9a-f]{6}$/i.test(value)) {
                          return 'Please enter a valid hex color'
                        }
                        return true
                      },
                      admin: {
                        description: 'Text color on primary background',
                      },
                    },
                  ],
                },
                
                // Secondary Colors
                {
                  name: 'secondary',
                  type: 'group',
                  label: 'Secondary Colors',
                  fields: [
                    {
                      name: 'main',
                      type: 'text',
                      required: true,
                      defaultValue: '#64748b',
                    },
                    {
                      name: 'light',
                      type: 'text',
                      defaultValue: '#94a3b8',
                    },
                    {
                      name: 'dark',
                      type: 'text',
                      defaultValue: '#475569',
                    },
                    {
                      name: 'contrast',
                      type: 'text',
                      defaultValue: '#ffffff',
                    },
                  ],
                },
                
                // Accent Colors
                {
                  name: 'accent',
                  type: 'group',
                  label: 'Accent Colors',
                  fields: [
                    {
                      name: 'main',
                      type: 'text',
                      defaultValue: '#f59e0b',
                    },
                    {
                      name: 'light',
                      type: 'text',
                      defaultValue: '#fbbf24',
                    },
                    {
                      name: 'dark',
                      type: 'text',
                      defaultValue: '#d97706',
                    },
                    {
                      name: 'contrast',
                      type: 'text',
                      defaultValue: '#000000',
                    },
                  ],
                },
                
                // Semantic Colors
                {
                  name: 'semantic',
                  type: 'group',
                  label: 'Semantic Colors',
                  fields: [
                    {
                      name: 'success',
                      type: 'text',
                      defaultValue: '#10b981',
                    },
                    {
                      name: 'warning',
                      type: 'text',
                      defaultValue: '#f59e0b',
                    },
                    {
                      name: 'error',
                      type: 'text',
                      defaultValue: '#ef4444',
                    },
                    {
                      name: 'info',
                      type: 'text',
                      defaultValue: '#3b82f6',
                    },
                  ],
                },
                
                // Neutral Colors
                {
                  name: 'neutral',
                  type: 'group',
                  label: 'Neutral Colors',
                  fields: [
                    {
                      name: 'white',
                      type: 'text',
                      defaultValue: '#ffffff',
                    },
                    {
                      name: 'black',
                      type: 'text',
                      defaultValue: '#000000',
                    },
                    {
                      name: 'gray50',
                      type: 'text',
                      defaultValue: '#f9fafb',
                    },
                    {
                      name: 'gray100',
                      type: 'text',
                      defaultValue: '#f3f4f6',
                    },
                    {
                      name: 'gray200',
                      type: 'text',
                      defaultValue: '#e5e7eb',
                    },
                    {
                      name: 'gray300',
                      type: 'text',
                      defaultValue: '#d1d5db',
                    },
                    {
                      name: 'gray400',
                      type: 'text',
                      defaultValue: '#9ca3af',
                    },
                    {
                      name: 'gray500',
                      type: 'text',
                      defaultValue: '#6b7280',
                    },
                    {
                      name: 'gray600',
                      type: 'text',
                      defaultValue: '#4b5563',
                    },
                    {
                      name: 'gray700',
                      type: 'text',
                      defaultValue: '#374151',
                    },
                    {
                      name: 'gray800',
                      type: 'text',
                      defaultValue: '#1f2937',
                    },
                    {
                      name: 'gray900',
                      type: 'text',
                      defaultValue: '#111827',
                    },
                  ],
                },
                
                // Custom Color Palette
                {
                  name: 'custom',
                  type: 'array',
                  label: 'Custom Colors',
                  maxRows: 20,
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Color name (e.g., "brand-purple")',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      validate: (value) => {
                        if (!/^#[0-9a-f]{6}$/i.test(value)) {
                          return 'Please enter a valid hex color'
                        }
                        return true
                      },
                    },
                    {
                      name: 'description',
                      type: 'text',
                      admin: {
                        description: 'When to use this color',
                      },
                    },
                  ],
                  admin: {
                    description: 'Additional brand colors',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              name: 'typography',
              type: 'group',
              fields: [
                {
                  name: 'fontFamilies',
                  type: 'group',
                  fields: [
                    {
                      name: 'primary',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Inter', value: 'Inter, sans-serif' },
                        { label: 'Roboto', value: 'Roboto, sans-serif' },
                        { label: 'Open Sans', value: '"Open Sans", sans-serif' },
                        { label: 'Montserrat', value: 'Montserrat, sans-serif' },
                        { label: 'Poppins', value: 'Poppins, sans-serif' },
                        { label: 'Lato', value: 'Lato, sans-serif' },
                        { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
                        { label: 'Nunito', value: 'Nunito, sans-serif' },
                        { label: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
                        { label: 'Custom', value: 'custom' },
                      ],
                      defaultValue: 'Inter, sans-serif',
                      admin: {
                        description: 'Primary font for body text',
                      },
                    },
                    {
                      name: 'customPrimary',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData.primary === 'custom',
                        description: 'Custom font family CSS value',
                      },
                    },
                    {
                      name: 'headings',
                      type: 'select',
                      options: [
                        { label: 'Same as Primary', value: 'inherit' },
                        { label: 'Playfair Display', value: '"Playfair Display", serif' },
                        { label: 'Merriweather', value: 'Merriweather, serif' },
                        { label: 'Oswald', value: 'Oswald, sans-serif' },
                        { label: 'Bebas Neue', value: '"Bebas Neue", cursive' },
                        { label: 'Custom', value: 'custom' },
                      ],
                      defaultValue: 'inherit',
                      admin: {
                        description: 'Font for headings',
                      },
                    },
                    {
                      name: 'customHeadings',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData.headings === 'custom',
                      },
                    },
                    {
                      name: 'monospace',
                      type: 'select',
                      options: [
                        { label: 'Fira Code', value: '"Fira Code", monospace' },
                        { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
                        { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
                        { label: 'Courier New', value: '"Courier New", monospace' },
                        { label: 'System Monospace', value: 'ui-monospace, monospace' },
                      ],
                      defaultValue: '"Fira Code", monospace',
                    },
                  ],
                },
                {
                  name: 'fontSizes',
                  type: 'group',
                  fields: [
                    {
                      name: 'xs',
                      type: 'text',
                      defaultValue: '0.75rem',
                    },
                    {
                      name: 'sm',
                      type: 'text',
                      defaultValue: '0.875rem',
                    },
                    {
                      name: 'base',
                      type: 'text',
                      defaultValue: '1rem',
                    },
                    {
                      name: 'lg',
                      type: 'text',
                      defaultValue: '1.125rem',
                    },
                    {
                      name: 'xl',
                      type: 'text',
                      defaultValue: '1.25rem',
                    },
                    {
                      name: '2xl',
                      type: 'text',
                      defaultValue: '1.5rem',
                    },
                    {
                      name: '3xl',
                      type: 'text',
                      defaultValue: '1.875rem',
                    },
                    {
                      name: '4xl',
                      type: 'text',
                      defaultValue: '2.25rem',
                    },
                    {
                      name: '5xl',
                      type: 'text',
                      defaultValue: '3rem',
                    },
                    {
                      name: '6xl',
                      type: 'text',
                      defaultValue: '3.75rem',
                    },
                  ],
                },
                {
                  name: 'fontWeights',
                  type: 'group',
                  fields: [
                    {
                      name: 'thin',
                      type: 'number',
                      defaultValue: 100,
                    },
                    {
                      name: 'light',
                      type: 'number',
                      defaultValue: 300,
                    },
                    {
                      name: 'normal',
                      type: 'number',
                      defaultValue: 400,
                    },
                    {
                      name: 'medium',
                      type: 'number',
                      defaultValue: 500,
                    },
                    {
                      name: 'semibold',
                      type: 'number',
                      defaultValue: 600,
                    },
                    {
                      name: 'bold',
                      type: 'number',
                      defaultValue: 700,
                    },
                    {
                      name: 'extrabold',
                      type: 'number',
                      defaultValue: 800,
                    },
                    {
                      name: 'black',
                      type: 'number',
                      defaultValue: 900,
                    },
                  ],
                },
                {
                  name: 'lineHeights',
                  type: 'group',
                  fields: [
                    {
                      name: 'tight',
                      type: 'text',
                      defaultValue: '1.25',
                    },
                    {
                      name: 'snug',
                      type: 'text',
                      defaultValue: '1.375',
                    },
                    {
                      name: 'normal',
                      type: 'text',
                      defaultValue: '1.5',
                    },
                    {
                      name: 'relaxed',
                      type: 'text',
                      defaultValue: '1.625',
                    },
                    {
                      name: 'loose',
                      type: 'text',
                      defaultValue: '2',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Spacing & Layout',
          fields: [
            {
              name: 'spacing',
              type: 'group',
              fields: [
                {
                  name: 'base',
                  type: 'text',
                  defaultValue: '1rem',
                  admin: {
                    description: 'Base spacing unit',
                  },
                },
                {
                  name: 'scale',
                  type: 'json',
                  defaultValue: {
                    '0': '0',
                    '1': '0.25rem',
                    '2': '0.5rem',
                    '3': '0.75rem',
                    '4': '1rem',
                    '5': '1.25rem',
                    '6': '1.5rem',
                    '8': '2rem',
                    '10': '2.5rem',
                    '12': '3rem',
                    '16': '4rem',
                    '20': '5rem',
                    '24': '6rem',
                    '32': '8rem',
                    '40': '10rem',
                    '48': '12rem',
                    '56': '14rem',
                    '64': '16rem',
                  },
                  admin: {
                    description: 'Spacing scale (JSON format)',
                  },
                },
              ],
            },
            {
              name: 'breakpoints',
              type: 'group',
              fields: [
                {
                  name: 'xs',
                  type: 'text',
                  defaultValue: '320px',
                },
                {
                  name: 'sm',
                  type: 'text',
                  defaultValue: '640px',
                },
                {
                  name: 'md',
                  type: 'text',
                  defaultValue: '768px',
                },
                {
                  name: 'lg',
                  type: 'text',
                  defaultValue: '1024px',
                },
                {
                  name: 'xl',
                  type: 'text',
                  defaultValue: '1280px',
                },
                {
                  name: '2xl',
                  type: 'text',
                  defaultValue: '1536px',
                },
              ],
            },
            {
              name: 'containers',
              type: 'group',
              fields: [
                {
                  name: 'maxWidths',
                  type: 'json',
                  defaultValue: {
                    'narrow': '640px',
                    'container': '1024px',
                    'wide': '1280px',
                    'full': '100%',
                  },
                  admin: {
                    description: 'Container max-width values',
                  },
                },
                {
                  name: 'padding',
                  type: 'json',
                  defaultValue: {
                    'mobile': '1rem',
                    'tablet': '2rem',
                    'desktop': '3rem',
                  },
                  admin: {
                    description: 'Container padding by breakpoint',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Components Styling',
          fields: [
            {
              name: 'components',
              type: 'group',
              fields: [
                {
                  name: 'buttons',
                  type: 'group',
                  fields: [
                    {
                      name: 'borderRadius',
                      type: 'select',
                      options: [
                        { label: 'None', value: '0' },
                        { label: 'Small', value: '0.25rem' },
                        { label: 'Medium', value: '0.375rem' },
                        { label: 'Large', value: '0.5rem' },
                        { label: 'XL', value: '0.75rem' },
                        { label: 'Full', value: '9999px' },
                      ],
                      defaultValue: '0.375rem',
                    },
                    {
                      name: 'padding',
                      type: 'json',
                      defaultValue: {
                        'sm': '0.5rem 1rem',
                        'md': '0.75rem 1.5rem',
                        'lg': '1rem 2rem',
                      },
                    },
                    {
                      name: 'fontSize',
                      type: 'json',
                      defaultValue: {
                        'sm': '0.875rem',
                        'md': '1rem',
                        'lg': '1.125rem',
                      },
                    },
                    {
                      name: 'fontWeight',
                      type: 'number',
                      defaultValue: 500,
                    },
                    {
                      name: 'variants',
                      type: 'json',
                      defaultValue: {
                        'primary': {
                          'background': 'var(--color-primary)',
                          'color': 'var(--color-primary-contrast)',
                          'hover': 'var(--color-primary-dark)'
                        },
                        'secondary': {
                          'background': 'var(--color-secondary)',
                          'color': 'var(--color-secondary-contrast)',
                          'hover': 'var(--color-secondary-dark)'
                        },
                        'outline': {
                          'background': 'transparent',
                          'color': 'var(--color-primary)',
                          'border': '1px solid var(--color-primary)',
                          'hover': 'var(--color-primary)'
                        }
                      },
                    },
                  ],
                },
                {
                  name: 'cards',
                  type: 'group',
                  fields: [
                    {
                      name: 'borderRadius',
                      type: 'text',
                      defaultValue: '0.5rem',
                    },
                    {
                      name: 'padding',
                      type: 'text',
                      defaultValue: '1.5rem',
                    },
                    {
                      name: 'shadow',
                      type: 'select',
                      options: [
                        { label: 'None', value: 'none' },
                        { label: 'Small', value: '0 1px 3px rgba(0,0,0,0.1)' },
                        { label: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)' },
                        { label: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)' },
                        { label: 'XL', value: '0 20px 25px rgba(0,0,0,0.1)' },
                      ],
                      defaultValue: '0 4px 6px rgba(0,0,0,0.1)',
                    },
                    {
                      name: 'border',
                      type: 'text',
                      defaultValue: '1px solid var(--color-gray-200)',
                    },
                  ],
                },
                {
                  name: 'forms',
                  type: 'group',
                  fields: [
                    {
                      name: 'inputBorderRadius',
                      type: 'text',
                      defaultValue: '0.375rem',
                    },
                    {
                      name: 'inputPadding',
                      type: 'text',
                      defaultValue: '0.75rem 1rem',
                    },
                    {
                      name: 'inputBorder',
                      type: 'text',
                      defaultValue: '1px solid var(--color-gray-300)',
                    },
                    {
                      name: 'inputFocusBorder',
                      type: 'text',
                      defaultValue: '2px solid var(--color-primary)',
                    },
                    {
                      name: 'labelFontWeight',
                      type: 'number',
                      defaultValue: 500,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Animations',
          fields: [
            {
              name: 'animations',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable animations globally',
                  },
                },
                {
                  name: 'duration',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                  },
                  fields: [
                    {
                      name: 'fast',
                      type: 'text',
                      defaultValue: '150ms',
                    },
                    {
                      name: 'normal',
                      type: 'text',
                      defaultValue: '300ms',
                    },
                    {
                      name: 'slow',
                      type: 'text',
                      defaultValue: '500ms',
                    },
                  ],
                },
                {
                  name: 'easing',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                  },
                  fields: [
                    {
                      name: 'linear',
                      type: 'text',
                      defaultValue: 'linear',
                    },
                    {
                      name: 'easeIn',
                      type: 'text',
                      defaultValue: 'cubic-bezier(0.4, 0, 1, 1)',
                    },
                    {
                      name: 'easeOut',
                      type: 'text',
                      defaultValue: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                    {
                      name: 'easeInOut',
                      type: 'text',
                      defaultValue: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                  ],
                },
                {
                  name: 'presets',
                  type: 'json',
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                    description: 'Animation presets (JSON format)',
                  },
                  defaultValue: {
                    'fadeIn': {
                      'from': { 'opacity': 0 },
                      'to': { 'opacity': 1 },
                      'duration': '300ms',
                      'easing': 'ease-out'
                    },
                    'slideUp': {
                      'from': { 'transform': 'translateY(20px)', 'opacity': 0 },
                      'to': { 'transform': 'translateY(0)', 'opacity': 1 },
                      'duration': '400ms',
                      'easing': 'ease-out'
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Dark Mode',
          fields: [
            {
              name: 'darkMode',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Support dark mode',
                  },
                },
                {
                  name: 'strategy',
                  type: 'select',
                  options: [
                    { label: 'CSS Variables', value: 'css-vars' },
                    { label: 'CSS Classes', value: 'css-classes' },
                    { label: 'Data Attributes', value: 'data-attrs' },
                  ],
                  defaultValue: 'css-vars',
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                  },
                },
                {
                  name: 'colorOverrides',
                  type: 'json',
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                    description: 'Dark mode color overrides',
                  },
                  defaultValue: {
                    'background': '#111827',
                    'surface': '#1f2937',
                    'text': '#f9fafb',
                    'textSecondary': '#d1d5db'
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'customCSS',
              type: 'code',
              admin: {
                language: 'css',
                description: 'Additional custom CSS',
              },
            },
            {
              name: 'cssVariables',
              type: 'json',
              admin: {
                description: 'CSS custom properties (JSON format)',
              },
            },
            {
              name: 'generateUtilities',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Generate utility classes automatically',
              },
            },
            {
              name: 'purgeCSS',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable CSS purging for production',
                  },
                },
                {
                  name: 'safelist',
                  type: 'array',
                  fields: [
                    {
                      name: 'pattern',
                      type: 'text',
                      required: true,
                    },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData.enabled,
                    description: 'CSS classes to never purge',
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
    afterChange: [
      async ({ doc, operation }) => {
        // Generate CSS file after theme changes
        if (operation === 'update' || operation === 'create') {
          // This would trigger CSS generation in a real implementation
          console.log(`Theme ${doc.themeName} updated - CSS regeneration needed`)
        }
      },
    ],
  },
}