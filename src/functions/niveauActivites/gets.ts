import { api } from '../../lib/api'
import { NiveauActiviteTypes } from '../../types/niveauActivite'

export const getAllNiveauActions = async (code_projet: string) => {
  try {
    const { data } = await api.get('niveau_activite_config/')
    if (data) {
      return data.filter(
        (niveau: NiveauActiviteTypes) => niveau.code_projet === code_projet
      )
    }
  } catch (error) {
    console.error(error)
  }
}
