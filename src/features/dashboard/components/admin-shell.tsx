"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import {
  adminNavigationItems,
  type AdminNavigationItem,
} from "@/features/dashboard/config/admin-navigation";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

type AdminShellProps = {
  children: ReactNode;
  user: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
  };
};

function getDisplayName(user: AdminShellProps["user"]) {
  return user.name?.trim() || user.email || "Usuario";
}

function getInitials(user: AdminShellProps["user"]) {
  const source = user.name?.trim() || user.email || "U";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isCurrentRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function NavigationLinks({
  collapsed,
  onNavigate,
  pathname,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  pathname: string;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1.5">
      {adminNavigationItems.map((item) => {
        const isActive = isCurrentRoute(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200 ease-out",
              "hover:bg-slate-100 hover:text-slate-900",
              isActive
                ? "bg-blue-700 text-white shadow-[0_16px_36px_rgba(37,99,235,0.22)]"
                : "text-slate-500",
              collapsed && "justify-center px-0",
            )}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700",
              )}
            />
            <div className={cn("min-w-0", collapsed && "hidden")}>
              <p className="font-medium">{item.label}</p>
              <p
                className={cn(
                  "mt-0.5 line-clamp-1 text-xs",
                  isActive ? "text-blue-100" : "text-slate-400",
                )}
              >
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarUser({
  collapsed,
  user,
}: {
  collapsed?: boolean;
  user: AdminShellProps["user"];
}) {
  const displayName = getDisplayName(user);
  const initials = getInitials(user);

  return (
    <div
      className={cn(
        "mt-auto overflow-hidden rounded-[22px] bg-white/90 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70",
        collapsed && "rounded-2xl p-2",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5",
          collapsed && "flex-col gap-2",
        )}
      >
        {user.image ? (
          <Image
            alt={displayName}
            className={cn(
              "h-10 w-10 rounded-[14px] object-cover ring-2 ring-white",
              collapsed && "h-11 w-11 rounded-xl",
            )}
            referrerPolicy="no-referrer"
            src={user.image}
            width={44}
            height={44}
          />
        ) : (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[14px] bg-blue-700 text-sm font-semibold text-white",
              collapsed && "h-11 w-11 rounded-xl",
            )}
          >
            {initials}
          </div>
        )}

        <div className={cn("min-w-0 flex-1", collapsed && "hidden")}>
          <p className="truncate text-sm font-semibold text-slate-900">
            {displayName}
          </p>
          <p className="truncate text-[11px] text-slate-500">{user.email}</p>
        </div>

        <SignOutButton
          className={cn(
            "h-8 rounded-[12px] px-2.5 text-[11px] font-medium text-slate-600 shadow-none",
            "bg-slate-100 hover:bg-slate-200",
            collapsed && "h-8 w-8 px-0",
          )}
          compact={collapsed}
        />
      </div>
    </div>
  );
}

function SidebarContent({
  collapsed = false,
  onNavigate,
  pathname,
  user,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  pathname: string;
  user: AdminShellProps["user"];
}) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div
        className={cn(
          "flex items-center gap-3 px-1",
          collapsed && "justify-center",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-lg font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.22)]">
          Z
        </div>
        <div className={cn("min-w-0", collapsed && "hidden")}>
          <p className="text-base font-semibold tracking-tight text-slate-900">
            z-suite-academic
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Panel administrativo
          </p>
        </div>
      </div>

      <NavigationLinks
        collapsed={collapsed}
        onNavigate={onNavigate}
        pathname={pathname}
      />

      <SidebarUser collapsed={collapsed} user={user} />
    </div>
  );
}

function MobileSidebar({
  onClose,
  open,
  pathname,
  user,
}: {
  onClose: () => void;
  open: boolean;
  pathname: string;
  user: AdminShellProps["user"];
}) {
  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-[320px] flex-col bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-center justify-end">
          <Button
            aria-label="Cerrar menu lateral"
            onClick={onClose}
            size="md"
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent onNavigate={onClose} pathname={pathname} user={user} />
      </aside>
    </>
  );
}

function DesktopSidebar({
  collapsed,
  onToggle,
  pathname,
  user,
}: {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
  user: AdminShellProps["user"];
}) {
  return (
    <>
      <div
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 ease-out lg:block",
          collapsed ? "w-[88px]" : "w-[320px]",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden bg-white px-4 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/80 transition-[width] duration-200 ease-out lg:flex lg:flex-col",
          collapsed ? "w-[88px]" : "w-[320px]",
        )}
      >
        <div className="mb-4 flex justify-end">
          <Button
            aria-label={collapsed ? "Expandir menu lateral" : "Contraer menu lateral"}
            onClick={onToggle}
            size="md"
            type="button"
            variant="ghost"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        <SidebarContent collapsed={collapsed} pathname={pathname} user={user} />
      </aside>
    </>
  );
}

function findCurrentSection(pathname: string) {
  return (
    adminNavigationItems.find((item) => isCurrentRoute(pathname, item.href)) ??
    adminNavigationItems[0]
  );
}

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentSection: AdminNavigationItem = useMemo(
    () => findCurrentSection(pathname),
    [pathname],
  );

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-900">
      <MobileSidebar
        onClose={() => setIsMobileOpen(false)}
        open={isMobileOpen}
        pathname={pathname}
        user={user}
      />

      <div className="mx-auto flex min-h-dvh w-full max-w-[1800px]">
        <DesktopSidebar
          collapsed={isDesktopCollapsed}
          onToggle={() => setIsDesktopCollapsed((current) => !current)}
          pathname={pathname}
          user={user}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 bg-slate-100/90 px-4 py-4 shadow-[inset_0_-1px_0_rgba(221,230,240,0.9)] backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-label="Mostrar menu lateral"
                className="lg:hidden"
                onClick={() => setIsMobileOpen(true)}
                size="md"
                type="button"
                variant="secondary"
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Panel principal
                </p>
                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {currentSection.label}
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
