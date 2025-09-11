import { instance } from '../../axios'

export const allProgram = async () => {
  try {
    const res = await instance.get('programme_nbc/')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}