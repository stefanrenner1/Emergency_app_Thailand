import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export function TextArea({ label, helperText, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full min-h-[120px] px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-[#2563EB] focus:outline-none transition-colors resize-none ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
