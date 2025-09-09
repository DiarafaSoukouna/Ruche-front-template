import React from 'react'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        tertiary: 'bg-tertiary text-tertiary-foreground hover:bg-tertiary/90',
        danger:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        danger: 'bg-red-500 text-white hover:bg-red-700',
      },
      size: {
        sm: 'px-3 py-2 text-sm h-8',
        md: 'px-4 py-2.5 text-sm h-10',
        lg: 'px-6 py-3 text-base h-12',
        xl: 'px-8 py-4 text-lg h-14',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  loading?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
