import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { cache } from "react";
import { authOptions } from "@/features/auth/server/auth-options";

export type SessionUser = {
  email?: string | null;
  id: string;
  image?: string | null;
  name?: string | null;
};

const getCachedSession = cache(() => getServerSession(authOptions));

export async function getSessionUser() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    return null;
  }

  return session.user as SessionUser;
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireSessionUserId() {
  const user = await requireSessionUser();

  return user.id;
}
