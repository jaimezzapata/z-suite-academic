import { GraduationCap } from "lucide-react";
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
  const accentClasses =
    accent === "emerald"
      ? {
          brand: "bg-emerald-700 text-white shadow-[0_18px_40px_rgba(4,120,87,0.20)]",
          title: "text-emerald-700",
          dot: "bg-emerald-200/70",
        }
      : {
          brand: "bg-blue-700 text-white shadow-[0_18px_40px_rgba(37,99,235,0.20)]",
          title: "text-blue-700",
          dot: "bg-blue-200/70",
        };

  return (
    <main className="relative h-dvh overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.22)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute left-[-8rem] top-[-4rem] h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="animate-float-medium absolute bottom-[-7rem] right-[-5rem] h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
      </div>

      <section className="relative flex h-dvh items-center justify-center px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-5 flex flex-col items-center text-center sm:mb-6">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl",
                accentClasses.brand,
              )}
            >
              <GraduationCap className="h-6 w-6" />
            </div>
            <p className="mt-4 text-[1.7rem] font-semibold tracking-tight text-slate-900 sm:text-3xl">
              z-suite-academic
            </p>
            <p className="mt-1.5 text-xs uppercase tracking-[0.22em] text-slate-400">
              {eyebrow}
            </p>
          </div>

          <div className="relative rounded-[28px] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-6">
            <div className="pointer-events-none absolute right-5 top-5 flex gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", accentClasses.dot)} />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-200/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-rose-200/80" />
            </div>

            <div className="mb-5 pr-12">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {description}
                </p>
              ) : null}
            </div>

            {children ? <div>{children}</div> : null}

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-center text-xs text-slate-400">
                Accede con tu cuenta para continuar.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-400 sm:mt-5">
            <span>Acceso seguro</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>UI minimalista</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>z-suite-academic</span>
          </div>
        </div>
      </section>
    </main>
  );
}
