import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormErrorMessageProps {
  error?: FieldError | string;
  className?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ 
  error, 
  className = "" 
}) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className={`text-red-600 text-sm mt-1 flex items-center ${className}`}>
      <svg 
        className="w-4 h-4 mr-1 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
          clipRule="evenodd" 
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default FormErrorMessage;
