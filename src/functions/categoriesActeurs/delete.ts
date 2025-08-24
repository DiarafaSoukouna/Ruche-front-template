import { api } from '../../lib/api'

export const DeleteCategorie = async (id: number) => {
  try {
    const res = await api.delete(`categorie_acteur/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
