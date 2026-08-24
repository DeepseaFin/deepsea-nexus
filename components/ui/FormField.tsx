import type { ReactNode } from "react";

export interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly children: ReactNode;
}

export default function FormField({ id, label, hint, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="ds-field-label">
        {label}
      </label>
      {children}
      {error ? <p className="ds-field-error">{error}</p> : hint ? <p className="ds-field-hint">{hint}</p> : null}
    </div>
  );
}
