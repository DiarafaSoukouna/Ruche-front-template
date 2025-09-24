import { api } from '../../lib/api'
import { NiveauActionTypes } from '../../types/niveauAction'

export const updateNiveauActions = async (data: NiveauActionTypes) => {
  try {
    const { id_ap, ...form } = data
    const res = await api.put(
      `niveau_activites_programme_config/${id_ap}/`,
      form
    )
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
