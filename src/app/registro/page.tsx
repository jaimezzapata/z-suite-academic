import { AuthEntryShell } from "@/features/auth/components/auth-entry-shell";

export default function RegisterPage() {
  return (
    <AuthEntryShell
      description="Crea tu acceso para empezar a organizar instituciones, grupos, calendario y materiales academicos desde una sola plataforma."
      eyebrow="Registro"
      title="Crea tu cuenta"
    />
  );
}
