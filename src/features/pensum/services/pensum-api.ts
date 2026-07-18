import type { CoreContentFormValues } from "@/features/pensum/validations/core-content-schema";
import type {
  StudyPlanImportPayload,
  StudyPlanImportRequest,
} from "@/features/pensum/validations/study-plan-import-schema";
import type { StudyPlanFormValues } from "@/features/pensum/validations/study-plan-schema";

export class PensumApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "PensumApiError";
  }
}

async function postJson<T>(url: string, payload: T, defaultMessage: string) {
  const response = await fetch(url, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    let payloadMessage = defaultMessage;
    let payloadCode = "REQUEST_FAILED";

    try {
      const payload = (await response.json()) as {
        code?: string;
        message?: string;
      };

      if (payload.message) {
        payloadMessage = payload.message;
      }

      if (payload.code) {
        payloadCode = payload.code;
      }
    } catch {
      // Keep default message.
    }

    throw new PensumApiError(payloadMessage, response.status, payloadCode);
  }
}

export const pensumApi = {
  createCoreContent: async (values: CoreContentFormValues) => {
    await postJson(
      "/api/core-contents",
      values,
      "No fue posible guardar el contenido base.",
    );
  },
  createStudyPlan: async (values: StudyPlanFormValues) => {
    await postJson(
      "/api/study-plans",
      values,
      "No fue posible guardar el plan de estudio.",
    );
  },
  importPresetStudyPlans: async (presetSlugs?: string[]) => {
    await postJson<StudyPlanImportRequest>(
      "/api/study-plans/import",
      {
        mode: "preset",
        presetSlugs,
      },
      "No fue posible cargar los planes predefinidos.",
    );
  },
  importStudyPlans: async (plans: StudyPlanImportPayload[]) => {
    await postJson<StudyPlanImportRequest>(
      "/api/study-plans/import",
      {
        mode: "structured",
        plans,
      },
      "No fue posible importar los planes de estudio.",
    );
  },
};
