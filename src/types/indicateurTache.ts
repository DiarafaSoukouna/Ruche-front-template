// Types spécifiques pour les indicateurs de tâches PTBA

export interface IndicateurTache extends Record<string, unknown> {
  id_indicateur_tache: number;
  tache: number; // relation vers TacheActivitePtba
  intitule_indicateur_tache: string;
  Responsable_ind_tache: string;
  unite_ind_tache: string;
  code_indicateur_ptba: string;
  indicateur_cmr: number; // relation vers IndicateurCmr
  id_activite: number; // relation vers Ptba
  created_at?: string;
  updated_at?: string;
}

export interface IndicateurTacheRequest {
  tache: number;
  intitule_indicateur_tache: string;
  Responsable_ind_tache: string;
  unite_ind_tache: string;
  code_indicateur_ptba: string;
  indicateur_cmr: number;
  id_activite: number;
}
