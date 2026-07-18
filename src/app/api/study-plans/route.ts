import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  createStudyPlanForUser,
  listStudyPlansByUserId,
  StudyPlanMutationError,
} from "@/features/pensum/server/study-plans";
import { studyPlanSchema } from "@/features/pensum/validations/study-plan-schema";

function getUnauthorizedResponse() {
  return NextResponse.json(
    {
      code: "UNAUTHORIZED",
      message: "Debes iniciar sesion para continuar.",
    },
    { status: 401 },
  );
}

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return getUnauthorizedResponse();
  }

  const studyPlans = await listStudyPlansByUserId(user.id);

  return NextResponse.json({ studyPlans });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const body = (await request.json()) as unknown;
    const parsedBody = studyPlanSchema.safeParse(body);

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

    const studyPlan = await createStudyPlanForUser(user.id, parsedBody.data);

    return NextResponse.json({ studyPlan }, { status: 201 });
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
        message: "No fue posible procesar el plan de estudio.",
      },
      { status: 500 },
    );
  }
}
