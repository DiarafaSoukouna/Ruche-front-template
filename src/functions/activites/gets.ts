import { api } from '../../lib/api'
import { ActiviteTypes } from '../../types/activite'

export const getAllActions = async (id_projet: number) => {
  try {
    const { data } = await api.get('activite_programme/')
    if (data) {
      return data.filter(
        (action: ActiviteTypes) => action.id_activite_projet === id_projet
      ) as ActiviteTypes[]
    }
  } catch (error) {
    console.error(error)
  }
}
