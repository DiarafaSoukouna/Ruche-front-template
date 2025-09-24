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
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
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
