import React from 'react'
import { FieldError } from 'react-hook-form'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError
  placeholder?: string
  type?: string
  label?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name,
      label,
      placeholder,
      error,
      required = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-foreground mb-1"
          >
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={name}
          className={`w-full px-3 py-2 border rounded-lg 
            bg-background text-foreground placeholder-muted-foreground border-input
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
            ${error ? 'border-destructive' : ''}
          `}
          placeholder={placeholder}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error.message}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
