import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type {
  Personnel,
  PersonnelFormData,
} from "../types/entities";

export const personnelService = {
  // Récupérer tous les personnels
  async getAll(): Promise<Personnel[]> {
    try {
      const response = await apiClient.request<Personnel[]>(
        "/personnel/"
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des personnels");
      throw error;
    }
  },

  // Récupérer un personnel par ID
  async getById(n_personnel: number): Promise<Personnel> {
    try {
      const response = await apiClient.request<Personnel>(
        `/personnel/${n_personnel}/`
      );
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération du personnel");
      throw error;
    }
  },

  // Créer un nouveau personnel
  async create(data: PersonnelFormData): Promise<Personnel> {
    try {
      const response = await apiClient.request<Personnel>(
        "/personnel/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Personnel créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du personnel");
      throw error;
    }
  },

  // Mettre à jour un personnel
  async update(
    n_personnel: number,
    data: PersonnelFormData
  ): Promise<Personnel> {
    try {
      const response = await apiClient.request<Personnel>(
        `/personnel/${n_personnel}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Personnel mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du personnel");
      throw error;
    }
  },

  // Supprimer un personnel
  async delete(n_personnel: number): Promise<void> {
    try {
      await apiClient.request<void>(`/personnel/${n_personnel}/`, {
        method: "DELETE",
      });
      toast.success("Personnel supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du personnel");
      throw error;
    }
  },

  // Rechercher des personnels
  async search(query: string): Promise<Personnel[]> {
    try {
      const response = await apiClient.request<Personnel[]>(
        `/personnel/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de personnels");
      throw error;
    }
  },
};
