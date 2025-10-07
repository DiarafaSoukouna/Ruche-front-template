import { api } from "../lib/api";
import { PtbaFormData } from "../schemas/ptbaSchemas";
import type { Ptba } from "../types/entities";

const ptbaService = {
  async getAll(codeProgramme: string): Promise<Ptba[]> {
    let url = `/ptba/`;
    if (codeProgramme) {
      url += `?code_programme=${codeProgramme}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  async getById(id: number): Promise<Ptba> {
    const response = await api.get(`/ptba/${id}/`);
    return response.data;
  },

  async create(data: PtbaFormData): Promise<Ptba> {
    const response = await api.post(`/ptba/`, data);
    return response.data;
  },

  async update(id: number, data: Partial<PtbaFormData>): Promise<Ptba> {
    const response = await api.put(`/ptba/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/ptba/${id}/`);
  },

  async search(query: string): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { search: query },
    });
    return response.data;
  },

  async getByVersion(versionId: number): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { version_ptba: versionId },
    });
    return response.data;
  },

  async getByTypeActivite(typeId: number): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { type_activite: typeId },
    });
    return response.data;
  },

  async getByStatut(statut: string): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { statut_activite: statut },
    });
    return response.data;
  },

  async getByResponsable(responsableId: number): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { responsable_ptba: responsableId },
    });
    return response.data;
  },

  async getByLocalite(localiteId: number): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { localites_ptba: localiteId },
    });
    return response.data;
  },

  async getByPartenaire(partenaireId: number): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: { partenaire_conserne_ptba: partenaireId },
    });
    return response.data;
  },

  async filter(filters: Record<string, any>): Promise<Ptba[]> {
    const response = await api.get(`/ptba/`, {
      params: filters,
    });
    return response.data;
  },

  // Méthodes spécifiques pour le chronogramme
  async updateChronogramme(id: number, chronogramme: string): Promise<Ptba> {
    const response = await api.patch(`/ptba/${id}/chronogramme/`, {
      chronogramme,
    });
    return response.data;
  },

  async updateStatut(id: number, statut: string): Promise<Ptba> {
    const response = await api.patch(`/ptba/${id}/statut/`, {
      statut_activite: statut,
    });
    return response.data;
  },
};

export default ptbaService;
