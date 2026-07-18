import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-200",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:outline-slate-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  children,
  className,
  disabled,
  fullWidth = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium shadow-sm",
        "transition-all duration-200 ease-out active:scale-95",
        "disabled:cursor-not-allowed disabled:opacity-80 disabled:active:scale-100",
        fullWidth && "w-full",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
