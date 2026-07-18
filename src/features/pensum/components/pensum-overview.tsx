"use client";

import {
  Building2,
  ChevronDown,
  Database,
  FolderTree,
  GraduationCap,
  LayoutGrid,
  ListTree,
  MapPinned,
  Rows3,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { StudyPlanImportForm } from "@/features/pensum/components/study-plan-import-form";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

type StudyPlanOverviewItem = {
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
      outcomes: unknown;
      title: string;
    }>;
    name: string;
    order: number;
  }>;
  sourceType: string;
  structureType: string;
};

type PensumOverviewProps = {
  studyPlans: StudyPlanOverviewItem[];
};

type ViewMode = "cards" | "table";
type StructureFilter = "ALL" | "LEVELS" | "TRIMESTERS" | "CUSTOM";
type SourceFilter = "ALL" | "MANUAL" | "PRESET" | "JSON" | "XLSX" | "MARKDOWN";

type GroupedStudyPlans = {
  institutionId: string;
  institutionName: string;
  plans: StudyPlanOverviewItem[];
};

const ALL_TAB = "all";

function getStructureLabel(structureType: string) {
  if (structureType === "LEVELS") {
    return "Niveles";
  }

  if (structureType === "TRIMESTERS") {
    return "Trimestres";
  }

  return "Personalizado";
}

function getSourceLabel(sourceType: string) {
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

function getStructureTone(structureType: string) {
  if (structureType === "TRIMESTERS") {
    return {
      accent: "bg-emerald-500",
      soft: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    };
  }

  if (structureType === "LEVELS") {
    return {
      accent: "bg-blue-500",
      soft: "border-blue-100 bg-blue-50/70 text-blue-700",
    };
  }

  return {
    accent: "bg-amber-500",
    soft: "border-amber-100 bg-amber-50/70 text-amber-700",
  };
}

function getSourceTone(sourceType: string) {
  if (sourceType === "PRESET") {
    return "border-violet-100 bg-violet-50/80 text-violet-700";
  }

  if (sourceType === "JSON") {
    return "border-sky-100 bg-sky-50/80 text-sky-700";
  }

  if (sourceType === "XLSX") {
    return "border-emerald-100 bg-emerald-50/80 text-emerald-700";
  }

  if (sourceType === "MARKDOWN") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
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

function ToolbarSelect({
  children,
  className,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        aria-label={label}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 ease-out",
          "focus-visible:border-blue-200 focus-visible:bg-white",
          className,
        )}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </div>
  );
}

function ToolbarSearchField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">Buscar</span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          aria-label="Buscar planes de estudio"
          className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-blue-200 focus-visible:bg-white focus-visible:outline-none"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por plan, sede, base o contenido"
          type="text"
          value={value}
        />
      </div>
    </div>
  );
}

function PeriodAccordionCard({
  period,
}: {
  period: StudyPlanOverviewItem["periods"][number];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleItems = period.items.slice(0, 4);
  const remainingItems = period.items.length - visibleItems.length;

  return (
    <article className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4">
      <button
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">{period.name}</h4>
          <p className="mt-1 text-xs text-slate-500">
            {isOpen ? "Ocultar materias registradas" : "Desplegar materias registradas"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
            {period.items.length} items
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200 ease-out",
                isOpen && "rotate-180",
              )}
            />
          </span>
        </div>
      </button>

      {isOpen ? (
        <div className="mt-3 space-y-2">
          {visibleItems.map((item) => {
            const outcomesCount = getNormalizedOutcomes(item.outcomes).length;

            return (
              <div
                className="flex items-start justify-between gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200"
                key={item.id}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    {outcomesCount > 0 ? (
                      <ListTree className="h-4 w-4" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">
                        {item.itemType}
                      </span>
                      {item.code ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">
                          {item.code}
                        </span>
                      ) : null}
                      {outcomesCount > 0 ? (
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700 ring-1 ring-blue-100">
                          {outcomesCount} resultados
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {remainingItems > 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-3 text-xs text-slate-500">
              +{remainingItems} elementos adicionales en este periodo
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function PensumOverview({ studyPlans }: PensumOverviewProps) {
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("ALL");
  const [structureFilter, setStructureFilter] =
    useState<StructureFilter>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const institutions = useMemo(() => {
    const institutionMap = new Map<string, { id: string; name: string }>();

    studyPlans.forEach((plan) => {
      institutionMap.set(plan.location.institution.id, {
        id: plan.location.institution.id,
        name: plan.location.institution.name,
      });
    });

    return Array.from(institutionMap.values()).sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [studyPlans]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const selectedInstitutionId = activeTab === ALL_TAB ? null : activeTab;
  const hasFiltersApplied =
    normalizedSearchQuery.length > 0 ||
    sourceFilter !== "ALL" ||
    structureFilter !== "ALL";

  const groupedStudyPlans = useMemo(() => {
    const filteredPlans = studyPlans.filter((plan) => {
      const matchesTab =
        selectedInstitutionId === null ||
        plan.location.institution.id === selectedInstitutionId;
      const matchesSource =
        sourceFilter === "ALL" || plan.sourceType === sourceFilter;
      const matchesStructure =
        structureFilter === "ALL" || plan.structureType === structureFilter;

      const searchableContent = [
        plan.aliasName,
        plan.coreContent.name,
        plan.location.name,
        plan.location.institution.name,
        ...plan.periods.map((period) => period.name),
        ...plan.periods.flatMap((period) => period.items.map((item) => item.title)),
        ...plan.periods.flatMap((period) =>
          period.items.flatMap((item) =>
            getNormalizedOutcomes(item.outcomes).map(
              (outcome) => `${outcome.code ?? ""} ${outcome.description}`,
            ),
          ),
        ),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        searchableContent.includes(normalizedSearchQuery);

      return matchesTab && matchesSource && matchesStructure && matchesSearch;
    });

    const groupedMap = new Map<string, GroupedStudyPlans>();

    filteredPlans.forEach((plan) => {
      const institutionId = plan.location.institution.id;
      const currentGroup = groupedMap.get(institutionId);

      if (currentGroup) {
        currentGroup.plans.push(plan);
        return;
      }

      groupedMap.set(institutionId, {
        institutionId,
        institutionName: plan.location.institution.name,
        plans: [plan],
      });
    });

    return Array.from(groupedMap.values())
      .map((group) => ({
        ...group,
        plans: group.plans.sort((first, second) => {
          const locationCompare = first.location.name.localeCompare(second.location.name);

          if (locationCompare !== 0) {
            return locationCompare;
          }

          return first.aliasName.localeCompare(second.aliasName);
        }),
      }))
      .sort((first, second) =>
        first.institutionName.localeCompare(second.institutionName),
      );
  }, [
    normalizedSearchQuery,
    selectedInstitutionId,
    sourceFilter,
    structureFilter,
    studyPlans,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSourceFilter("ALL");
    setStructureFilter("ALL");
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
                activeTab === ALL_TAB
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100",
              )}
              onClick={() => setActiveTab(ALL_TAB)}
              type="button"
            >
              Todas
            </button>
            {institutions.map((institution, index) => (
              <button
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
                  activeTab === institution.id
                    ? index % 2 === 0
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-emerald-600 text-white shadow-sm"
                    : index % 2 === 0
                      ? "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50 hover:text-emerald-700",
                )}
                key={institution.id}
                onClick={() => setActiveTab(institution.id)}
                type="button"
              >
                {institution.name}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                viewMode === "cards"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
              onClick={() => setViewMode("cards")}
              type="button"
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </button>
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                viewMode === "table"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
              onClick={() => setViewMode("table")}
              type="button"
            >
              <Rows3 className="h-4 w-4" />
              Tabla
            </button>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto] xl:items-end">
          <div className="min-w-0">
            <ToolbarSearchField
              onChange={(value) => setSearchQuery(value)}
              value={searchQuery}
            />
          </div>

          <ToolbarSelect
            className="xl:w-[220px]"
            label="Estructura"
            onChange={(value) => setStructureFilter(value as StructureFilter)}
            value={structureFilter}
          >
            <option value="ALL">Toda estructura</option>
            <option value="LEVELS">Niveles</option>
            <option value="TRIMESTERS">Trimestres</option>
            <option value="CUSTOM">Personalizado</option>
          </ToolbarSelect>

          <ToolbarSelect
            className="xl:w-[220px]"
            label="Origen"
            onChange={(value) => setSourceFilter(value as SourceFilter)}
            value={sourceFilter}
          >
            <option value="ALL">Todo origen</option>
            <option value="PRESET">Preset</option>
            <option value="JSON">JSON</option>
            <option value="XLSX">Excel</option>
            <option value="MARKDOWN">Markdown</option>
            <option value="MANUAL">Manual</option>
          </ToolbarSelect>

          <Button
            className="xl:min-w-[148px]"
            onClick={handleResetFilters}
            type="button"
            variant="secondary"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="border-b border-slate-200 bg-slate-50/50 p-4 sm:p-5 xl:border-b-0 xl:border-r">
          <StudyPlanImportForm />
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-6">
            {groupedStudyPlans.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                {hasFiltersApplied
                  ? "No hay planes que coincidan con tu busqueda o filtros."
                  : "Sin planes de estudio registrados."}
              </div>
            ) : (
              groupedStudyPlans.map((group) => (
                <section
                  className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50/40 p-4 sm:p-5"
                  key={group.institutionId}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    {group.institutionName}
                  </div>

                  {viewMode === "cards" ? (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {group.plans.map((plan) => {
                        const structureTone = getStructureTone(plan.structureType);
                        const usesWideLayout = plan.structureType === "TRIMESTERS";

                        return (
                          <article
                            className={cn(
                              "rounded-[22px] border border-slate-200 bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(15,23,42,0.06)]",
                              usesWideLayout && "xl:col-span-2",
                            )}
                            key={plan.id}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn("h-2 w-2 rounded-full", structureTone.accent)}
                                  />
                                  <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                                    {plan.aliasName}
                                  </h3>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">
                                  {plan.location.name}
                                </p>
                              </div>

                              <span
                                className={cn(
                                  "rounded-full border px-2.5 py-1 text-xs font-medium",
                                  structureTone.soft,
                                )}
                              >
                                {getStructureLabel(plan.structureType)}
                              </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                                <GraduationCap className="h-3.5 w-3.5" />
                                {plan.coreContent.name}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full border px-2.5 py-1",
                                  getSourceTone(plan.sourceType),
                                )}
                              >
                                {getSourceLabel(plan.sourceType)}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                                {plan._count.periods} periodos
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                                {plan._count.cohorts} cohortes
                              </span>
                            </div>

                            <div
                              className={cn(
                                "mt-4 space-y-3",
                                usesWideLayout && "w-full",
                              )}
                            >
                              {plan.periods.map((period) => (
                                <PeriodAccordionCard key={period.id} period={period} />
                              ))}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[20px] border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50 text-left text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-medium">Plan</th>
                            <th className="px-4 py-3 font-medium">Sede</th>
                            <th className="px-4 py-3 font-medium">Base</th>
                            <th className="px-4 py-3 font-medium">Estructura</th>
                            <th className="px-4 py-3 font-medium">Origen</th>
                            <th className="px-4 py-3 font-medium">Periodos</th>
                            <th className="px-4 py-3 font-medium">Cohortes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {group.plans.map((plan) => (
                            <tr
                              className="transition-colors duration-200 ease-out hover:bg-slate-50/80"
                              key={plan.id}
                            >
                              <td className="px-4 py-3 font-medium text-slate-900">
                                <div className="flex items-center gap-2">
                                  <FolderTree className="h-4 w-4 text-blue-600" />
                                  {plan.aliasName}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                <div className="flex items-center gap-2">
                                  <MapPinned className="h-4 w-4 text-emerald-600" />
                                  {plan.location.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {plan.coreContent.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {getStructureLabel(plan.structureType)}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {getSourceLabel(plan.sourceType)}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {plan._count.periods}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {plan._count.cohorts}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
