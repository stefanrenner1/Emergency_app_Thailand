import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emergency' | 'informational' | 'ghost';
  size?: 'large' | 'medium' | 'small';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    emergency: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-lg',
    informational: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]',
    ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  };
  
  const sizeStyles = {
    large: 'h-14 px-6 rounded-2xl text-lg',
    medium: 'h-12 px-5 rounded-xl',
    small: 'h-10 px-4 rounded-lg text-sm',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
