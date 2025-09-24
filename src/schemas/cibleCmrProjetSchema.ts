import { z } from "zod";

export const cibleCmrProjetSchema = z.object({
  annee: z.string().min(1, "L'année est obligatoire"),
  valeur_cible_indcateur_crp: z
    .number()
    .min(0, "La valeur cible doit être positive")
    .int("La valeur cible doit être un entier"),
  code_indicateur_crp: z
    .string()
    .max(50, "Le code indicateur ne peut pas dépasser 50 caractères")
    .nullable()
    .optional(),
  code_ug: z
    .string()
    .max(50, "Le code UG ne peut pas dépasser 50 caractères")
    .nullable()
    .optional(),
  code_projet: z
    .string()
    .max(100, "Le code projet ne peut pas dépasser 100 caractères")
    .nullable()
    .optional(),
});

export type CibleCmrProjetFormData = z.infer<typeof cibleCmrProjetSchema>;

// Type pour les relations
export type CibleCmrProjetWithRelations = CibleCmrProjetFormData & {
  indicateur_crp?: any;
  ugl?: any;
};

// Schéma pour la mise à jour (tous les champs optionnels)
export const cibleCmrProjetUpdateSchema = cibleCmrProjetSchema.partial();

export type CibleCmrProjetUpdateData = z.infer<
  typeof cibleCmrProjetUpdateSchema
>;

// Fonction utilitaire pour formater la valeur cible
export const formatValeurCible = (valeur: number): string => {
  return new Intl.NumberFormat("fr-FR").format(valeur);
};
