import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type {
  CadreStrategique,
  CadreStrategiqueFormData,
} from "../types/entities";

export const cadreStrategiqueService = {
  // Get all cadres strategiques
  getAll: async (programmeId?: number): Promise<CadreStrategique[]> => {
    try {
      const url = programmeId
        ? `/cadre_strategique/?programme_cs=${programmeId}`
        : "/cadre_strategique/";
      const response = await apiClient.request<CadreStrategique[]>(url);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres stratégiques");
      throw error;
    }
  },

  // Get cadre strategique by ID
  getById: async (id: number): Promise<CadreStrategique> => {
    try {
      return await apiClient.request<CadreStrategique>(
        `/cadre_strategique/${id}/`
      );
    } catch (error) {
      toast.error("Erreur lors de la récupération du cadre stratégique");
      throw error;
    }
  },

  // Get hierarchy of cadres strategiques
  getHierarchy: async (): Promise<CadreStrategique[]> => {
    try {
      const response = await apiClient.request<CadreStrategique[]>(
        "/cadre_strategique/hierarchy/"
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération de la hiérarchie");
      throw error;
    }
  },

  // Get cadres by parent
  getByParent: async (parentId: number | null): Promise<CadreStrategique[]> => {
    try {
      const url = parentId
        ? `/cadre_strategique/parent/${parentId}/`
        : "/cadre_strategique/root/";
      const response = await apiClient.request<CadreStrategique[]>(url);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres par parent");
      throw error;
    }
  },

  // Get cadres by niveau
  getByNiveau: async (niveau: number): Promise<CadreStrategique[]> => {
    try {
      const response = await apiClient.request<CadreStrategique[]>(
        `/cadre_strategique/?niveau_cs=${niveau}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres par niveau");
      throw error;
    }
  },

  // Get cadres by projet
  getByProjet: async (projetId: number): Promise<CadreStrategique[]> => {
    try {
      const response = await apiClient.request<CadreStrategique[]>(
        `/cadre_strategique/?projet_cs=${projetId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres par projet");
      throw error;
    }
  },

  // Search by code
  searchByCode: async (code: string): Promise<CadreStrategique[]> => {
    try {
      const response = await apiClient.request<CadreStrategique[]>(
        `/cadre_strategique/?code_cs__icontains=${code}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche par code");
      throw error;
    }
  },

  // Create new cadre strategique
  create: async (data: CadreStrategiqueFormData): Promise<CadreStrategique> => {
    try {
      const response = await apiClient.request<CadreStrategique>(
        "/cadre_strategique/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Cadre stratégique créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du cadre stratégique");
      throw error;
    }
  },

  // Update cadre strategique
  update: async (
    id: number,
    data: Partial<CadreStrategiqueFormData>
  ): Promise<CadreStrategique> => {
    try {
      const response = await apiClient.request<CadreStrategique>(
        `/cadre_strategique/${id}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Cadre stratégique mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du cadre stratégique");
      throw error;
    }
  },

  // Delete cadre strategique
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request(`/cadre_strategique/${id}/`, {
        method: "DELETE",
      });
      toast.success("Cadre stratégique supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du cadre stratégique");
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id: number): Promise<CadreStrategique> => {
    try {
      const response = await apiClient.request<CadreStrategique>(
        `/cadre_strategique/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success("Statut du cadre stratégique mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
      throw error;
    }
  },

  // Get children of a cadre
  getChildren: async (parentId: number): Promise<CadreStrategique[]> => {
    try {
      const response = await apiClient.request<CadreStrategique[]>(
        `/cadre_strategique/children/${parentId}/`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des enfants");
      throw error;
    }
  },

  // Validate code uniqueness
  validateCode: async (code: string, excludeId?: number): Promise<boolean> => {
    try {
      const response = await apiClient.request<{ isUnique: boolean }>(
        "/cadre_strategique/validate_code/",
        {
          method: "POST",
          data: { code_cs: code, exclude_id: excludeId },
        }
      );
      return response.isUnique;
    } catch (error) {
      console.error("Erreur lors de la validation du code:", error);
      return false;
    }
  },
};
