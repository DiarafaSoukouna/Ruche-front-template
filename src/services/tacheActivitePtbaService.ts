import { apiClient } from "../lib/api";
import type {
  TacheActivitePtba,
  TacheActivitePtbaRequest,
} from "../types/entities";

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

  async create(data: TacheActivitePtbaRequest): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      "/tache_activite_ptba/",
      {
        method: "POST",
        data,
      }
    );
    return response;
  }

  async update(
    id: number,
    data: Partial<TacheActivitePtbaRequest>
  ): Promise<TacheActivitePtba> {
    const response = await apiClient.request<TacheActivitePtba>(
      `/tache_activite_ptba/${id}/`,
      {
        method: "PUT",
        data,
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
