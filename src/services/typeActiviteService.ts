import { api } from "../lib/api";
import { TypeActiviteFormData } from "../schemas/ptbaSchemas";
import type { TypeActivite } from "../types/entities";

const typeActiviteService = {
  async getAll(): Promise<TypeActivite[]> {
    const response = await api.get(`/type_activite/`);
    return response.data;
  },

  async getById(id: number): Promise<TypeActivite> {
    const response = await api.get(`/type_activite/${id}/`);
    return response.data;
  },

  async create(data: TypeActiviteFormData): Promise<TypeActivite> {
    const response = await api.post(`/type_activite/`, data);
    return response.data;
  },

  async update(
    id: number,
    data: Partial<TypeActiviteFormData>
  ): Promise<TypeActivite> {
    const response = await api.put(`/type_activite/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/type_activite/${id}/`);
  },

  async search(query: string): Promise<TypeActivite[]> {
    const response = await api.get(`/type_activite/`, {
      params: { search: query },
    });
    return response.data;
  },

  async filter(filters: Record<string, any>): Promise<TypeActivite[]> {
    const response = await api.get(`/type_activite/`, {
      params: filters,
    });
    return response.data;
  },
};

export default typeActiviteService;
