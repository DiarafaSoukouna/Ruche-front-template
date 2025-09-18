import { instance } from '../../axios'
import { typeLocalite } from './types'

export const allLocalite = async () => {
  try {
    const res = await instance.get('localite/')
    return res.data as typeLocalite[]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const oneLocalite = (id: number) => {
  try {
    const res = instance.get('localite/' + id)
    console.log('data', res)
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const localiteByParent = async (id: number | null) => {
  try {
    const res = instance.get('localiteByParent/' + id + '/')
    return res
  } catch (error) {
    throw error
  }
}
export const localiteOneLevel = async () => {
  try {
    const res = await instance.get('localite/')
    const local = res.data.filter(
      (loc: typeLocalite) => loc.parent_loca === null
    )
    return local
  } catch (error) {
    throw error
  }
}
