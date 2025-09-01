import React from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'outline' | 'danger' | 'yellow'
type Size = 'sm' | 'md' | 'lg'

interface BoutonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  className?: string
}

const Button: React.FC<BoutonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<Variant, string> = {
    primary:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-200',
    outline:
      'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    yellow:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-yellow-500 shadow-md hover:shadow-lg',
  }

  const sizes: Record<Size, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
