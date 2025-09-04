import { api } from '../../lib/api'
import { ZoneCollecteTypes } from '../../pages/Parametrages/ZoneCollecte/types'

export const updateZoneCollecte = async (data: ZoneCollecteTypes) => {
  try {
    const { id_zone_collecte, ...form } = data
    const res = await api.put(`zone_collecte/${id_zone_collecte}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
