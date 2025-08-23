import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Play, Settings, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm mb-6">
            <Zap className="w-4 h-4" />
            Framework Ready
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Music Artist Website
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional music artist platform built with Next.js 14, Payload CMS, and shadcn/ui.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <Button asChild size="default">
              <Link href="/demo" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                View Live Demo
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="default">
              <Link href="/admin" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                CMS Admin
              </Link>
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm mb-16">
            CMS requires database setup - see .env.example for configuration
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center mb-4">
              <Zap className="w-4 h-4 text-background" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Hero Animations</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Precise timing controls and background customization
            </p>
            <div className="text-xs text-muted-foreground">✓ Ready</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center mb-4">
              <Settings className="w-4 h-4 text-background" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Dynamic Layouts</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Tour dates and bio with independent controls
            </p>
            <div className="text-xs text-muted-foreground">✓ Ready</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center mb-4">
              <Play className="w-4 h-4 text-background" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Media Gallery</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Grid, masonry layouts with category filtering
            </p>
            <div className="text-xs text-muted-foreground">✓ Ready</div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center mb-4">
              <CheckCircle className="w-4 h-4 text-background" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Contact System</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Validated forms with social media integration
            </p>
            <div className="text-xs text-muted-foreground">✓ Ready</div>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-8">Built With Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {[
              'Next.js 14',
              'shadcn/ui',
              'Framer Motion',
              'TypeScript',
              'Tailwind CSS',
              'Radix UI'
            ].map((tech) => (
              <div key={tech} className="bg-muted border border-border px-3 py-1 rounded-md text-muted-foreground">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}