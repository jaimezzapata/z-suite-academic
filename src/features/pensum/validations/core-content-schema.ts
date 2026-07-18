import { z } from "zod";

export const coreContentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre del contenido base.")
    .max(120, "El nombre es demasiado largo."),
});

export type CoreContentFormValues = z.infer<typeof coreContentSchema>;
