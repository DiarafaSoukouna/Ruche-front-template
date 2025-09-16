import { api } from '../../lib/api'
import { CadreAnalytiqueConfigTypes } from '../../types/cadreAnalytiqueConfig'

export const updateCadreAnalytiqueConfig = async (
  data: CadreAnalytiqueConfigTypes
) => {
  try {
    const { id_csa, ...form } = data
    const res = await api.put(`cadre_analytique_config/${id_csa}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
