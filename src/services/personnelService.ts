import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { Personnel, PersonnelFormData } from "../types/entities";

export const personnelService = {
  // Récupérer tous les personnels
  async getAll(): Promise<Personnel[]> {
    try {
      const response = await apiClient.request<Personnel[]>("/personnel/");
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des personnels");
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
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
      const response = await apiClient.request<Personnel>("/personnel/", {
        method: "POST",
        data,
      });
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du personnel");
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  async update(
    n_personnel: number,
    data: PersonnelFormData
  ): Promise<Personnel> {
    try {
      data.projet_active_perso =
        (data.projet_active_perso as string)
          ?.split(",")
          .map((p) => p.trim() || undefined) || [];
      data.projet_active_perso = (data.projet_active_perso as string[])?.filter(
        Boolean
      );
      console.log(data);
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

  // Supprimer un utilisateur
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

  // Activer un utilisateur
  async enable(n_personnel: number): Promise<void> {
    try {
      await apiClient.request<void>(`/personnel/${n_personnel}/enable/`, {
        method: "PUT",
      });
      toast.success("Personnel activé avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'activation du personnel");
      throw error;
    }
  },

  // Désactiver un utilisateur
  async disable(n_personnel: number): Promise<void> {
    try {
      await apiClient.request<void>(`/personnel/${n_personnel}/disable/`, {
        method: "PUT",
      });
      toast.success("Personnel désactivé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la désactivation du personnel");
      throw error;
    }
  },
};
