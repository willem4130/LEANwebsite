import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavSwitcher } from '@/components/ui/nav-switcher'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <ErrorBoundary>
          <NavSwitcher />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}