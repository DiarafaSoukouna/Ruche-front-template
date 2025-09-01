import { z } from "zod";

export const cibleCmrProjetSchema = z.object({
  annee: z
    .string()
    .min(1, "L'année est obligatoire")
    .regex(/^\d{4}$/, "L'année doit être au format YYYY (ex: 2024)"),
  valeur_cible_indcateur_crp: z
    .number()
    .min(0, "La valeur cible doit être positive")
    .int("La valeur cible doit être un entier"),
  code_indicateur_crp: z
    .number()
    .int("Le code indicateur doit être un entier")
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

// Schéma pour la mise à jour (tous les champs optionnels)
export const cibleCmrProjetUpdateSchema = cibleCmrProjetSchema.partial();

export type CibleCmrProjetUpdateData = z.infer<
  typeof cibleCmrProjetUpdateSchema
>;

// Fonction utilitaire pour formater l'année
export const formatAnnee = (annee: string): string => {
  return annee;
};

// Fonction utilitaire pour valider l'année
export const isValidAnnee = (annee: string): boolean => {
  const currentYear = new Date().getFullYear();
  const year = parseInt(annee);
  return year >= 2000 && year <= currentYear + 10; // Années valides de 2000 à +10 ans dans le futur
};

// Options pour les années (dernières 10 années + 5 années futures)
export const getAnneeOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];

  // Années passées (10 dernières années)
  for (let i = 10; i >= 0; i--) {
    const year = currentYear - i;
    options.push({ value: year.toString(), label: year.toString() });
  }

  // Années futures (5 prochaines années)
  for (let i = 1; i <= 5; i++) {
    const year = currentYear + i;
    options.push({ value: year.toString(), label: year.toString() });
  }

  return options;
};

// Fonction utilitaire pour formater la valeur cible
export const formatValeurCible = (valeur: number): string => {
  return new Intl.NumberFormat("fr-FR").format(valeur);
};
