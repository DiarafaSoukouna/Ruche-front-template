import { api } from '../../lib/api'

export const getAllCadreAnalytiqueConfig = async () => {
  try {
    const res = await api.get('cadre_analytique_config/')
    if (res) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}

export const getCadreAnalytiqueConfigByProgramme = async (id: number) => {
  try {
    const res = await api.get(`programme/${id}/get_cadres_config/`)
    if (res) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}
