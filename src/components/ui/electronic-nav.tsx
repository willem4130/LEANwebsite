'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { Home, Music, Calendar, Camera, Mail, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, href: '#hero' },
  { id: 'shows', label: 'Shows & About', icon: <Calendar className="w-4 h-4" />, href: '#shows' },
  { id: 'gallery', label: 'Gallery', icon: <Camera className="w-4 h-4" />, href: '#gallery' },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" />, href: '#contact' },
]

export function ElectronicNav() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 50], [0.95, 0.98])
  const navBlur = useTransform(scrollY, [0, 100], [8, 12])

  useEffect(() => {
    // GSAP entrance animation for nav - SMOOTHED with MCP optimization
    if (navRef.current) {
      // Performance defaults for smooth 60fps
      gsap.defaults({ force3D: true, lazy: false })
      
      gsap.fromTo(navRef.current, 
        { 
          y: -80, 
          opacity: 0,
          filter: 'blur(8px)',
          scale: 0.9
        },
        { 
          y: 0, 
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 1.8, 
          ease: 'back.out(1.2)', // Smoother, more refined bounce
          delay: 2.5, // After hero loads
          force3D: true,
          clearProps: 'transform,opacity,filter' // Memory cleanup
        }
      )
    }

    // Scroll detection and section tracking
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Detect active section based on scroll position
      const sections = ['#hero', '#shows', '#gallery', '#contact']
      const sectionIds = ['home', 'shows', 'gallery', 'contact']
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.querySelector(sections[i])
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) { // Section is in view
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP nav item hover animations
  const handleNavItemHover = (element: HTMLElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(element, {
        scale: 1.1,
        y: -2,
        duration: 0.3,
        ease: 'power2.out'
      })
      
      // Glow effect
      gsap.to(element.querySelector('.nav-glow'), {
        opacity: 1,
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
      
      gsap.to(element.querySelector('.nav-glow'), {
        opacity: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        ref={navRef}
        className={cn(
          "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
          "backdrop-blur-md border border-brand-neon/20 rounded-2xl",
          "px-6 py-4 transition-all duration-500",
          "bg-gradient-to-r from-brand-void/90 via-brand-dark/90 to-brand-navy/90",
          "shadow-lg shadow-brand-neon/10",
          isScrolled && "shadow-xl shadow-brand-neon/20 border-brand-neon/30"
        )}
        style={{
          opacity: navOpacity,
          backdropFilter: `blur(${navBlur}px)`
        }}
      >
        {/* Animated background glow */}
        <div 
          ref={glowRef}
          className="absolute inset-0 bg-gradient-to-r from-brand-neon/5 via-brand-electric/5 to-brand-purple/5 rounded-full opacity-0 transition-opacity duration-300"
        />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.href)}
              className={cn(
                "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5",
                "text-sm font-medium transition-all duration-300 group outline-none",
                "focus-visible:ring-2 focus-visible:ring-brand-neon/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark",
                "hover:bg-brand-neon/10 hover:text-brand-neon hover:shadow-lg hover:shadow-brand-neon/25",
                "disabled:pointer-events-none disabled:opacity-50",
                "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
                activeSection === item.id 
                  ? "text-brand-neon bg-brand-neon/10 shadow-md shadow-brand-neon/20" 
                  : "text-brand-text-secondary hover:text-brand-text-primary"
              )}
              onMouseEnter={(e) => handleNavItemHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleNavItemHover(e.currentTarget, false)}
            >
              {/* Hover glow effect */}
              <div className="nav-glow absolute inset-0 bg-brand-neon/20 rounded-full opacity-0 blur-sm" />
              
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
              
              {/* Active indicator */}
              {activeSection === item.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-neon/20 to-brand-electric/20 rounded-full"
                  layoutId="activeSection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-brand-text-primary hover:text-brand-neon transition-colors p-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-4 right-4 z-40 md:hidden"
        >
          <div className="bg-gradient-to-br from-brand-void/95 via-brand-dark/95 to-brand-navy/95 backdrop-blur-lg border border-brand-neon/20 rounded-xl p-4 shadow-xl shadow-brand-neon/20">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "flex items-center space-x-3 w-full px-4 py-3 rounded-lg mb-2 last:mb-0",
                  "text-sm font-medium transition-all duration-300",
                  "hover:bg-brand-neon/10 hover:text-brand-neon",
                  activeSection === item.id 
                    ? "text-brand-neon bg-brand-neon/10" 
                    : "text-brand-text-secondary"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Floating Circuit Lines */}
      <div className="fixed top-0 left-0 w-full h-2 pointer-events-none z-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="nav-circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#00ffff', stopOpacity: 0}} />
              <stop offset="50%" style={{stopColor: '#00d4ff', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0}} />
            </linearGradient>
          </defs>
          <path
            className="nav-circuit-path"
            d="M0,1 Q25,0.5 50,1 T100,1"
            stroke="url(#nav-circuit-gradient)"
            strokeWidth="1"
            fill="none"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="100"
            style={{ 
              animation: `${isScrolled ? 'drawCircuit 3s ease-in-out infinite' : 'none'}` 
            }}
          />
        </svg>
      </div>

      {/* Circuit Animation CSS */}
      <style jsx>{`
        @keyframes drawCircuit {
          0%, 100% { stroke-dashoffset: 100; }
          50% { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  )
}