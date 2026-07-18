"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data, status, update } = useSession();

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    session: data ?? null,
    status,
    update,
    user: data?.user ?? null,
    userId: data?.user?.id ?? null,
  };
}
