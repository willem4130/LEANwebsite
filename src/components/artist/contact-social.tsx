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
import { contactAnimations, getOptimizedTransition, prefersReducedMotion } from '@/lib/animations/electronic-music-animations'

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
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  React.useEffect(() => {
    setIsReducedMotion(prefersReducedMotion())
  }, [])

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

  // Electronic Music Contact Animations for Booking Confidence
  const containerVariants = {
    ...contactAnimations.container,
    visible: {
      ...contactAnimations.container.visible,
      transition: getOptimizedTransition(contactAnimations.container.visible!.transition!),
    },
  }

  const formFieldVariants = {
    ...contactAnimations.formField,
    visible: {
      ...contactAnimations.formField.visible,
      transition: getOptimizedTransition(contactAnimations.formField.visible!.transition!),
    },
    focus: {
      ...contactAnimations.formField.focus,
      transition: getOptimizedTransition(contactAnimations.formField.focus!.transition!),
    },
    error: {
      ...contactAnimations.formField.error,
      transition: getOptimizedTransition(contactAnimations.formField.error!.transition!),
    },
  }

  const submitButtonVariants = {
    ...contactAnimations.submitButton,
    hover: {
      ...contactAnimations.submitButton.hover,
      transition: getOptimizedTransition(contactAnimations.submitButton.hover!.transition!),
    },
    loading: {
      ...contactAnimations.submitButton.loading,
      transition: getOptimizedTransition(contactAnimations.submitButton.loading!.transition!),
    },
    success: {
      ...contactAnimations.submitButton.success,
      transition: getOptimizedTransition(contactAnimations.submitButton.success!.transition!),
    },
  }

  const socialGridVariants = {
    ...contactAnimations.socialGrid,
    visible: {
      ...contactAnimations.socialGrid.visible,
      transition: getOptimizedTransition(contactAnimations.socialGrid.visible!.transition!),
    },
  }

  const socialItemVariants = {
    ...contactAnimations.socialItem,
    visible: {
      ...contactAnimations.socialItem.visible,
      transition: getOptimizedTransition(contactAnimations.socialItem.visible!.transition!),
    },
    hover: {
      ...contactAnimations.socialItem.hover,
      transition: getOptimizedTransition(contactAnimations.socialItem.hover!.transition!),
    },
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
            exit="hidden"
            viewport={{ once: false, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Electronic Music Contact Form */}
            <motion.div
              variants={formFieldVariants}
              className="space-y-8"
            >
              <div className="text-center lg:text-left space-y-4">
                <h2 className="text-section-header text-white">
                  Get In Touch
                </h2>
                <p className="text-body-large text-gray-300">
                  Ready to book a show or have a question? Drop me a message and I'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Field with Confidence Building */}
                  <motion.div
                    variants={formFieldVariants}
                    animate={focusedField === 'name' ? 'focus' : 'visible'}
                    className="relative"
                  >
                    <div className="relative group">
                      <Input
                        type="text"
                        placeholder="Your Name"
                        className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 transition-all duration-300 focus:bg-white/15 focus:border-white/50 focus:shadow-lg focus:shadow-purple-500/10"
                        value={form.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      
                      {/* Focus indicator */}
                      {focusedField === 'name' && (
                        <motion.div
                          className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      
                      {/* Typing confidence indicator */}
                      {form.name.length > 0 && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                        </motion.div>
                      )}
                    </div>
                    
                    {errors.name && (
                      <motion.div 
                        className="flex items-center mt-1 text-red-400 text-sm"
                        variants={formFieldVariants}
                        animate="error"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Email Field with Professional Validation */}
                  <motion.div
                    variants={formFieldVariants}
                    animate={focusedField === 'email' ? 'focus' : 'visible'}
                    className="relative"
                  >
                    <div className="relative group">
                      <Input
                        type="email"
                        placeholder="Your Email"
                        className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 transition-all duration-300 focus:bg-white/15 focus:border-white/50 focus:shadow-lg focus:shadow-blue-500/10"
                        value={form.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      
                      {/* Focus indicator */}
                      {focusedField === 'email' && (
                        <motion.div
                          className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      
                      {/* Email validation indicator */}
                      {form.email.length > 0 && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            isValidEmail(form.email) ? 'bg-green-400' : 'bg-yellow-400'
                          }`} />
                        </motion.div>
                      )}
                    </div>
                    
                    {errors.email && (
                      <motion.div 
                        className="flex items-center mt-1 text-red-400 text-sm"
                        variants={formFieldVariants}
                        animate="error"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Subject Field with Booking Context */}
                <motion.div
                  variants={formFieldVariants}
                  animate={focusedField === 'subject' ? 'focus' : 'visible'}
                  className="relative"
                >
                  <div className="relative group">
                    <Input
                      type="text"
                      placeholder="Subject (e.g., Booking Inquiry, Collaboration)"
                      className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 transition-all duration-300 focus:bg-white/15 focus:border-white/50 focus:shadow-lg focus:shadow-green-500/10"
                      value={form.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                    />
                    
                    {/* Focus indicator */}
                    {focusedField === 'subject' && (
                      <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg -z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    {/* Booking context indicator */}
                    {form.subject.toLowerCase().includes('booking') && (
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-green-400 text-xs font-semibold">🎵</div>
                      </motion.div>
                    )}
                  </div>
                  
                  {errors.subject && (
                    <motion.div 
                      className="flex items-center mt-1 text-red-400 text-sm"
                      variants={formFieldVariants}
                      animate="error"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </motion.div>
                  )}
                </motion.div>

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

                {/* Enhanced Submit Button with Booking Confidence */}
                <motion.div
                  variants={submitButtonVariants}
                  animate={
                    submitStatus === 'success' ? 'success' :
                    isSubmitting ? 'loading' : 'idle'
                  }
                  whileHover={!isSubmitting ? 'hover' : undefined}
                  className="relative"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 relative overflow-hidden group transition-all duration-300"
                  >
                    {/* Button background effects */}
                    {!isSubmitting && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {isSubmitting ? (
                      <div className="flex items-center gap-2 relative z-10">
                        <motion.div 
                          className="w-4 h-4 border-2 border-gray-600 border-t-gray-900 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending Your Message...</span>
                      </div>
                    ) : submitStatus === 'success' ? (
                      <div className="flex items-center gap-2 relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </motion.div>
                        <span>Message Sent!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative z-10">
                        <Send className="w-4 h-4" />
                        <span>Send Booking Inquiry</span>
                      </div>
                    )}
                  </Button>
                  
                  {/* Professional response time indicator */}
                  {!isSubmitting && submitStatus === 'idle' && (
                    <motion.p
                      className="text-center text-gray-400 text-xs mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      ⚡ Professional response within 24 hours
                    </motion.p>
                  )}
                </motion.div>

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
              variants={formFieldVariants}
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

              {/* Electronic Music Social Links Grid */}
              <motion.div 
                variants={socialGridVariants}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={socialItemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    className="group"
                    style={{
                      // Stagger the animation delays
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/25 transition-all duration-300 cursor-pointer relative overflow-hidden group">
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Platform-specific accent */}
                      <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-300 ${
                        social.platform === 'instagram' ? 'bg-gradient-to-r from-pink-500 to-yellow-500' :
                        social.platform === 'spotify' ? 'bg-green-500' :
                        social.platform === 'youtube' ? 'bg-red-500' :
                        social.platform === 'facebook' ? 'bg-blue-500' :
                        'bg-purple-500'
                      } scale-x-0 group-hover:scale-x-100 origin-left`} />
                      
                      <CardContent className="p-6 relative z-10">
                        <div className="flex flex-col items-center space-y-3">
                          <motion.div 
                            className="text-white relative"
                            whileHover={!isReducedMotion ? {
                              rotate: [0, -5, 5, 0],
                              scale: [1, 1.1, 1.1, 1],
                            } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {getSocialIcon(social.platform)}
                            
                            {/* Icon glow effect */}
                            <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 rounded-full blur-lg transition-opacity duration-300" />
                          </motion.div>
                          
                          <p className="text-white text-sm font-medium capitalize group-hover:text-white/90 transition-colors">
                            {social.platform}
                          </p>
                          
                          {social.username && (
                            <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                              @{social.username}
                            </p>
                          )}
                          
                          {/* Follow indicator */}
                          <motion.div
                            className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ y: 5 }}
                            whileHover={{ y: 0 }}
                          >
                            Follow for updates
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.a>
                ))}
              </motion.div>

              {/* Enhanced Direct Email Card */}
              <motion.div 
                variants={formFieldVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 relative overflow-hidden">
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 border border-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center relative"
                        whileHover={!isReducedMotion ? {
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <Mail className="w-6 h-6 text-white" />
                        
                        {/* Pulse indicator for direct contact */}
                        <motion.div
                          className="absolute -inset-1 border-2 border-white/30 rounded-full"
                          animate={!isReducedMotion ? {
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                          Direct Booking Email
                        </h3>
                        <a
                          href={`mailto:${contactEmail}?subject=Booking Inquiry`}
                          className="text-gray-300 hover:text-white underline transition-colors text-sm flex items-center gap-2"
                        >
                          {contactEmail}
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ x: 2 }}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </motion.div>
                        </a>
                        
                        {/* Professional indicator */}
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-xs text-green-300">Fastest response time</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Professional Promise */}
              <motion.div
                variants={formFieldVariants}
                className="flex justify-center lg:justify-start"
              >
                <motion.div 
                  className="flex items-center bg-green-500/20 text-green-300 px-6 py-3 rounded-full text-sm space-x-3 border border-green-500/30 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-green-400/10"
                    animate={!isReducedMotion ? {
                      x: ['-100%', '100%'],
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  <motion.div
                    animate={!isReducedMotion ? {
                      rotate: [0, 360],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                  
                  <div className="relative z-10">
                    <div className="font-semibold">Professional Response Guarantee</div>
                    <div className="text-xs opacity-80">Within 24 hours • Booking priority</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </ComponentErrorBoundary>
  )
}