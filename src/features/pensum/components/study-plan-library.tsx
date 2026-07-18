type StudyPlanLibraryItem = {
  _count: {
    cohorts: number;
    periods: number;
  };
  aliasName: string;
  coreContent: {
    id: string;
    name: string;
  };
  id: string;
  location: {
    id: string;
    institution: {
      id: string;
      name: string;
    };
    name: string;
  };
  periods: Array<{
    id: string;
    items: Array<{
      code: string | null;
      description: string | null;
      id: string;
      itemType: string;
      order: number;
      outcomes: unknown;
      title: string;
    }>;
    name: string;
    order: number;
  }>;
  sourceType: string;
  structureType: string;
};

type StudyPlanLibraryProps = {
  studyPlans: StudyPlanLibraryItem[];
};

function getStructureLabel(structureType: StudyPlanLibraryItem["structureType"]) {
  if (structureType === "LEVELS") {
    return "Niveles";
  }

  if (structureType === "TRIMESTERS") {
    return "Trimestres";
  }

  return "Personalizado";
}

function getSourceLabel(sourceType: StudyPlanLibraryItem["sourceType"]) {
  switch (sourceType) {
    case "PRESET":
      return "Preset";
    case "JSON":
      return "JSON";
    case "XLSX":
      return "Excel";
    case "MARKDOWN":
      return "Markdown";
    default:
      return "Manual";
  }
}

function getNormalizedOutcomes(outcomes: unknown) {
  if (!Array.isArray(outcomes)) {
    return [];
  }

  return outcomes
    .map((outcome) => {
      if (!outcome || typeof outcome !== "object") {
        return null;
      }

      const normalizedOutcome = outcome as {
        code?: unknown;
        description?: unknown;
      };

      if (typeof normalizedOutcome.description !== "string") {
        return null;
      }

      return {
        code:
          typeof normalizedOutcome.code === "string"
            ? normalizedOutcome.code
            : null,
        description: normalizedOutcome.description,
      };
    })
    .filter((outcome): outcome is { code: string | null; description: string } => outcome !== null);
}

function StudyPlanItemCard({
  item,
}: {
  item: StudyPlanLibraryItem["periods"][number]["items"][number];
}) {
  const normalizedOutcomes = getNormalizedOutcomes(item.outcomes);

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h5 className="text-sm font-semibold text-slate-900">{item.title}</h5>
          {item.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
          <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
            {item.itemType}
          </span>
          {item.code ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
              {item.code}
            </span>
          ) : null}
        </div>
      </div>

      {normalizedOutcomes.length > 0 ? (
        <div className="mt-4 space-y-3">
          {normalizedOutcomes.map((outcome, index) => (
            <div
              className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
              key={`${item.id}-${outcome.code ?? "outcome"}-${index}`}
            >
              {outcome.code ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  {outcome.code}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function StudyPlanLibrary({ studyPlans }: StudyPlanLibraryProps) {
  if (studyPlans.length === 0) {
    return (
      <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
        <div className="rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-700">
            Aun no tienes planes de estudio cargados.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Importa un archivo estandar o usa la carga base para registrar los
            primeros planes de CESDE y SENA.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {studyPlans.map((studyPlan) => (
        <article
          className="rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-200"
          key={studyPlan.id}
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                {studyPlan.location.institution.name} - {studyPlan.location.name}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {studyPlan.aliasName}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Contenido base: {studyPlan.coreContent.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                {getStructureLabel(studyPlan.structureType)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                {getSourceLabel(studyPlan.sourceType)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                {studyPlan._count.periods} periodos
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 ring-1 ring-slate-200">
                {studyPlan._count.cohorts} cohortes
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {studyPlan.periods.map((period) => (
              <section
                className="rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-200"
                key={period.id}
              >
                <h4 className="text-lg font-semibold text-slate-900">{period.name}</h4>

                <div className="mt-4 space-y-4">
                  {period.items.map((item) => (
                    <StudyPlanItemCard item={item} key={item.id} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
