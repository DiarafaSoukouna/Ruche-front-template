import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type {
  IndicateurCadreResultat,
  IndicateurCadreResultatFormData,
} from "../types/entities";

export const indicateurCadreResultatService = {
  // Get all indicateurs cadre résultat
  getAll: async (): Promise<IndicateurCadreResultat[]> => {
    try {
      const response = await apiClient.request<IndicateurCadreResultat[]>(
        "/indicateur_cadre_resultat/"
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des indicateurs cadre résultat"
      );
      throw error;
    }
  },

  // Get indicateur by ID
  getById: async (id: number): Promise<IndicateurCadreResultat> => {
    try {
      return await apiClient.request<IndicateurCadreResultat>(
        `/indicateur_cadre_resultat/${id}/`
      );
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération de l'indicateur cadre résultat"
      );
      throw error;
    }
  },

  // Get indicateurs by cadre secteur
  getByCadre: async (cadreId: number): Promise<IndicateurCadreResultat[]> => {
    try {
      const response = await apiClient.request<IndicateurCadreResultat[]>(
        `/indicateur_cadre_resultat/?id_cadre_secteur=${cadreId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des indicateurs cadre résultat"
      );
      throw error;
    }
  },

  // Get indicateurs by niveau
  getByNiveau: async (niveau: number): Promise<IndicateurCadreResultat[]> => {
    try {
      const response = await apiClient.request<IndicateurCadreResultat[]>(
        `/indicateur_cadre_resultat/?niveau_cr=${niveau}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des indicateurs cadre résultat"
      );
      throw error;
    }
  },

  // Create new indicateur
  create: async (
    data: IndicateurCadreResultatFormData
  ): Promise<IndicateurCadreResultat> => {
    try {
      const response = await apiClient.request<IndicateurCadreResultat>(
        "/indicateur_cadre_resultat/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Indicateur cadre résultat créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de l'indicateur cadre résultat");
      throw error;
    }
  },

  // Update indicateur
  update: async (
    id: number,
    data: Partial<IndicateurCadreResultatFormData>
  ): Promise<IndicateurCadreResultat> => {
    try {
      const response = await apiClient.request<IndicateurCadreResultat>(
        `/indicateur_cadre_resultat/${id}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Indicateur cadre résultat mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error(
        "Erreur lors de la mise à jour de l'indicateur cadre résultat"
      );
      throw error;
    }
  },

  // Delete indicateur
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request<IndicateurCadreResultat>(
        `/indicateur_cadre_resultat/${id}/`,
        { method: "DELETE" }
      );
      toast.success("Indicateur cadre résultat supprimé avec succès");
    } catch (error) {
      toast.error(
        "Erreur lors de la suppression de l'indicateur cadre résultat"
      );
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id: number): Promise<IndicateurCadreResultat> => {
    try {
      const response = await apiClient.request<IndicateurCadreResultat>(
        `/indicateur_cadre_resultat/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success(
        "Status de l'indicateur cadre résultat mis à jour avec succès"
      );
      return response;
    } catch (error) {
      toast.error(
        "Erreur lors de la mise à jour du status de l'indicateur cadre résultat"
      );
      throw error;
    }
  },
};
