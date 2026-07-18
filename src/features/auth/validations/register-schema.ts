import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Ingresa tu nombre.")
      .max(80, "El nombre es demasiado largo."),
    email: z.string().trim().email("Ingresa un correo valido."),
    password: z
      .string()
      .min(8, "La contrasena debe tener minimo 8 caracteres.")
      .regex(/[A-Za-z]/, "La contrasena debe incluir al menos una letra.")
      .regex(/\d/, "La contrasena debe incluir al menos un numero."),
    confirmPassword: z
      .string()
      .min(1, "Confirma tu contrasena."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contrasenas no coinciden.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

