import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/cn";

type LinkButtonVariant = "primary" | "secondary" | "ghost";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: LinkButtonVariant;
};

const variantClasses: Record<LinkButtonVariant, string> = {
  primary:
    "bg-slate-900 text-slate-50 hover:bg-slate-800 focus-visible:outline-slate-400",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-300",
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
        "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium shadow-sm",
        "transition-all duration-200 ease-out active:scale-95",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

