import { api } from '../../lib/api'

export const DeleteActeur = async (id: number) => {
  try {
    const res = await api.delete(`acteur/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
