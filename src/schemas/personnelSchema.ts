import { z } from "zod";
import { TitrePersonnelEnum } from "../types/entities";

// Schéma pour la création de personnel (PersonnelRequest)
export const personnelCreateSchema = z.object({
  // Email - string(email), requis
  email: z
    .string()
    .email("Format email invalide")
    .max(254, "Email ne peut pas dépasser 254 caractères"),

  // ID personnel - string, requis
  id_personnel_perso: z.string().min(1, "ID personnel requis"),

  // Titre personnel - enum TitrePersonnelEnum, optionnel
  titre_personnel: z
    .enum([TitrePersonnelEnum.M, TitrePersonnelEnum.F])
    .optional(),

  // Prénom - string, optionnel
  prenom_perso: z.string().optional(),

  // Nom - string, optionnel
  nom_perso: z.string().optional(),

  // Contact - string, optionnel
  contact_perso: z.string().optional(),

  // Fonction - string, optionnel
  fonction_perso: z.string().optional(),

  // Description fonction - string, optionnel
  description_fonction_perso: z.string().optional(),

  // Niveau - integer, optionnel
  niveau_perso: z.number().int("Niveau doit être un nombre entier").optional(),

  // Rapport mensuel - boolean, optionnel
  rapport_mensuel_perso: z.boolean().optional(),

  // Rapport trimestriel - boolean, optionnel
  rapport_trimestriel_perso: z.boolean().optional(),

  // Rapport semestriel - boolean, optionnel
  rapport_semestriel_perso: z.boolean().optional(),

  // Rapport annuel - boolean, optionnel
  rapport_annuel_perso: z.boolean().optional(),

  // Statut - string, optionnel
  statut: z.string().optional(),

  // Région - integer, optionnel
  region_perso: z.number().int("Région doit être un nombre entier").optional(),

  // Structure - string, optionnel
  structure_perso: z.string().optional(),

  // UGL - string, optionnel
  ugl_perso: z.string().optional(),

  // Projet actif - string, optionnel
  projet_active_perso: z.string().optional(),
});

// Schéma pour la modification de personnel (PatchedPersonnelRequest)
export const personnelUpdateSchema = z.object({
  // Mot de passe - string, optionnel pour la modification
  password: z.string().optional(),

  // Email - string(email), optionnel pour la modification
  email: z
    .string()
    .email("Format email invalide")
    .max(254, "Email ne peut pas dépasser 254 caractères")
    .optional(),

  // ID personnel - string, optionnel pour la modification
  id_personnel_perso: z.string().optional(),

  // Titre personnel - enum TitrePersonnelEnum, optionnel
  titre_personnel: z
    .enum([TitrePersonnelEnum.M, TitrePersonnelEnum.F])
    .optional(),

  // Prénom - string, optionnel
  prenom_perso: z.string().optional(),

  // Nom - string, optionnel
  nom_perso: z.string().optional(),

  // Contact - string, optionnel
  contact_perso: z.string().optional(),

  // Fonction - string, optionnel
  fonction_perso: z.string().optional(),

  // Description fonction - string, optionnel
  description_fonction_perso: z.string().optional(),

  // Niveau - integer, optionnel
  niveau_perso: z.number().int("Niveau doit être un nombre entier").optional(),

  // Rapport mensuel - boolean, optionnel
  rapport_mensuel_perso: z.boolean().optional(),

  // Rapport trimestriel - boolean, optionnel
  rapport_trimestriel_perso: z.boolean().optional(),

  // Rapport semestriel - boolean, optionnel
  rapport_semestriel_perso: z.boolean().optional(),

  // Rapport annuel - boolean, optionnel
  rapport_annuel_perso: z.boolean().optional(),

  // Statut - string, optionnel
  statut: z.string().optional(),

  // Région - integer, optionnel
  region_perso: z.number().int("Région doit être un nombre entier").optional(),

  // Structure - string, optionnel
  structure_perso: z.string().optional(),

  // UGL - string, optionnel
  ugl_perso: z.string().optional(),

  // Projet actif - string, optionnel
  projet_active_perso: z.string().optional(),
});

// Types pour les formulaires
export type PersonnelCreateData = z.infer<typeof personnelCreateSchema>;
export type PersonnelUpdateData = z.infer<typeof personnelUpdateSchema>;

// Schema principal qui s'adapte selon le mode
export const personnelSchema = personnelCreateSchema;
export type PersonnelFormData = PersonnelCreateData;
