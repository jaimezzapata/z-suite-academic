"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { pensumApi, PensumApiError } from "@/features/pensum/services/pensum-api";
import {
  coreContentSchema,
  type CoreContentFormValues,
} from "@/features/pensum/validations/core-content-schema";

export function useCreateCoreContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<CoreContentFormValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(coreContentSchema),
  });

  const handleValidSubmit = async (values: CoreContentFormValues) => {
    setIsSubmitting(true);

    try {
      await pensumApi.createCoreContent(values);
      toast.success("Contenido base creado correctamente.", {
        description: "Ya puedes usarlo para crear alias comerciales.",
      });
      form.reset({ name: "" });
      router.refresh();
    } catch (error) {
      const description =
        error instanceof PensumApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible guardar el contenido base.", {
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalidSubmit = () => {
    const firstError = Object.values(form.formState.errors)
      .map((field) => field?.message)
      .find(Boolean);

    toast.warning("Corrige los datos del formulario.", {
      description: firstError ?? "Revisa la informacion antes de continuar.",
    });
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(handleValidSubmit, handleInvalidSubmit),
  };
}
