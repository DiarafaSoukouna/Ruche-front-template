// Types pour les entités de paramètres

// Niveau Cadre Stratégique
export interface NiveauCadreStrategique extends Record<string, unknown> {
  id_nsc: number;
  nombre_nsc: number;
  libelle_nsc: string;
  code_number_nsc: number;
  type_niveau: 1 | 2 | 3 | string; // 1 - Effet, 2 - Produit, 3 - Impact
}

// Niveau Cadre Analytique
export interface NiveauCadreAnalytique extends Record<string, unknown> {
  id_nca: number;
  nombre_nca: number;
  libelle_nca: string;
  code_number_nca: number;
  type_niveau: 1 | 2 | 3 | string; // 1 - Effet, 2 - Produit, 3 - Impact
}

// Cible CMR Projet
export interface CibleCmrProjet extends Record<string, unknown> {
  id_cible_indicateur_crp: number; // readOnly
  annee: string; // date format - Année de la cible
  valeur_cible_indcateur_crp: number; // Valeur cible de l'indicateur CRP
  code_indicateur_crp?: number | null; // Code de l'indicateur de résultat du projet, relation avec IndicateurCadreResultat
  code_ug?: string | null;
  code_projet?: string | null; // Code du projet concerné
}

export interface TitrePersonnel extends Record<string, unknown> {
  id_titre: number;
  libelle_titre: string;
  description_titre?: string;
}

export interface Personnel extends Record<string, unknown> {
  n_personnel?: number;
  id_personnel_perso?: string;
  titre_personnel?: TitrePersonnel | null;
  nom_perso?: string;
  prenom_perso?: string;
  email?: string;
  contact_perso?: string;
  fonction_perso?: Fonction | null;
  service_perso?: PlanSite | null;
  niveau_perso?: number;
  rapport_mensuel_perso?: boolean;
  rapport_trimestriel_perso?: boolean;
  rapport_semestriel_perso?: boolean;
  rapport_annuel_perso?: boolean;
  statut?: number;
  region_perso?: Localite | null;
  structure_perso?: Acteur | null;
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
  id_type_zone: number;
  code_type_zone: string;
  nom_type_zone: string;
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

export interface Localite extends Record<string, unknown> {
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

export interface ProjetActivePerso {
  id_projet: number,
  code_projet: string,
  sigle_projet: string,
  intitule_projet: string,
  duree_projet: number,
  date_signature_projet: string,
  date_demarrage_projet: string,
  partenaire_projet: number,
  programme_projet: number,
  structure_projet: number[],
  signataires_projet: number[],
  partenaires_execution_projet: number[],
  zone_projet: number[],
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
export type LocaliteFormData = Omit<Localite, "id_loca">;
export type StructureFormData = Omit<Structure, "id_acteur">;
export type UGLFormData = Omit<UGL, "id_ugl">;
export type FonctionFormData = Omit<Fonction, "id_fonction">;
export type NiveauStructureConfigFormData = Omit<
  NiveauStructureConfig,
  "id_nsc"
>;

// ============================================
// RESULTS FRAMEWORKS & INDICATORS ENTITIES
// ============================================

// Unité d'indicateur
export interface UniteIndicateur extends Record<string, unknown> {
  id_unite: number;
  unite_ui: string;
  definition_ui: string;
}

// Cadre logique (cadre_secteur)
export interface CadreSecteur extends Record<string, unknown> {
  id_cl: number;
  code_cl: string;
  intitule_cl: string;
  abrege_cl: string;
  niveau_cl: number;
  parent_cl?: number | null;
  id_programme?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Indicateur de cadre de résultat
export interface IndicateurCadreResultat extends Record<string, unknown> {
  id_indicateur_cr_iop: number;
  niveau_iop: number;
  code_indicateur_cr_iop: string;
  code_cr_iop: string;
  intitule_indicateur_cr_iop: string;
  periodicite_iop: string;
  source_iop: string;
  responsable_iop: string;
  description_iop: string;
  structure_iop?: string;
  projet_iop?: string;
  created_at?: string;
  updated_at?: string;
}

// Indicateur stratégique (indicateur_cmr)
export interface IndicateurCmr extends Record<string, unknown> {
  id_ref_ind_cmr: number;
  code_ref_ind: string;
  resultat_cmr: string;
  intitule_ref_ind: string;
  reference_cmr: string;
  annee_reference: number;
  responsable_collecte_cmr: string;
  cible_cmr: string;
  unite_cmr?: UniteIndicateur | null;
  created_at?: string;
  updated_at?: string;
}

// Dictionnaire des indicateurs
export interface DictionnaireIndicateur extends Record<string, unknown> {
  id_ref_ind_ref: number;
  code_ref_ind: string;
  intitule_ref_ind: string;
  unite_cmr?: UniteIndicateur | null;
  fonction_agregat_cmr?: string;
  echelle?: TypeZone | null;
  typologie?: string;
  seuil_minimum?: number;
  seuil_maximum?: number;
  responsable_collecte_cmr?: Acteur;
  created_at?: string;
  updated_at?: string;
}

// Form Data Types
export type UniteIndicateurFormData = Omit<UniteIndicateur, "id_unite">;
export type CadreSecteurFormData = Omit<CadreSecteur, "id_cl">;
export type IndicateurCadreResultatFormData = Omit<
  IndicateurCadreResultat,
  "id_indicateur_cr_iop"
>;
export type IndicateurCmrFormData = Omit<IndicateurCmr, "id_ref_ind_cmr">;
export type DictionnaireIndicateurFormData = Omit<
  DictionnaireIndicateur,
  "id_ref_ind_ref"
>;

// Programme Entity
export interface Programme extends Record<string, unknown> {
  id_programme: number;
  code_programme: string;
  nom_programme: string;
  description_programme?: string;
  date_debut?: string;
  date_fin?: string;
  budget?: number;
  statut?: number;
  created_at?: string;
  updated_at?: string;
}

// CadreStrategique Entity
export interface CadreStrategique extends Record<string, unknown> {
  id_cs: number;
  code_cs: string;
  intutile_cs: string;
  abgrege_cs: string;
  niveau_cs: number | string;
  cout_axe: number;
  date_enregistrement: string;
  date_modification: string;
  etat?: number;
  partenaire_cs?: Acteur | null;
  parent_cs?: CadreStrategique | number | null;
  projet_cs?: Programme | null;
  created_at?: string;
  updated_at?: string;
}

// CadreStrategiqueConfig Entity
export interface CadreStrategiqueConfig extends Record<string, unknown> {
  id_csc: number;
  nombre: number;
  libelle_csc: string;
  type_csc: 1 | 2 | 3; // 1 - Effet, 2 - Produit, 3 - Impact
  date_enregistrement: string;
  date_modification: string;
  etat?: number;
  programme?: Programme | null;
  created_at?: string;
  updated_at?: string;
}

// Form Data Types for new entities
export type CadreStrategiqueFormData = Omit<CadreStrategique, "id_cs">;
export type CadreStrategiqueConfigFormData = Omit<CadreStrategiqueConfig, "id_csc">;
