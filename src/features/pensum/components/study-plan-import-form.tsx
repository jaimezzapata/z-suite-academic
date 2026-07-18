"use client";

import { FileSpreadsheet, FileText, FileUp, FolderInput, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { useStudyPlanImport } from "@/features/pensum/hooks/use-study-plan-import";

const supportedFormats = [
  {
    description: "Formato canonico o timeline SENA.",
    icon: FileText,
    key: "json" as const,
    label: "Plantilla JSON",
  },
  {
    description: "Titulos y listas por periodos.",
    icon: FolderInput,
    key: "markdown" as const,
    label: "Plantilla MD",
  },
  {
    description: "Hoja plan_items con columnas estandar.",
    icon: FileSpreadsheet,
    key: "xlsx" as const,
    label: "Plantilla Excel",
  },
];

export function StudyPlanImportForm() {
  const {
    downloadTemplate,
    fileName,
    handleFileSelection,
    importParsedPlans,
    importPresetPlans,
    isParsingFile,
    isSubmitting,
    parsedPlans,
    previewSummary,
    resetParsedPlans,
  } = useStudyPlanImport();

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-blue-100 bg-blue-50/70 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          Carga inicial
        </div>
        <p className="text-sm leading-6 text-slate-600">
          Precarga CESDE y SENA o descarga las plantillas estandar para futuros
          planes.
        </p>
        <Button
          className="mt-4 w-full"
          disabled={isSubmitting}
          onClick={() => void importPresetPlans()}
          type="button"
        >
          Cargar presets base
        </Button>
      </div>

      <div className="grid gap-3">
        {supportedFormats.map((format) => {
          const Icon = format.icon;

          return (
            <article
              className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
              key={format.key}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-slate-900">
                    {format.label}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {format.description}
                  </p>
                </div>

                <Button
                  className="shrink-0"
                  onClick={() => downloadTemplate(format.key)}
                  type="button"
                  variant="secondary"
                >
                  Descargar
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
          <FileUp className="h-4 w-4" />
          Importar archivo
        </div>

        <div className="grid gap-4">
          <label
            className={cn(
              "flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-white px-5 py-8 text-center transition-colors duration-200 hover:border-emerald-300 hover:bg-emerald-50/60",
              isParsingFile && "pointer-events-none opacity-70",
            )}
          >
            <input
              accept=".json,.md,.markdown,.txt,.xlsx,.xls"
              className="sr-only"
              disabled={isParsingFile || isSubmitting}
              onChange={(event) =>
                void handleFileSelection(event.target.files?.[0] ?? null)
              }
              type="file"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <FileUp className="h-5 w-5" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900">
              {isParsingFile ? "Analizando archivo..." : "Selecciona un archivo"}
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Soporta `.json`, `.md`, `.markdown`, `.txt`, `.xlsx` y `.xls`.
            </p>
            {fileName ? (
              <p className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                {fileName}
              </p>
            ) : null}
          </label>

          <div className="space-y-3">
            <div className="rounded-[20px] bg-white p-4 ring-1 ring-emerald-100">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">
                Vista previa
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    {previewSummary.plans}
                  </p>
                  <p className="text-sm text-slate-500">Planes</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    {previewSummary.periods}
                  </p>
                  <p className="text-sm text-slate-500">Periodos</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    {previewSummary.items}
                  </p>
                  <p className="text-sm text-slate-500">Items</p>
                </div>
              </div>
            </div>

            <Button
              disabled={isSubmitting || parsedPlans.length === 0}
              fullWidth
              onClick={() => void importParsedPlans()}
              type="button"
            >
              Importar archivo
            </Button>
            <Button
              disabled={parsedPlans.length === 0 || isSubmitting}
              fullWidth
              onClick={resetParsedPlans}
              type="button"
              variant="secondary"
            >
              Limpiar vista previa
            </Button>
          </div>
        </div>

        {parsedPlans.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {parsedPlans.map((plan) => (
              <article
                className="rounded-[20px] bg-white p-4 ring-1 ring-emerald-100"
                key={`${plan.aliasName}-${plan.locationName}`}
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  {plan.institutionName} - {plan.locationName}
                </p>
                <h4 className="mt-2 text-base font-semibold text-slate-900">
                  {plan.aliasName}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Base: {plan.coreContentName}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                    {plan.periods.length} periodos
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                    {plan.structureType}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
