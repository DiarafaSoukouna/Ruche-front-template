import { instance } from '../../axios'

export const allReferentiel = async () => {
  try {
    const res = await instance.get('dictionnaire_indicateur/')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}