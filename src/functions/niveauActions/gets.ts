import { api } from '../../lib/api'
import { NiveauActionTypes } from '../../types/niveauAction'

export const getAllNiveauActions = async (code_programme: number) => {
  try {
    const { data } = await api.get('niveau_activites_programme_config/')
    if (data) {
      return data.filter(
        (niveau: NiveauActionTypes) => niveau.code_programme === code_programme
      )
    }
  } catch (error) {
    console.error(error)
  }
}
