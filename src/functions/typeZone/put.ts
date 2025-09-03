import { api } from '../../lib/api'
import { TypesZoneTypes } from '../../pages/Parametrages/ZoneCollecte/types'

export const updateTypeZone = async (data: TypesZoneTypes) => {
  try {
    const { id_type_zone, ...form } = data
    const res = await api.put(`type_zone/${id_type_zone}/`, form)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
