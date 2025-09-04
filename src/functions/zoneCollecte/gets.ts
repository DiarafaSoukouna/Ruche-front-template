import { instance } from '../../axios'

export const getAllZoneCollecte = async () => {
  try {
    const res = await instance.get('zone_collecte/')
    if (res?.data) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}
