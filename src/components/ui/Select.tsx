import type { SelectHTMLAttributes } from "react";
import FormField, { controlClass, fieldA11y } from "./FormField";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  placeholder: string;
  options: { value: string | number; label: string }[];
  error?: string | null;
}

export default function Select({ label, id, placeholder, options, error, required, ...props }: SelectProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <select
        id={id}
        required={required}
        className={`bg-white ${controlClass(error)}`}
        {...fieldA11y(id, error)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
