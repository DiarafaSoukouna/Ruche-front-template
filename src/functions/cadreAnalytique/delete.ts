import { api } from '../../lib/api'

export const DeleteCadreAnalytique = async (id: number) => {
  try {
    const res = await api.delete(`cadre_analytique/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
