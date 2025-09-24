import { apiClient } from "../../lib/api";
import { CadreAnalytiqueType } from "../../types/cadreAnalytique";

export const addCadreAnalytique = async (data: CadreAnalytiqueType) => {
  return await apiClient.request<CadreAnalytiqueType>("cadre_analytique/", {
    method: "POST",
    data,
  });
};
