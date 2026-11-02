import type { InputHTMLAttributes } from "react";
import FormField, { controlClass, fieldA11y } from "./FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
}

export default function Input({ label, id, error, required, ...props }: InputProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <input
        id={id}
        required={required}
        className={controlClass(error)}
        {...fieldA11y(id, error)}
        {...props}
      />
    </FormField>
  );
}
