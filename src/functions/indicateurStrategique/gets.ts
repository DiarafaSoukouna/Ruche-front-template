import { instance } from '../../axios'

export const allIndicStrategique = async () => {
  try {
    const res = await instance.get('indicateur_strategique/')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}