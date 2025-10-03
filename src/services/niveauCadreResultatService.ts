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
    try {
      const response = await apiClient.request<NiveauCadreResultat>(
        "/niveau_cadre_resultat/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Niveau de cadre de résultat créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du niveau de cadre de résultat");
      throw error;
    }
  },

  // Update niveau
  update: async (
    id: number,
    data: Partial<NiveauCadreResultatFormData>
  ): Promise<NiveauCadreResultat> => {
    try {
      const response = await apiClient.request<NiveauCadreResultat>(
        `/niveau_cadre_resultat/${id}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Niveau de cadre de résultat mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error(
        "Erreur lors de la mise à jour du niveau de cadre de résultat"
      );
      throw error;
    }
  },

  // Delete niveau
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request(`/niveau_cadre_resultat/${id}/`, {
        method: "DELETE",
      });
      toast.success("Niveau de cadre de résultat supprimé avec succès");
    } catch (error) {
      toast.error(
        "Erreur lors de la suppression du niveau de cadre de résultat"
      );
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id: number): Promise<NiveauCadreResultat> => {
    try {
      const response = await apiClient.request<NiveauCadreResultat>(
        `/niveau_cadre_resultat/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success(
        "Statut du niveau de cadre de résultat mis à jour avec succès"
      );
      return response;
    } catch (error) {
      toast.error(
        "Erreur lors de la mise à jour du statut du niveau de cadre de résultat"
      );
      throw error;
    }
  },
};
