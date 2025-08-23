import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-brand-electric to-brand-purple text-white shadow-lg hover:from-cyan-400 hover:to-purple-600 transform hover:scale-105 transition-all duration-200",
        artist: "bg-brand-navy/80 backdrop-blur-sm text-white border border-brand-electric/50 hover:bg-brand-electric/20 hover:border-brand-electric transition-all duration-300",
        
        // Premium Booking Agent Appeal Variants
        premium: "bg-gradient-to-r from-brand-neon via-brand-electric to-brand-purple text-black font-bold shadow-2xl hover:shadow-brand-neon/25 hover:scale-105 border border-brand-neon/30 hover:border-brand-neon transition-all duration-300 backdrop-blur-sm",
        
        professional: "bg-brand-charcoal/90 backdrop-blur-md text-brand-text-hero border-2 border-brand-neon/40 hover:bg-brand-neon/10 hover:border-brand-neon hover:shadow-lg hover:shadow-brand-neon/20 transition-all duration-300 font-semibold",
        
        booking: "bg-gradient-to-r from-brand-void via-brand-dark to-brand-navy text-brand-neon border border-brand-neon/50 hover:bg-gradient-to-r hover:from-brand-neon/20 hover:via-brand-electric/20 hover:to-brand-purple/20 hover:text-white hover:border-brand-neon hover:shadow-xl hover:shadow-brand-neon/30 transition-all duration-500 font-bold backdrop-blur-sm",
        
        cta: "bg-brand-neon text-black font-bold hover:bg-white hover:text-brand-void shadow-lg hover:shadow-xl hover:shadow-brand-neon/40 border border-brand-neon hover:border-white transform hover:scale-102 transition-all duration-300",
      },
      size: {
        default: "h-11 px-4 py-2", // 44px minimum for accessibility
        sm: "h-11 rounded-md px-3 text-xs", // Fixed: was h-8 (32px) - accessibility violation
        lg: "h-12 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-11 w-11", // 44px minimum for touch targets
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }