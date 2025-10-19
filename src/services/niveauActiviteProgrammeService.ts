import { apiClient } from "../lib/api";
import type { NiveauActiviteProgramme } from "../types/niveauActiviteProgramme";
import type { NiveauActiviteProgrammeFormData } from "../schemas/niveauActiviteProgrammeSchemas";

const BASE_URL = "/niveau_activites_programme_config/";

const niveauActiviteProgrammeService = {
  // Récupérer tous les niveaux
  async getAll(codeProgramme: string): Promise<NiveauActiviteProgramme[]> {
    const response = await apiClient.request<NiveauActiviteProgramme[]>(
      BASE_URL
    );
    const filteredResponse = response.filter(
      (niveau) => niveau.code_programme === codeProgramme
    );
    return filteredResponse;
  },

  // Récupérer un niveau par ID
  async getById(id: number): Promise<NiveauActiviteProgramme> {
    const response = await apiClient.request<NiveauActiviteProgramme>(
      `${BASE_URL}${id}/`
    );
    return response;
  },

  // Récupérer les niveaux par programme
  async getByProgramme(
    codeProgramme: string
  ): Promise<NiveauActiviteProgramme[]> {
    const response = await apiClient.request<NiveauActiviteProgramme[]>(
      `${BASE_URL}?code_programme=${codeProgramme}`
    );
    return response;
  },

  // Créer un nouveau niveau
  async create(
    data: NiveauActiviteProgrammeFormData
  ): Promise<NiveauActiviteProgramme> {
    const response = await apiClient.request<NiveauActiviteProgramme>(
      BASE_URL,
      {
        method: "POST",
        data,
      }
    );
    return response;
  },

  // Mettre à jour un niveau
  async update(
    id: number,
    data: Partial<NiveauActiviteProgrammeFormData>
  ): Promise<NiveauActiviteProgramme> {
    const response = await apiClient.request<NiveauActiviteProgramme>(
      `${BASE_URL}${id}/`,
      {
        method: "PUT",
        data,
      }
    );
    return response;
  },

  // Supprimer un niveau
  async delete(id: number): Promise<void> {
    await apiClient.request<void>(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
  },
};

export default niveauActiviteProgrammeService;
