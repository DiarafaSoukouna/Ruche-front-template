import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { NiveauStructureConfig, NiveauStructureConfigFormData } from "../types/entities";

export const niveauStructureConfigService = {
  // Récupérer toutes les configurations de niveau de structure
  async getAll(): Promise<NiveauStructureConfig[]> {
    try {
      const response = await apiClient.request<NiveauStructureConfig[]>("/niveau_structure_config/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des configurations de niveau");
      throw error;
    }
  },

  // Récupérer une configuration par ID
  async getById(id: number): Promise<NiveauStructureConfig> {
    try {
      const response = await apiClient.request<NiveauStructureConfig>(`/niveau_structure_config/${id}/`);
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération de la configuration");
      throw error;
    }
  },

  // Créer une nouvelle configuration
  async create(data: NiveauStructureConfigFormData): Promise<NiveauStructureConfig> {
    try {
      const response = await apiClient.request<NiveauStructureConfig>("/niveau_structure_config/", {
        method: "POST",
        data,
      });
      toast.success("Configuration de niveau créée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de la configuration");
      throw error;
    }
  },

  // Mettre à jour une configuration
  async update(id: number, data: NiveauStructureConfigFormData): Promise<NiveauStructureConfig> {
    try {
      const response = await apiClient.request<NiveauStructureConfig>(`/niveau_structure_config/${id}/`, {
        method: "PUT",
        data,
      });
      toast.success("Configuration de niveau modifiée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la modification de la configuration");
      throw error;
    }
  },

  // Supprimer une configuration
  async delete(id: number): Promise<void> {
    try {
      await apiClient.request<void>(`/niveau_structure_config/${id}/`, {
        method: "DELETE",
      });
      toast.success("Configuration de niveau supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la configuration");
      throw error;
    }
  },

  // Rechercher des configurations
  async search(query: string): Promise<NiveauStructureConfig[]> {
    try {
      const response = await apiClient.request<NiveauStructureConfig[]>(
        `/niveau_structure_config/search/?q=${encodeURIComponent(query)}`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de configurations");
      throw error;
    }
  },

  // Valider l'ordre des niveaux
  async validateLevelOrder(configs: NiveauStructureConfig[]): Promise<boolean> {
    try {
      const response = await apiClient.request<{ valid: boolean }>("/niveau_structure_config/validate/", {
        method: "POST",
        data: { configs },
      });
      return response.valid;
    } catch (error) {
      toast.error("Erreur lors de la validation des niveaux");
      throw error;
    }
  },
};
