import { api } from '../../lib/api'

export const DeleteUniteIndicateur = async (id: number) => {
  try {
    const res = await api.delete(`unite_indicateur/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
