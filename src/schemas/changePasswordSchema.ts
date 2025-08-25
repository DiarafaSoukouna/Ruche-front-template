import { z } from 'zod';

// Schéma de validation pour le changement de mot de passe
export const changePasswordSchema = z.object({
  // Mot de passe actuel - requis
  oldPassword: z
    .string()
    .min(1, 'Mot de passe actuel requis'),

  // Nouveau mot de passe - requis avec validation de force
  newPassword: z
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),

  // Confirmation du nouveau mot de passe - doit correspondre
  confirmNewPassword: z
    .string()
    .min(1, 'Confirmation du mot de passe requise'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmNewPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
