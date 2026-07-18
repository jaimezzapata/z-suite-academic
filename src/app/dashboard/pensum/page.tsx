import { requireSessionUserId } from "@/features/auth/server/session";
import { ModulePageShell } from "@/features/dashboard/components/module-page-shell";
import { PensumOverview } from "@/features/pensum/components/pensum-overview";
import {
  importPresetStudyPlansForUser,
  listStudyPlansByUserId,
} from "@/features/pensum/server/study-plans";

export default async function PensumPage() {
  const userId = await requireSessionUserId();
  let studyPlans = await listStudyPlansByUserId(userId);

  if (studyPlans.length === 0) {
    await importPresetStudyPlansForUser(userId);
    studyPlans = await listStudyPlansByUserId(userId);
  }

  return (
    <ModulePageShell
      description="Centraliza la carga, importacion y consulta de planes de estudio por institucion y sede. El modulo soporta presets base y archivos estandar en JSON, Markdown y Excel."
      eyebrow="Modulo"
      title="Pensum"
    >
      <PensumOverview studyPlans={studyPlans} />
    </ModulePageShell>
  );
}
