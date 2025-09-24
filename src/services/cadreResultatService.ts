import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { CadreResultat, CadreResultatFormData } from "../types/entities";

export const cadreResultatService = {
  // Get all cadres
  getAll: async (projetId?: number): Promise<CadreResultat[]> => {
    try {
      let url = "cadre_resultat/";
      if (projetId) {
        console.log("projetId", projetId);
        url += "?projet_cr=" + projetId;
      }
      const response = await apiClient.request<CadreResultat[]>(url);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres de résultat");
      throw error;
    }
  },

  // Get cadre by ID
  getById: async (id: number): Promise<CadreResultat> => {
    try {
      return await apiClient.request<CadreResultat>(`/cadre_resultat/${id}/`);
    } catch (error) {
      toast.error("Erreur lors de la récupération du cadre de résultat");
      throw error;
    }
  },

  // Get cadres by niveau
  getByNiveau: async (niveauId: number): Promise<CadreResultat[]> => {
    try {
      const response = await apiClient.request<CadreResultat[]>(
        `/cadre_resultat/?niveau_cr=${niveauId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres de résultat");
      throw error;
    }
  },

  // Get cadres by parent
  getByParent: async (parentId: number): Promise<CadreResultat[]> => {
    try {
      const response = await apiClient.request<CadreResultat[]>(
        `/cadre_resultat/?parent_cr=${parentId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres de résultat");
      throw error;
    }
  },

  // Get cadres by partenaire
  getByPartenaire: async (partenaireId: number): Promise<CadreResultat[]> => {
    try {
      const response = await apiClient.request<CadreResultat[]>(
        `/cadre_resultat/?partenaire_cr=${partenaireId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres de résultat");
      throw error;
    }
  },

  // Search cadres
  search: async (query: string): Promise<CadreResultat[]> => {
    try {
      const response = await apiClient.request<CadreResultat[]>(
        `/cadre_resultat/?search=${encodeURIComponent(query)}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche des cadres de résultat");
      throw error;
    }
  },

  // Create new cadre
  create: async (data: CadreResultatFormData): Promise<CadreResultat> => {
    try {
      const response = await apiClient.request<CadreResultat>(
        "/cadre_resultat/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Cadre de résultat créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du cadre de résultat");
      throw error;
    }
  },

  // Update cadre
  update: async (
    id: number,
    data: Partial<CadreResultatFormData>
  ): Promise<CadreResultat> => {
    try {
      const response = await apiClient.request<CadreResultat>(
        `/cadre_resultat/${id}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Cadre de résultat mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du cadre de résultat");
      throw error;
    }
  },

  // Delete cadre
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request(`/cadre_resultat/${id}/`, {
        method: "DELETE",
      });
      toast.success("Cadre de résultat supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du cadre de résultat");
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id: number): Promise<CadreResultat> => {
    try {
      const response = await apiClient.request<CadreResultat>(
        `/cadre_resultat/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success("Statut du cadre de résultat mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error(
        "Erreur lors de la mise à jour du statut du cadre de résultat"
      );
      throw error;
    }
  },
};
