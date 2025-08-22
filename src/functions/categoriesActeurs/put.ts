import { api } from '../../lib/api'
import { CategorieTypes } from '../../pages/Parametrages/Acteurs/categories/types'

export const updateCategorie = async (data: CategorieTypes, id: number) => {
  try {
    const res = await api.post(`categorie_acteur/${id}`, data)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
