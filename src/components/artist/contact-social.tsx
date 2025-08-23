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
  AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

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

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For now, we'll just show success
      setSubmitStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      className={cn("py-16 lg:py-24 relative overflow-hidden", className)}
      style={getBackgroundStyle()}
    >
      {/* Background overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
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
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                />
              </div>

              <div>
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Failed to send message. Please try again or email me directly.</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Social Links & Direct Contact */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
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
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="text-white group-hover:text-gray-200 transition-colors mb-3">
                    {getSocialIcon(social.platform)}
                  </div>
                  <span className="text-white text-sm font-medium capitalize">
                    {social.platform}
                  </span>
                  {social.username && (
                    <span className="text-gray-400 text-xs mt-1">
                      @{social.username}
                    </span>
                  )}
                </motion.a>
              ))}
            </motion.div>

            {/* Direct Email */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Direct Email</h3>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-gray-300 hover:text-white transition-colors underline"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Quick Response Promise */}
            <motion.div
              variants={itemVariants}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                Typically responds within 24 hours
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}