import { ModulePageShell } from "@/features/dashboard/components/module-page-shell";

export default function GroupsPage() {
  return (
    <ModulePageShell
      description="Aqui vivira la gestion de grupos activos, seguimiento diario, acceso a bitacoras y acciones clave del trabajo docente."
      eyebrow="Modulo"
      title="Mis grupos"
    >
      <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
        <p className="text-sm leading-6 text-slate-600">
          Este modulo queda listo para integrar datos reales desde base de datos
          sin comprometer la estructura del panel.
        </p>
      </div>
    </ModulePageShell>
  );
}
