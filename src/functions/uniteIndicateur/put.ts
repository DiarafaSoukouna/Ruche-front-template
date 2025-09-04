import { api } from '../../lib/api'
import { UniteIndicateurTypes } from '../../pages/Parametrages/AutresParametrages/UniteIndicateur/types'

export const updateUniteIndicateur = async (data: UniteIndicateurTypes) => {
  try {
    const { id_unite, ...form } = data
    const res = await api.put(`unite_indicateur/${id_unite}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
