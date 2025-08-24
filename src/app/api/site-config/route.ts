import { NextRequest } from 'next/server'
import { 
  SiteConfigSchema, 
  createApiResponse, 
  withErrorHandling,
  addSecurityHeaders 
} from '@/lib/api-framework'

// Mock data - in production this would come from Payload CMS
const mockSiteConfig = {
  siteName: "ARIA NOVA",
  primaryColor: "#00ffff",
  secondaryColor: "#8b5cf6", 
  logo: {
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&auto=format",
    alt: "Aria Nova Logo"
  },
  socialLinks: [
    {
      platform: "instagram" as const,
      url: "https://instagram.com/arianova",
      username: "arianova"
    },
    {
      platform: "spotify" as const,
      url: "https://open.spotify.com/artist/arianova"
    },
    {
      platform: "youtube" as const,
      url: "https://youtube.com/@arianova",
      username: "arianova"
    }
  ]
}

export const GET = withErrorHandling(async (req: NextRequest) => {
  // Validate the data structure
  const validatedConfig = SiteConfigSchema.parse(mockSiteConfig)
  
  const response = createApiResponse(validatedConfig)
  return addSecurityHeaders(response)
})