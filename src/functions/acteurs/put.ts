import { api } from '../../lib/api'
import { ActeurType } from '../../pages/Parametrages/Acteurs/types'

export const UpdateActeur = async (data: ActeurType, id: number) => {
  try {
    const res = await api.put(`acteur/${id}/`, data)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
