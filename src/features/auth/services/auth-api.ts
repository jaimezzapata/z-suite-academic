type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  name: string;
  password: string;
};

async function postJson<T>(url: string, payload: T) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("REQUEST_FAILED");
  }
}

export const authApi = {
  loginWithEmail: async (payload: LoginPayload) => {
    await postJson("/api/auth/login", payload);
  },
  registerWithEmail: async (payload: RegisterPayload) => {
    await postJson("/api/auth/register", payload);
  },
};

