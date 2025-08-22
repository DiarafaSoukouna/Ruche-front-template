import { api } from '../../lib/api'

export const getAllCategories = async () => {
  try {
    const res = await api.get('categorie_acteur/')
    if (res) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}
