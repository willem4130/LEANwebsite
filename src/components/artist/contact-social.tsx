'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Send, 
  Instagram, 
  Facebook, 
  Youtube, 
  Music, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ComponentErrorBoundary } from '@/components/ErrorBoundary'
import { toaster } from '@/components/ui/toaster'

interface SocialLink {
  platform: 'instagram' | 'facebook' | 'youtube' | 'spotify' | 'soundcloud' | 'twitter' | 'tiktok'
  url: string
  username?: string
}

interface ContactSocialProps {
  socialLinks: SocialLink[]
  contactEmail: string
  backgroundType?: 'color' | 'gradient' | 'image' | 'video'
  backgroundColor?: string
  backgroundMedia?: {
    url: string
    alt?: string
  }
  className?: string
}

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  general?: string
}

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function ContactSocial({
  socialLinks,
  contactEmail,
  backgroundType = 'color',
  backgroundColor = '#1a1a1a',
  backgroundMedia,
  className,
}: ContactSocialProps) {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'color':
        return { backgroundColor }
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor} 0%, #4a5568 100%)`
        }
      case 'image':
        return backgroundMedia?.url
          ? {
              backgroundImage: `url(${backgroundMedia.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : { backgroundColor }
      default:
        return { backgroundColor }
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-6 h-6" />
      case 'facebook':
        return <Facebook className="w-6 h-6" />
      case 'youtube':
        return <Youtube className="w-6 h-6" />
      case 'spotify':
      case 'soundcloud':
        return <Music className="w-6 h-6" />
      default:
        return <ExternalLink className="w-6 h-6" />
    }
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    
    // Validate name
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    // Validate email
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Validate subject
    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    // Validate message
    if (!form.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    return newErrors
  }

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    // Sanitize input
    const sanitizedValue = sanitizeInput(value)
    
    setForm(prev => ({ ...prev, [field]: sanitizedValue }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset status
    setSubmitStatus('idle')
    setErrors({})
    
    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    setIsSubmitting(true)

    try {
      // Send form data to API endpoint
      const sanitizedForm = {
        name: sanitizeInput(form.name),
        email: sanitizeInput(form.email),
        subject: sanitizeInput(form.subject),
        message: sanitizeInput(form.message),
      }
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedForm),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }
      
      setSubmitStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      toaster.success('Message sent successfully!')
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      toaster.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <ComponentErrorBoundary 
      componentName="Contact Form"
      fallback={
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <Alert>
              <AlertDescription>
                <div className="flex items-start space-y-2 flex-col">
                  <h3 className="text-lg font-semibold text-red-800">Contact Form Error</h3>
                  <p className="text-red-700">The contact form couldn't load properly.</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="text-red-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      }
    >
      <section
        className={`py-16 lg:py-24 relative overflow-hidden ${className}`}
        style={getBackgroundStyle()}
      >
        {/* Background overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              <div className="text-center lg:text-left space-y-4">
                <h2 className="text-3xl lg:text-5xl font-bold text-white">
                  Get In Touch
                </h2>
                <p className="text-gray-300 text-lg">
                  Ready to book a show or have a question? Drop me a message and I'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center mt-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                      value={form.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    {errors.email && (
                      <div className="flex items-center mt-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Subject"
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                    value={form.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                  {errors.subject && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </div>
                  )}
                </div>

                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 resize-none"
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                  {errors.message && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </div>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {form.message.length}/1000 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-900 rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </div>
                  )}
                </Button>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert className="bg-green-500/20 border-green-500/50 text-green-100">
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>
                        Message sent successfully! I'll get back to you soon.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        Failed to send message. Please try again or email me directly.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Social Links & Direct Contact */}
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              <div className="text-center lg:text-left space-y-4">
                <h2 className="text-3xl lg:text-5xl font-bold text-white">
                  Follow Along
                </h2>
                <p className="text-gray-300 text-lg">
                  Stay connected and be the first to know about new music, shows, and behind-the-scenes content.
                </p>
              </div>

              {/* Social Links Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={socialVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="text-white">
                            {getSocialIcon(social.platform)}
                          </div>
                          <p className="text-white text-sm font-medium capitalize">
                            {social.platform}
                          </p>
                          {social.username && (
                            <p className="text-gray-400 text-xs">
                              @{social.username}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.a>
                ))}
              </motion.div>

              {/* Direct Email */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">Direct Email</h3>
                        <a
                          href={`mailto:${contactEmail}`}
                          className="text-gray-300 hover:text-white underline transition-colors"
                        >
                          {contactEmail}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Response Promise */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center lg:justify-start"
              >
                <div className="flex items-center bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Typically responds within 24 hours</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </ComponentErrorBoundary>
  )
}