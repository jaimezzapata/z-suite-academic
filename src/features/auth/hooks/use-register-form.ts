"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authApi } from "@/features/auth/services/auth-api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirma la contraseña"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      await authApi.registerWithEmail({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Cuenta creada correctamente");
    } catch {
      toast.error("No fue posible completar el registro");
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, isSubmitting, onSubmit };
}

