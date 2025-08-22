import { z } from "zod";

// Schéma de validation pour Plan Site basé sur la documentation
export const planSiteSchema = z.object({
  // Code direction/service - AN 20 caractères, requis
  code_ds: z
    .string()
    .min(1, "Code direction/service requis")
    .max(20, "Code ne peut pas dépasser 20 caractères")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Code doit contenir uniquement des lettres et chiffres"
    ),

  // Intitulé - A (alphabétique), requis
  intutile_ds: z
    .string()
    .min(1, "Intitulé requis")
    .regex(
      /^[A-Za-zÀ-ÿ\s\-'.,]+$/,
      "Intitulé doit contenir uniquement des lettres et ponctuation"
    ),

  // Niveau hiérarchique - N 11 chiffres, requis
  niveau_ds: z
    .int("Niveau doit être un nombre entier")
    .min(0, "Niveau doit être positif")
    .max(99999999999, "Niveau ne peut pas dépasser 11 chiffres"),

  // Code parent - N, requis
  parent_ds: z
    .int("Code parent doit être un nombre entier")
    .min(0, "Code parent doit être positif"),

  // Code relai - A (alphabétique), requis
  code_relai_ds: z
    .string()
    .min(1, "Code relai requis")
    .regex(
      /^[A-Za-zÀ-ÿ\s\-'.,]+$/,
      "Code relai doit contenir uniquement des lettres"
    ),
});

export type PlanSiteFormData = z.infer<typeof planSiteSchema>;
