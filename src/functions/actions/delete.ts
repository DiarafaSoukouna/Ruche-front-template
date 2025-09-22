import { api } from '../../lib/api'

export const DeleteNiveauAction = async (id: number) => {
  try {
    const res = await api.delete(`niveau_activites_programme_config/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    throw error
  }
}
