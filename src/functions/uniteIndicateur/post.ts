import { api } from '../../lib/api'
import { UniteIndicateurTypes } from '../../pages/Parametrages/AutresParametrages/UniteIndicateur/types'

export const addUniteIndicateur = async (data: UniteIndicateurTypes) => {
  try {
    const res = await api.post('unite_indicateur/', data)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
