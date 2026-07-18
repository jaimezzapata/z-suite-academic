import { presetStudyPlans } from "@/features/pensum/data/preset-study-plans";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/shared/libs/prisma";
import type {
  StudyPlanImportPayload,
  StudyPlanImportPeriod,
} from "@/features/pensum/validations/study-plan-import-schema";
import type { StudyPlanFormValues } from "@/features/pensum/validations/study-plan-schema";

export class StudyPlanMutationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "LOCATION_NOT_FOUND"
      | "CORE_CONTENT_NOT_FOUND"
      | "STUDY_PLAN_ALREADY_EXISTS"
      | "PRESET_NOT_FOUND"
      | "STUDY_PLAN_CREATE_FAILED"
      | "STUDY_PLAN_IMPORT_FAILED",
    public readonly status: number,
  ) {
    super(message);
    this.name = "StudyPlanMutationError";
  }
}

export async function listStudyPlansByUserId(userId: string) {
  return prisma.studyPlan.findMany({
    where: { userId },
    orderBy: [
      {
        location: {
          institution: {
            name: "asc",
          },
        },
      },
      {
        location: {
          name: "asc",
        },
      },
      { aliasName: "asc" },
    ],
    include: {
      coreContent: {
        select: {
          id: true,
          name: true,
        },
      },
      location: {
        select: {
          id: true,
          institution: {
            select: {
              id: true,
              name: true,
            },
          },
          name: true,
        },
      },
      periods: {
        orderBy: [{ order: "asc" }],
        include: {
          items: {
            orderBy: [{ order: "asc" }],
          },
        },
      },
      _count: {
        select: {
          cohorts: true,
          periods: true,
        },
      },
    },
  });
}

function getInstitutionDefaults(structureType: StudyPlanImportPayload["structureType"]) {
  return {
    minutesPerHour: 60,
    paymentType: "HOURLY" as const,
    periodType: structureType === "TRIMESTERS" ? ("TRIMESTER" as const) : ("SEMESTER" as const),
  };
}

async function ensureInstitutionForUser(
  userId: string,
  institutionName: string,
  structureType: StudyPlanImportPayload["structureType"],
) {
  const normalizedName = institutionName.trim();

  const existingInstitution = await prisma.institution.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      userId,
    },
    select: {
      id: true,
    },
  });

  if (existingInstitution) {
    return existingInstitution;
  }

  return prisma.institution.create({
    data: {
      name: normalizedName,
      userId,
      ...getInstitutionDefaults(structureType),
    },
    select: {
      id: true,
    },
  });
}

async function ensureLocationForUser(
  userId: string,
  institutionId: string,
  locationName: string,
) {
  const normalizedName = locationName.trim();

  const existingLocation = await prisma.location.findFirst({
    where: {
      institutionId,
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      userId,
    },
    select: {
      id: true,
    },
  });

  if (existingLocation) {
    return existingLocation;
  }

  return prisma.location.create({
    data: {
      institutionId,
      name: normalizedName,
      userId,
    },
    select: {
      id: true,
    },
  });
}

async function ensureCoreContentForUser(userId: string, coreContentName: string) {
  const normalizedName = coreContentName.trim();

  const existingCoreContent = await prisma.coreContent.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      userId,
    },
    select: {
      id: true,
    },
  });

  if (existingCoreContent) {
    return existingCoreContent;
  }

  return prisma.coreContent.create({
    data: {
      name: normalizedName,
      userId,
    },
    select: {
      id: true,
    },
  });
}

function buildStudyPlanPeriodsCreateInput(periods: StudyPlanImportPeriod[]) {
  return periods.map((period, periodIndex) => ({
    items: {
      create: period.items.map((item, itemIndex) => ({
        code: item.code?.trim() || null,
        description: item.description?.trim() || null,
        itemType: item.itemType,
        metadata: item.metadata as Prisma.InputJsonValue | undefined,
        order: item.order ?? itemIndex + 1,
        outcomes:
          item.outcomes.length > 0
            ? (item.outcomes as Prisma.InputJsonValue)
            : undefined,
        title: item.title.trim(),
      })),
    },
    metadata: period.metadata as Prisma.InputJsonValue | undefined,
    name: period.name.trim(),
    order: period.order ?? periodIndex + 1,
  }));
}

async function findExistingImportedStudyPlan(
  userId: string,
  locationId: string,
  aliasName: string,
  sourceSlug?: string,
) {
  const orConditions: Array<
    | {
        sourceSlug: string;
      }
    | {
        aliasName: {
          equals: string;
          mode: "insensitive";
        };
        locationId: string;
      }
  > = [
    {
      aliasName: {
        equals: aliasName,
        mode: "insensitive" as const,
      },
      locationId,
    },
  ];

  if (sourceSlug) {
    orConditions.unshift({
      sourceSlug,
    });
  }

  return prisma.studyPlan.findFirst({
    where: {
      OR: orConditions,
      userId,
    },
    select: {
      id: true,
    },
  });
}

export async function importStudyPlanForUser(
  userId: string,
  values: StudyPlanImportPayload,
) {
  const institution = await ensureInstitutionForUser(
    userId,
    values.institutionName,
    values.structureType,
  );
  const location = await ensureLocationForUser(
    userId,
    institution.id,
    values.locationName,
  );
  const coreContent = await ensureCoreContentForUser(userId, values.coreContentName);
  const normalizedAlias = values.aliasName.trim();
  const normalizedSourceSlug = values.sourceSlug?.trim() || undefined;

  const existingStudyPlan = await findExistingImportedStudyPlan(
    userId,
    location.id,
    normalizedAlias,
    normalizedSourceSlug,
  );

  try {
    if (existingStudyPlan) {
      await prisma.studyPlanPeriod.deleteMany({
        where: {
          studyPlanId: existingStudyPlan.id,
        },
      });

      return await prisma.studyPlan.update({
        where: {
          id: existingStudyPlan.id,
        },
        data: {
          aliasName: normalizedAlias,
          coreContentId: coreContent.id,
          locationId: location.id,
          metadata: values.metadata as Prisma.InputJsonValue | undefined,
          periods: {
            create: buildStudyPlanPeriodsCreateInput(values.periods),
          },
          sourceSlug: normalizedSourceSlug,
          sourceType: values.sourceType,
          structureType: values.structureType,
        },
      });
    }

    return await prisma.studyPlan.create({
      data: {
        aliasName: normalizedAlias,
        coreContentId: coreContent.id,
        locationId: location.id,
        metadata: values.metadata as Prisma.InputJsonValue | undefined,
        periods: {
          create: buildStudyPlanPeriodsCreateInput(values.periods),
        },
        sourceSlug: normalizedSourceSlug,
        sourceType: values.sourceType,
        structureType: values.structureType,
        userId,
      },
    });
  } catch {
    throw new StudyPlanMutationError(
      "No fue posible importar el plan de estudio.",
      "STUDY_PLAN_IMPORT_FAILED",
      500,
    );
  }
}

export async function importPresetStudyPlansForUser(
  userId: string,
  presetSlugs?: string[],
) {
  const plansToImport =
    presetSlugs && presetSlugs.length > 0
      ? presetStudyPlans.filter((plan) => plan.sourceSlug && presetSlugs.includes(plan.sourceSlug))
      : presetStudyPlans;

  if (plansToImport.length === 0) {
    throw new StudyPlanMutationError(
      "No se encontraron presets validos para importar.",
      "PRESET_NOT_FOUND",
      404,
    );
  }

  return Promise.all(plansToImport.map((plan) => importStudyPlanForUser(userId, plan)));
}

export async function createStudyPlanForUser(
  userId: string,
  values: StudyPlanFormValues,
) {
  const [location, coreContent] = await Promise.all([
    prisma.location.findFirst({
      where: {
        id: values.locationId,
        userId,
      },
      select: { id: true },
    }),
    prisma.coreContent.findFirst({
      where: {
        id: values.coreContentId,
        userId,
      },
      select: { id: true },
    }),
  ]);

  if (!location) {
    throw new StudyPlanMutationError(
      "La sede seleccionada no pertenece a tu cuenta.",
      "LOCATION_NOT_FOUND",
      404,
    );
  }

  if (!coreContent) {
    throw new StudyPlanMutationError(
      "El contenido base seleccionado no pertenece a tu cuenta.",
      "CORE_CONTENT_NOT_FOUND",
      404,
    );
  }

  const normalizedAlias = values.aliasName.trim();

  const existingStudyPlan = await prisma.studyPlan.findFirst({
    where: {
      aliasName: {
        equals: normalizedAlias,
        mode: "insensitive",
      },
      locationId: values.locationId,
      userId,
    },
    select: { id: true },
  });

  if (existingStudyPlan) {
    throw new StudyPlanMutationError(
      "Ya existe un alias con ese nombre para la sede seleccionada.",
      "STUDY_PLAN_ALREADY_EXISTS",
      409,
    );
  }

  try {
    return await prisma.studyPlan.create({
      data: {
        aliasName: normalizedAlias,
        coreContentId: values.coreContentId,
        locationId: values.locationId,
        sourceType: "MANUAL",
        structureType: "CUSTOM",
        userId,
      },
    });
  } catch {
    throw new StudyPlanMutationError(
      "No fue posible guardar el plan de estudio.",
      "STUDY_PLAN_CREATE_FAILED",
      500,
    );
  }
}
