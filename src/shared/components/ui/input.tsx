import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

export function Input({
  className,
  error,
  id,
  label,
  ...props
}: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2" htmlFor={id}>
      {label ? (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      ) : null}

      <input
        className={cn(
          "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:outline-none",
          error && "border-rose-300 bg-rose-50/40",
          className,
        )}
        id={id}
        {...props}
      />

      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
