import { z } from "zod";

export const locationSchema = z.object({
  address: z
    .string()
    .trim()
    .max(160, "La direccion es demasiado larga.")
    .optional()
    .or(z.literal("")),
  code: z
    .string()
    .trim()
    .max(30, "El codigo es demasiado largo.")
    .optional()
    .or(z.literal("")),
  institutionId: z.string().trim().min(1, "Selecciona una institucion."),
  name: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de la sede.")
    .max(120, "El nombre es demasiado largo."),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
