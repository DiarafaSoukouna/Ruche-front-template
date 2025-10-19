// Types de requêtes pour les API des nouvelles entités projet

// ============================================
// ACTIVITÉ PROJET
// ============================================

export interface ActiviteProjetRequest {
  code_activite_projet: string;
  intitule_activite_projet: string;
  niveau_activite_projet: number;
  parent_activite_projet?: number | null;
  code_activite_programme?: string | null;
  code_projet?: string | null;
}

export interface ActiviteProjetResponse {
  id_activite_projet: number;
  code_activite_projet: string;
  intitule_activite_projet: string;
  niveau_activite_projet: number;
  parent_activite_projet?: number | null;
  code_activite_programme?: string | null;
  code_projet?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// INDICATEUR PERFORMANCE PROJET
// ============================================

export interface IndicateurPerformanceProjetRequest {
  code_indicateur_performance: string;
  intitule_indicateur_tache: string;
  code_activite_projet?: string | number | null;
  unite_indicateur_performance?: number | null;
  code_projet?: string | null;
}

export interface IndicateurPerformanceProjetResponse {
  id_indicateur_performance: number;
  code_indicateur_performance: string;
  intitule_indicateur_tache: string;
  code_activite_projet?: string | number | null;
  unite_indicateur_performance?: number | null;
  code_projet?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// INDICATEUR ACTIVITÉ PTBA
// ============================================

export interface IndicateurActivitePtbaRequest {
  code_indicateur_activite: string;
  intitule_indicateur_tache: string;
  activite_ptba?: string | number | null;
  code_indicateur_performance?: string | number | null;
  abrege_unite?: number | null;
}

export interface IndicateurActivitePtbaResponse {
  id_indicateur_activite: number;
  code_indicateur_activite: string;
  intitule_indicateur_tache: string;
  activite_ptba?: string | number | null;
  code_indicateur_performance?: string | number | null;
  abrege_unite?: number | null;
  created_at?: string;
  updated_at?: string;
}
