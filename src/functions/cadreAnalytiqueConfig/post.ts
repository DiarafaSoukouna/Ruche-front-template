import { api } from '../../lib/api'
import { CadreAnalytiqueConfigTypes } from '../../types/cadreAnalytiqueConfig'

export const addCadreAnalytiqueConfig = async (
  data: CadreAnalytiqueConfigTypes
) => {
  try {
    const { id_csa, ...form } = data
    const res = await api.post('cadre_analytique_config/', form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
