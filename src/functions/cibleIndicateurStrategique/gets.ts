import { instance } from '../../axios'

export const allCibleIndicStrategique = async () => {
  try {
    const res = await instance.get('cible_indicateur_strategique/')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}