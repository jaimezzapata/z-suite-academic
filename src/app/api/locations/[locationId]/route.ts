import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/server/session";
import {
  deleteLocationForUser,
  LocationMutationError,
  updateLocationForUser,
} from "@/features/institutions/server/locations";
import { locationSchema } from "@/features/institutions/validations/location-schema";

type RouteContext = {
  params: Promise<{
    locationId: string;
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

    const { locationId } = await context.params;
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

    const location = await updateLocationForUser(user.id, locationId, parsedBody.data);

    return NextResponse.json({ location });
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
        message: "No fue posible actualizar la sede.",
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

    const { locationId } = await context.params;
    await deleteLocationForUser(user.id, locationId);

    return NextResponse.json({ success: true });
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
        message: "No fue posible eliminar la sede.",
      },
      { status: 500 },
    );
  }
}
