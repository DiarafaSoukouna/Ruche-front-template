import { apiClient } from "../lib/api";
import type {
  IndicateurTache,
  IndicateurTacheRequest,
} from "../types/indicateurTache";

class IndicateurTacheService {
  async getAll(): Promise<IndicateurTache[]> {
    const response = await apiClient.request<IndicateurTache[]>(
      "/indicateur_tache/"
    );
    return response;
  }

  async getByActivite(idActivite: number): Promise<IndicateurTache[]> {
    const response = await apiClient.request<IndicateurTache[]>(
      `/indicateur_tache/?id_activite=${idActivite}`
    );
    return response;
  }

  async getByTache(idTache: number): Promise<IndicateurTache[]> {
    const response = await apiClient.request<IndicateurTache[]>(
      `/indicateur_tache/?tache=${idTache}`
    );
    return response;
  }

  async getById(id: number): Promise<IndicateurTache> {
    const response = await apiClient.request<IndicateurTache>(
      `/indicateur_tache/${id}/`
    );
    return response;
  }

  async create(data: IndicateurTacheRequest): Promise<IndicateurTache> {
    const response = await apiClient.request<IndicateurTache>(
      "/indicateur_tache/",
      {
        method: "POST",
        data,
      }
    );
    return response;
  }

  async update(
    id: number,
    data: Partial<IndicateurTacheRequest>
  ): Promise<IndicateurTache> {
    const response = await apiClient.request<IndicateurTache>(
      `/indicateur_tache/${id}/`,
      {
        method: "PUT",
        data,
      }
    );
    return response;
  }

  async delete(id: number): Promise<void> {
    await apiClient.request(`/indicateur_tache/${id}/`, {
      method: "DELETE",
    });
  }
}

export default new IndicateurTacheService();
