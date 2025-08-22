// Types pour les entités de paramètres

export enum TitrePersonnelEnum {
  F = "F", // Féminin
  M = "M", // Masculin
}

export interface Personnel extends Record<string, unknown> {
  n_personnel?: number;
  email: string;
  id_personnel_perso: string;
  titre_personnel?: TitrePersonnelEnum;
  prenom_perso?: string;
  nom_perso?: string;
  contact_perso?: string;
  fonction_perso?: string;
  description_fonction_perso?: string;
  niveau_perso?: number;
  rapport_mensuel_perso?: boolean;
  rapport_trimestriel_perso?: boolean;
  rapport_semestriel_perso?: boolean;
  rapport_annuel_perso?: boolean;
  statut?: string;
  region_perso?: number | null;
  structure_perso?: string | null;
  ugl_perso?: string | null;
  projet_active_perso?: string[];
  pass?: string;
}

export interface PlanSite extends Record<string, unknown> {
  id_ds?: number;
  code_ds: string;
  intutile_ds: string;
  niveau_ds: number;
  parent_ds: number;
  code_relai_ds: string;
}

export interface TypeZone extends Record<string, unknown> {
  id_type_zone?: number;
  code_type_zone: string;
  nom_type_zone?: string;
}

// Types pour les formulaires
export type PersonnelFormData = Omit<Personnel, "n_personnel">;
export type PlanSiteFormData = Omit<PlanSite, "id_ds">;
export type TypeZoneFormData = Omit<TypeZone, "id_type_zone">;
