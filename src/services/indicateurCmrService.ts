import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { IndicateurCmr, IndicateurCmrFormData } from "../types/entities";

export const indicateurCmrService = {
  // Get all indicateurs CMR
  getAll: async (): Promise<IndicateurCmr[]> => {
    try {
      const response = await apiClient.request<IndicateurCmr[]>(
        "/indicateur_cmr/"
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des indicateurs CMR");
      throw error;
    }
  },

  // Get indicateur by ID
  getById: async (id: number): Promise<IndicateurCmr> => {
    try {
      return await apiClient.request<IndicateurCmr>(`/indicateur_cmr/${id}/`);
    } catch (error) {
      toast.error("Erreur lors de la récupération de l'indicateur CMR");
      throw error;
    }
  },

  // Get indicateurs by résultat CMR
  getByResultat: async (resultatId: number): Promise<IndicateurCmr[]> => {
    try {
      const response = await apiClient.request<IndicateurCmr[]>(
        `/indicateur_cmr/?resultat_cmr=${resultatId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des indicateurs CMR");
      throw error;
    }
  },

  // Get indicateurs by responsable collecte
  getByResponsable: async (responsable: string): Promise<IndicateurCmr[]> => {
    try {
      const response = await apiClient.request<IndicateurCmr[]>(
        `/indicateur_cmr/?responsable_collecte_cmr=${responsable}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des indicateurs CMR");
      throw error;
    }
  },

  // Create new indicateur
  create: async (data: IndicateurCmrFormData): Promise<IndicateurCmr> => {
    try {
      const response = await apiClient.request<IndicateurCmr>(
        "/indicateur_cmr/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Indicateur CMR créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de l'indicateur CMR");
      throw error;
    }
  },

  // Update indicateur
  update: async (
    id: number,
    data: Partial<IndicateurCmrFormData>
  ): Promise<IndicateurCmr> => {
    try {
      const response = await apiClient.request<IndicateurCmr>(
        `/indicateur_cmr/${id}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Indicateur CMR mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'indicateur CMR");
      throw error;
    }
  },

  // Delete indicateur
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request<IndicateurCmr>(`/indicateur_cmr/${id}/`, {
        method: "DELETE",
      });
      toast.success("Indicateur CMR supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'indicateur CMR");
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id: number): Promise<IndicateurCmr> => {
    try {
      const response = await apiClient.request<IndicateurCmr>(
        `/indicateur_cmr/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success("Status de l'indicateur CMR mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error(
        "Erreur lors de la mise à jour du status de l'indicateur CMR"
      );
      throw error;
    }
  },
};
