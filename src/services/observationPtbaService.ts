import { api } from "../lib/api";
import { ObservationPtbaFormData } from "../schemas/observationPtbaSchemas";
import type { ObservationPtba } from "../types/entities";

const observationPtbaService = {
  /**
   * Récupère toutes les observations
   */
  async getAll(): Promise<ObservationPtba[]> {
    const response = await api.get("/observation_ptba/");
    return response.data;
  },

  /**
   * Récupère une observation par son ID
   */
  async getById(id: number): Promise<ObservationPtba> {
    const response = await api.get(`/observation_ptba/${id}/`);
    return response.data;
  },

  /**
   * Récupère toutes les observations pour une activité PTBA spécifique
   */
  async getByActivite(codeActivite: string): Promise<ObservationPtba[]> {
    const response = await api.get("/observation_ptba/", {
      params: { ptba: codeActivite },
    });
    return response.data;
  },

  /**
   * Récupère les observations par période
   */
  async getByPeriode(
    dateDebut: string,
    dateFin: string
  ): Promise<ObservationPtba[]> {
    const response = await api.get("/observation_ptba/", {
      params: {
        date_debut: dateDebut,
        date_fin: dateFin,
      },
    });
    return response.data;
  },

  /**
   * Crée une nouvelle observation
   */
  async create(data: ObservationPtbaFormData): Promise<ObservationPtba> {
    const response = await api.post("/observation_ptba/", data);
    return response.data;
  },

  /**
   * Met à jour une observation existante
   */
  async update(
    id: number,
    data: Partial<ObservationPtbaFormData>
  ): Promise<ObservationPtba> {
    const response = await api.put(`/observation_ptba/${id}/`, data);
    return response.data;
  },

  /**
   * Met à jour partiellement une observation
   */
  async patch(
    id: number,
    data: Partial<ObservationPtbaFormData>
  ): Promise<ObservationPtba> {
    const response = await api.patch(`/observation_ptba/${id}/`, data);
    return response.data;
  },

  /**
   * Supprime une observation
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/observation_ptba/${id}/`);
  },

  /**
   * Recherche des observations par critères
   */
  async search(query: string): Promise<ObservationPtba[]> {
    const response = await api.get("/observation_ptba/", {
      params: { search: query },
    });
    return response.data;
  },

  /**
   * Récupère les observations avec pagination
   */
  async getPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      ptba?: string;
      dateDebut?: string;
      dateFin?: string;
    }
  ): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ObservationPtba[];
  }> {
    const response = await api.get("/observation_ptba/", {
      params: {
        page,
        page_size: pageSize,
        ...filters,
      },
    });
    return response.data;
  },
};

export default observationPtbaService;
