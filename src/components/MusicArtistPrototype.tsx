'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Heart, Share2, Download, Instagram, Music, Video } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function MusicArtistPrototype() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // EXPLOSIVE HERO ENTRANCE - Hollywood Level
    const heroTimeline = gsap.timeline({ 
      defaults: { ease: "power3.out" } 
    })

    // Background explosion entrance
    heroTimeline
      .from(".hero-bg", { 
        scale: 1.3, 
        opacity: 0, 
        duration: 2.5, 
        ease: "power2.out",
        force3D: true
      })
      // Artist name explosive reveal
      .from(".hero-title", { 
        y: 150, 
        opacity: 0, 
        duration: 1.5,
        ease: "back.out(1.7)",
        force3D: true 
      }, "-=2")
      // Tagline smooth slide
      .from(".hero-subtitle", { 
        y: 80, 
        opacity: 0, 
        duration: 1.2,
        force3D: true 
      }, "-=1")
      // CTA buttons scale explosion
      .from(".hero-cta", { 
        scale: 0, 
        opacity: 0, 
        duration: 1, 
        ease: "back.out(2.5)",
        stagger: 0.2,
        force3D: true
      }, "-=0.8")
      // Social icons stagger entrance
      .from(".social-icon", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        force3D: true
      }, "-=0.5")

    // Parallax scroll effect for hero
    gsap.to(".hero-bg", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    })

    // Music cards explosive entrance on scroll
    gsap.from(".music-card", {
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      stagger: 0.15,
      ease: "back.out(1.4)",
      force3D: true,
      scrollTrigger: {
        trigger: ".music-gallery",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })

    // Artist story section smooth reveal
    gsap.from(".story-content", {
      y: 80,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".story-section",
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    })

    // Performance stats counter animation
    gsap.from(".stat-number", {
      textContent: 0,
      duration: 2,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })

  }, { scope: containerRef, dependencies: [] })

  // Cleanup on unmount
  useLayoutEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const musicTracks = [
    {
      title: "Midnight Vibes",
      genre: "Electronic",
      duration: "3:42",
      plays: "2.3M",
      featured: true,
      cover: "🎵"
    },
    {
      title: "City Dreams",
      genre: "Hip-Hop",
      duration: "4:18",
      plays: "1.8M",
      featured: false,
      cover: "🌃"
    },
    {
      title: "Neon Nights",
      genre: "Synthwave",
      duration: "5:24",
      plays: "3.1M",
      featured: true,
      cover: "✨"
    },
    {
      title: "Bass Drop",
      genre: "EDM",
      duration: "3:58",
      plays: "4.2M",
      featured: false,
      cover: "🔥"
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* EXPLOSIVE HERO SECTION */}
      <section ref={heroRef} className="hero-section relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-black z-0">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="hero-title text-7xl md:text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            AXIOM
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8 font-light">
            Electronic Music Producer • Bass Architect • Sound Designer
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button className="hero-cta bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Listen Now
            </Button>
            <Button variant="outline" className="hero-cta border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
              Book Live Show
            </Button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6">
            <div className="social-icon p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
              <Music className="w-6 h-6 text-green-500" />
            </div>
            <div className="social-icon p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
              <Video className="w-6 h-6 text-red-500" />
            </div>
            <div className="social-icon p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
              <Instagram className="w-6 h-6 text-pink-500" />
            </div>
          </div>
        </div>
      </section>

      {/* MUSIC GALLERY SECTION */}
      <section className="music-gallery py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Latest Tracks
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Experience the sound that defines the underground</p>

          <div className="grid md:grid-cols-2 gap-8">
            {musicTracks.map((track, index) => (
              <Card key={index} className="music-card bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-2xl">
                        {track.cover}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          {track.title}
                          {track.featured && <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">Featured</Badge>}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {track.genre} • {track.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <div>
                      <Button size="icon" variant="ghost" className="text-purple-400 hover:bg-purple-400/20">
                        <Play className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{track.plays} plays</span>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-gray-400 hover:text-blue-500">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-gray-400 hover:text-green-500">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIST STORY SECTION */}
      <section className="story-section py-20 px-6 bg-gradient-to-r from-gray-900/50 to-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="story-content text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              The Sound Journey
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              From underground raves to festival main stages, AXIOM has been crafting bass-heavy electronic experiences that push the boundaries of sound design. With over 50M streams worldwide and collaborations with industry legends, every track is an invitation to lose yourself in the rhythm.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="stat-number text-3xl font-bold text-purple-400 mb-2">50</div>
                <p className="text-gray-400">Million Streams</p>
              </div>
              <div className="text-center">
                <div className="stat-number text-3xl font-bold text-cyan-400 mb-2">127</div>
                <p className="text-gray-400">Live Shows</p>
              </div>
              <div className="text-center">
                <div className="stat-number text-3xl font-bold text-pink-400 mb-2">23</div>
                <p className="text-gray-400">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Ready to Collaborate?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Let's create something that will shake the speakers and move the crowd
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg">
              Book for Event
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
              Studio Collaboration
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}