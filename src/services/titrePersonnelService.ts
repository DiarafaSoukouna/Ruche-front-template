import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import { TitrePersonnel } from "../types/entities";

export const titrePersonnelService = {
  // Récupérer tous les titres
  async getAll(): Promise<TitrePersonnel[]> {
    try {
      const response = await apiClient.request<TitrePersonnel[]>("/titre_personnel/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors du chargement des titres");
      throw error;
    }
  },

  // Récupérer un titre par ID
  async getById(id: number): Promise<TitrePersonnel> {
    try {
      const response = await apiClient.request<TitrePersonnel>(`/titre_personnel/${id}/`);
      return response;
    } catch (error) {
      toast.error("Erreur lors du chargement du titre");
      throw error;
    }
  },

  // Créer un nouveau titre
  async create(data: Omit<TitrePersonnel, "id_titre">): Promise<TitrePersonnel> {
    try {
      const response = await apiClient.request<TitrePersonnel>("/titre_personnel/", {
        method: "POST",
        data,
      });
      toast.success("Titre créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du titre");
      throw error;
    }
  },

  // Mettre à jour un titre
  async update(id: number, data: Partial<Omit<TitrePersonnel, "id_titre">>): Promise<TitrePersonnel> {
    try {
      const response = await apiClient.request<TitrePersonnel>(`/titre_personnel/${id}/`, {
        method: "PUT",
        data,
      });
      toast.success("Titre mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du titre");
      throw error;
    }
  },

  // Supprimer un titre
  async delete(id: number): Promise<void> {
    try {
      await apiClient.request<void>(`/titre_personnel/${id}/`, {
        method: "DELETE",
      });
      toast.success("Titre supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du titre");
      throw error;
    }
  },

  // Rechercher des titres
  async search(query: string): Promise<TitrePersonnel[]> {
    try {
      const response = await apiClient.request<TitrePersonnel[]>(
        `/titre_personnel/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de titres");
      throw error;
    }
  },
};
