import { api } from '../../lib/api'
import { ZoneCollecteTypes } from '../../pages/Parametrages/AutresParametrages/ZoneCollecte/types'

export const addZoneCollecte = async (data: ZoneCollecteTypes) => {
  try {
    const res = await api.post('zone_collecte/', data)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
