import { api } from '../../lib/api'
import { ActeurType } from '../../pages/Parametrages/Acteurs/types'

export const addActeur = async (data: ActeurType) => {
  try {
    const res = await api.post('acteur/', data)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
