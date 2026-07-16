import { AuthEntryShell } from "@/features/auth/components/auth-entry-shell";

export default function LoginPage() {
  return (
    <AuthEntryShell
      description="Accede a tu espacio docente para gestionar grupos, calendario academico y recursos en un flujo unificado."
      eyebrow="Acceso"
      title="Ingresa a Z-Suite Academic"
    />
  );
}
