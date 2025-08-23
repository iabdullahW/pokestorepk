import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg hover:shadow-xl hover:from-rose-500 hover:to-rose-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-rose-400 bg-white/50 backdrop-blur-sm text-rose-600 hover:bg-rose-50 hover:border-rose-500 hover:text-rose-700",
        secondary:
          "bg-rose-100 text-rose-700 hover:bg-rose-200 hover:text-rose-800",
        ghost: "text-rose-600 hover:bg-rose-100/50 hover:text-rose-700",
        link: "text-rose-600 underline-offset-4 hover:underline hover:text-rose-700",
        // New Dusty Rose Variants
        "dusty-rose": "bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-dusty-rose hover:shadow-dusty-rose-lg hover:from-rose-500 hover:to-rose-600",
        "dusty-rose-outline": "border-2 border-rose-400 text-rose-600 bg-white/50 backdrop-blur-sm hover:bg-rose-50 hover:border-rose-500 hover:text-rose-700 shadow-sm hover:shadow-dusty-rose",
        "dusty-rose-ghost": "text-rose-600 hover:bg-rose-100/50 hover:text-rose-700",
        "dusty-rose-soft": "bg-rose-100/80 text-rose-700 hover:bg-rose-200/80 hover:text-rose-800 backdrop-blur-sm",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 py-2 text-xs",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        xl: "h-14 rounded-xl px-10 py-5 text-lg",
        icon: "h-11 w-11",
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
