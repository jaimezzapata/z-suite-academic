"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { pensumApi, PensumApiError } from "@/features/pensum/services/pensum-api";
import {
  studyPlanSchema,
  type StudyPlanFormValues,
} from "@/features/pensum/validations/study-plan-schema";

export function useCreateStudyPlan() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<StudyPlanFormValues>({
    defaultValues: {
      aliasName: "",
      coreContentId: "",
      locationId: "",
    },
    resolver: zodResolver(studyPlanSchema),
  });

  const handleValidSubmit = async (values: StudyPlanFormValues) => {
    setIsSubmitting(true);

    try {
      await pensumApi.createStudyPlan(values);
      toast.success("Plan de estudio creado correctamente.", {
        description: "El alias comercial ya quedo listo para usarse en grupos.",
      });
      form.reset({
        aliasName: "",
        coreContentId: "",
        locationId: "",
      });
      router.refresh();
    } catch (error) {
      const description =
        error instanceof PensumApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible guardar el plan de estudio.", {
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
