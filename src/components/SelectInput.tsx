import React from "react";
import { FieldError } from "react-hook-form";
import Select, { Props as SelectProps } from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface SelectInputProps extends Omit<SelectProps<Option, false>, "options"> {
  options: Option[];
  placeholder?: string;
  error?: FieldError;
  label?: string;
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = React.forwardRef<
  HTMLDivElement,
  SelectInputProps
>(({ options, placeholder, error, label, required, ...rest }, ref) => {
  // Styles pour react-select utilisant ton thème CSS
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--input))",
      color: "hsl(var(--foreground))",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
      boxShadow: state.isFocused ? `0 0 0 2px hsl(var(--ring))` : "none",
      "&:hover": {
        borderColor: state.isFocused
          ? "hsl(var(--ring))"
          : "hsl(var(--border))",
      },
      borderRadius: "var(--radius)",
      padding: "2px",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      borderRadius: "var(--radius)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : state.isFocused
        ? "hsl(var(--muted))"
        : "hsl(var(--background))",
      color: state.isSelected
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))",
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--border))",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
      "&:hover": { color: "hsl(var(--primary))" },
    }),
  };

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <Select
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix="react-select"
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive dark:text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
});

export default SelectInput;
