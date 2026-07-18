import { z } from "zod";

export const studyPlanSchema = z.object({
  aliasName: z
    .string()
    .trim()
    .min(2, "Ingresa el alias comercial.")
    .max(120, "El alias es demasiado largo."),
  coreContentId: z.string().trim().min(1, "Selecciona un contenido base."),
  locationId: z.string().trim().min(1, "Selecciona una sede."),
});

export type StudyPlanFormValues = z.infer<typeof studyPlanSchema>;
