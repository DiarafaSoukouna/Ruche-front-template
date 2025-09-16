import { api } from '../../lib/api'

export const DeleteCadreAnalytiqueConfig = async (id: number) => {
  try {
    const res = await api.delete(`cadre_analytique_config/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
