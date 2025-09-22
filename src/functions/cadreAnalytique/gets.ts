import { apiClient } from "../../lib/api";
import { CadreAnalytiqueTypes } from "../../types/cadreAnalytique";
import type { NiveauCadreAnalytique } from "../../types/entities";

export const getAllCadreAnalytique = async () => {
  try {
    return await apiClient.request<CadreAnalytiqueTypes[]>("cadre_analytique/");
  } catch (error) {
    console.error(error);
    return [];
  }
};

// export const getCadreAnalytiqueConfigByProgramme = async (id: number) => {
//   try {
//     const res = await api.get(`programme/${id}/get_cadres_config/`)
//     if (res) {
//       return res.data
//     }
//   } catch (error) {
//     console.error(error)
//   }
// }
