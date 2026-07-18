"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteInstitution,
  InstitutionsApiError,
} from "@/features/institutions/services/institutions-api";

type UseDeleteInstitutionOptions = {
  onSuccess?: () => void;
};

export function useDeleteInstitution({
  onSuccess,
}: UseDeleteInstitutionOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const removeInstitution = async (institutionId: string) => {
    setIsDeleting(true);

    try {
      await deleteInstitution(institutionId);
      toast.success("Institucion eliminada correctamente.", {
        description: "La informacion asociada ya fue retirada de tu cuenta.",
      });

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      const description =
        error instanceof InstitutionsApiError
          ? error.message
          : "Intenta nuevamente en unos segundos.";

      toast.error("No fue posible eliminar la institucion.", {
        description,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    removeInstitution,
  };
}
