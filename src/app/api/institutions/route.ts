import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  createInstitutionForUser,
  InstitutionMutationError,
  listInstitutionsByUserId,
} from "@/features/institutions/server/institutions";
import { institutionSchema } from "@/features/institutions/validations/institution-schema";

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

  const userId = user.id;
  const institutions = await listInstitutionsByUserId(userId);

  return NextResponse.json({ institutions });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const userId = user.id;
    const body = (await request.json()) as unknown;
    const parsedBody = institutionSchema.safeParse(body);

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

    const institution = await createInstitutionForUser(userId, parsedBody.data);

    return NextResponse.json({ institution }, { status: 201 });
  } catch (error) {
    if (error instanceof InstitutionMutationError) {
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
        message: "No fue posible procesar la institucion.",
      },
      { status: 500 },
    );
  }
}
