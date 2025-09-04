import { api } from '../../lib/api'

export const DeleteZoneCollecte = async (id: number) => {
  try {
    const res = await api.delete(`zone_collecte/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
