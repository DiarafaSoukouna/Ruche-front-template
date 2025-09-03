import { z } from "zod";
import type { NiveauStructureConfig } from "../types/entities";

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
;

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

// Dynamic validation function using niveau_structure_config
export const validatePlanSiteWithConfig = (
  data: { niveau_ds: number; parent_ds?: number; intutile_ds: string },
  niveauConfigs: NiveauStructureConfig[]
): { isValid: boolean; message?: string } => {
  const { niveau_ds, parent_ds, intutile_ds } = data;
  
  // Find the configuration for this niveau
  const config = niveauConfigs.find(c => c.nombre_nsc === niveau_ds);
  
  if (!config) {
    return {
      isValid: false,
      message: `Niveau ${niveau_ds} non configuré dans niveau_structure_config`
    };
  }
  
  // Validate parent-child relationship based on configuration
  if (niveau_ds === 1) {
    // Premier niveau doit avoir parent_ds = 0 ou null
    if (parent_ds !== 0 && parent_ds !== undefined && parent_ds !== null) {
      return {
        isValid: false,
        message: `Le niveau racine (${config.libelle_nsc}) doit avoir parent_ds = 0`
      };
    }
  } else if (niveau_ds > 1) {
    // Niveaux supérieurs doivent avoir un parent valide
    if (!parent_ds || parent_ds === 0) {
      return {
        isValid: false,
        message: `Le niveau ${config.libelle_nsc} doit avoir un parent valide`
      };
    }
  }
  
  // Validate code length based on configuration
  if (config.code_number_nsc) {
    const expectedLength = parseInt(config.code_number_nsc);
    if (!isNaN(expectedLength) && intutile_ds.length > expectedLength * 10) {
      return {
        isValid: false,
        message: `L'intitulé pour ${config.libelle_nsc} est trop long selon la configuration`
      };
    }
  }
  
  return { isValid: true };
};

// Create dynamic schema factory
export const createPlanSiteFormSchemaWithConfig = (niveauConfigs: NiveauStructureConfig[]) => {
  return planSiteFormSchema.refine(
    (data) => {
      const validation = validatePlanSiteWithConfig(data, niveauConfigs);
      return validation.isValid;
    },
    {
      message: "Validation échouée selon la configuration niveau_structure_config",
      path: ["niveau_ds"],
    }
  );
};
