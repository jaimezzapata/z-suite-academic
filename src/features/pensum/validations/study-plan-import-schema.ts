import { z } from "zod";

export const studyPlanOutcomeSchema = z.object({
  code: z.string().trim().max(160).optional().nullable(),
  description: z
    .string()
    .trim()
    .min(2, "Cada resultado debe tener una descripcion.")
    .max(600, "La descripcion del resultado es demasiado larga."),
});

export const studyPlanImportItemSchema = z.object({
  code: z.string().trim().max(160).optional().nullable(),
  description: z.string().trim().max(600).optional().nullable(),
  itemType: z
    .enum(["SUBJECT", "MODULE", "OUTCOME_GROUP", "MILESTONE", "OTHER"])
    .default("SUBJECT"),
  metadata: z.record(z.string(), z.unknown()).optional(),
  order: z.number().int().positive().optional(),
  outcomes: z.array(studyPlanOutcomeSchema).default([]),
  title: z
    .string()
    .trim()
    .min(2, "Cada item debe tener un titulo.")
    .max(160, "El titulo del item es demasiado largo."),
});

export const studyPlanImportPeriodSchema = z.object({
  items: z.array(studyPlanImportItemSchema).min(1, "Cada periodo debe tener al menos un item."),
  metadata: z.record(z.string(), z.unknown()).optional(),
  name: z
    .string()
    .trim()
    .min(2, "Cada periodo debe tener un nombre.")
    .max(160, "El nombre del periodo es demasiado largo."),
  order: z.number().int().positive().optional(),
});

export const studyPlanImportSchema = z.object({
  aliasName: z
    .string()
    .trim()
    .min(2, "El plan debe tener un alias visible.")
    .max(160, "El alias del plan es demasiado largo."),
  coreContentName: z
    .string()
    .trim()
    .min(2, "El plan debe definir un contenido base.")
    .max(160, "El nombre del contenido base es demasiado largo."),
  institutionName: z
    .string()
    .trim()
    .min(2, "El plan debe indicar la institucion.")
    .max(160, "El nombre de la institucion es demasiado largo."),
  locationName: z
    .string()
    .trim()
    .min(2, "El plan debe indicar la sede.")
    .max(160, "El nombre de la sede es demasiado largo."),
  metadata: z.record(z.string(), z.unknown()).optional(),
  periods: z.array(studyPlanImportPeriodSchema).min(1, "El plan debe tener al menos un periodo."),
  sourceSlug: z.string().trim().max(160).optional(),
  sourceType: z.enum(["MANUAL", "PRESET", "JSON", "XLSX", "MARKDOWN"]).default("MANUAL"),
  structureType: z.enum(["LEVELS", "TRIMESTERS", "CUSTOM"]).default("CUSTOM"),
});

export const studyPlanImportRequestSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("preset"),
    presetSlugs: z.array(z.string().trim().min(1)).optional(),
  }),
  z.object({
    mode: z.literal("structured"),
    plans: z.array(studyPlanImportSchema).min(1, "Debes enviar al menos un plan."),
  }),
]);

export type StudyPlanImportItem = z.infer<typeof studyPlanImportItemSchema>;
export type StudyPlanImportOutcome = z.infer<typeof studyPlanOutcomeSchema>;
export type StudyPlanImportPeriod = z.infer<typeof studyPlanImportPeriodSchema>;
export type StudyPlanImportPayload = z.infer<typeof studyPlanImportSchema>;
export type StudyPlanImportRequest = z.infer<typeof studyPlanImportRequestSchema>;
