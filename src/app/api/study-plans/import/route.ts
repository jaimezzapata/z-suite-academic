import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  importPresetStudyPlansForUser,
  importStudyPlanForUser,
  StudyPlanMutationError,
} from "@/features/pensum/server/study-plans";
import { studyPlanImportRequestSchema } from "@/features/pensum/validations/study-plan-import-schema";

function getUnauthorizedResponse() {
  return NextResponse.json(
    {
      code: "UNAUTHORIZED",
      message: "Debes iniciar sesion para continuar.",
    },
    { status: 401 },
  );
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const body = (await request.json()) as unknown;
    const parsedBody = studyPlanImportRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      const firstIssue = parsedBody.error.issues[0];

      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: firstIssue?.message ?? "Verifica la informacion ingresada.",
        },
        { status: 400 },
      );
    }

    if (parsedBody.data.mode === "preset") {
      const importedPlans = await importPresetStudyPlansForUser(
        user.id,
        parsedBody.data.presetSlugs,
      );

      return NextResponse.json(
        {
          importedCount: importedPlans.length,
          studyPlans: importedPlans,
        },
        { status: 201 },
      );
    }

    const importedPlans = await Promise.all(
      parsedBody.data.plans.map((plan) => importStudyPlanForUser(user.id, plan)),
    );

    return NextResponse.json(
      {
        importedCount: importedPlans.length,
        studyPlans: importedPlans,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof StudyPlanMutationError) {
      return NextResponse.json(
        {
          code: error.code,
          message: error.message,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "No fue posible importar los planes de estudio.",
      },
      { status: 500 },
    );
  }
}
