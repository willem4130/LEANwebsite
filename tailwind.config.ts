import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Electronic Music Typography System
        'display-primary': ['var(--font-orbitron)', 'sans-serif'],
        'display-secondary': ['var(--font-exo2)', 'sans-serif'],
        'body-primary': ['var(--font-inter)', 'sans-serif'],
        'body-accent': ['var(--font-space-mono)', 'monospace'],
      },
      fontSize: {
        // Mobile-first responsive typography scale
        'h1-mobile': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1-tablet': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1-desktop': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1-large': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h2-mobile': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2-tablet': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2-desktop': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3-mobile': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3-tablet': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3-desktop': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-base': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '500' }],
      },
      colors: {
        // ARIA NOVA Premium Electronic Brand System
        brand: {
          // Core Background Hierarchy
          void: "#060609",         // Deep void - ultimate dark background
          dark: "#0a0a0f",         // Original deep space black - primary background
          navy: "#1a1a2e",         // Electronic navy - secondary background  
          charcoal: "#2a2a3e",     // Enhanced charcoal - elevated surfaces
          
          // Premium Electric Palette
          neon: "#00ffff",         // Pure cyan neon - primary electric accent
          electric: "#00d4ff",     // Bright electric blue - secondary electric
          pulse: "#0099cc",        // Pulse blue - subtle electric interactions
          
          // Energy Gradient System
          coral: "#ff6b6b",        // Warm coral energy - secondary CTA
          purple: "#8b5cf6",       // Deep purple energy - accent
          magenta: "#e91e63",      // Electric magenta - premium highlight
          
          // Atmospheric Effects
          glow: "rgba(0, 255, 255, 0.15)",    // Neon cyan glow overlay
          mist: "rgba(255, 255, 255, 0.05)",  // Ultra-subtle atmospheric mist
          shadow: "rgba(0, 0, 0, 0.8)",       // Deep shadow for layering
          
          // Professional Text Hierarchy
          text: {
            hero: "#ffffff",        // Pure white - hero/artist name text
            primary: "#e2e8f0",     // Light gray - primary content
            secondary: "#94a3b8",   // Medium gray - supporting content
            muted: "#475569",       // Muted gray - subtle text
            accent: "#00ffff",      // Neon cyan - accent/CTA text
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "hero-entrance": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "parallax-float": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "25%": { transform: "translateY(-8px) translateX(4px)" },
          "50%": { transform: "translateY(-10px) translateX(0px)" },
          "75%": { transform: "translateY(-8px) translateX(-4px)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(0, 255, 255, 0.5)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4)",
            transform: "scale(1.05)"
          },
        },
        "electric-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "energy-wave": {
          "0%": { 
            transform: "scaleX(1) scaleY(1)",
            opacity: "0.8"
          },
          "50%": { 
            transform: "scaleX(1.1) scaleY(0.9)",
            opacity: "1"
          },
          "100%": { 
            transform: "scaleX(1) scaleY(1)",
            opacity: "0.8"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out motion-reduce:duration-0",
        "slide-in": "slide-in 0.8s ease-out motion-reduce:duration-0", 
        "hero-entrance": "hero-entrance 0.8s ease-out motion-reduce:duration-0",
        "parallax-float": "parallax-float 6s ease-in-out infinite motion-reduce:duration-0",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite motion-reduce:duration-0",
        "electric-shimmer": "electric-shimmer 2s linear infinite motion-reduce:duration-0",
        "energy-wave": "energy-wave 4s ease-in-out infinite motion-reduce:duration-0",
      },
    },
  },
  plugins: [],
};

export default config;