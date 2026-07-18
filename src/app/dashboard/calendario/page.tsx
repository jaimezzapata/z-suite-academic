import { ModulePageShell } from "@/features/dashboard/components/module-page-shell";

export default function CalendarPage() {
  return (
    <ModulePageShell
      description="Este espacio queda preparado para la agenda academica, la gestion de recesos y la programacion de recuperaciones."
      eyebrow="Modulo"
      title="Calendario"
    >
      <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
        <p className="text-sm leading-6 text-slate-600">
          La navegacion lateral se mantiene fija para que el cambio entre
          modulos sea inmediato en cualquier pantalla.
        </p>
      </div>
    </ModulePageShell>
  );
}
