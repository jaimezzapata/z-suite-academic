import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  createCoreContentForUser,
  CoreContentMutationError,
  listCoreContentsByUserId,
} from "@/features/pensum/server/core-contents";
import { coreContentSchema } from "@/features/pensum/validations/core-content-schema";

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

  const coreContents = await listCoreContentsByUserId(user.id);

  return NextResponse.json({ coreContents });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const body = (await request.json()) as unknown;
    const parsedBody = coreContentSchema.safeParse(body);

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

    const coreContent = await createCoreContentForUser(user.id, parsedBody.data);

    return NextResponse.json({ coreContent }, { status: 201 });
  } catch (error) {
    if (error instanceof CoreContentMutationError) {
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
        message: "No fue posible procesar el contenido base.",
      },
      { status: 500 },
    );
  }
}
