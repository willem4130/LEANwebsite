import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Play, Settings, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm mb-6">
            <CheckCircle className="w-4 h-4" />
            MVP Complete - All Components Built!
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            Music Artist Website
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Professional music artist platform with full CMS control over backgrounds, 
            animations, and content. Built with Next.js 14, Payload CMS, and Framer Motion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild variant="gradient" size="xl">
              <Link href="/demo" className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                View Live Demo
              </Link>
            </Button>
            
            <Button asChild variant="artist" size="xl">
              <Link href="/admin" className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                CMS Admin
              </Link>
            </Button>
          </div>
          
          <div className="text-slate-400 text-sm mb-16">
            ⚠️ CMS requires database setup - see .env.example for configuration
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Hero Animations</h3>
            <p className="text-slate-300 text-sm">
              5-second intro sequences with precise timing controls and full background customization
            </p>
            <div className="mt-3 text-green-400 text-xs font-semibold">✓ COMPLETE</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Dynamic Layouts</h3>
            <p className="text-slate-300 text-sm">
              Tour dates and bio with independent background controls per section
            </p>
            <div className="mt-3 text-green-400 text-xs font-semibold">✓ COMPLETE</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Media Gallery</h3>
            <p className="text-slate-300 text-sm">
              Grid, masonry, and carousel layouts with lightbox and category filtering
            </p>
            <div className="mt-3 text-green-400 text-xs font-semibold">✓ COMPLETE</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Contact System</h3>
            <p className="text-slate-300 text-sm">
              Validated contact forms with social media integration and animations
            </p>
            <div className="mt-3 text-green-400 text-xs font-semibold">✓ COMPLETE</div>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Built With Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'Next.js 14',
              'Payload CMS',
              'Framer Motion',
              'TypeScript',
              'Tailwind CSS',
              'Radix UI',
              'PostgreSQL'
            ].map((tech) => (
              <div key={tech} className="bg-white/5 border border-white/20 px-4 py-2 rounded-full text-slate-300">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}