import { redirect } from "next/navigation";
import { AuthEntryShell } from "@/features/auth/components/auth-entry-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSessionUser } from "@/features/auth/server/session";

export default async function RegisterPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthEntryShell
      accent="emerald"
      eyebrow="Registro"
      title="Crea tu cuenta"
    >
      <RegisterForm />
    </AuthEntryShell>
  );
}
