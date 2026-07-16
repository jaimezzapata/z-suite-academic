import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

type AuthEntryShellProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function AuthEntryShell({
  description,
  eyebrow,
  title,
}: AuthEntryShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute left-[-4rem] top-20 h-64 w-64 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="animate-float-medium absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-emerald-100/65 blur-3xl" />
      </div>

      <section className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="glass-panel w-full max-w-2xl rounded-[36px] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-400 shadow-sm">
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

          <div className="mt-10 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
