import { api } from '../../lib/api'
import { NiveauActiviteTypes } from '../../types/niveauActivite'

export const addNiveauActions = async (
  data: NiveauActiviteTypes[]
): Promise<any[]> => {
  try {
    const promises = data.map((item) => {
      const { id_niveau_activite_projet, ...form } = item
      return api.post('niveau_activite_config/', form)
    })

    const results = await Promise.all(promises)

    return results
  } catch (error) {
    throw error
  }
}
