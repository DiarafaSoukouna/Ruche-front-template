import { api } from '../../lib/api'
import { TypesZoneTypes } from '../../pages/Parametrages/ZoneCollecte/types'

export const addTypeZone = async (data: TypesZoneTypes) => {
  try {
    const res = await api.post('type_zone/', data)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
