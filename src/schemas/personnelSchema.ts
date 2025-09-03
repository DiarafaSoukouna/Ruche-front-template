import { z } from "zod";

// Schéma pour la création de personnel (PersonnelRequest)
export const personnelCreateSchema = z.object({
  // Email - string(email), requis
  email: z
    .email("Format email invalide")
    .max(254, "Email ne peut pas dépasser 254 caractères"),

  // ID personnel - string, requis
  id_personnel_perso: z.string("Identifiant requis").min(1, "Identifiant requis"),

  // Titre personnel - integer, requis
  titre_personnel: z.number("Titre requis").min(1, "Titre requis"),

  // Prénom - string, requis
  prenom_perso: z.string("Prénom requis").min(1, "Prénom requis"),

  // Nom - string, requis
  nom_perso: z.string("Nom requis").min(1, "Nom requis"),

  // Contact - string, requis
  contact_perso: z.string("Contact requis").min(1, "Contact requis"),

  // Fonction - number (ID de la fonction), requis
  fonction_perso: z.number("Fonction requise").min(1, "Fonction requise"),

  // Service - number (ID du plan site), optionnel
  service_perso: z.number("Service requis").min(1, "Service requis").optional(),

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


  // Région - integer (ID de la localité), requis
  region_perso: z.int("Région requise").min(1, "Région requise"),

  // Structure - integer (ID de l'acteur), requis
  structure_perso: z.int("Structure requise").min(1, "Structure requise"),

  // UGL - integer (ID de l'UGL), optionnel
  ugl_perso: z.int("UGL requise").min(1, "UGL requise"),

  // Projet actif - string, optionnel
  projet_active_perso: z.string("Projet actif requis").optional(),
});

// Types pour les formulaires
export type PersonnelCreateData = z.infer<typeof personnelCreateSchema>;

// Schema principal qui s'adapte selon le mode
export const personnelSchema = personnelCreateSchema;
export type PersonnelFormData = PersonnelCreateData;
