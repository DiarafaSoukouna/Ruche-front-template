import { api } from '../../lib/api'
import { NiveauActiviteTypes } from '../../types/niveauActivite'

export const updateNiveauActions = async (data: NiveauActiviteTypes) => {
  try {
    const { id_niveau_activite_projet, ...form } = data
    const res = await api.put(
      `niveau_activites_programme_config/${id_niveau_activite_projet}/`,
      form
    )
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
