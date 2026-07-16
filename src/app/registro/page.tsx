import { AuthEntryShell } from "@/features/auth/components/auth-entry-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthEntryShell
      accent="emerald"
      description="Crea tu acceso para empezar a organizar instituciones, grupos, calendario y materiales academicos desde una sola plataforma."
      eyebrow="Registro"
      title="Crea tu cuenta"
    >
      <RegisterForm />
    </AuthEntryShell>
  );
}
