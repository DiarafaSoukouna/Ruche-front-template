import { z } from "zod";
import { TitrePersonnelEnum } from "../types/entities";

// Schéma pour la création de personnel (PersonnelRequest)
export const personnelCreateSchema = z.object({
  // Email - string(email), requis
  email: z
    .email("Format email invalide")
    .max(254, "Email ne peut pas dépasser 254 caractères"),

  // ID personnel - string, requis
  id_personnel_perso: z.string().min(1, "Identifiant requis"),

  // Titre personnel - enum TitrePersonnelEnum, optionnel
  titre_personnel: z.enum([TitrePersonnelEnum.M, TitrePersonnelEnum.F], {
    error: "Titre requis",
  }),

  // Prénom - string, requis
  prenom_perso: z.string().min(1, "Prénom requis"),

  // Nom - string, requis
  nom_perso: z.string().min(1, "Nom requis"),

  // Contact - string, requis
  contact_perso: z.string("Contact requis").min(1, "Contact requis"),

  // Fonction - string, requis
  fonction_perso: z.string("Fonction requise").min(1, "Fonction requise"),

  // Description fonction - string, optionnel
  description_fonction_perso: z.string().optional(),

  // Niveau - integer, requis
  niveau_perso: z
    .int("Niveau doit être un nombre entier")
    .min(1, "Niveau requis"),

  // Rapport mensuel - boolean, requis
  rapport_mensuel_perso: z.boolean().optional(),

  // Rapport trimestriel - boolean, optionnel
  rapport_trimestriel_perso: z.boolean().optional(),

  // Rapport semestriel - boolean, optionnel
  rapport_semestriel_perso: z.boolean().optional(),

  // Rapport annuel - boolean, optionnel
  rapport_annuel_perso: z.boolean().optional(),

  // Statut - string, requis
  statut: z.string("Statut requis").min(1, "Statut requis"),

  // Région - integer (ID de la localité), requis
  region_perso: z.int("Région requise").min(1, "Région requise"),

  // Structure - integer (ID de l'acteur), requis
  structure_perso: z.int("Structure requise").min(1, "Structure requise"),

  // UGL - integer (ID de l'UGL), optionnel
  ugl_perso: z.int("UGL requise").min(1, "UGL requise"),

  // Projet actif - string, optionnel
  projet_active_perso: z.string().optional(),
});

// Types pour les formulaires
export type PersonnelCreateData = z.infer<typeof personnelCreateSchema>;

// Schema principal qui s'adapte selon le mode
export const personnelSchema = personnelCreateSchema;
export type PersonnelFormData = PersonnelCreateData;
