import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type AuthEntryShellProps = {
  accent?: "blue" | "emerald";
  children?: ReactNode;
  description?: string;
  eyebrow: string;
  title: string;
};

export function AuthEntryShell({
  accent = "blue",
  children,
  description,
  eyebrow,
  title,
}: AuthEntryShellProps) {
  const accentPill =
    accent === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  const accentCard =
    accent === "emerald"
      ? "border-emerald-200/80"
      : "border-blue-200/80";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute left-[-4rem] top-20 h-64 w-64 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="animate-float-medium absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-emerald-100/65 blur-3xl" />
      </div>

      <section className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="glass-panel w-full max-w-xl rounded-[34px] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] shadow-sm",
                accentPill,
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-500" />
              {eyebrow}
            </div>

            <Link
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 ease-out hover:bg-slate-50 active:scale-95"
              href="/"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>

          <div
            className={cn(
              "mt-6 rounded-[28px] border bg-white p-5 shadow-sm sm:p-6",
              accentCard,
            )}
          >
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                {description}
              </p>
            ) : null}

            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
