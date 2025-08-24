import { api } from '../../lib/api'
import { CategorieTypes } from '../../pages/Parametrages/Acteurs/categories/types'

export const addCategorie = async (data: CategorieTypes) => {
  try {
    const { id_categorie, ...form } = data
    const res = await api.post('categorie_acteur/', form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
