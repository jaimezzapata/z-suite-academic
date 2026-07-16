import { AuthEntryShell } from "@/features/auth/components/auth-entry-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
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
