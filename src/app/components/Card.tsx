import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'warning' | 'info';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    warning: 'bg-[#FEF3C7] border-[#F59E0B]',
    info: 'bg-blue-50 border-blue-200',
  };
  
  return (
    <div className={`rounded-2xl border-2 p-5 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
