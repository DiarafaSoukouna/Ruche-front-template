import { api } from "../lib/api";
import type { IndicateurPerformanceProjet } from "../types/entities";

const indicateurPerformanceProjetService = {
  /**
   * Récupère tous les indicateurs de performance
   */
  async getAll(): Promise<IndicateurPerformanceProjet[]> {
    const response = await api.get("/indicateur_performance_projet/");
    return response.data;
  },

  /**
   * Récupère un indicateur par son ID
   */
  async getById(id: number): Promise<IndicateurPerformanceProjet> {
    const response = await api.get(`/indicateur_performance_projet/${id}/`);
    return response.data;
  },

  /**
   * Récupère un indicateur par son code
   */
  async getByCode(code: string): Promise<IndicateurPerformanceProjet> {
    const response = await api.get(`/indicateur_performance_projet/`, {
      params: { code_indicateur_performance: code },
    });
    return response.data[0];
  },

  /**
   * Récupère les indicateurs par activité projet
   */
  async getByActiviteProjet(
    codeActivite: string
  ): Promise<IndicateurPerformanceProjet[]> {
    const response = await api.get("/indicateur_performance_projet/", {
      params: { code_activite_projet: codeActivite },
    });
    return response.data;
  },

  /**
   * Crée un nouvel indicateur de performance
   */
  async create(
    data: Omit<IndicateurPerformanceProjet, "id_indicateur_performance">
  ): Promise<IndicateurPerformanceProjet> {
    const response = await api.post("/indicateur_performance_projet/", data);
    return response.data;
  },

  /**
   * Met à jour un indicateur
   */
  async update(
    id: number,
    data: Partial<Omit<IndicateurPerformanceProjet, "id_indicateur_performance">>
  ): Promise<IndicateurPerformanceProjet> {
    const response = await api.put(
      `/indicateur_performance_projet/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Supprime un indicateur
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/indicateur_performance_projet/${id}/`);
  },

  /**
   * Recherche des indicateurs
   */
  async search(query: string): Promise<IndicateurPerformanceProjet[]> {
    const response = await api.get("/indicateur_performance_projet/", {
      params: { search: query },
    });
    return response.data;
  },
};

export default indicateurPerformanceProjetService;
