import { apiClient } from "../lib/api";
import { TacheActivitePtbaFormData } from "../schemas/tacheActivitePtbaSchemas";
import type { TacheActivitePtba } from "../types/entities";

class TacheActivitePtbaService {
  async getAll(): Promise<TacheActivitePtba[]> {
    const response = await apiClient.request<TacheActivitePtba[]>(
      "/tache_activite_ptba/"
    );
    return response;
  }

  async getByActivite(idActivite: number): Promise<TacheActivitePtba[]> {
    const response = await apiClient.request<TacheActivitePtba[]>(
      `/tache_activite_ptba/?id_activite=${idActivite}`
    );
    return response;
  }

  async getById(id: number): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      `/tache_activite_ptba/${id}/`
    );
    return response;
  }

  async create(data: TacheActivitePtbaFormData): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      "/tache_activite_ptba/",
      {
        method: "POST",
        data: { ...data, proportion_gt: data.proportion_gt?.toString() },
      }
    );
    return response;
  }

  async update(
    id: number,
    data: Partial<TacheActivitePtbaFormData>
  ): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      `/tache_activite_ptba/${id}/`,
      {
        method: "PUT",
        data: { ...data, proportion_gt: data.proportion_gt?.toString() },
      }
    );
    return response;
  }

  async delete(id: number): Promise<void> {
    await apiClient.request(`/tache_activite_ptba/${id}/`, {
      method: "DELETE",
    });
  }
}

export default new TacheActivitePtbaService();
