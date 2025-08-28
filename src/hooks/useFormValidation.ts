import { useCallback } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';

interface UseFormValidationOptions {
  showToastOnError?: boolean;
  scrollToFirstError?: boolean;
}

export const useFormValidation = <T extends FieldValues>(
  options: UseFormValidationOptions = {}
) => {
  const { showToastOnError = true, scrollToFirstError = true } = options;

  const handleFormErrors = useCallback((errors: FieldErrors<T>) => {
    const errorEntries = Object.entries(errors);
    
    if (errorEntries.length === 0) return;

    // Show toast notification for first error
    if (showToastOnError) {
      const firstError = errorEntries[0][1] as any;
      const message = firstError?.message || 'Erreur de validation du formulaire';
      
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }

    // Scroll to first error field
    if (scrollToFirstError) {
      const firstErrorField = errorEntries[0][0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Focus the field if it's focusable
        if (element instanceof HTMLInputElement || 
            element instanceof HTMLTextAreaElement || 
            element instanceof HTMLSelectElement) {
          setTimeout(() => element.focus(), 100);
        }
      }
    }
  }, [showToastOnError, scrollToFirstError]);

  const getFieldErrorMessage = useCallback((fieldName: keyof T, errors: FieldErrors<T>): string | undefined => {
    const error = errors[fieldName] as any;
    return error?.message || undefined;
  }, []);

  const hasFieldError = useCallback((fieldName: keyof T, errors: FieldErrors<T>): boolean => {
    return !!errors[fieldName];
  }, []);

  const getFieldErrorClass = useCallback((fieldName: keyof T, errors: FieldErrors<T>, baseClass: string = ""): string => {
    const hasError = hasFieldError(fieldName, errors);
    const errorClass = hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";
    return `${baseClass} ${errorClass}`.trim();
  }, [hasFieldError]);

  return {
    handleFormErrors,
    getFieldErrorMessage,
    hasFieldError,
    getFieldErrorClass,
  };
};

export default useFormValidation;
