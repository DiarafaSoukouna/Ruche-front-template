import { api } from '../../lib/api'
import { ActiviteTypes } from '../../types/activite'

export const addActions = async (data: ActiviteTypes) => {
  try {
    const { id_activite_projet, ...form } = data
    const res = await api.post('activite_projet/', form)
    if (res) {
      return res
    }
  } catch (error) {
    throw error
  }
}
