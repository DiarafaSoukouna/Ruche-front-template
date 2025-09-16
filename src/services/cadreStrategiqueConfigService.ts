import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type {
  CadreStrategiqueConfig,
  CadreStrategiqueConfigFormData,
} from "../types/entities";

export const cadreStrategiqueConfigService = {
  // Get all configurations
  getAll: async (): Promise<CadreStrategiqueConfig[]> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig[]>(
        "/cadre_strategique_config/"
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des configurations");
      throw error;
    }
  },

  // Get configuration by ID
  getById: async (id: number): Promise<CadreStrategiqueConfig> => {
    try {
      return await apiClient.request<CadreStrategiqueConfig>(
        `/cadre_strategique_config/${id}/`
      );
    } catch (error) {
      toast.error("Erreur lors de la récupération de la configuration");
      throw error;
    }
  },

  // Get configurations by type
  getByType: async (type: 1 | 2 | 3): Promise<CadreStrategiqueConfig[]> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig[]>(
        `/cadre_strategique_config/?type_csc=${type}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des configurations par type");
      throw error;
    }
  },

  // Get configurations by programme
  getByProgramme: async (programmeId: number): Promise<CadreStrategiqueConfig[]> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig[]>(
        `/cadre_strategique_config/?programme=${programmeId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des configurations par programme");
      throw error;
    }
  },

  // Search by libelle
  searchByLibelle: async (libelle: string): Promise<CadreStrategiqueConfig[]> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig[]>(
        `/cadre_strategique_config/?libelle_csc__icontains=${libelle}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche par libellé");
      throw error;
    }
  },

  // Create new configuration
  create: async (data: CadreStrategiqueConfigFormData): Promise<CadreStrategiqueConfig> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig>(
        "/cadre_strategique_config/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Configuration créée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de la configuration");
      throw error;
    }
  },

  // Update configuration
  update: async (
    id: number,
    data: Partial<CadreStrategiqueConfigFormData>
  ): Promise<CadreStrategiqueConfig> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig>(
        `/cadre_strategique_config/${id}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Configuration mise à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la configuration");
      throw error;
    }
  },

  // Delete configuration
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request(`/cadre_strategique_config/${id}/`, {
        method: "DELETE",
      });
      toast.success("Configuration supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la configuration");
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id: number): Promise<CadreStrategiqueConfig> => {
    try {
      const response = await apiClient.request<CadreStrategiqueConfig>(
        `/cadre_strategique_config/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success("Statut de la configuration mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
  },

  // Validate libelle uniqueness
  validateLibelle: async (libelle: string, excludeId?: number): Promise<boolean> => {
    try {
      const response = await apiClient.request<{ isUnique: boolean }>(
        "/cadre_strategique_config/validate_libelle/",
        {
          method: "POST",
          data: { libelle_csc: libelle, exclude_id: excludeId },
        }
      );
      return response.isUnique;
    } catch (error) {
      console.error("Erreur lors de la validation du libellé:", error);
      return false;
    }
  },

  // Get statistics
  getStats: async (): Promise<{
    total: number;
    byType: Record<1 | 2 | 3, number>;
  }> => {
    try {
      const response = await apiClient.request<{
        total: number;
        byType: Record<1 | 2 | 3, number>;
      }>("/cadre_strategique_config/stats/");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération des statistiques");
      throw error;
    }
  },
};
