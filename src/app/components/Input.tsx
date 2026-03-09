import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Input({ label, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white focus:border-[#2563EB] focus:outline-none transition-colors ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
