import { api } from '../../lib/api'
import { ActionsTypes } from '../../types/actions'

export const updateActions = async (data: ActionsTypes) => {
  try {
    const { id_ap, ...form } = data
    const res = await api.put(`activite_programme/${id_ap}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
