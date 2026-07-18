"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  buildStudyPlanWorkbookTemplate,
  parseStudyPlansFromFile,
  studyPlanJsonTemplate,
  studyPlanMarkdownTemplate,
} from "@/features/pensum/lib/study-plan-import-utils";
import { pensumApi, PensumApiError } from "@/features/pensum/services/pensum-api";
import type { StudyPlanImportPayload } from "@/features/pensum/validations/study-plan-import-schema";

type DownloadableTemplateFormat = "json" | "markdown" | "xlsx";

function downloadBlob(content: BlobPart, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function useStudyPlanImport() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parsedPlans, setParsedPlans] = useState<StudyPlanImportPayload[]>([]);
  const router = useRouter();

  const previewSummary = useMemo(() => {
    const periods = parsedPlans.reduce((total, plan) => total + plan.periods.length, 0);
    const items = parsedPlans.reduce(
      (total, plan) =>
        total +
        plan.periods.reduce((periodTotal, period) => periodTotal + period.items.length, 0),
      0,
    );

    return {
      items,
      periods,
      plans: parsedPlans.length,
    };
  }, [parsedPlans]);

  const handleFileSelection = async (file: File | null) => {
    if (!file) {
      setFileName(null);
      setParsedPlans([]);
      return;
    }

    setIsParsingFile(true);

    try {
      const plans = await parseStudyPlansFromFile(file);
      setFileName(file.name);
      setParsedPlans(plans);

      toast.success("Archivo analizado correctamente.", {
        description: `Se detectaron ${plans.length} plan(es) listos para importar.`,
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Revisa el archivo e intenta nuevamente.";

      setFileName(file.name);
      setParsedPlans([]);
      toast.error("No fue posible leer el archivo.", {
        description,
      });
    } finally {
      setIsParsingFile(false);
    }
  };

  const importParsedPlans = async () => {
    if (parsedPlans.length === 0) {
      toast.warning("No hay planes listos para importar.", {
        description: "Carga primero un archivo valido.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await pensumApi.importStudyPlans(parsedPlans);
      toast.success("Planes importados correctamente.", {
        description: `Se guardaron ${parsedPlans.length} plan(es) de estudio.`,
      });
      setFileName(null);
      setParsedPlans([]);
      router.refresh();
    } catch (error) {
      const description =
        error instanceof PensumApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible importar los planes.", {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const importPresetPlans = async () => {
    setIsSubmitting(true);

    try {
      await pensumApi.importPresetStudyPlans();
      toast.success("Planes base cargados correctamente.", {
        description: "CESDE Medellin, CESDE Bello y SENA ya quedaron disponibles.",
      });
      router.refresh();
    } catch (error) {
      const description =
        error instanceof PensumApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible cargar los presets.", {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = (format: DownloadableTemplateFormat) => {
    if (format === "json") {
      downloadBlob(
        studyPlanJsonTemplate,
        "plantilla-pensum.json",
        "application/json;charset=utf-8",
      );
      return;
    }

    if (format === "markdown") {
      downloadBlob(
        studyPlanMarkdownTemplate,
        "plantilla-pensum.md",
        "text/markdown;charset=utf-8",
      );
      return;
    }

    downloadBlob(
      buildStudyPlanWorkbookTemplate(),
      "plantilla-pensum.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };

  return {
    downloadTemplate,
    fileName,
    handleFileSelection,
    importParsedPlans,
    importPresetPlans,
    isParsingFile,
    isSubmitting,
    parsedPlans,
    previewSummary,
    resetParsedPlans: () => {
      setFileName(null);
      setParsedPlans([]);
    },
  };
}
