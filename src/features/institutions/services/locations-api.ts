import type { LocationFormValues } from "@/features/institutions/validations/location-schema";

export class LocationsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "LocationsApiError";
  }
}

async function throwLocationApiError(response: Response, fallbackMessage: string) {
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

  throw new LocationsApiError(payloadMessage, response.status, payloadCode);
}

async function requestLocation(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  values?: LocationFormValues,
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
        ? "No fue posible guardar la sede."
        : method === "PUT"
          ? "No fue posible actualizar la sede."
          : "No fue posible eliminar la sede.";

    await throwLocationApiError(response, fallbackMessage);
  }
}

export async function createLocation(values: LocationFormValues) {
  await requestLocation("/api/locations", "POST", values);
}

export async function updateLocation(locationId: string, values: LocationFormValues) {
  await requestLocation(`/api/locations/${locationId}`, "PUT", values);
}

export async function deleteLocation(locationId: string) {
  await requestLocation(`/api/locations/${locationId}`, "DELETE");
}
