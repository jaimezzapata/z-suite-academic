"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteLocation,
  LocationsApiError,
} from "@/features/institutions/services/locations-api";

type UseDeleteLocationOptions = {
  onSuccess?: () => void;
};

export function useDeleteLocation({ onSuccess }: UseDeleteLocationOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const removeLocation = async (locationId: string) => {
    setIsDeleting(true);

    try {
      await deleteLocation(locationId);
      toast.success("Sede eliminada correctamente.", {
        description: "La sede ya no aparece en tu estructura institucional.",
      });

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      const description =
        error instanceof LocationsApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible eliminar la sede.", {
        description,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    removeLocation,
  };
}
