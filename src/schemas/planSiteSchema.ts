import { z } from "zod";

// Schéma de validation pour Plan Site basé sur la documentation
export const planSiteSchema = z.object({
  // Code direction/service - AN 20 caractères, requis
  code_ds: z
    .string({
      message: "Le code direction/service est requis",
    })
    .min(1, "Code direction/service requis")
    .max(20, "Code ne peut pas dépasser 20 caractères")
    .regex(
      /^[A-Za-z0-9\-_]+$/,
      "Code doit contenir uniquement des lettres, chiffres, tirets et underscores"
    )
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => val.length >= 2, {
      message: "Le code doit contenir au moins 2 caractères",
    }),

  // Intitulé - A (alphabétique), requis
  intutile_ds: z
    .string({
      message: "L'intitulé est requis",
    })
    .min(1, "Intitulé requis")
    .max(200, "Intitulé ne peut pas dépasser 200 caractères")
    .regex(
      /^[A-Za-zÀ-ÿ0-9\s\-'.,()]+$/,
      "Intitulé doit contenir uniquement des lettres, chiffres, espaces et ponctuation"
    )
    .transform((val) => val.trim())
    .refine((val) => val.length >= 3, {
      message: "L'intitulé doit contenir au moins 3 caractères",
    }),

  // Niveau hiérarchique - N 11 chiffres, requis
  niveau_ds: z
    .number({
      message: "Le niveau hiérarchique est requis et doit être un nombre",
    })
    .int("Niveau doit être un nombre entier")
    .min(0, "Niveau doit être positif ou nul")
    .max(99999999999, "Niveau ne peut pas dépasser 11 chiffres")
    .refine((val) => val >= 0, {
      message: "Le niveau doit être un nombre positif ou nul",
    }),

  // Code parent - N, requis
  parent_ds: z
    .number({
      message: "Le code parent est requis et doit être un nombre",
    })
    .int("Code parent doit être un nombre entier")
    .min(0, "Code parent doit être positif ou nul")
    .max(999999999, "Code parent ne peut pas dépasser 9 chiffres")
    .optional(),

  // Code relai - A (alphabétique), requis
  code_relai_ds: z
    .string()
    .min(1, "Code relai requis")
    .max(50, "Code relai ne peut pas dépasser 50 caractères")
    .optional(),
});

// Schéma avec validations contextuelles pour le formulaire
export const planSiteFormSchema = planSiteSchema
  .refine(
    (data) => {
      // Validation: le code ne doit pas être générique
      const genericCodes = ["TEST", "TEMP", "TMP", "XXX", "ABC", "123"];
      return !genericCodes.includes(data.code_ds);
    },
    {
      message: "Le code ne peut pas être un code générique (TEST, TEMP, etc.)",
      path: ["code_ds"],
    }
  )
  .refine(
    (data) => {
      // Validation: cohérence entre niveau et parent
      if (data.niveau_ds === 0 && data.parent_ds !== 0) {
        return false; // Niveau racine doit avoir parent = 0
      }
      if (data.niveau_ds > 0 && data.parent_ds === 0) {
        return false; // Niveau non-racine doit avoir un parent
      }
      return true;
    },
    {
      message:
        "Incohérence: niveau racine (0) doit avoir parent=0, autres niveaux doivent avoir un parent",
      path: ["parent_ds"],
    }
  )
  .refine(
    (data) => {
      // Validation: intitulé approprié selon le niveau
      const niveau = data.niveau_ds;
      const intitule = data.intutile_ds.toLowerCase();

      if (niveau === 0) {
        // Niveau racine: ministère, gouvernement, etc.
        const rootKeywords = [
          "ministère",
          "gouvernement",
          "présidence",
          "cabinet",
        ];
        return rootKeywords.some((keyword) => intitule.includes(keyword));
      } else if (niveau === 1) {
        // Premier niveau: direction générale, secrétariat, etc.
        const level1Keywords = [
          "direction",
          "secrétariat",
          "département",
          "division",
        ];
        return level1Keywords.some((keyword) => intitule.includes(keyword));
      }
      return true; // Pas de validation spécifique pour les autres niveaux
    },
    {
      message:
        "L'intitulé devrait correspondre au niveau hiérarchique (ex: Ministère pour niveau 0, Direction pour niveau 1)",
      path: ["intutile_ds"],
    }
  );

export type PlanSiteFormData = z.infer<typeof planSiteFormSchema>;

// Validation helpers
export const validateNiveauHierarchique = (
  niveau: number,
  parent: number
): boolean => {
  if (niveau === 0) return parent === 0;
  return niveau > 0 && parent >= 0;
};

export const validateCodeDS = (code: string): boolean => {
  const genericCodes = ["TEST", "TEMP", "TMP", "XXX", "ABC", "123"];
  return !genericCodes.includes(code.toUpperCase()) && code.length >= 2;
};
