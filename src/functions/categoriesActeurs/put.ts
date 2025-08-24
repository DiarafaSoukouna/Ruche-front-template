import { api } from '../../lib/api'
import { CategorieTypes } from '../../pages/Parametrages/Acteurs/categories/types'

export const updateCategorie = async (data: CategorieTypes) => {
  try {
    const { id_categorie, ...form } = data
    const res = await api.put(`categorie_acteur/${id_categorie}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
