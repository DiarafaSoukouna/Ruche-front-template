import { api } from "../lib/api";
import type {
  IndicateurActivitePtba,
  IndicateurActivitePtbaFormData,
} from "../types/entities";

const indicateurActivitePtbaService = {
  /**
   * Récupère tous les indicateurs d'activité PTBA
   */
  async getAll(): Promise<IndicateurActivitePtba[]> {
    const response = await api.get("/indicateur_activite_ptba/");
    return response.data;
  },

  /**
   * Récupère un indicateur par son ID
   */
  async getById(id: number): Promise<IndicateurActivitePtba> {
    const response = await api.get(`/indicateur_activite_ptba/${id}/`);
    return response.data;
  },

  /**
   * Récupère un indicateur par son code
   */
  async getByCode(code: string): Promise<IndicateurActivitePtba> {
    const response = await api.get(`/indicateur_activite_ptba/`, {
      params: { code_indicateur_activite: code },
    });
    return response.data[0];
  },

  /**
   * Récupère tous les indicateurs pour une activité PTBA spécifique
   */
  async getByActivite(
    activiteCode: string
  ): Promise<IndicateurActivitePtba[]> {
    const response = await api.get("/indicateur_activite_ptba/", {
      params: { activite_ptba: activiteCode },
    });
    return response.data;
  },

  /**
   * Récupère tous les indicateurs pour une activité PTBA par ID
   */
  async getByActiviteId(activiteId: number): Promise<IndicateurActivitePtba[]> {
    const response = await api.get("/indicateur_activite_ptba/", {
      params: { activite_ptba_id: activiteId },
    });
    return response.data;
  },

  /**
   * Récupère les indicateurs par indicateur de performance
   */
  async getByIndicateurPerformance(
    codeIndicateurPerformance: string
  ): Promise<IndicateurActivitePtba[]> {
    const response = await api.get("/indicateur_activite_ptba/", {
      params: { code_indicateur_performance: codeIndicateurPerformance },
    });
    return response.data;
  },

  /**
   * Récupère les indicateurs par unité
   */
  async getByUnite(uniteId: number): Promise<IndicateurActivitePtba[]> {
    const response = await api.get("/indicateur_activite_ptba/", {
      params: { abrege_unite: uniteId },
    });
    return response.data;
  },

  /**
   * Crée un nouveau indicateur d'activité PTBA
   */
  async create(
    data: IndicateurActivitePtbaFormData
  ): Promise<IndicateurActivitePtba> {
    const response = await api.post("/indicateur_activite_ptba/", data);
    return response.data;
  },

  /**
   * Met à jour un indicateur existant
   */
  async update(
    id: number,
    data: Partial<IndicateurActivitePtbaFormData>
  ): Promise<IndicateurActivitePtba> {
    const response = await api.put(`/indicateur_activite_ptba/${id}/`, data);
    return response.data;
  },

  /**
   * Met à jour partiellement un indicateur
   */
  async patch(
    id: number,
    data: Partial<IndicateurActivitePtbaFormData>
  ): Promise<IndicateurActivitePtba> {
    const response = await api.patch(`/indicateur_activite_ptba/${id}/`, data);
    return response.data;
  },

  /**
   * Supprime un indicateur
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/indicateur_activite_ptba/${id}/`);
  },

  /**
   * Recherche des indicateurs par critères
   */
  async search(query: string): Promise<IndicateurActivitePtba[]> {
    const response = await api.get("/indicateur_activite_ptba/", {
      params: { search: query },
    });
    return response.data;
  },

  /**
   * Crée plusieurs indicateurs en batch
   */
  async createBatch(
    data: IndicateurActivitePtbaFormData[]
  ): Promise<IndicateurActivitePtba[]> {
    const response = await api.post("/indicateur_activite_ptba/batch/", data);
    return response.data;
  },

  /**
   * Récupère les statistiques d'un indicateur
   */
  async getStatistiques(codeIndicateur: string): Promise<{
    nombre_suivis: number;
    valeur_moyenne: number;
    valeur_min: number;
    valeur_max: number;
    taux_realisation: number;
  }> {
    const response = await api.get(
      `/indicateur_activite_ptba/statistiques/${codeIndicateur}/`
    );
    return response.data;
  },

  /**
   * Duplique un indicateur
   */
  async duplicate(id: number): Promise<IndicateurActivitePtba> {
    const response = await api.post(
      `/indicateur_activite_ptba/${id}/duplicate/`
    );
    return response.data;
  },

  /**
   * Récupère les indicateurs avec pagination
   */
  async getPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      activite_ptba?: string;
      code_indicateur_performance?: string;
      abrege_unite?: number;
    }
  ): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: IndicateurActivitePtba[];
  }> {
    const response = await api.get("/indicateur_activite_ptba/", {
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    });
    return response.data;
  },

  /**
   * Exporte les indicateurs au format CSV
   */
  async exportCSV(filters?: {
    activite_ptba?: string;
    code_indicateur_performance?: string;
  }): Promise<Blob> {
    const response = await api.get("/indicateur_activite_ptba/export/", {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Valide un indicateur
   */
  async validate(id: number): Promise<IndicateurActivitePtba> {
    const response = await api.post(
      `/indicateur_activite_ptba/${id}/validate/`
    );
    return response.data;
  },

  /**
   * Archive un indicateur
   */
  async archive(id: number): Promise<IndicateurActivitePtba> {
    const response = await api.post(`/indicateur_activite_ptba/${id}/archive/`);
    return response.data;
  },

  /**
   * Restaure un indicateur archivé
   */
  async restore(id: number): Promise<IndicateurActivitePtba> {
    const response = await api.post(`/indicateur_activite_ptba/${id}/restore/`);
    return response.data;
  },
};

export default indicateurActivitePtbaService;
