import {
  ModuleNavigationGrid,
  ModulePageShell,
} from "@/features/dashboard/components/module-page-shell";

export default function DashboardPage() {
  return (
    <ModulePageShell
      description="Centraliza el acceso a los modulos principales del sistema desde una interfaz limpia, estable y siempre disponible."
      eyebrow="Inicio"
      title="Panel principal de administracion"
    >
      <ModuleNavigationGrid />
    </ModulePageShell>
  );
}
