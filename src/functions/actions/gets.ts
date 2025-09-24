import { api } from '../../lib/api'
import { ActionsTypes } from '../../types/actions'

export const getAllActions = async (id_programme: number) => {
  try {
    const { data } = await api.get('activite_programme/')
    if (data) {
      return data.filter(
        (action: ActionsTypes) => action.id_programme === id_programme
      ) as ActionsTypes[]
    }
  } catch (error) {
    console.error(error)
  }
}
