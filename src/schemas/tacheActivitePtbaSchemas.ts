import { z } from "zod";

// Schéma de validation pour TacheActivitePtba
export const tacheActivitePtbaSchema = z.object({
  intutile_tache_gt: z
    .string()
    .min(1, "L'intitulé de la tâche est requis")
    .max(200, "L'intitulé ne peut pas dépasser 200 caractères"),
  
  proportion_gt: z
    .string()
    .min(1, "La proportion est requise")
    .max(10, "La proportion ne peut pas dépasser 10 caractères"),
  
  code_tache_gt: z
    .string()
    .min(1, "Le code de la tâche est requis")
    .max(200, "Le code ne peut pas dépasser 200 caractères"),
  
  date_debut_gt: z
    .string()
    .min(1, "La date de début est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  
  date_fin_gt: z
    .string()
    .min(1, "La date de fin est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  
  date_reelle_gt: z
    .string()
    .min(1, "La date réelle est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  
  n_lot_gt: z
    .number()
    .int("Le numéro de lot doit être un entier")
    .positive("Le numéro de lot doit être positif"),
  
  valider_gt: z
    .string()
    .min(1, "Le statut de validation est requis")
    .max(100, "Le statut ne peut pas dépasser 100 caractères"),
  
  observation_gt: z
    .string()
    .max(200, "L'observation ne peut pas dépasser 200 caractères")
    .optional(),
  
  livrable_gt: z
    .string()
    .min(1, "Le livrable est requis")
    .max(100, "Le livrable ne peut pas dépasser 100 caractères"),
  
  id_personnel_gt: z
    .number()
    .int("L'ID du personnel doit être un entier")
    .positive("L'ID du personnel doit être positif"),
  
  responsable_gt: z
    .string()
    .min(1, "Le responsable est requis")
    .max(100, "Le responsable ne peut pas dépasser 100 caractères"),
  
  id_activite: z
    .number()
    .int("L'ID de l'activité doit être un entier")
    .positive("L'ID de l'activité doit être positif"),
});

// Type inféré du schéma
export type TacheActivitePtbaFormData = z.infer<typeof tacheActivitePtbaSchema>;

// Options pour les statuts de validation
export const statutValidationOptions = [
  { value: "En attente", label: "En attente" },
  { value: "En cours", label: "En cours" },
  { value: "Validé", label: "Validé" },
  { value: "Rejeté", label: "Rejeté" },
  { value: "Terminé", label: "Terminé" },
];
