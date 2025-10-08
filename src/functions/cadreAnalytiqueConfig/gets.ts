import { api } from '../../lib/api'
import { useRoot } from '../../contexts/RootContext'
import { CadreAnalytiqueConfigTypes } from '../../types/cadreAnalytiqueConfig'

export const getAllCadreAnalytiqueConfig = async () => {
  const { currentProgramme } = useRoot()
  try {
    const res = await api.get('cadre_analytique_config/')
    if (res) {
      return res.data.filter(
        (cadre: CadreAnalytiqueConfigTypes) =>
          cadre.programme === currentProgramme.code_programme
      )
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
