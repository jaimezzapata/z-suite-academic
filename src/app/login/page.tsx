import { redirect } from "next/navigation";
import { AuthEntryShell } from "@/features/auth/components/auth-entry-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSessionUser } from "@/features/auth/server/session";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthEntryShell
      accent="blue"
      eyebrow="Acceso"
      title="Ingresa a Z-Suite Academic"
    >
      <LoginForm />
    </AuthEntryShell>
  );
}
