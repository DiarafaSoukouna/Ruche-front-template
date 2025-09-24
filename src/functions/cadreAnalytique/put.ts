import { api } from "../../lib/api";
import { CadreAnalytiqueType } from "../../types/cadreAnalytique";

export const updateCadreAnalytique = async (data: CadreAnalytiqueType) => {
  try {
    const { id_ca, ...form } = data;
    const res = await api.put(`cadre_analytique/${id_ca}/`, form);
    if (res) {
      return res;
    }
  } catch (error) {
    console.error(error);
  }
};
