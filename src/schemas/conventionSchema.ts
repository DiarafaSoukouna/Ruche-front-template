import { z } from "zod";

// Schéma de validation pour les conventions
export const conventionSchema = z.object({
  // ID de la convention (auto-généré)
  id_convention: z.number().optional(),

  // Code de la convention - requis
  code_convention: z
    .string({
      message: "Le code de convention est requis",
    })
    .min(1, "Code de convention requis")
    .max(50, "Code de convention trop long")
    .regex(
      /^[A-Z0-9\-_]+$/,
      "Le code doit contenir uniquement des lettres majuscules, chiffres, tirets et underscores"
    )
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => val.length >= 3, {
      message: "Le code doit contenir au moins 3 caractères",
    }),

  // Intitulé de la convention - requis
  intutile_conv: z
    .string({
      message: "L'intitulé de convention est requis",
    })
    .min(1, "Intitulé de convention requis")
    .max(255, "Intitulé trop long")
    .regex(
      /^[A-Za-zÀ-ÿ0-9\s\-'.,()]+$/,
      "L'intitulé doit contenir uniquement des lettres, chiffres, espaces et ponctuation"
    )
    .transform((val) => val.trim())
    .refine((val) => val.length >= 5, {
      message: "L'intitulé doit contenir au moins 5 caractères",
    }),

  // Référence de la convention - requis
  reference_conv: z
    .string({
      message: "La référence de convention est requise",
    })
    .min(1, "Référence de convention requise")
    .max(100, "Référence trop longue")
    .regex(
      /^[A-Za-z0-9\-_/]+$/,
      "La référence doit contenir uniquement des lettres, chiffres, tirets, underscores et slashes"
    )
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => val.length >= 3, {
      message: "La référence doit contenir au moins 3 caractères",
    }),

  // Montant de la convention - requis
  montant_conv: z
    .number({
      message: "Le montant de convention est requis et doit être un nombre",
    })
    .min(0, "Le montant doit être positif ou nul")
    .max(999999999, "Le montant ne peut pas dépasser 999 999 999")
    .refine((val) => Number.isFinite(val), {
      message: "Le montant doit être un nombre valide",
    }),

  // Date de signature - requis
  date_signature_conv: z
    .string({
      message: "La date de signature est requise",
    })
    .min(1, "Date de signature requise")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Format de date invalide (YYYY-MM-DD attendu)",
    })
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        const today = new Date();
        const minDate = new Date("1900-01-01");
        return parsedDate >= minDate && parsedDate <= today;
      },
      {
        message: "La date doit être comprise entre 1900 et aujourd'hui",
      }
    ),

  // État de la convention - requis
  etat_conv: z
    .string({
      message: "L'état de convention est requis",
    })
    .min(1, "État de convention requis")
    .max(50, "État trop long")
    .refine(
      (val) =>
        ["active", "inactive", "en_cours", "terminee", "suspendue"].includes(
          val
        ),
      {
        message:
          "État invalide. Valeurs acceptées: active, inactive, en_cours, terminee, suspendue",
      }
    ),

  // Partenaire de la convention - optionnel (ID de l'acteur)
  partenaire_conv: z
    .number({
      message: "L'ID du partenaire doit être un nombre",
    })
    .int("L'ID du partenaire doit être un entier")
    .min(1, "L'ID du partenaire doit être positif")
    .optional()
    .nullable(),
});

// Schéma avec validations contextuelles pour le formulaire
export const conventionFormSchema = conventionSchema.omit({
  id_convention: true,
});

export type ConventionFormData = z.infer<typeof conventionFormSchema>;

// Options pour l'état des conventions avec descriptions
export const CONVENTION_STATES = [
  {
    value: "active",
    label: "Active",
    description: "Convention en vigueur et opérationnelle",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Convention temporairement suspendue",
  },
  {
    value: "en_cours",
    label: "En cours",
    description: "Convention en cours de négociation",
  },
  {
    value: "terminee",
    label: "Terminée",
    description: "Convention arrivée à échéance",
  },
  {
    value: "suspendue",
    label: "Suspendue",
    description: "Convention suspendue par décision",
  },
] as const;

// Validation helper pour les montants
export const validateMontant = (montant: number): boolean => {
  return Number.isFinite(montant) && montant >= 0 && montant <= 999999999;
};

// Validation helper pour les dates
export const validateDateSignature = (date: string): boolean => {
  if (!date) return false;
  const parsedDate = new Date(date);
  const today = new Date();
  const minDate = new Date("1900-01-01");
  return (
    !isNaN(parsedDate.getTime()) && parsedDate >= minDate && parsedDate <= today
  );
};
