import Link from "next/link";
import type { ReactNode } from "react";
import {
  adminNavigationItems,
  type AdminNavigationItem,
} from "@/features/dashboard/config/admin-navigation";
import { cn } from "@/shared/utils/cn";

type ModulePageShellProps = {
  actions?: ReactNode;
  children?: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export function ModulePageShell({
  actions,
  children,
  description,
  eyebrow = "Administracion",
  title,
}: ModulePageShellProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-blue-700">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {description}
            </p>
          </div>

          {actions ? <div>{actions}</div> : null}
        </div>
      </div>

      {children}
    </section>
  );
}

export function ModuleNavigationGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {adminNavigationItems.map((item: AdminNavigationItem) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            className={cn(
              "group rounded-[28px] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200 transition-all duration-200 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(37,99,235,0.12)] hover:ring-blue-200",
            )}
            href={item.href}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors duration-200 group-hover:bg-blue-50 group-hover:text-blue-700">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
              {item.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
