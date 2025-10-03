import { api } from '../../lib/api'
import { ActiviteTypes } from '../../types/activite'

export const updateActions = async (data: ActiviteTypes) => {
  try {
    const { id_activite_projet, ...form } = data
    const res = await api.put(`activite_programme/${id_activite_projet}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
