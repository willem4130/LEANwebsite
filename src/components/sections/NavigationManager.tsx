/**
 * Navigation Manager - Dynamic Navigation System
 * ============================================
 * 
 * Enterprise-level navigation management with:
 * - Real-time navigation updates
 * - Multi-level menu support
 * - Mobile responsiveness
 * - Analytics integration
 * - A/B testing support
 * - SEO optimization
 */

'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEnhancedApi } from '@/hooks/useEnhancedApi'
import type { ThemeSettings } from '@/lib/enhanced-api-framework'

interface NavigationItem {
  id: string
  label: string
  type: 'internal' | 'external' | 'anchor'
  href: string
  openInNewTab?: boolean
  children?: NavigationItem[]
  icon?: string
  description?: string
  order?: number
  enabled?: boolean
  conditions?: {
    userRoles?: string[]
    deviceVisibility?: string[]
    dateRange?: {
      startDate?: Date
      endDate?: Date
    }
  }
}

interface NavigationData {
  primaryNavigation: NavigationItem[]
  socialLinks: Array<{
    platform: string
    url: string
    username?: string
  }>
}

interface NavigationManagerProps {
  variant?: 'header' | 'footer' | 'mobile' | 'sidebar'
  theme?: ThemeSettings
  className?: string
  enableAnalytics?: boolean
  maxDepth?: number
  showSocialLinks?: boolean
  mobileBreakpoint?: number
}

export const NavigationManager: React.FC<NavigationManagerProps> = ({
  variant = 'header',
  theme,
  className,
  enableAnalytics = false,
  maxDepth = 3,
  showSocialLinks = false,
  mobileBreakpoint = 768,
}) => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // Fetch navigation data with real-time updates
  const { data: navigationData, loading, error } = useEnhancedApi<NavigationData>(
    '/navigation',
    {
      realtime: true,
      enableCache: true,
      ttl: 600000, // 10 minutes
    }
  )

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      setIsMobile(mobile)
      if (!mobile) {
        setIsMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileBreakpoint])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Filter and process navigation items
  const processedNavigation = useMemo(() => {
    if (!navigationData?.primaryNavigation) return []

    return filterNavigationItems(navigationData.primaryNavigation, maxDepth)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [navigationData?.primaryNavigation, maxDepth])

  // Analytics tracking
  const trackNavClick = (item: NavigationItem, depth: number = 0) => {
    if (!enableAnalytics) return

    console.log('Analytics: Navigation click', {
      label: item.label,
      href: item.href,
      type: item.type,
      depth,
      variant,
      timestamp: Date.now(),
    })
  }

  if (loading) {
    return <NavigationSkeleton variant={variant} />
  }

  if (error || !navigationData) {
    return <NavigationError error={error || undefined} />
  }

  const navClasses = [
    'navigation-manager',
    `navigation-${variant}`,
    isMobile && 'navigation-mobile',
    className,
  ].filter(Boolean).join(' ')

  return (
    <nav ref={navRef} className={navClasses} role="navigation" aria-label="Main navigation">
      {variant === 'header' && (
        <HeaderNavigation
          items={processedNavigation}
          socialLinks={showSocialLinks ? navigationData.socialLinks : []}
          pathname={pathname}
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onItemClick={trackNavClick}
          theme={theme}
        />
      )}

      {variant === 'footer' && (
        <FooterNavigation
          items={processedNavigation}
          socialLinks={showSocialLinks ? navigationData.socialLinks : []}
          onItemClick={trackNavClick}
          theme={theme}
        />
      )}

      {variant === 'sidebar' && (
        <SidebarNavigation
          items={processedNavigation}
          pathname={pathname}
          onItemClick={trackNavClick}
          theme={theme}
        />
      )}

      {variant === 'mobile' && (
        <MobileNavigation
          items={processedNavigation}
          socialLinks={showSocialLinks ? navigationData.socialLinks : []}
          pathname={pathname}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onItemClick={trackNavClick}
          theme={theme}
        />
      )}
    </nav>
  )
}

// ================================
// HEADER NAVIGATION
// ================================

interface HeaderNavigationProps {
  items: NavigationItem[]
  socialLinks: NavigationData['socialLinks']
  pathname: string
  isMobile: boolean
  isMobileMenuOpen: boolean
  onMobileMenuToggle: () => void
  onItemClick: (item: NavigationItem, depth?: number) => void
  theme?: ThemeSettings
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  items,
  socialLinks,
  pathname,
  isMobile,
  isMobileMenuOpen,
  onMobileMenuToggle,
  onItemClick,
  theme,
}) => {
  return (
    <div className="header-navigation flex items-center justify-between">
      {/* Desktop Navigation */}
      {!isMobile && (
        <ul className="nav-items flex items-center space-x-6">
          {items.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              pathname={pathname}
              onItemClick={onItemClick}
              depth={0}
              theme={theme}
            />
          ))}
        </ul>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={onMobileMenuToggle}
          className="mobile-menu-toggle p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <MenuIcon isOpen={isMobileMenuOpen} />
        </button>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && !isMobile && (
        <div className="social-links flex items-center space-x-4">
          {socialLinks.map((link, index) => (
            <SocialLink key={index} link={link} onItemClick={onItemClick} />
          ))}
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <MobileMenu
          items={items}
          socialLinks={socialLinks}
          pathname={pathname}
          onItemClick={onItemClick}
          theme={theme}
        />
      )}
    </div>
  )
}

// ================================
// FOOTER NAVIGATION
// ================================

interface FooterNavigationProps {
  items: NavigationItem[]
  socialLinks: NavigationData['socialLinks']
  onItemClick: (item: NavigationItem, depth?: number) => void
  theme?: ThemeSettings
}

const FooterNavigation: React.FC<FooterNavigationProps> = ({
  items,
  socialLinks,
  onItemClick,
  theme,
}) => {
  return (
    <div className="footer-navigation">
      <div className="nav-columns grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Navigation */}
        <div className="nav-column">
          <h3 className="nav-column-title font-semibold mb-4">Navigation</h3>
          <ul className="nav-items space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <NavigationLink
                  item={item}
                  onItemClick={onItemClick}
                  className="text-sm hover:underline"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="nav-column">
            <h3 className="nav-column-title font-semibold mb-4">Follow Us</h3>
            <ul className="social-links space-y-2">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <SocialLink link={link} onItemClick={onItemClick} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ================================
// SIDEBAR NAVIGATION
// ================================

interface SidebarNavigationProps {
  items: NavigationItem[]
  pathname: string
  onItemClick: (item: NavigationItem, depth?: number) => void
  theme?: ThemeSettings
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  items,
  pathname,
  onItemClick,
  theme,
}) => {
  return (
    <div className="sidebar-navigation">
      <ul className="nav-items space-y-1">
        {items.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            pathname={pathname}
            onItemClick={onItemClick}
            depth={0}
            variant="sidebar"
            theme={theme}
          />
        ))}
      </ul>
    </div>
  )
}

// ================================
// MOBILE NAVIGATION
// ================================

interface MobileNavigationProps {
  items: NavigationItem[]
  socialLinks: NavigationData['socialLinks']
  pathname: string
  isOpen: boolean
  onClose: () => void
  onItemClick: (item: NavigationItem, depth?: number) => void
  theme?: ThemeSettings
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  socialLinks,
  pathname,
  isOpen,
  onClose,
  onItemClick,
  theme,
}) => {
  if (!isOpen) return null

  return (
    <div className="mobile-navigation fixed inset-0 z-50 bg-white">
      <div className="mobile-nav-header flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Close mobile menu"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mobile-nav-content p-4">
        <ul className="nav-items space-y-4">
          {items.map((item) => (
            <MobileNavigationItem
              key={item.id}
              item={item}
              pathname={pathname}
              onItemClick={onItemClick}
              depth={0}
              theme={theme}
            />
          ))}
        </ul>

        {socialLinks.length > 0 && (
          <div className="social-links mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((link, index) => (
                <SocialLink
                  key={index}
                  link={link}
                  onItemClick={onItemClick}
                  variant="mobile"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ================================
// NAVIGATION ITEM COMPONENTS
// ================================

interface NavigationItemProps {
  item: NavigationItem
  pathname: string
  onItemClick: (item: NavigationItem, depth?: number) => void
  depth: number
  variant?: 'header' | 'sidebar'
  theme?: ThemeSettings
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  pathname,
  onItemClick,
  depth,
  variant = 'header',
  theme,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <li
      className={`nav-item nav-item-${variant} ${isActive ? 'active' : ''}`}
      onMouseEnter={() => hasChildren && variant === 'header' && setIsDropdownOpen(true)}
      onMouseLeave={() => hasChildren && variant === 'header' && setIsDropdownOpen(false)}
    >
      <NavigationLink
        item={item}
        onItemClick={onItemClick}
        depth={depth}
        isActive={isActive}
        className={`nav-link nav-link-${variant} ${isActive ? 'active' : ''}`}
      />

      {hasChildren && isDropdownOpen && variant === 'header' && (
        <DropdownMenu
          items={item.children!}
          pathname={pathname}
          onItemClick={onItemClick}
          depth={depth + 1}
          theme={theme}
        />
      )}

      {hasChildren && variant === 'sidebar' && (
        <CollapsibleMenu
          items={item.children!}
          pathname={pathname}
          onItemClick={onItemClick}
          depth={depth + 1}
          isOpen={isActive}
          theme={theme}
        />
      )}
    </li>
  )
}

const MobileNavigationItem: React.FC<NavigationItemProps> = ({
  item,
  pathname,
  onItemClick,
  depth,
  theme,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === item.href

  return (
    <li className={`mobile-nav-item depth-${depth} ${isActive ? 'active' : ''}`}>
      <div className="mobile-nav-link-wrapper flex items-center justify-between">
        <NavigationLink
          item={item}
          onItemClick={onItemClick}
          depth={depth}
          isActive={isActive}
          className={`mobile-nav-link flex-1 ${isActive ? 'active' : ''}`}
        />
        
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-button p-2 rounded-md hover:bg-gray-100"
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
          >
            <ChevronIcon isExpanded={isExpanded} />
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className="mobile-submenu mt-2 ml-4 space-y-2">
          {item.children!.map((child) => (
            <MobileNavigationItem
              key={child.id}
              item={child}
              pathname={pathname}
              onItemClick={onItemClick}
              depth={depth + 1}
              theme={theme}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// ================================
// UTILITY COMPONENTS
// ================================

interface NavigationLinkProps {
  item: NavigationItem
  onItemClick: (item: NavigationItem, depth?: number) => void
  depth?: number
  isActive?: boolean
  className?: string
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  item,
  onItemClick,
  depth = 0,
  isActive = false,
  className,
}) => {
  const handleClick = () => {
    onItemClick(item, depth)
  }

  const linkProps = {
    onClick: handleClick,
    className,
    'aria-current': (isActive as boolean) ? ('page' as const) : undefined,
  }

  if (item.type === 'external') {
    return (
      <a
        href={item.href}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        {...linkProps}
      >
        {item.icon && <span className="nav-icon mr-2">{item.icon}</span>}
        {item.label}
      </a>
    )
  }

  if (item.type === 'anchor') {
    return (
      <a href={item.href} {...linkProps}>
        {item.icon && <span className="nav-icon mr-2">{item.icon}</span>}
        {item.label}
      </a>
    )
  }

  return (
    <Link href={item.href} {...linkProps}>
      {item.icon && <span className="nav-icon mr-2">{item.icon}</span>}
      {item.label}
    </Link>
  )
}

const SocialLink: React.FC<{
  link: NavigationData['socialLinks'][0]
  onItemClick: (item: NavigationItem, depth?: number) => void
  variant?: 'header' | 'footer' | 'mobile'
}> = ({ link, onItemClick, variant = 'header' }) => {
  const handleClick = () => {
    onItemClick({
      id: `social-${link.platform}`,
      label: link.platform,
      type: 'external',
      href: link.url,
      openInNewTab: true,
    }, 0)
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`social-link social-link-${link.platform} social-link-${variant}`}
      aria-label={`${link.platform}${link.username ? ` - ${link.username}` : ''}`}
    >
      <SocialIcon platform={link.platform} />
      {variant === 'mobile' && (
        <span className="ml-2">{link.platform}</span>
      )}
    </a>
  )
}

// ================================
// DROPDOWN AND COLLAPSIBLE MENUS
// ================================

interface DropdownMenuProps {
  items: NavigationItem[]
  pathname: string
  onItemClick: (item: NavigationItem, depth?: number) => void
  depth: number
  theme?: ThemeSettings
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  pathname,
  onItemClick,
  depth,
  theme,
}) => {
  return (
    <ul className="dropdown-menu absolute top-full left-0 bg-white shadow-lg border rounded-md py-2 min-w-48 z-10">
      {items.map((item) => (
        <li key={item.id}>
          <NavigationLink
            item={item}
            onItemClick={onItemClick}
            depth={depth}
            isActive={pathname === item.href}
            className="dropdown-link block px-4 py-2 hover:bg-gray-100"
          />
        </li>
      ))}
    </ul>
  )
}

const CollapsibleMenu: React.FC<DropdownMenuProps & { isOpen: boolean }> = ({
  items,
  pathname,
  onItemClick,
  depth,
  isOpen,
  theme,
}) => {
  if (!isOpen) return null

  return (
    <ul className="collapsible-menu ml-4 mt-2 space-y-1">
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          pathname={pathname}
          onItemClick={onItemClick}
          depth={depth}
          variant="sidebar"
          theme={theme}
        />
      ))}
    </ul>
  )
}

const MobileMenu: React.FC<{
  items: NavigationItem[]
  socialLinks: NavigationData['socialLinks']
  pathname: string
  onItemClick: (item: NavigationItem, depth?: number) => void
  theme?: ThemeSettings
}> = ({ items, socialLinks, pathname, onItemClick, theme }) => {
  return (
    <div className="mobile-menu absolute top-full left-0 right-0 bg-white shadow-lg border-t max-h-96 overflow-y-auto">
      <ul className="nav-items py-4">
        {items.map((item) => (
          <li key={item.id} className="border-b last:border-b-0">
            <NavigationLink
              item={item}
              onItemClick={onItemClick}
              isActive={pathname === item.href}
              className="mobile-menu-link block px-4 py-3 hover:bg-gray-50"
            />
          </li>
        ))}
      </ul>

      {socialLinks.length > 0 && (
        <div className="social-links flex justify-center space-x-4 py-4 border-t bg-gray-50">
          {socialLinks.map((link, index) => (
            <SocialLink key={index} link={link} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// ================================
// ICON COMPONENTS
// ================================

const MenuIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    className="w-6 h-6 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
)

const CloseIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ChevronIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <svg
    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
  // This would contain actual social media icons
  const iconMap: Record<string, string> = {
    instagram: '📷',
    facebook: '📘',
    youtube: '📺',
    spotify: '🎵',
    soundcloud: '☁️',
    twitter: '🐦',
    tiktok: '🎬',
  }

  return <span className="social-icon">{iconMap[platform] || '🔗'}</span>
}

// ================================
// UTILITY FUNCTIONS
// ================================

function filterNavigationItems(items: NavigationItem[], maxDepth: number, currentDepth: number = 0): NavigationItem[] {
  if (currentDepth >= maxDepth) return []

  return items
    .filter(item => item.enabled !== false)
    .filter(item => shouldShowNavigationItem(item))
    .map(item => ({
      ...item,
      children: item.children 
        ? filterNavigationItems(item.children, maxDepth, currentDepth + 1)
        : undefined,
    }))
}

function shouldShowNavigationItem(item: NavigationItem): boolean {
  const { conditions } = item
  if (!conditions) return true

  // Check date range
  if (conditions.dateRange) {
    const now = new Date()
    if (conditions.dateRange.startDate && new Date(conditions.dateRange.startDate) > now) {
      return false
    }
    if (conditions.dateRange.endDate && new Date(conditions.dateRange.endDate) < now) {
      return false
    }
  }

  // Additional condition checks would go here
  return true
}

// ================================
// FALLBACK COMPONENTS
// ================================

const NavigationSkeleton: React.FC<{ variant: string }> = ({ variant }) => (
  <div className={`navigation-skeleton navigation-skeleton-${variant}`}>
    <div className="flex items-center space-x-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      ))}
    </div>
  </div>
)

const NavigationError: React.FC<{ error?: string }> = ({ error }) => (
  <div className="navigation-error p-4 bg-red-50 border border-red-200 rounded">
    <p className="text-red-600 text-sm">
      Failed to load navigation: {error || 'Unknown error'}
    </p>
  </div>
)

// ================================
// EXPORTS
// ================================

export default NavigationManager
export type { NavigationManagerProps, NavigationItem, NavigationData }