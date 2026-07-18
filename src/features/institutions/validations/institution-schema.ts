import { z } from "zod";

export const paymentTypeSchema = z.enum(["HOURLY", "FIXED_SALARY"]);
export const periodTypeSchema = z.enum(["SEMESTER", "TRIMESTER"]);

export const institutionSchema = z.object({
  minutesPerHour: z.union([z.literal(45), z.literal(60)], {
    error: "Selecciona una regla valida de 45 o 60 minutos.",
  }),
  name: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de la institucion.")
    .max(120, "El nombre es demasiado largo."),
  paymentType: paymentTypeSchema,
  periodType: periodTypeSchema,
});

export type InstitutionFormValues = z.infer<typeof institutionSchema>;
