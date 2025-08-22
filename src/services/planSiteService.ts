import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { PlanSite, PlanSiteFormData } from "../types/entities";

export const planSiteService = {
  // Récupérer tous les plans de site
  async getAll(): Promise<PlanSite[]> {
    try {
      const response = await apiClient.request<PlanSite[]>("/plan_site/");
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des plans de site");
      throw error;
    }
  },

  // Récupérer un plan de site par ID
  async getById(id: number): Promise<PlanSite> {
    try {
      const response = await apiClient.request<PlanSite>(`/plan_site/${id}/`);
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération du plan de site");
      throw error;
    }
  },

  // Créer un nouveau plan de site
  async create(data: PlanSiteFormData): Promise<PlanSite> {
    try {
      const response = await apiClient.request<PlanSite>("/plan_site/", {
        method: "POST",
        data,
      });
      toast.success("Plan de site créé avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la création du plan de site");
      throw error;
    }
  },

  // Mettre à jour un plan de site
  async update(id: number, data: PlanSiteFormData): Promise<PlanSite> {
    try {
      const response = await apiClient.request<PlanSite>(`/plan_site/${id}/`, {
        method: "PUT",
        data,
      });
      toast.success("Plan de site modifié avec succès");
      return response;
    } catch (error) {
      toast.error("Erreur lors de la modification du plan de site");
      throw error;
    }
  },

  // Supprimer un plan de site
  async delete(id: number): Promise<void> {
    try {
      await apiClient.request<void>(`/plan_site/${id}/`, {
        method: "DELETE",
      });
      toast.success("Plan de site supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du plan de site");
      throw error;
    }
  },

  // Rechercher des plans de site
  async search(query: string): Promise<PlanSite[]> {
    try {
      const response = await apiClient.request<PlanSite[]>(
        `/plan_site/search/?q=${encodeURIComponent(query)}`
      );
      return response || [];
    } catch (error) {
      toast.error("Erreur lors de la recherche de plans de site");
      throw error;
    }
  },
};
