import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-therapeutic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-soft hover:shadow-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-medium hover:shadow-therapeutic transform hover:scale-[1.02] font-semibold",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-soft hover:shadow-medium",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-accent shadow-soft hover:shadow-medium",
        ghost: "hover:bg-accent text-accent-foreground hover:shadow-soft",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-dark",
        // Clean professional variants
        therapeutic: "bg-gradient-hero text-primary-foreground shadow-therapeutic hover:shadow-glow transform hover:scale-[1.02] font-semibold",
        calm: "bg-gradient-calm text-primary border border-primary/20 shadow-soft hover:shadow-medium transform hover:scale-[1.02]",
        wellness: "bg-gradient-wellness text-primary border border-border shadow-soft hover:shadow-medium hover:bg-accent",
        chat: "bg-gradient-chat text-primary-foreground shadow-therapeutic hover:shadow-glow transform hover:scale-[1.05] font-semibold",
        floating: "bg-gradient-glass backdrop-blur-md border-2 border-primary/20 text-primary hover:bg-primary/10 shadow-large hover:shadow-therapeutic",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base font-medium",
        xl: "h-16 rounded-2xl px-12 text-lg font-semibold",
        icon: "h-11 w-11 rounded-xl",
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
