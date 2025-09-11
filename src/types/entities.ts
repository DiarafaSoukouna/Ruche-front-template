// Types pour les entités de paramètres
export interface TitrePersonnel extends Record<string, unknown> {
  id_titre: number;
  libelle_titre: string;
  description_titre?: string;
}

export interface Personnel extends Record<string, unknown> {
  n_personnel?: number;
  id_personnel_perso?: string;
  titre_personnel?: number | TitrePersonnel | null;
  nom_perso?: string;
  prenom_perso?: string;
  email?: string;
  contact_perso?: string;
  fonction_perso?: number | Fonction | null;
  service_perso?: number | PlanSite | null;
  niveau_perso?: number;
  rapport_mensuel_perso?: boolean;
  rapport_trimestriel_perso?: boolean;
  rapport_semestriel_perso?: boolean;
  rapport_annuel_perso?: boolean;
  statut?: number;
  region_perso?: number | null;
  structure_perso?: string | Acteur | null;
  ugl_perso?: string | null;
  projet_active_perso?: ProjetActivePerso[];
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
export interface Acteur extends Record<string, unknown> {
  id_acteur: number;
  code_acteur: string;
  nom_acteur: string;
  description_acteur: string;
  personne_responsable: string;
  contact: string;
  adresse_email: string;
  categorie_acteur: number;
}

export interface Convention extends Record<string, unknown> {
  id_convention?: number;
  code_convention: string;
  intutile_conv: string;
  reference_conv: string;
  montant_conv: number;
  date_signature_conv: string;
  etat_conv: string;
  partenaire_conv: Partial<Acteur> | null;
}

export interface Region extends Record<string, unknown> {
  id_loca: number;
  code_loca: string;
  intitule_loca: string;
  code_national_loca: string;
  parent_loca: number | null;
  niveau_loca: number;
}

export interface Structure extends Record<string, unknown> {
  id_acteur: number;
  code_acteur: string;
  nom_acteur: string;
  description_acteur: string;
  personne_responsable: string;
  contact: string;
  adresse_email: string;
  categorie_acteur: number;
}

export interface UGL extends Record<string, unknown> {
  id_ugl: number;
  code_ugl: string;
  nom_ugl: string;
  abrege_ugl: string;
  couleur_ugl: string;
  chef_lieu_ugl: number;
  region_concerne_ugl: number[];
}

export interface Fonction extends Record<string, unknown> {
  id_fonction?: number;
  nom_fonction: string;
  description_fonction: string;
}

export interface NiveauStructureConfig extends Record<string, unknown> {
  id_nsc?: number;
  nombre_nsc: number;
  libelle_nsc: string;
  code_number_nsc: string;
  id_programme: number;
}

// Types pour les formulaires
export type PersonnelFormData = Omit<Personnel, "n_personnel">;
export type PlanSiteFormData = Omit<PlanSite, "id_ds">;
export type TypeZoneFormData = Omit<TypeZone, "id_type_zone">;
export type ActeurFormData = Omit<Acteur, "id_acteur">;
export type RegionFormData = Omit<Region, "id_loca">;
export type StructureFormData = Omit<Structure, "id_acteur">;
export type UGLFormData = Omit<UGL, "id_ugl">;
export type FonctionFormData = Omit<Fonction, "id_fonction">;
export type NiveauStructureConfigFormData = Omit<
  NiveauStructureConfig,
  "id_nsc"
>;
