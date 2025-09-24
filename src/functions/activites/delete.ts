import { api } from '../../lib/api'

export const DeleteNiveauActivite = async (id: number) => {
  try {
    const res = await api.delete(`niveau_activite_config/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    throw error
  }
}
