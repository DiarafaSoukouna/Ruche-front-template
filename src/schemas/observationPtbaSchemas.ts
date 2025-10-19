import { z } from "zod";

// ============================================
// SCHÉMA OBSERVATION PTBA
// ============================================

export const observationPtbaSchema = z.object({
  observation: z
    .string()
    .min(1, "L'observation est requise")
    .max(1000, "L'observation ne peut pas dépasser 1000 caractères"),

  date_observation: z
    .string()
    .min(1, "La date d'observation est requise")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Format de date invalide",
    }),

  ptba: z
    .string()
    .min(1, "Le code de l'activité PTBA est requis")
    .nullable()
    .optional(),
});

// Schéma pour la création
export const observationPtbaCreateSchema = observationPtbaSchema;

// Schéma pour la mise à jour
export const observationPtbaUpdateSchema = observationPtbaSchema.partial();

// Type inféré du schéma
export type ObservationPtbaFormData = z.infer<typeof observationPtbaSchema>;
