import { z } from "zod";

export const niveauCadreStrategiqueSchema = z.object({
  nombre_nsc: z
    .number()
    .min(1, "Le nombre doit être supérieur à 0")
    .int("Le nombre doit être un entier"),
  libelle_nsc: z
    .string()
    .min(1, "Le libellé est obligatoire")
    .max(255, "Le libellé ne peut pas dépasser 255 caractères"),
  code_number_nsc: z
    .number()
    .min(1, "Le code numérique doit être supérieur à 0")
    .int("Le code numérique doit être un entier"),
  type_niveau: z
    .number()
    .int("Le type doit être un entier")
    .min(1, "Le type doit être 1, 2 ou 3")
    .max(3, "Le type doit être 1, 2 ou 3")
    .refine((val) => [1, 2, 3].includes(val), {
      message: "Le type doit être 1 (Effet), 2 (Produit) ou 3 (Impact)",
    }),
});

export type NiveauCadreStrategiqueFormData = z.infer<typeof niveauCadreStrategiqueSchema>;

// Schéma pour la mise à jour (tous les champs optionnels)
export const niveauCadreStrategiqueUpdateSchema = niveauCadreStrategiqueSchema.partial();

export type NiveauCadreStrategiqueUpdateData = z.infer<typeof niveauCadreStrategiqueUpdateSchema>;

// Fonction utilitaire pour obtenir le libellé du type
export const getTypeNiveauLabel = (type: 1 | 2 | 3): string => {
  switch (type) {
    case 1:
      return "Effet";
    case 2:
      return "Produit";
    case 3:
      return "Impact";
    default:
      return "Inconnu";
  }
};

// Options pour les selects
export const typeNiveauOptions = [
  { value: 1, label: "Effet" },
  { value: 2, label: "Produit" },
  { value: 3, label: "Impact" },
] as const;
