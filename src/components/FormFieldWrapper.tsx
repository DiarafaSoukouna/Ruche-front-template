import React from 'react';
import { FieldError } from 'react-hook-form';
import FormErrorMessage from './FormErrorMessage';

interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
  helpText?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  required = false,
  error,
  children,
  className = "",
  helpText
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {helpText && (
        <p className="text-xs text-gray-500 mb-1">{helpText}</p>
      )}
      
      <div className="relative">
        {children}
        {error && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg 
              className="w-5 h-5 text-red-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
      
      <FormErrorMessage error={error} />
    </div>
  );
};

export default FormFieldWrapper;
