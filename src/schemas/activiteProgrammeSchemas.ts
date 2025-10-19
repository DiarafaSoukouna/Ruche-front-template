import { z } from "zod";

// ============================================
// SCHÉMA ACTIVITÉ PROGRAMME
// ============================================

export const activiteProgrammeSchema = z.object({
  code_ap: z
    .string()
    .min(1, "Le code de l'activité est requis")
    .max(50, "Le code ne peut pas dépasser 50 caractères"),

  intutile: z
    .string()
    .min(1, "L'intitulé de l'activité est requis")
    .max(255, "L'intitulé ne peut pas dépasser 255 caractères"),

  niveau_ap: z
    .number()
    .int("Le niveau doit être un entier")
    .positive("Le niveau doit être positif"),

  code_relai_ap: z
    .string()
    .min(1, "Le code relai est requis")
    .max(50, "Le code relai ne peut pas dépasser 50 caractères"),

  parent_ap: z
    .number()
    .int("L'ID du parent doit être un entier")
    .positive("L'ID du parent doit être positif")
    .nullable()
    .optional(),

  id_programme: z
    .number()
    .int("L'ID du programme doit être un entier")
    .positive("L'ID du programme doit être positif")
    .nullable()
    .optional(),
});

// Schéma pour la création
export const activiteProgrammeCreateSchema = activiteProgrammeSchema;

// Schéma pour la mise à jour
export const activiteProgrammeUpdateSchema = activiteProgrammeSchema.partial();

// Type inféré du schéma
export type ActiviteProgrammeFormData = z.infer<
  typeof activiteProgrammeSchema
>;
