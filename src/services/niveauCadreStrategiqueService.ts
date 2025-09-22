import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { NiveauCadreStrategique } from "../types/entities";

export interface NiveauCadreStrategiqueFormData {
  nombre_nsc: number;
  libelle_nsc: string;
  code_number_nsc: number;
  type_niveau: number;
}

export const niveauCadreStrategiqueService = {
  // Récupérer tous les niveaux
  async getAll(): Promise<NiveauCadreStrategique[]> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique[]>(
        "/niveau_cadre_strategique/"
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des niveaux");
      throw error;
    }
  },

  // Récupérer un niveau par ID
  async getById(id_nsc: number): Promise<NiveauCadreStrategique> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique>(
        `/niveau_cadre_strategique/${id_nsc}/`
      );
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération du niveau");
      throw error;
    }
  },

  // Créer un nouveau niveau
  async create(
    data: NiveauCadreStrategiqueFormData
  ): Promise<NiveauCadreStrategique> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique>(
        "/niveau_cadre_strategique/",
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
    id_nsc: number,
    data: NiveauCadreStrategiqueFormData
  ): Promise<NiveauCadreStrategique> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique>(
        `/niveau_cadre_strategique/${id_nsc}/`,
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
  async delete(id_nsc: number): Promise<void> {
    try {
      await apiClient.request<void>(`/niveau_cadre_strategique/${id_nsc}/`, {
        method: "DELETE",
      });
      toast.success("Niveau supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du niveau");
      throw error;
    }
  },

  // Rechercher des niveaux
  async search(query: string): Promise<NiveauCadreStrategique[]> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique[]>(
        `/niveau_cadre_strategique/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de niveaux");
      throw error;
    }
  },

  // Récupérer les niveaux par type
  async getByType(type_niveau: 1 | 2 | 3): Promise<NiveauCadreStrategique[]> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique[]>(
        `/niveau_cadre_strategique/?type_niveau=${type_niveau}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des niveaux par type");
      throw error;
    }
  },

  // Récupérer les niveaux ordonnés par nombre
  async getAllOrdered(): Promise<NiveauCadreStrategique[]> {
    try {
      const response = await apiClient.request<NiveauCadreStrategique[]>(
        "/niveau_cadre_strategique/?ordering=nombre_nsc"
      );
      response.sort((a, b) => a.nombre_nsc - b.nombre_nsc);
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des niveaux ordonnés");
      throw error;
    }
  },
};
