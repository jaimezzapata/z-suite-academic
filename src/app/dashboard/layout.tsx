import type { ReactNode } from "react";
import { requireSessionUser } from "@/features/auth/server/session";
import { AdminShell } from "@/features/dashboard/components/admin-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await requireSessionUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
