import type { SelectHTMLAttributes } from "react";

export interface SelectInputOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  readonly options: readonly SelectInputOption[];
  readonly placeholder?: string;
}

export default function SelectInput({
  options,
  placeholder,
  className = "",
  ...props
}: SelectInputProps) {
  return (
    <select className={`ds-input ${className}`} {...props}>
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
