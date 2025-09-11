import React from "react";
import { FieldError } from "react-hook-form";
interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name?: string;
  error?: FieldError;
  placeholder?: string;
  label?: string;
  required?: boolean;
}
const TextArea: React.FC<InputProps> = ({
  name,
  placeholder,
  error,
  className = "",
  label,
  required,
  ...rest
}) => {
  return (
    <>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        cols={1}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary 
        border-input text-foreground bg-background placeholder-muted-foreground
        dark:border-input dark:text-foreground dark:bg-background dark:placeholder-muted-foreground
        ${className}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive dark:text-destructive">
          {error.message}
        </p>
      )}
    </>
  );
};

export default TextArea;
