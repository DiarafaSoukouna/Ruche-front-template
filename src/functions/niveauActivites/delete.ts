import { api } from '../../lib/api'

export const DeleteAction = async (id: number) => {
  try {
    const res = await api.delete(`activite_projet/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    throw error
  }
}
