import React from "react";
import { FieldError } from "react-hook-form";
import Select, {
  ControlProps,
  CSSObjectWithLabel,
  GroupBase,
  OptionProps,
  Props as SelectProps,
  StylesConfig,
} from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface SelectInputProps<IsMulti extends boolean = false>
  extends Omit<SelectProps<Option, IsMulti>, "options" | "onChange"> {
  options: Option[];
  placeholder?: string;
  error?: FieldError;
  label?: string;
  required?: boolean;
  isMulti?: IsMulti;
  onChange?: (value: IsMulti extends true ? Option[] : Option | null) => void;
}

const SelectInput = React.forwardRef<HTMLDivElement, SelectInputProps<any>>(
  ({ options, placeholder, error, label, required, isMulti, onChange, ...rest }, ref) => {
    
    // Wrapper pour gérer la conversion des types
    const handleChange = (newValue: any) => {
      if (onChange) {
        if (isMulti) {
          // Mode multi : convertir readonly Option[] en Option[]
          onChange(newValue ? [...newValue] : []);
        } else {
          // Mode simple : passer directement la valeur
          onChange(newValue);
        }
      }
    };
    // Styles pour react-select utilisant ton thème CSS
    const customStyles: StylesConfig<Option, any> = {
      control: (
        provided: CSSObjectWithLabel,
        state: ControlProps<Option, any, GroupBase<Option>>
      ) => ({
        ...provided,
        backgroundColor: "hsl(var(--input))",
        color: "hsl(var(--foreground))",
        borderColor: state.isFocused
          ? "hsl(var(--ring))"
          : "hsl(var(--border))",
        boxShadow: state.isFocused ? `0 0 0 2px hsl(var(--ring))` : "none",
        "&:hover": {
          borderColor: state.isFocused
            ? "hsl(var(--ring))"
            : "hsl(var(--border))",
        },
        borderRadius: "var(--radius)",
        padding: "2px",
      }),
      menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        borderRadius: "var(--radius)",
      }),
      option: (
        provided: CSSObjectWithLabel,
        state: OptionProps<Option, any, GroupBase<Option>>
      ) => ({
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
      singleValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: "hsl(var(--foreground))",
      }),
      placeholder: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
      }),
      indicatorSeparator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: "hsl(var(--border))",
      }),
      dropdownIndicator: (provided: CSSObjectWithLabel) => ({
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
          isMulti={isMulti}
          onChange={handleChange}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive dark:text-destructive">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";
export default SelectInput;
