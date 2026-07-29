import UIButton, { type UIButtonProps } from "@/components/ui/Button";

type ButtonProps = Omit<UIButtonProps, "size"> & {
  readonly variant?: "primary" | "secondary";
};

export default function Button({ children, variant = "primary", ...props }: ButtonProps) {
  return (
    <UIButton variant={variant} size="lg" {...props}>
      {children}
    </UIButton>
  );
}