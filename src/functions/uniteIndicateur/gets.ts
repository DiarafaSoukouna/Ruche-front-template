import { instance } from '../../axios'

export const getAllUniteIndicateur = async () => {
  try {
    const res = await instance.get('unite_indicateur/')
    if (res?.data) {
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}
