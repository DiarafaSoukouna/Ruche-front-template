import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { Fonction, FonctionFormData } from "../types/entities";

export const fonctionService = {
  // Récupérer toutes les fonctions
  async getAll(): Promise<Fonction[]> {
    try {
      const response = await apiClient.request<Fonction[]>("/fonction_personnel/");
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des fonctions");
      throw error;
    }
  },

  // Récupérer une fonction par ID
  async getById(id_fonction: number): Promise<Fonction> {
    try {
      const response = await apiClient.request<Fonction>(
        `/fonction_personnel/${id_fonction}/`
      );
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération de la fonction");
      throw error;
    }
  },

  // Créer une nouvelle fonction
  async create(data: FonctionFormData): Promise<Fonction> {
    try {
      const response = await apiClient.request<Fonction>("/fonction_personnel/", {
        method: "POST",
        data,
      });
      toast.success("Fonction créée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de la fonction");
      throw error;
    }
  },

  // Mettre à jour une fonction
  async update(
    id_fonction: number,
    data: FonctionFormData
  ): Promise<Fonction> {
    try {
      const response = await apiClient.request<Fonction>(
        `/fonction_personnel/${id_fonction}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Fonction mise à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la fonction");
      throw error;
    }
  },

  // Supprimer une fonction
  async delete(id_fonction: number): Promise<void> {
    try {
      await apiClient.request<void>(`/fonction_personnel/${id_fonction}/`, {
        method: "DELETE",
      });
      toast.success("Fonction supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la fonction");
      throw error;
    }
  },

  // Rechercher des fonctions
  async search(query: string): Promise<Fonction[]> {
    try {
      const response = await apiClient.request<Fonction[]>(
        `/fonction_personnel/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de fonctions");
      throw error;
    }
  },
};
