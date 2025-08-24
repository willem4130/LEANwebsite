'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, Play, Settings, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function NavSwitcher() {
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      description: 'Project overview'
    },
    {
      href: '/demo',
      label: 'Demo Site',
      icon: Play,
      description: 'Live preview'
    },
    {
      href: '/admin',
      label: 'CMS Admin',
      icon: Settings,
      description: 'Content management'
    }
  ]

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isClient && pathname === item.href
            
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "flex items-center gap-2 transition-all",
                  isActive 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white hover:bg-white/20 hover:text-white"
                )}
                title={item.description}
              >
                <Link href={item.href}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
        
        {/* Quick info tooltip */}
        <div className="mt-2 text-xs text-white/70 text-center">
          Quick Switch Navigation
        </div>
      </div>
    </div>
  )
}