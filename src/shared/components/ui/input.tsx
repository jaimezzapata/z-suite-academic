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
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      ) : null}

      <input
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-900 shadow-sm",
          "placeholder:text-slate-400 focus-visible:border-blue-200 focus-visible:bg-white focus-visible:outline-none",
          error && "border-rose-200 bg-rose-50/50",
          className,
        )}
        id={inputId}
        {...props}
      />

      {error ? (
        <span className="text-xs text-rose-600" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
