import { z } from 'zod';

// Schéma de validation pour les conventions
export const conventionSchema = z.object({
  // ID de la convention (auto-généré)
  id_convention: z.number().optional(),

  // Code de la convention - requis
  code_convention: z
    .string()
    .min(1, 'Code de convention requis')
    .max(50, 'Code de convention trop long'),

  // Intitulé de la convention - requis
  intutile_conv: z
    .string()
    .min(1, 'Intitulé de convention requis')
    .max(255, 'Intitulé trop long'),

  // Référence de la convention - requis
  reference_conv: z
    .string()
    .min(1, 'Référence de convention requise')
    .max(100, 'Référence trop longue'),

  // Montant de la convention - requis
  montant_conv: z
    .number()
    .min(0, 'Le montant doit être positif'),

  // Date de signature - requis
  date_signature_conv: z
    .string()
    .min(1, 'Date de signature requise')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Format de date invalide',
    }),

  // État de la convention - requis
  etat_conv: z
    .string()
    .min(1, 'État de convention requis')
    .max(50, 'État trop long'),

  // Partenaire de la convention - optionnel (ID de l'acteur)
  partenaire_conv: z
    .number()
    .optional()
    .nullable(),
});

// Schéma pour les données du formulaire (sans l'ID pour la création)
export const conventionFormSchema = conventionSchema.omit({ id_convention: true });
export type ConventionFormData = z.infer<typeof conventionFormSchema>;

// Options pour l'état des conventions
export const CONVENTION_STATES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'suspendue', label: 'Suspendue' },
] as const;
