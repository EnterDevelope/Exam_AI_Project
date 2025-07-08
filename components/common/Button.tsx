import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'bg-transparent text-brand hover:bg-brand-light border border-transparent': variant === 'ghost',
          'opacity-60 cursor-not-allowed': loading || disabled,
        },
        className
      )}
      disabled={loading || disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 animate-spin border-2 border-brand border-t-transparent rounded-full" />
      ) : (
        <>
          {leftIcon && <span className="mr-1">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-1">{rightIcon}</span>}
        </>
      )}
    </button>
  );
} 