'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentTheme, getThemeConfig, type ThemeVariant, type ThemeConfig } from '@/lib/theme-variants';

interface ThemeContextType {
  theme: ThemeVariant;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeVariant) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeVariant;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setCurrentTheme] = useState<ThemeVariant>(defaultTheme || getCurrentTheme());
  const [isLoading, setIsLoading] = useState(true);

  const themeConfig = getThemeConfig(theme);

  const setTheme = (newTheme: ThemeVariant) => {
    setIsLoading(true);
    setCurrentTheme(newTheme);
    
    // Update the document class for theme-specific CSS
    document.documentElement.className = `theme-${newTheme}`;
    
    // Store theme preference
    localStorage.setItem('lean-theme-preference', newTheme);
  };

  useEffect(() => {
    // Load saved theme preference or use environment variable
    const savedTheme = localStorage.getItem('lean-theme-preference') as ThemeVariant;
    const envTheme = process.env.NEXT_PUBLIC_THEME_VARIANT as ThemeVariant;
    const initialTheme = savedTheme || envTheme || defaultTheme || 'electronic';

    if (initialTheme !== theme) {
      setCurrentTheme(initialTheme);
    }

    // Set initial document class
    document.documentElement.className = `theme-${initialTheme}`;
    
    // Dynamically load theme-specific CSS
    loadThemeCSS(initialTheme);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadThemeCSS(theme);
      setIsLoading(false);
    }
  }, [theme]);

  const loadThemeCSS = async (themeVariant: ThemeVariant) => {
    // Remove existing theme stylesheets
    const existingThemeStyles = document.querySelectorAll('link[data-theme-css]');
    existingThemeStyles.forEach(style => style.remove());

    // Load new theme CSS if not electronic (default)
    if (themeVariant !== 'electronic') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/themes/${themeVariant}.css`;
      link.setAttribute('data-theme-css', themeVariant);
      link.onload = () => setIsLoading(false);
      link.onerror = () => {
        console.warn(`Failed to load theme CSS: ${themeVariant}`);
        setIsLoading(false);
      };
      
      document.head.appendChild(link);
    }

    // Apply theme-specific CSS variables
    applyThemeVariables(themeConfig);
  };

  const applyThemeVariables = (config: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--theme-bg-primary', config.colors.background.primary);
    root.style.setProperty('--theme-bg-secondary', config.colors.background.secondary);
    root.style.setProperty('--theme-bg-elevated', config.colors.background.elevated);
    root.style.setProperty('--theme-text-primary', config.colors.text.primary);
    root.style.setProperty('--theme-text-secondary', config.colors.text.secondary);
    root.style.setProperty('--theme-text-accent', config.colors.text.accent);
    root.style.setProperty('--theme-brand-primary', config.colors.brand.primary);
    root.style.setProperty('--theme-brand-secondary', config.colors.brand.secondary);
    root.style.setProperty('--theme-brand-accent', config.colors.brand.accent);
    
    // Apply font variables
    root.style.setProperty('--theme-font-display', config.fonts.display.join(', '));
    root.style.setProperty('--theme-font-heading', config.fonts.heading.join(', '));
    root.style.setProperty('--theme-font-body', config.fonts.body.join(', '));
    root.style.setProperty('--theme-font-accent', config.fonts.accent.join(', '));
    
    // Apply color scheme
    root.style.setProperty('color-scheme', config.colorScheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme, isLoading }}>
      <div className={`theme-${theme} min-h-screen transition-all duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme-aware component wrapper for easy theming
export function ThemedComponent({ 
  children, 
  variant = 'default',
  className = '' 
}: {
  children: ReactNode;
  variant?: 'card' | 'hero' | 'navigation' | 'gallery' | 'default';
  className?: string;
}) {
  const { theme } = useTheme();
  
  const variantClasses = {
    card: `theme-card theme-card-${theme}`,
    hero: `theme-hero theme-hero-${theme}`, 
    navigation: `theme-navigation theme-navigation-${theme}`,
    gallery: `theme-gallery theme-gallery-${theme}`,
    default: ''
  };
  
  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

// Quick theme switcher for development/demo
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  const themes: { value: ThemeVariant; label: string; emoji: string }[] = [
    { value: 'electronic', label: 'Electronic', emoji: '⚡' },
    { value: 'vintage', label: 'Vintage', emoji: '📸' },
    { value: 'minimal', label: 'Minimal', emoji: '🤍' },
    { value: 'luxury', label: 'Luxury', emoji: '✨' }
  ];

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <div className="text-sm font-medium mb-2">Theme:</div>
      <div className="flex gap-2">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`px-3 py-1 rounded text-sm transition-all ${
              theme === t.value 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={t.label}
          >
            {t.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}