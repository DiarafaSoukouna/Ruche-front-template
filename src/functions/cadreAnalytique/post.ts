import { api } from '../../lib/api'
import { CadreAnalytiqueTypes } from '../../types/cadreAnalytique'

export const addCadreAnalytique = async (data: CadreAnalytiqueTypes) => {
  try {
    const { id_ca, ...form } = data
    const res = await api.post('cadre_analytique/', form)
    if (res) {
      return res
    }
  } catch (error) {
    throw error
  }
}
