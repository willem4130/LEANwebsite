import type { Metadata } from 'next'
import { Inter, Orbitron, Exo_2, Space_Mono, Playfair_Display, Crimson_Text, Source_Sans_Pro } from 'next/font/google'
import { NavSwitcher } from '@/components/ui/nav-switcher'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ClientOnly } from '@/components/ClientOnly'
import { ThemeProvider, ThemeSwitcher } from '@/components/framework/ThemeProvider'
import { Suspense } from 'react'
import '@/styles/globals.css'

// Electronic Music Typography System
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500']
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['700', '800', '900']
})

const exo2 = Exo_2({ 
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
  weight: ['500', '600', '700']
})

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700']
})

// Vintage Theme Typography System
const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900']
})

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  weight: ['400', '600', '700']
})

const sourceSansPro = Source_Sans_Pro({ 
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '600', '700']
})

export const metadata: Metadata = {
  title: 'Music Artist Website',
  description: 'Professional music artist website with CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fontVariables = `${inter.variable} ${orbitron.variable} ${exo2.variable} ${spaceMono.variable} ${playfairDisplay.variable} ${crimsonText.variable} ${sourceSansPro.variable}`;
  
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fontVariables} font-body-primary`}>
        <ThemeProvider>
          <ErrorBoundary>
            <ClientOnly>
              <NavSwitcher />
              <ThemeSwitcher />
            </ClientOnly>
            <Suspense fallback={
              <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
              </div>
            }>
              {children}
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}