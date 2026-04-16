import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-700 active:bg-primary-800 disabled:bg-gray-200 disabled:text-gray-400',
    secondary: 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400',
    tertiary: 'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400',
    danger: 'bg-destructive text-destructive-foreground hover:bg-red-600 active:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400',
    ghost: 'bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100 disabled:text-gray-400',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10 p-0',
  };

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed whitespace-nowrap tracking-[0.5px]';

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className={cn(children && "mr-2")}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={cn(children && "ml-2")}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
