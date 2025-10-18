import { apiClient } from "../lib/api";
import type { NiveauActiviteProjet } from "../types/entities";

const BASE_URL = "/niveau_activite_config/";

export const niveauActiviteProjetService = {
  // Récupérer tous les niveaux
  getAll: async (): Promise<NiveauActiviteProjet[]> => {
    return await apiClient.request<NiveauActiviteProjet[]>(BASE_URL);
  },

  // Récupérer un niveau par ID
  getById: async (id: number): Promise<NiveauActiviteProjet> => {
    return await apiClient.request<NiveauActiviteProjet>(`${BASE_URL}${id}/`);
  },

  // Récupérer les niveaux par projet
  getByProjet: async (codeProjet: string): Promise<NiveauActiviteProjet[]> => {
    return await apiClient.request<NiveauActiviteProjet[]>(
      `${BASE_URL}?code_projet=${codeProjet}`
    );
  },

  // Créer un niveau
  create: async (
    data: Partial<NiveauActiviteProjet>
  ): Promise<NiveauActiviteProjet> => {
    return await apiClient.request<NiveauActiviteProjet>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour un niveau
  update: async (
    id: number,
    data: Partial<NiveauActiviteProjet>
  ): Promise<NiveauActiviteProjet> => {
    return await apiClient.request<NiveauActiviteProjet>(`${BASE_URL}${id}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer un niveau
  delete: async (id: number): Promise<void> => {
    await apiClient.request(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  },
};

export default niveauActiviteProjetService;
