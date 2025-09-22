import { api } from '../../lib/api'
import { NiveauActionTypes } from '../../types/niveauAction'

export const addNiveauActions = async (
  data: NiveauActionTypes[]
): Promise<any[]> => {
  try {
    const promises = data.map((item) => {
      const { id_niveau_ap, ...form } = item
      return api.post('niveau_activites_programme_config/', form)
    })

    const results = await Promise.all(promises)

    return results
  } catch (error) {
    throw error
  }
}
