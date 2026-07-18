import type { InstitutionFormValues } from "@/features/institutions/validations/institution-schema";

export class InstitutionsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "InstitutionsApiError";
  }
}

async function throwInstitutionApiError(response: Response, fallbackMessage: string) {
  let payloadMessage = fallbackMessage;
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
    // Keep the fallback message.
  }

  throw new InstitutionsApiError(payloadMessage, response.status, payloadCode);
}

async function requestInstitution(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  values?: InstitutionFormValues,
) {
  const response = await fetch(url, {
    body: values ? JSON.stringify(values) : undefined,
    headers: values
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    method,
  });

  if (!response.ok) {
    const fallbackMessage =
      method === "POST"
        ? "No fue posible guardar la institucion."
        : method === "PUT"
          ? "No fue posible actualizar la institucion."
          : "No fue posible eliminar la institucion.";

    await throwInstitutionApiError(response, fallbackMessage);
  }
}

export async function createInstitution(values: InstitutionFormValues) {
  await requestInstitution("/api/institutions", "POST", values);
}

export async function updateInstitution(
  institutionId: string,
  values: InstitutionFormValues,
) {
  await requestInstitution(`/api/institutions/${institutionId}`, "PUT", values);
}

export async function deleteInstitution(institutionId: string) {
  await requestInstitution(`/api/institutions/${institutionId}`, "DELETE");
}
