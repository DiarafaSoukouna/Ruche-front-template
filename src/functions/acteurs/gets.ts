import { instance } from '../../axios'

export const getAllActeurs = async () => {
  try {
    const res = await instance.get('acteur/')
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
