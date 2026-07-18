import { ModulePageShell } from "@/features/dashboard/components/module-page-shell";

export default function SettingsPage() {
  return (
    <ModulePageShell
      description="Este modulo concentrara conexiones, preferencias visuales y configuraciones de cuenta dentro de una experiencia unificada."
      eyebrow="Modulo"
      title="Configuracion"
    >
      <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
        <p className="text-sm leading-6 text-slate-600">
          La informacion del usuario autenticado se mantiene visible en el panel
          lateral para reforzar contexto y control de sesion.
        </p>
      </div>
    </ModulePageShell>
  );
}
