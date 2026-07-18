import { prisma } from "@/shared/libs/prisma";
import type { LocationFormValues } from "@/features/institutions/validations/location-schema";

export class LocationMutationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INSTITUTION_NOT_FOUND"
      | "LOCATION_ALREADY_EXISTS"
      | "LOCATION_CREATE_FAILED"
      | "LOCATION_NOT_FOUND"
      | "LOCATION_UPDATE_FAILED"
      | "LOCATION_DELETE_FAILED",
    public readonly status: number,
  ) {
    super(message);
    this.name = "LocationMutationError";
  }
}

async function ensureLocationBelongsToUser(userId: string, locationId: string) {
  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!location) {
    throw new LocationMutationError(
      "La sede seleccionada no pertenece a tu cuenta.",
      "LOCATION_NOT_FOUND",
      404,
    );
  }
}

async function ensureInstitutionBelongsToUser(userId: string, institutionId: string) {
  const institution = await prisma.institution.findFirst({
    where: {
      id: institutionId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!institution) {
    throw new LocationMutationError(
      "La institucion seleccionada no pertenece a tu cuenta.",
      "INSTITUTION_NOT_FOUND",
      404,
    );
  }
}

async function ensureLocationNameIsAvailable(
  userId: string,
  institutionId: string,
  normalizedName: string,
  excludedLocationId?: string,
) {
  const existingLocation = await prisma.location.findFirst({
    where: {
      userId,
      institutionId,
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      ...(excludedLocationId
        ? {
            NOT: {
              id: excludedLocationId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  if (existingLocation) {
    throw new LocationMutationError(
      "Ya existe una sede con ese nombre dentro de la institucion.",
      "LOCATION_ALREADY_EXISTS",
      409,
    );
  }
}

export async function listLocationsByUserId(userId: string) {
  return prisma.location.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    include: {
      institution: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          cohorts: true,
          studyPlans: true,
        },
      },
    },
  });
}

export async function createLocationForUser(
  userId: string,
  values: LocationFormValues,
) {
  await ensureInstitutionBelongsToUser(userId, values.institutionId);

  const normalizedName = values.name.trim();
  await ensureLocationNameIsAvailable(userId, values.institutionId, normalizedName);

  try {
    return await prisma.location.create({
      data: {
        address: values.address?.trim() || null,
        code: values.code?.trim() || null,
        institutionId: values.institutionId,
        name: normalizedName,
        userId,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch {
    throw new LocationMutationError(
      "No fue posible guardar la sede.",
      "LOCATION_CREATE_FAILED",
      500,
    );
  }
}

export async function updateLocationForUser(
  userId: string,
  locationId: string,
  values: LocationFormValues,
) {
  await ensureLocationBelongsToUser(userId, locationId);
  await ensureInstitutionBelongsToUser(userId, values.institutionId);

  const normalizedName = values.name.trim();
  await ensureLocationNameIsAvailable(
    userId,
    values.institutionId,
    normalizedName,
    locationId,
  );

  try {
    return await prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        address: values.address?.trim() || null,
        code: values.code?.trim() || null,
        institutionId: values.institutionId,
        name: normalizedName,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            cohorts: true,
            studyPlans: true,
          },
        },
      },
    });
  } catch {
    throw new LocationMutationError(
      "No fue posible actualizar la sede.",
      "LOCATION_UPDATE_FAILED",
      500,
    );
  }
}

export async function deleteLocationForUser(userId: string, locationId: string) {
  await ensureLocationBelongsToUser(userId, locationId);

  try {
    await prisma.location.delete({
      where: {
        id: locationId,
      },
    });
  } catch {
    throw new LocationMutationError(
      "No fue posible eliminar la sede.",
      "LOCATION_DELETE_FAILED",
      500,
    );
  }
}
