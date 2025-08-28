import { z } from "zod";

// Schéma de validation pour NiveauStructureConfig
export const niveauStructureConfigSchema = z.object({
  // Nombre - N, requis (niveau hiérarchique)
  nombre_nsc: z
    .number({
      message: "Le niveau hiérarchique est requis et doit être un nombre",
    })
    .int("Le niveau doit être un entier")
    .min(1, "Le niveau doit être supérieur à 0")
    .max(99, "Le niveau ne peut pas dépasser 99")
    .refine((val) => val > 0, {
      message: "Le niveau doit être un nombre positif",
    }),

  // Libellé - A (alphabétique), requis
  libelle_nsc: z
    .string({
      message: "Le libellé est requis et doit être une chaîne de caractères",
    })
    .min(1, "Le libellé ne peut pas être vide")
    .max(100, "Le libellé ne peut pas dépasser 100 caractères")
    .regex(
      /^[A-Za-zÀ-ÿ\s\-'.,()]+$/,
      "Le libellé doit contenir uniquement des lettres, espaces et ponctuation"
    )
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Le libellé ne peut pas être vide après suppression des espaces",
    }),

  // Code numérique - AN, requis
  code_number_nsc: z
    .string({
      message:
        "Le code numérique est requis et doit être une chaîne de caractères",
    })
    .min(1, "Le code numérique ne peut pas être vide")
    .max(20, "Le code numérique ne peut pas dépasser 20 caractères")
    .regex(
      /^[A-Za-z0-9\-_]+$/,
      "Le code doit contenir uniquement des lettres, chiffres, tirets et underscores"
    )
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => val.length >= 2, {
      message: "Le code doit contenir au moins 2 caractères",
    }),

  // ID Programme - N, requis
  id_programme: z
    .number({
      message: "L'ID programme est requis et doit être un nombre",
    })
    .int("L'ID programme doit être un entier")
    .min(0, "L'ID programme doit être positif ou nul")
    .max(999999, "L'ID programme ne peut pas dépasser 999999")
    .optional(),
});

// Schéma avec validation contextuelle pour la création/modification
export const niveauStructureConfigFormSchema =
  niveauStructureConfigSchema.refine(
    (data) => {
      // Validation personnalisée : le code ne doit pas être trop générique
      const genericCodes = ["TEST", "TEMP", "TMP", "XXX", "ABC", "123"];
      return !genericCodes.includes(data.code_number_nsc);
    },
    {
      message: "Le code ne peut pas être un code générique (TEST, TEMP, etc.)",
      path: ["code_number_nsc"],
    }
  );

export type NiveauStructureConfigFormData = z.infer<
  typeof niveauStructureConfigFormSchema
>;
