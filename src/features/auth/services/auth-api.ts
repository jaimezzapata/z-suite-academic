import { signIn } from "next-auth/react";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  name: string;
  password: string;
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function postJson<T>(url: string, payload: T) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let payloadMessage = "No fue posible completar la solicitud.";
    let payloadCode = "REQUEST_FAILED";

    try {
      const data = (await response.json()) as {
        code?: string;
        message?: string;
      };

      if (data.message) {
        payloadMessage = data.message;
      }

      if (data.code) {
        payloadCode = data.code;
      }
    } catch {
      if (response.status === 404) {
        payloadMessage = "El servicio de autenticacion aun no esta disponible.";
        payloadCode = "AUTH_ROUTE_NOT_AVAILABLE";
      }
    }

    throw new AuthApiError(payloadMessage, response.status, payloadCode);
  }

  return response;
}

export const authApi = {
  loginWithEmail: async (payload: LoginPayload) => {
    const result = await signIn("credentials", {
      callbackUrl: "/dashboard",
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      redirect: false,
    });

    if (!result) {
      throw new AuthApiError(
        "No fue posible iniciar sesion en este momento.",
        500,
        "AUTH_RESPONSE_EMPTY",
      );
    }

    if (result.error) {
      throw new AuthApiError(
        "Correo o contrasena incorrectos.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    return result.url ?? "/dashboard";
  },
  registerWithEmail: async (payload: RegisterPayload) => {
    await postJson("/api/auth/register", payload);
  },
  loginWithGoogle: async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  },
};
