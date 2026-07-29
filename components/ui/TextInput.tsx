import type { InputHTMLAttributes } from "react";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ className = "", type = "text", ...props }: TextInputProps) {
  return <input type={type} className={`ds-input ${className}`} {...props} />;
}
