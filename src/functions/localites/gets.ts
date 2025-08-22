import { instance } from '../../axios'

export const allLocalite = async () => {
  try {
    const res = await instance.get('localite')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}

export const oneLocalite = (id:number) => {
  try {
    const res = instance.get('localite/'+ id)
    console.log('data', res)
    return res
  } catch (error){
    console.log(error)
    return error
  }
}