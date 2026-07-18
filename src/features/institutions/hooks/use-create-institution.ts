"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createInstitution,
  InstitutionsApiError,
  updateInstitution,
} from "@/features/institutions/services/institutions-api";
import {
  institutionSchema,
  type InstitutionFormValues,
} from "@/features/institutions/validations/institution-schema";

const institutionDefaults: InstitutionFormValues = {
  minutesPerHour: 45,
  name: "",
  paymentType: "HOURLY",
  periodType: "SEMESTER",
};

type UseInstitutionFormOptions = {
  institutionId?: string;
  initialValues?: InstitutionFormValues;
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

export function useInstitutionForm({
  institutionId,
  initialValues,
  mode = "create",
  onSuccess,
}: UseInstitutionFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<InstitutionFormValues>({
    defaultValues: initialValues ?? institutionDefaults,
    resolver: zodResolver(institutionSchema),
  });

  useEffect(() => {
    form.reset(initialValues ?? institutionDefaults);
  }, [form, initialValues]);

  const handleValidSubmit = async (values: InstitutionFormValues) => {
    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        if (!institutionId) {
          throw new Error("institutionId is required in edit mode");
        }

        await updateInstitution(institutionId, values);
        toast.success("Institucion actualizada correctamente.", {
          description: "Los cambios ya fueron guardados.",
        });
      } else {
        await createInstitution(values);
        toast.success("Institucion creada correctamente.", {
          description: "La informacion ya quedo ligada a tu cuenta.",
        });
        form.reset(institutionDefaults);
      }

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      const description =
        error instanceof InstitutionsApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible guardar la institucion.", {
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

export function useCreateInstitution() {
  return useInstitutionForm();
}
