import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  deleteInstitutionForUser,
  InstitutionMutationError,
  updateInstitutionForUser,
} from "@/features/institutions/server/institutions";
import { institutionSchema } from "@/features/institutions/validations/institution-schema";

type RouteContext = {
  params: Promise<{
    institutionId: string;
  }>;
};

function getUnauthorizedResponse() {
  return NextResponse.json(
    {
      code: "UNAUTHORIZED",
      message: "Debes iniciar sesion para continuar.",
    },
    { status: 401 },
  );
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const { institutionId } = await context.params;
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

    const institution = await updateInstitutionForUser(
      user.id,
      institutionId,
      parsedBody.data,
    );

    return NextResponse.json({ institution });
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
        message: "No fue posible actualizar la institucion.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const { institutionId } = await context.params;
    await deleteInstitutionForUser(user.id, institutionId);

    return NextResponse.json({ success: true });
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
        message: "No fue posible eliminar la institucion.",
      },
      { status: 500 },
    );
  }
}
