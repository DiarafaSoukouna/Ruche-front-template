import { api } from '../../lib/api'
import { SuiviDecaissement } from '../../types/decaissement_ptba'

export const getAllDecaissementPtba = async () => {
  try {
    const response = await api.get('suivi_decaissement_ptba/')
    if (response) {
      return response.data as SuiviDecaissement[]
    }
    return []
  } catch (error) {
    throw error
  }
}
