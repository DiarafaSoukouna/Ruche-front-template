import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { NiveauCadreAnalytique } from "../types/entities";

export interface NiveauCadreAnalytiqueFormData {
  nombre_nca: number;
  libelle_nca: string;
  code_number_nca: number;
}

export const niveauCadreAnalytiqueService = {
  // Récupérer tous les niveaux
  async getAll(): Promise<NiveauCadreAnalytique[]> {
    try {
      const response = await apiClient.request<NiveauCadreAnalytique[]>(
        "/niveau_cadre_analytique/"
      );
      response.sort((a, b) => a.nombre_nca - b.nombre_nca);
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des niveaux");
      throw error;
    }
  },

  // Récupérer un niveau par ID
  async getById(id_nca: number): Promise<NiveauCadreAnalytique> {
    try {
      const response = await apiClient.request<NiveauCadreAnalytique>(
        `/niveau_cadre_analytique/${id_nca}/`
      );
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération du niveau");
      throw error;
    }
  },

  // Créer un nouveau niveau
  async create(
    data: NiveauCadreAnalytiqueFormData
  ): Promise<NiveauCadreAnalytique> {
    try {
      const response = await apiClient.request<NiveauCadreAnalytique>(
        "/niveau_cadre_analytique/",
        {
          method: "POST",
          data,
        }
      );
      toast.success("Niveau créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du niveau");
      throw error;
    }
  },

  // Mettre à jour un niveau
  async update(
    id_nca: number,
    data: NiveauCadreAnalytiqueFormData
  ): Promise<NiveauCadreAnalytique> {
    try {
      const response = await apiClient.request<NiveauCadreAnalytique>(
        `/niveau_cadre_analytique/${id_nca}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Niveau mis à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du niveau");
      throw error;
    }
  },

  // Supprimer un niveau
  async delete(id_nca: number): Promise<void> {
    try {
      await apiClient.request<void>(`/niveau_cadre_analytique/${id_nca}/`, {
        method: "DELETE",
      });
      toast.success("Niveau supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du niveau");
      throw error;
    }
  },

  // Rechercher des niveaux
  async search(query: string): Promise<NiveauCadreAnalytique[]> {
    try {
      const response = await apiClient.request<NiveauCadreAnalytique[]>(
        `/niveau_cadre_analytique/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de niveaux");
      throw error;
    }
  },

  // Récupérer les niveaux par type
  async getByType(type_niveau: 1 | 2 | 3): Promise<NiveauCadreAnalytique[]> {
    try {
      const response = await apiClient.request<NiveauCadreAnalytique[]>(
        `/niveau_cadre_analytique/?type_niveau=${type_niveau}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des niveaux par type");
      throw error;
    }
  },
};
