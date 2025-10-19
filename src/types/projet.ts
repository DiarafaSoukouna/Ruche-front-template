import { typeLocalite } from "../functions/localites/types";
import {
  Acteur,
  ActiviteProjet,
  IndicateurPerformanceProjet,
  IndicateurActivitePtba,
} from "./entities";
import { ProgrammeTypes } from "./programme";

export interface Projet {
  id_projet: number;
  code_projet: string;
  sigle_projet: string;
  intitule_projet: string;
  duree_projet: number;
  date_signature_projet: string;
  date_demarrage_projet: string;
  partenaire_projet?: Acteur;
  programme_projet?: ProgrammeTypes;
  structure_projet: Acteur[];
  signataires_projet: Acteur[];
  partenaires_execution_projet: Acteur[];
  zone_projet: typeLocalite[];
}

export type ProjetFormData = Omit<Projet, "id_projet">;

export interface ProjetSelectOption {
  value: number;
  label: string;
  projet: Projet;
}

// ============================================
// TYPES POUR LES NOUVELLES ENTITÉS PROJET
// ============================================

// Type pour les options de sélection d'activité projet
export interface ActiviteProjetSelectOption {
  value: number;
  label: string;
  activite: ActiviteProjet;
}

// Type pour les options de sélection d'indicateur performance
export interface IndicateurPerformanceProjetSelectOption {
  value: number;
  label: string;
  indicateur: IndicateurPerformanceProjet;
}

// Type pour les options de sélection d'indicateur activité PTBA
export interface IndicateurActivitePtbaSelectOption {
  value: number;
  label: string;
  indicateur: IndicateurActivitePtba;
}

// Export des types d'entités pour faciliter l'import
export type {
  ActiviteProjet,
  IndicateurPerformanceProjet,
  IndicateurActivitePtba,
};
