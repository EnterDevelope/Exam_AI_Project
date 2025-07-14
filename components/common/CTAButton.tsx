import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  children: ReactNode
  className?: string
}

export default function CTAButton({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...props
}: CTAButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: clsx(
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      disabled && 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
    ),
    ghost: clsx(
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border border-gray-300',
      disabled && 'text-gray-400 cursor-not-allowed hover:bg-transparent'
    )
  }

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
} 