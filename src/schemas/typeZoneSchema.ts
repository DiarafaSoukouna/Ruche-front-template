import { z } from 'zod';

// Schéma de validation pour Type Zone basé sur la documentation
export const typeZoneSchema = z.object({
  // Code type zone - AN 20 caractères, requis
  code_type_zone: z
    .string()
    .min(1, 'Code type zone requis')
    .max(20, 'Code ne peut pas dépasser 20 caractères')
    .regex(/^[A-Za-z0-9]+$/, 'Code doit contenir uniquement des lettres et chiffres'),

  // Nom type zone - A (alphabétique), optionnel
  nom_type_zone: z
    .string()
    .regex(/^[A-Za-zÀ-ÿ\s\-'.,]*$/, 'Nom doit contenir uniquement des lettres et ponctuation')
    .optional(),
});

export type TypeZoneFormData = z.infer<typeof typeZoneSchema>;
