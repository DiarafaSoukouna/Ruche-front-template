import { api } from '../../lib/api'
import { ActionsTypes } from '../../types/actions'

export const addActions = async (data: ActionsTypes) => {
  try {
    const { id_ap, ...form } = data
    const res = await api.post('activite_programme/', form)
    if (res) {
      return res
    }
  } catch (error) {
    throw error
  }
}
