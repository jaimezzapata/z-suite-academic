import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  createLocationForUser,
  listLocationsByUserId,
  LocationMutationError,
} from "@/features/institutions/server/locations";
import { locationSchema } from "@/features/institutions/validations/location-schema";

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

  const locations = await listLocationsByUserId(user.id);

  return NextResponse.json({ locations });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return getUnauthorizedResponse();
    }

    const body = (await request.json()) as unknown;
    const parsedBody = locationSchema.safeParse(body);

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

    const location = await createLocationForUser(user.id, parsedBody.data);

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    if (error instanceof LocationMutationError) {
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
        message: "No fue posible procesar la sede.",
      },
      { status: 500 },
    );
  }
}
