import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { CibleCmrProjet } from "../types/entities";

export interface CibleCmrProjetFormData {
  annee: string;
  valeur_cible_indcateur_crp: number;
  code_indicateur_crp?: number | null;
  code_ug?: string | null;
  code_projet?: string | null;
}

export const cibleCmrProjetService = {
  // Récupérer toutes les cibles
  async getAll(): Promise<CibleCmrProjet[]> {
    try {
      const response = await apiClient.request<CibleCmrProjet[]>("/cible_cmr_projet/");
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cibles CMR projet");
      throw error;
    }
  },

  // Récupérer une cible par ID
  async getById(id_cible_indicateur_crp: number): Promise<CibleCmrProjet> {
    try {
      const response = await apiClient.request<CibleCmrProjet>(
        `/cible_cmr_projet/${id_cible_indicateur_crp}/`
      );
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération de la cible CMR projet");
      throw error;
    }
  },

  // Créer une nouvelle cible
  async create(data: CibleCmrProjetFormData): Promise<CibleCmrProjet> {
    try {
      const response = await apiClient.request<CibleCmrProjet>("/cible_cmr_projet/", {
        method: "POST",
        data,
      });
      toast.success("Cible CMR projet créée avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création de la cible CMR projet");
      throw error;
    }
  },

  // Mettre à jour une cible
  async update(
    id_cible_indicateur_crp: number,
    data: CibleCmrProjetFormData
  ): Promise<CibleCmrProjet> {
    try {
      const response = await apiClient.request<CibleCmrProjet>(
        `/cible_cmr_projet/${id_cible_indicateur_crp}/`,
        {
          method: "PUT",
          data,
        }
      );
      toast.success("Cible CMR projet mise à jour avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la cible CMR projet");
      throw error;
    }
  },

  // Supprimer une cible
  async delete(id_cible_indicateur_crp: number): Promise<void> {
    try {
      await apiClient.request<void>(`/cible_cmr_projet/${id_cible_indicateur_crp}/`, {
        method: "DELETE",
      });
      toast.success("Cible CMR projet supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la cible CMR projet");
      throw error;
    }
  },

  // Rechercher des cibles
  async search(query: string): Promise<CibleCmrProjet[]> {
    try {
      const response = await apiClient.request<CibleCmrProjet[]>(
        `/cible_cmr_projet/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de cibles CMR projet");
      throw error;
    }
  },

  // Récupérer les cibles par indicateur
  async getByIndicateur(code_indicateur_crp: number): Promise<CibleCmrProjet[]> {
    try {
      const response = await apiClient.request<CibleCmrProjet[]>(
        `/cible_cmr_projet/?code_indicateur_crp=${code_indicateur_crp}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cibles par indicateur");
      throw error;
    }
  },

  // Récupérer les cibles par projet
  async getByProjet(code_projet: string): Promise<CibleCmrProjet[]> {
    try {
      const response = await apiClient.request<CibleCmrProjet[]>(
        `/cible_cmr_projet/?code_projet=${encodeURIComponent(code_projet)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cibles par projet");
      throw error;
    }
  },

  // Récupérer les cibles par année
  async getByAnnee(annee: string): Promise<CibleCmrProjet[]> {
    try {
      const response = await apiClient.request<CibleCmrProjet[]>(
        `/cible_cmr_projet/?annee=${encodeURIComponent(annee)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cibles par année");
      throw error;
    }
  },

  // Récupérer les cibles ordonnées par année
  async getAllOrdered(): Promise<CibleCmrProjet[]> {
    try {
      const response = await apiClient.request<CibleCmrProjet[]>(
        "/cible_cmr_projet/?ordering=annee"
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des cibles ordonnées");
      throw error;
    }
  },
};
