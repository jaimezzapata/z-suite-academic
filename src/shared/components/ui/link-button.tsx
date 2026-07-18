import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type LinkButtonVariant = "primary" | "secondary" | "ghost";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: LinkButtonVariant;
};

const variantClasses: Record<LinkButtonVariant, string> = {
  primary:
    "bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-200",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:outline-slate-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-300",
};

export function LinkButton({
  className,
  variant = "secondary",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium shadow-sm",
        "transition-all duration-200 ease-out active:scale-95",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
