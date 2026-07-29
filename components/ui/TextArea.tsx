import type { TextareaHTMLAttributes } from "react";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({ className = "", rows = 5, ...props }: TextAreaProps) {
  return <textarea rows={rows} className={`ds-input ${className}`} {...props} />;
}
