'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CalendarDays, MapPin, Users, DollarSign, Sparkles, Star } from 'lucide-react'

interface BookingFormProps {
  artistName?: string
  backgroundColor?: string
}

const pricingTiers = [
  {
    name: "Club Performance",
    price: "$5,000 - $8,000",
    duration: "2-3 hours",
    audience: "200-500 people",
    includes: ["2-3 hour performance", "Professional sound setup", "Basic lighting", "Meet & greet"],
    badge: "Popular",
    icon: <Users className="w-5 h-5" />
  },
  {
    name: "Festival Headliner", 
    price: "$15,000 - $25,000",
    duration: "45-60 minutes",
    audience: "2,000-10,000 people",
    includes: ["Main stage performance", "Full production support", "Custom lighting design", "VIP backstage access"],
    badge: "Premium",
    icon: <Star className="w-5 h-5" />
  },
  {
    name: "Private Event",
    price: "$10,000 - $20,000", 
    duration: "3-4 hours",
    audience: "50-300 people",
    includes: ["Exclusive performance", "Custom setlist", "Premium sound/lighting", "Extended meet & greet"],
    badge: "Exclusive",
    icon: <Sparkles className="w-5 h-5" />
  }
]

export function BookingForm({ artistName = "ARIA NOVA", backgroundColor = "#0a0a0f" }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    eventType: '',
    date: '',
    location: '',
    budget: '',
    audience: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    console.log('Booking inquiry submitted:', formData)
    alert('Thank you for your booking inquiry! We\'ll be in touch within 24 hours.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="py-20 px-6" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Book {artistName}
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Professional electronic music performances for festivals, clubs, and private events
          </p>
          <div className="flex justify-center">
            <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
              Available for 2024 - 2025 bookings
            </Badge>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 hover:border-cyan-400/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600/20 to-purple-600/20">
                      {tier.icon}
                    </div>
                    <CardTitle className="text-white">{tier.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-400">
                    {tier.badge}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-cyan-400 mb-2">{tier.price}</div>
                <CardDescription className="text-gray-400">
                  {tier.duration} • {tier.audience}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Form */}
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <CalendarDays className="w-6 h-6 mr-3 text-cyan-400" />
              Submit Booking Inquiry
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tell us about your event and we'll get back to you within 24 hours with availability and a custom quote.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                    Organization/Venue
                  </label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Event organizer or venue name"
                  />
                </div>

                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-2">
                    Event Type *
                  </label>
                  <Input
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Festival, club night, private party, etc."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="City, State/Country"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <Input
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="$5,000 - $25,000"
                  />
                </div>

                <div>
                  <label htmlFor="audience" className="block text-sm font-medium text-gray-300 mb-2">
                    Expected Audience
                  </label>
                  <Input
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="200 - 5,000 people"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Details
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Tell us more about your event, special requirements, or any questions..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-3"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Submit Booking Inquiry
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  View Tour Dates
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Powered By Branding */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-2">
            Website powered by
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              LEAN Artist Websites
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-1">
            Professional music artist websites with Hollywood-level animations
          </p>
        </div>
      </div>
    </div>
  )
}