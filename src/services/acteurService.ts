import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { Acteur, ActeurFormData } from "../types/entities";

export const acteurService = {
  // Get all acteurs
  getAll: async (): Promise<Acteur[]> => {
    try {
      const response = await apiClient.request<Acteur[]>("/acteur/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des acteurs");
      throw error;
    }
  },

  // Get acteur by ID
  getById: async (id: number): Promise<Acteur> => {
    try {
      return await apiClient.request<Acteur>(`/acteur/${id}/`);
    } catch (error) {
      toast.error("Erreur lors de la récupération de l'acteur");
      throw error;
    }
  },

  // Search acteurs by code
  searchByCode: async (code: string): Promise<Acteur[]> => {
    try {
      const response = await apiClient.request<Acteur[]>(
        `/acteur/?code_acteur__icontains=${code}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche des acteurs");
      throw error;
    }
  },

  // Search acteurs by name
  searchByName: async (name: string): Promise<Acteur[]> => {
    try {
      const response = await apiClient.request<Acteur[]>(
        `/acteur/?nom_acteur__icontains=${name}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche des acteurs");
      throw error;
    }
  },

  // Get acteurs by category
  getByCategory: async (categoryId: number): Promise<Acteur[]> => {
    try {
      const response = await apiClient.request<Acteur[]>(
        `/acteur/?categorie_acteur=${categoryId}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des acteurs par catégorie");
      throw error;
    }
  },

  // Create new acteur
  create: async (data: ActeurFormData): Promise<Acteur> => {
    try {
      const response = await apiClient.request<Acteur>("/acteur/", {
        method: "POST",
        data,
      });
      toast.success("Acteur créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de l'acteur");
      throw error;
    }
  },

  // Update acteur
  update: async (
    id: number,
    data: Partial<ActeurFormData>
  ): Promise<Acteur> => {
    try {
      const response = await apiClient.request<Acteur>(`/acteur/${id}/`, {
        method: "PUT",
        data,
      });
      toast.success("Acteur mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'acteur");
      throw error;
    }
  },

  // Delete acteur
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.request(`/acteur/${id}/`, {
        method: "DELETE",
      });
      toast.success("Acteur supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'acteur");
      throw error;
    }
  },

  // Toggle status (if applicable)
  toggleStatus: async (id: number): Promise<Acteur> => {
    try {
      const response = await apiClient.request<Acteur>(
        `/acteur/${id}/toggle_status/`,
        {
          method: "PATCH",
        }
      );
      toast.success("Statut de l'acteur mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut de l'acteur");
      throw error;
    }
  },

  // Get acteurs statistics
  getStats: async (): Promise<{
    total: number;
    byCategory: Record<number, number>;
  }> => {
    try {
      const response = await apiClient.request<{
        total: number;
        byCategory: Record<number, number>;
      }>("/acteur/stats/");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération des statistiques");
      throw error;
    }
  },

  // Validate acteur code uniqueness
  validateCode: async (code: string, excludeId?: number): Promise<boolean> => {
    try {
      const response = await apiClient.request<{ isUnique: boolean }>(
        `/acteur/validate_code/`,
        {
          method: "POST",
          data: { code_acteur: code, exclude_id: excludeId },
        }
      );
      return response.isUnique;
    } catch (error) {
      console.error("Erreur lors de la validation du code:", error);
      return false;
    }
  },

  // Validate email uniqueness
  validateEmail: async (
    email: string,
    excludeId?: number
  ): Promise<boolean> => {
    try {
      const response = await apiClient.request<{ isUnique: boolean }>(
        `/acteur/validate_email/`,
        {
          method: "POST",
          data: { adresse_email: email, exclude_id: excludeId },
        }
      );
      return response.isUnique;
    } catch (error) {
      console.error("Erreur lors de la validation de l'email:", error);
      return false;
    }
  },
};
