import { api } from "../lib/api";
import { SuiviIndicateurActiviteFormData } from "../schemas/suiviIndicateurSchemas";
import type {
  SuiviIndicateurActivite,
} from "../types/entities";

const suiviIndicateurActiviteService = {
  /**
   * Récupère tous les suivis d'indicateurs
   */
  async getAll(): Promise<SuiviIndicateurActivite[]> {
    const response = await api.get("/suivi_indicateur_activite/");
    return response.data;
  },

  /**
   * Récupère un suivi par son ID
   */
  async getById(id: number): Promise<SuiviIndicateurActivite> {
    const response = await api.get(`/suivi_indicateur_activite/${id}/`);
    return response.data;
  },

  /**
   * Récupère tous les suivis pour un indicateur spécifique
   */
  async getByIndicateur(
    codeIndicateur: string
  ): Promise<SuiviIndicateurActivite[]> {
    const response = await api.get("/suivi_indicateur_activite/", {
      params: { indicateur_activite: codeIndicateur },
    });
    return response.data;
  },

  /**
   * Récupère tous les suivis pour une localité spécifique
   */
  async getByLocalite(codeLocalite: string): Promise<SuiviIndicateurActivite[]> {
    const response = await api.get("/suivi_indicateur_activite/", {
      params: { localite: codeLocalite },
    });
    return response.data;
  },

  /**
   * Récupère les suivis par période
   */
  async getByPeriode(
    dateDebut: string,
    dateFin: string
  ): Promise<SuiviIndicateurActivite[]> {
    const response = await api.get("/suivi_indicateur_activite/", {
      params: {
        date_debut: dateDebut,
        date_fin: dateFin,
      },
    });
    return response.data;
  },

  /**
   * Crée un nouveau suivi d'indicateur
   */
  async create(
    data: SuiviIndicateurActiviteFormData
  ): Promise<SuiviIndicateurActivite> {
    const response = await api.post("/suivi_indicateur_activite/", data);
    return response.data;
  },

  /**
   * Met à jour un suivi existant
   */
  async update(
    id: number,
    data: Partial<SuiviIndicateurActiviteFormData>
  ): Promise<SuiviIndicateurActivite> {
    const response = await api.put(`/suivi_indicateur_activite/${id}/`, data);
    return response.data;
  },

  /**
   * Met à jour partiellement un suivi
   */
  async patch(
    id: number,
    data: Partial<SuiviIndicateurActiviteFormData>
  ): Promise<SuiviIndicateurActivite> {
    const response = await api.patch(`/suivi_indicateur_activite/${id}/`, data);
    return response.data;
  },

  /**
   * Supprime un suivi
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/suivi_indicateur_activite/${id}/`);
  },

  /**
   * Recherche des suivis par critères
   */
  async search(query: string): Promise<SuiviIndicateurActivite[]> {
    const response = await api.get("/suivi_indicateur_activite/", {
      params: { search: query },
    });
    return response.data;
  },

  /**
   * Récupère les statistiques des suivis pour un indicateur
   */
  async getStatistiques(codeIndicateur: string): Promise<{
    total_suivis: number;
    valeur_moyenne: number;
    valeur_min: number;
    valeur_max: number;
    dernier_suivi: SuiviIndicateurActivite | null;
  }> {
    const response = await api.get(
      `/suivi_indicateur_activite/statistiques/${codeIndicateur}/`
    );
    return response.data;
  },

  /**
   * Crée plusieurs suivis en batch
   */
  async createBatch(
    data: SuiviIndicateurActiviteFormData[]
  ): Promise<SuiviIndicateurActivite[]> {
    const response = await api.post("/suivi_indicateur_activite/batch/", data);
    return response.data;
  },

  /**
   * Exporte les suivis au format CSV
   */
  async exportCSV(filters?: {
    indicateur?: string;
    localite?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Promise<Blob> {
    const response = await api.get("/suivi_indicateur_activite/export/", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Récupère les suivis avec pagination
   */
  async getPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      indicateur?: string;
      localite?: string;
      dateDebut?: string;
      dateFin?: string;
    }
  ): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: SuiviIndicateurActivite[];
  }> {
    const response = await api.get("/suivi_indicateur_activite/", {
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    });
    return response.data;
  },
};

export default suiviIndicateurActiviteService;
