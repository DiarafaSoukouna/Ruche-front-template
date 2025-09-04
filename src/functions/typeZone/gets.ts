import { instance } from '../../axios'

export const getAllTypeZones = async () => {
  try {
    const res = await instance.get('type_zone/')
    if (res?.data) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}
