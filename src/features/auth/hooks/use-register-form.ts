"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  authApi,
  AuthApiError,
} from "@/features/auth/services/auth-api";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/validations/register-schema";

export function useRegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const fieldOrder: Array<keyof RegisterFormValues> = [
    "name",
    "email",
    "password",
    "confirmPassword",
  ];

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const handleValidSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);

    try {
      await authApi.registerWithEmail({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      const redirectUrl = await authApi.loginWithEmail({
        email: values.email,
        password: values.password,
      });
      toast.success("Cuenta creada correctamente.", {
        description: "Tu sesion ya esta lista.",
      });
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      const description =
        error instanceof AuthApiError
          ? error.message
          : "Revisa la informacion ingresada e intenta nuevamente.";

      toast.error("No fue posible completar el registro.", {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);

    try {
      await authApi.loginWithGoogle();
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible continuar con Google.", {
        description,
      });
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = () => {
    const firstError = fieldOrder
      .map((fieldName) => form.getFieldState(fieldName).error?.message)
      .find(Boolean);

    toast.warning("Corrige los datos del formulario.", {
      description: firstError ?? "Verifica la informacion antes de continuar.",
    });
  };

  const onSubmit = form.handleSubmit(handleValidSubmit, handleInvalidSubmit);

  const handleFieldKeyDown =
    (fieldName: keyof RegisterFormValues) =>
    async (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();

      const isCurrentFieldValid = await form.trigger(fieldName);
      if (!isCurrentFieldValid) {
        const errorMessage = form.getFieldState(fieldName).error?.message;

        toast.warning("Corrige este campo.", {
          description: errorMessage ?? "Verifica el valor ingresado.",
        });
        return;
      }

      const currentFieldIndex = fieldOrder.indexOf(fieldName);
      const nextField = fieldOrder[currentFieldIndex + 1];

      if (nextField) {
        form.setFocus(nextField);
        return;
      }

      void onSubmit();
    };

  return {
    form,
    handleFieldKeyDown,
    handleGoogleSignIn,
    isSubmitting,
    onSubmit,
  };
}
