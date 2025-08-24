/**
 * LEAN Website Theme Variant System
 * 
 * This system allows switching between different visual themes
 * while maintaining the same framework, components, and logic.
 * 
 * Perfect for testing framework reusability across different aesthetics.
 */

export type ThemeVariant = 'electronic' | 'vintage' | 'minimal' | 'luxury';

export interface ThemeConfig {
  id: ThemeVariant;
  name: string;
  description: string;
  colorScheme: 'dark' | 'light';
  fonts: {
    display: string[];
    heading: string[];
    body: string[];
    accent: string[];
  };
  colors: {
    background: {
      primary: string;
      secondary: string;
      elevated: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    brand: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

export const THEME_VARIANTS: Record<ThemeVariant, ThemeConfig> = {
  electronic: {
    id: 'electronic',
    name: 'Electronic/ARIA NOVA',
    description: 'Dark futuristic theme with neon accents and electronic music aesthetics',
    colorScheme: 'dark',
    fonts: {
      display: ['Orbitron', 'sans-serif'],
      heading: ['Exo 2', 'sans-serif'], 
      body: ['Inter', 'sans-serif'],
      accent: ['Space Mono', 'monospace']
    },
    colors: {
      background: {
        primary: '#060609',    // brand-void
        secondary: '#0a0a0f',  // brand-dark
        elevated: '#1a1a2e',   // brand-navy
      },
      text: {
        primary: '#ffffff',    // pure white
        secondary: '#e2e8f0',  // light gray
        accent: '#00ffff',     // neon cyan
      },
      brand: {
        primary: '#00ffff',    // neon cyan
        secondary: '#00d4ff',  // electric blue
        accent: '#ff6b6b',     // coral energy
      }
    }
  },

  vintage: {
    id: 'vintage',
    name: 'Vintage/Analogue',
    description: 'Warm vintage theme with film photography aesthetics and organic textures',
    colorScheme: 'light',
    fonts: {
      display: ['Playfair Display', 'serif'],
      heading: ['Crimson Text', 'serif'],
      body: ['Source Sans Pro', 'sans-serif'],
      accent: ['Courier New', 'monospace']
    },
    colors: {
      background: {
        primary: '#f7f3e9',    // warm cream
        secondary: '#ede4d3',  // aged paper
        elevated: '#e8dcc0',   // vintage parchment
      },
      text: {
        primary: '#2d1810',    // dark brown
        secondary: '#4a3728',  // medium brown
        accent: '#8b4513',     // saddle brown
      },
      brand: {
        primary: '#cd853f',    // peru/golden
        secondary: '#daa520',  // goldenrod
        accent: '#a0522d',     // sienna
      }
    }
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal/Clean',
    description: 'Clean minimalist theme with subtle colors and modern typography',
    colorScheme: 'light',
    fonts: {
      display: ['Inter', 'sans-serif'],
      heading: ['Inter', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      accent: ['JetBrains Mono', 'monospace']
    },
    colors: {
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        elevated: '#f1f5f9',
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        accent: '#0f172a',
      },
      brand: {
        primary: '#1e293b',
        secondary: '#334155',
        accent: '#64748b',
      }
    }
  },

  luxury: {
    id: 'luxury',
    name: 'Luxury/Premium',
    description: 'High-end luxury theme with rich colors and elegant typography',
    colorScheme: 'dark',
    fonts: {
      display: ['Cormorant Garamond', 'serif'],
      heading: ['Montserrat', 'sans-serif'],
      body: ['Source Sans Pro', 'sans-serif'],
      accent: ['Crimson Text', 'serif']
    },
    colors: {
      background: {
        primary: '#0f0f0f',    // deep black
        secondary: '#1a1a1a',  // charcoal
        elevated: '#2a2a2a',   // dark gray
      },
      text: {
        primary: '#f5f5f5',    // off white
        secondary: '#d4d4d4',  // light gray
        accent: '#ffd700',     // gold
      },
      brand: {
        primary: '#ffd700',    // gold
        secondary: '#daa520',  // darker gold
        accent: '#8b7355',     // bronze
      }
    }
  }
};

/**
 * Get current theme variant from environment or default
 */
export function getCurrentTheme(): ThemeVariant {
  const envTheme = process.env.NEXT_PUBLIC_THEME_VARIANT as ThemeVariant;
  return envTheme && envTheme in THEME_VARIANTS ? envTheme : 'electronic';
}

/**
 * Get theme configuration for specified variant
 */
export function getThemeConfig(variant?: ThemeVariant): ThemeConfig {
  const theme = variant || getCurrentTheme();
  return THEME_VARIANTS[theme];
}

/**
 * Generate CSS variables for a theme variant
 */
export function generateThemeCSS(variant: ThemeVariant): string {
  const config = THEME_VARIANTS[variant];
  
  return `
    /* ${config.name} Theme Variables */
    :root {
      /* Background System */
      --background-primary: ${config.colors.background.primary};
      --background-secondary: ${config.colors.background.secondary};
      --background-elevated: ${config.colors.background.elevated};
      
      /* Text System */
      --text-primary: ${config.colors.text.primary};
      --text-secondary: ${config.colors.text.secondary};
      --text-accent: ${config.colors.text.accent};
      
      /* Brand System */
      --brand-primary: ${config.colors.brand.primary};
      --brand-secondary: ${config.colors.brand.secondary};
      --brand-accent: ${config.colors.brand.accent};
      
      /* Typography System */
      --font-display: ${config.fonts.display.join(', ')};
      --font-heading: ${config.fonts.heading.join(', ')};
      --font-body: ${config.fonts.body.join(', ')};
      --font-accent: ${config.fonts.accent.join(', ')};
    }
  `;
}