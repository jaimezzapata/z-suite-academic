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
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/validations/login-schema";

export function useLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const fieldOrder: Array<keyof LoginFormValues> = ["email", "password"];

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const handleValidSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      const redirectUrl = await authApi.loginWithEmail(values);
      toast.success("Inicio de sesion correcto.", {
        description: "Estamos preparando tu acceso.",
      });
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      const description =
        error instanceof AuthApiError
          ? error.message
          : "Verifica tus datos e intenta nuevamente.";

      toast.error("No fue posible iniciar sesion.", {
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

    toast.warning("Revisa los campos obligatorios.", {
      description: firstError ?? "Corrige la informacion antes de continuar.",
    });
  };

  const onSubmit = form.handleSubmit(handleValidSubmit, handleInvalidSubmit);

  const handleFieldKeyDown =
    (fieldName: keyof LoginFormValues) =>
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
