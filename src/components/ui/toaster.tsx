'use client'

// Simple toast replacement during Chakra UI to shadcn/ui migration
export const toaster = {
  success: (message: string) => {
    console.log('Toast Success:', message)
    // Could implement with react-hot-toast or shadcn/ui toast later
  },
  error: (message: string) => {
    console.log('Toast Error:', message) 
  },
  info: (message: string) => {
    console.log('Toast Info:', message)
  }
}

export const Toaster = () => {
  return null // Placeholder during migration
}