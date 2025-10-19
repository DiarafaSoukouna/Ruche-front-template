import { z } from "zod";

// ============================================
// SCHÉMA NIVEAU ACTIVITÉ PROGRAMME
// ============================================

export const niveauActiviteProgrammeSchema = z.object({
  libelle_niveau_ap: z
    .string()
    .min(1, "Le libellé du niveau est requis")
    .max(100, "Le libellé ne peut pas dépasser 100 caractères"),

  taille_code_niveau_ap: z
    .number()
    .int("La taille du code doit être un entier")
    .min(1, "La taille du code doit être au moins 1")
    .max(10, "La taille du code ne peut pas dépasser 10"),

  nombre_niveau_ap: z
    .number()
    .int("Le nombre doit être un entier")
    .positive("Le nombre doit être positif"),

  code_programme: z
    .string()
    .max(50, "Le code programme ne peut pas dépasser 50 caractères")
    .nullable()
    .optional(),
});

// Type inféré du schéma
export type NiveauActiviteProgrammeFormData = z.infer<
  typeof niveauActiviteProgrammeSchema
>;
