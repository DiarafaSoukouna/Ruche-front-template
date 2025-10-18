import { apiClient } from "../lib/api";
import type { ActiviteProjet } from "../types/entities";

const BASE_URL = "/activite_projet/";

export const activiteProjetService = {
  // Récupérer toutes les activités projet
  getAll: async (): Promise<ActiviteProjet[]> => {
    return await apiClient.request<ActiviteProjet[]>(BASE_URL);
  },

  // Récupérer une activité projet par ID
  getById: async (id: number): Promise<ActiviteProjet> => {
    return await apiClient.request<ActiviteProjet>(`${BASE_URL}${id}/`);
  },

  // Récupérer une activité projet par code
  getByCode: async (code: string): Promise<ActiviteProjet> => {
    return await apiClient.request<ActiviteProjet>(
      `${BASE_URL}?code_activite_projet=${code}`
    );
  },

  // Créer une activité projet
  create: async (data: Partial<ActiviteProjet>): Promise<ActiviteProjet> => {
    return await apiClient.request<ActiviteProjet>(BASE_URL, {
      method: "POST",
      data,
    });
  },

  // Mettre à jour une activité projet
  update: async (
    id: number,
    data: Partial<ActiviteProjet>
  ): Promise<ActiviteProjet> => {
    return await apiClient.request<ActiviteProjet>(`${BASE_URL}${id}/`, {
      method: "PUT",
      data,
    });
  },

  // Supprimer une activité projet
  delete: async (id: number): Promise<void> => {
    await apiClient.request(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  },

  // Rechercher des activités projet
  search: async (query: string): Promise<ActiviteProjet[]> => {
    return await apiClient.request<ActiviteProjet[]>(
      `${BASE_URL}?search=${query}`
    );
  },

  // Récupérer les activités par projet
  getByProjet: async (codeProjet: string): Promise<ActiviteProjet[]> => {
    return await apiClient.request<ActiviteProjet[]>(
      `${BASE_URL}?code_projet=${codeProjet}`
    );
  },

  // Récupérer les activités par niveau
  getByNiveau: async (niveau: number): Promise<ActiviteProjet[]> => {
    return await apiClient.request<ActiviteProjet[]>(
      `${BASE_URL}?niveau_activite_projet=${niveau}`
    );
  },
};

export default activiteProjetService;
