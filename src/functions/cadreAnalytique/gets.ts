import { apiClient } from "../../lib/api";
import { CadreAnalytiqueType } from "../../types/cadreAnalytique";

export const getAllCadreAnalytique = async (programmeId?: number) => {
  try {
    let url = "cadre_analytique/";
    if (programmeId) {
      url += "?programme_ca=" + programmeId;
    }
    return await apiClient.request<CadreAnalytiqueType[]>(url);
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
