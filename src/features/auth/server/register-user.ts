import { prisma } from "@/shared/libs/prisma";
import { hashPassword } from "@/features/auth/server/password-hasher";

export class RegisterUserError extends Error {
  constructor(
    message: string,
    public readonly code: "EMAIL_IN_USE" | "REGISTER_FAILED",
    public readonly status: number,
  ) {
    super(message);
    this.name = "RegisterUserError";
  }
}

type RegisterUserInput = {
  email: string;
  name: string;
  password: string;
};

export async function registerUser({
  email,
  name,
  password,
}: RegisterUserInput) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existingUser) {
    throw new RegisterUserError(
      "Ya existe una cuenta con este correo.",
      "EMAIL_IN_USE",
      409,
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        credential: {
          create: {
            passwordHash: hashPassword(password),
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch {
    throw new RegisterUserError(
      "No fue posible crear la cuenta.",
      "REGISTER_FAILED",
      500,
    );
  }
}
