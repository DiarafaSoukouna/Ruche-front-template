import { instance } from '../../axios'

export const getAll = () => {
  try {
    const res = instance.get('niveau_localite_config')
    console.log('data', res)
    return res
  } catch (error){
    console.log(error)
    return error
  }
}

export const getOne = (id:number) => {
  try {
    const res = instance.get('niveau_localite_config/'+ id)
    console.log('data', res)
    return res
  } catch (error){
    console.log(error)
    return error
  }
}