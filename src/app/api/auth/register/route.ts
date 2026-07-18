import { NextResponse } from "next/server";
import { registerUser, RegisterUserError } from "@/features/auth/server/register-user";
import { registerSchema } from "@/features/auth/validations/register-schema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsedBody = registerSchema.safeParse(body);

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

    const user = await registerUser({
      email: parsedBody.data.email,
      name: parsedBody.data.name,
      password: parsedBody.data.password,
    });

    return NextResponse.json(
      {
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RegisterUserError) {
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
        message: "No fue posible completar el registro.",
      },
      { status: 500 },
    );
  }
}
