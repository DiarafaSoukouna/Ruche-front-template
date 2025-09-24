import { toast } from "react-toastify";
import { apiClient } from "../lib/api";
import type { UGL } from "../types/entities";

export const uglService = {
  // Get all UGLs
  getAll: async (): Promise<UGL[]> => {
    try {
      const response = await apiClient.request<UGL[]>("/ugl/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      toast.error("Erreur lors de la récupération des UGL");
      throw error;
    }
  },

  // Get UGL by ID
  getById: async (id: number): Promise<UGL> => {
    try {
      return await apiClient.request<UGL>(`/ugl/${id}/`);
    } catch (error) {
      toast.error("Erreur lors de la récupération de l'UGL");
      throw error;
    }
  },

  // Get UGL by code
  getByCode: async (code: string): Promise<UGL> => {
    try {
      return await apiClient.request<UGL>(`/ugl/?code_ugl=${code}`);
    } catch (error) {
      toast.error("Erreur lors de la récupération de l'UGL");
      throw error;
    }
  },
};
