import type { Metadata } from 'next'
import { Inter, Orbitron, Exo_2, Space_Mono } from 'next/font/google'
import { NavSwitcher } from '@/components/ui/nav-switcher'
import { ErrorBoundary } from '@/components/ErrorBoundary'
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

export const metadata: Metadata = {
  title: 'Music Artist Website',
  description: 'Professional music artist website with CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} ${exo2.variable} ${spaceMono.variable} font-body-primary`}>
        <ErrorBoundary>
          <NavSwitcher />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}