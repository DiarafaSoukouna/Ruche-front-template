import { z } from "zod";

// Schéma pour la création d'un indicateur de performance
export const createIndicateurPerformanceProjetSchema = z.object({
  code_indicateur_performance: z
    .string()
    .min(1, "Le code est requis")
    .max(50, "Le code ne peut pas dépasser 50 caractères"),
  intitule_indicateur_tache: z
    .string()
    .min(1, "L'intitulé est requis")
    .max(255, "L'intitulé ne peut pas dépasser 255 caractères"),
  code_activite_projet: z.string().optional().nullable(),
  unite_indicateur_performance: z.number().optional().nullable(),
  code_projet: z.string().optional().nullable(),
});

// Schéma pour la mise à jour
export const updateIndicateurPerformanceProjetSchema =
  createIndicateurPerformanceProjetSchema.partial();

// Types inférés
export type CreateIndicateurPerformanceProjetFormData = z.infer<
  typeof createIndicateurPerformanceProjetSchema
>;
export type UpdateIndicateurPerformanceProjetFormData = z.infer<
  typeof updateIndicateurPerformanceProjetSchema
>;
