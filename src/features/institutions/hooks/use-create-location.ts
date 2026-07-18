"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createLocation,
  LocationsApiError,
  updateLocation,
} from "@/features/institutions/services/locations-api";
import {
  locationSchema,
  type LocationFormValues,
} from "@/features/institutions/validations/location-schema";

const locationDefaults: LocationFormValues = {
  address: "",
  code: "",
  institutionId: "",
  name: "",
};

type UseLocationFormOptions = {
  initialValues?: LocationFormValues;
  locationId?: string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
};

export function useLocationForm({
  initialValues,
  locationId,
  mode = "create",
  onSuccess,
}: UseLocationFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<LocationFormValues>({
    defaultValues: initialValues ?? locationDefaults,
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
    form.reset(initialValues ?? locationDefaults);
  }, [form, initialValues]);

  const handleValidSubmit = async (values: LocationFormValues) => {
    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        if (!locationId) {
          throw new Error("locationId is required in edit mode");
        }

        await updateLocation(locationId, values);
        toast.success("Sede actualizada correctamente.", {
          description: "Los cambios ya fueron guardados.",
        });
      } else {
        await createLocation(values);
        toast.success("Sede creada correctamente.", {
          description: "La sede ya quedo asociada a tu institucion.",
        });
        form.reset(locationDefaults);
      }

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      const description =
        error instanceof LocationsApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible guardar la sede.", {
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

export function useCreateLocation() {
  return useLocationForm();
}
