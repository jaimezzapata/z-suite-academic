import { prisma } from "@/shared/libs/prisma";
import type { CoreContentFormValues } from "@/features/pensum/validations/core-content-schema";

export class CoreContentMutationError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "CORE_CONTENT_ALREADY_EXISTS"
      | "CORE_CONTENT_CREATE_FAILED",
    public readonly status: number,
  ) {
    super(message);
    this.name = "CoreContentMutationError";
  }
}

export async function listCoreContentsByUserId(userId: string) {
  return prisma.coreContent.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: {
        select: {
          studyPlans: true,
        },
      },
    },
  });
}

export async function createCoreContentForUser(
  userId: string,
  values: CoreContentFormValues,
) {
  const normalizedName = values.name.trim();

  const existingContent = await prisma.coreContent.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      userId,
    },
    select: { id: true },
  });

  if (existingContent) {
    throw new CoreContentMutationError(
      "Ya existe un contenido base con ese nombre.",
      "CORE_CONTENT_ALREADY_EXISTS",
      409,
    );
  }

  try {
    return await prisma.coreContent.create({
      data: {
        name: normalizedName,
        userId,
      },
    });
  } catch {
    throw new CoreContentMutationError(
      "No fue posible guardar el contenido base.",
      "CORE_CONTENT_CREATE_FAILED",
      500,
    );
  }
}
