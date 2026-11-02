import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  children: ReactNode;
}

/** Shared label + required marker + error message layout for form controls. */
export default function FormField({ id, label, required, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label
        htmlFor={id}
        className={`text-sm text-gray-700 ${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Props every control passes to its native element for accessible error state. */
export const fieldA11y = (id: string, error?: string | null) => ({
  "aria-invalid": !!error,
  "aria-describedby": error ? `${id}-error` : undefined,
});

export const controlClass = (error?: string | null) =>
  `rounded-md border px-3 py-2 text-gray-900 focus:outline-none ${
    error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
  }`;
