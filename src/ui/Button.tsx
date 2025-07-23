'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow text-base px-6 py-2 border-0',
  {
    variants: {
      variant: {
        neutral:
          'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100',
        outline:
          'bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
        github: 'bg-[#181717] hover:bg-black text-white border-0',
        discord: 'bg-[#5865F2] hover:bg-[#4752c4] text-white border-0',
      },
      size: {
        default: 'h-10 px-6 py-2 text-base',
        sm: 'h-8 px-4 py-1 text-sm',
        lg: 'h-12 px-8 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
