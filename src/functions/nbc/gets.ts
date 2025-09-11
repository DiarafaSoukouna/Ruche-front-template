import { instance } from '../../axios'

export const allUgl = async () => {
  try {
    const res = await instance.get('ugl/')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}