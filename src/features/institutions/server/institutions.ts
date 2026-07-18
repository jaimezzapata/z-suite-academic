import { prisma } from "@/shared/libs/prisma";
import type { InstitutionFormValues } from "@/features/institutions/validations/institution-schema";

export class InstitutionMutationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INSTITUTION_ALREADY_EXISTS"
      | "INSTITUTION_CREATE_FAILED"
      | "INSTITUTION_NOT_FOUND"
      | "INSTITUTION_UPDATE_FAILED"
      | "INSTITUTION_DELETE_FAILED",
    public readonly status: number,
  ) {
    super(message);
    this.name = "InstitutionMutationError";
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
    throw new InstitutionMutationError(
      "La institucion seleccionada no pertenece a tu cuenta.",
      "INSTITUTION_NOT_FOUND",
      404,
    );
  }
}

async function ensureInstitutionNameIsAvailable(
  userId: string,
  normalizedName: string,
  excludedInstitutionId?: string,
) {
  const existingInstitution = await prisma.institution.findFirst({
    where: {
      userId,
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      ...(excludedInstitutionId
        ? {
            NOT: {
              id: excludedInstitutionId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  if (existingInstitution) {
    throw new InstitutionMutationError(
      "Ya existe una institucion con ese nombre en tu cuenta.",
      "INSTITUTION_ALREADY_EXISTS",
      409,
    );
  }
}

export async function listInstitutionsByUserId(userId: string) {
  return prisma.institution.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: {
        select: {
          cohorts: true,
          locations: true,
        },
      },
    },
  });
}

export async function createInstitutionForUser(
  userId: string,
  values: InstitutionFormValues,
) {
  const normalizedName = values.name.trim();
  await ensureInstitutionNameIsAvailable(userId, normalizedName);

  try {
    return await prisma.institution.create({
      data: {
        minutesPerHour: values.minutesPerHour,
        name: normalizedName,
        paymentType: values.paymentType,
        periodType: values.periodType,
        userId,
      },
    });
  } catch {
    throw new InstitutionMutationError(
      "No fue posible guardar la institucion.",
      "INSTITUTION_CREATE_FAILED",
      500,
    );
  }
}

export async function updateInstitutionForUser(
  userId: string,
  institutionId: string,
  values: InstitutionFormValues,
) {
  await ensureInstitutionBelongsToUser(userId, institutionId);

  const normalizedName = values.name.trim();
  await ensureInstitutionNameIsAvailable(userId, normalizedName, institutionId);

  try {
    return await prisma.institution.update({
      where: {
        id: institutionId,
      },
      data: {
        minutesPerHour: values.minutesPerHour,
        name: normalizedName,
        paymentType: values.paymentType,
        periodType: values.periodType,
      },
    });
  } catch {
    throw new InstitutionMutationError(
      "No fue posible actualizar la institucion.",
      "INSTITUTION_UPDATE_FAILED",
      500,
    );
  }
}

export async function deleteInstitutionForUser(
  userId: string,
  institutionId: string,
) {
  await ensureInstitutionBelongsToUser(userId, institutionId);

  try {
    await prisma.institution.delete({
      where: {
        id: institutionId,
      },
    });
  } catch {
    throw new InstitutionMutationError(
      "No fue posible eliminar la institucion.",
      "INSTITUTION_DELETE_FAILED",
      500,
    );
  }
}
