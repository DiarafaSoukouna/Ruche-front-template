import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type {
  NiveauCadreResultat,
  NiveauCadreResultatFormData,
} from "../types/entities";

export const niveauCadreResultatService = {
  // Get all niveaux
  getAll: async (): Promise<NiveauCadreResultat[]> => {
    try {
      const response = await apiClient.request<NiveauCadreResultat[]>(
        "/niveau_cadre_resultat/"
      );
      return Array.isArray(response)
        ? response.sort((a, b) => b.nombre_ncr - a.nombre_ncr)
        : [];
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des niveaux de cadre de résultat"
      );
      throw error;
    }
  },

  // Get niveau by ID
  getById: async (id: number): Promise<NiveauCadreResultat> => {
    try {
      return await apiClient.request<NiveauCadreResultat>(
        `/niveau_cadre_resultat/${id}/`
      );
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération du niveau de cadre de résultat"
      );
      throw error;
    }
  },

  // Get niveaux by type
  getByType: async (type: 1 | 2 | 3): Promise<NiveauCadreResultat[]> => {
    try {
      const response = await apiClient.request<NiveauCadreResultat[]>(
        `/niveau_cadre_resultat/?type_niveau=${type}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des niveaux de cadre de résultat"
      );
      throw error;
    }
  },

  // Search niveaux
  search: async (query: string): Promise<NiveauCadreResultat[]> => {
    try {
      const response = await apiClient.request<NiveauCadreResultat[]>(
        `/niveau_cadre_resultat/?search=${encodeURIComponent(query)}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error(
        "Erreur lors de la recherche des niveaux de cadre de résultat"
      );
      throw error;
    }
  },

  // Create new niveau
  create: async (
    data: NiveauCadreResultatFormData
  ): Promise<NiveauCadreResultat> => {
    return await apiClient.request<NiveauCadreResultat>(
      "/niveau_cadre_resultat/",
      {
        method: "POST",
        data,
      }
    );
  },

  // Update niveau
  update: async (
    id: number,
    data: Partial<NiveauCadreResultatFormData>
  ): Promise<NiveauCadreResultat> => {
    return await apiClient.request<NiveauCadreResultat>(
      `/niveau_cadre_resultat/${id}/`,
      {
        method: "PUT",
        data,
      }
    );
  },

  // Delete niveau
  delete: async (id: number): Promise<void> => {
    await apiClient.request(`/niveau_cadre_resultat/${id}/`, {
      method: "DELETE",
    });
  },
};
