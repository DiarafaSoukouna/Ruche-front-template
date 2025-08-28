import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { Convention } from "../types/entities";

// Type pour les données de formulaire Convention
export type ConventionFormData = Omit<Convention, "id_convention">;

export const conventionService = {
  // Récupérer toutes les conventions
  async getAll(): Promise<Convention[]> {
    try {
      const response = await apiClient.request<Convention[]>("/convention/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des conventions");
      throw error;
    }
  },

  // Récupérer une convention par ID
  async getById(id: number): Promise<Convention> {
    try {
      const response = await apiClient.request<Convention>(`/convention/${id}/`);
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération de la convention");
      throw error;
    }
  },

  // Créer une nouvelle convention
  async create(data: ConventionFormData): Promise<Convention> {
    try {
      const response = await apiClient.request<Convention>("/convention/", {
        method: "POST",
        data,
      });
      toast.success("Convention créée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de la convention");
      throw error;
    }
  },

  // Mettre à jour une convention
  async update(id: number, data: ConventionFormData): Promise<Convention> {
    try {
      const response = await apiClient.request<Convention>(`/convention/${id}/`, {
        method: "PUT",
        data,
      });
      toast.success("Convention modifiée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la modification de la convention");
      throw error;
    }
  },

  // Supprimer une convention
  async delete(id: number): Promise<void> {
    try {
      await apiClient.request<void>(`/convention/${id}/`, {
        method: "DELETE",
      });
      toast.success("Convention supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la convention");
      throw error;
    }
  },

  // Rechercher des conventions
  async search(query: string): Promise<Convention[]> {
    try {
      const response = await apiClient.request<Convention[]>(
        `/convention/search/?q=${encodeURIComponent(query)}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de conventions");
      throw error;
    }
  },

  // Obtenir les conventions par partenaire
  async getByPartenaire(partenaireId: number): Promise<Convention[]> {
    try {
      const response = await apiClient.request<Convention[]>(
        `/convention/partenaire/${partenaireId}/`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des conventions du partenaire");
      throw error;
    }
  },

  // Obtenir les conventions par état
  async getByEtat(etat: string): Promise<Convention[]> {
    try {
      const response = await apiClient.request<Convention[]>(
        `/convention/etat/${encodeURIComponent(etat)}/`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des conventions par état");
      throw error;
    }
  },
};
