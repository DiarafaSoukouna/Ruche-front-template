import { instance } from '../../axios'

export const allPartFinancier = async () => {
  try {
    const res = await instance.get('partenaire_financier/')
    return res.data
  } catch (error){
    console.log(error)
    return error
  }
}

export const onePartFinancier = (id:number) => {
  try {
    const res = instance.get('partenaire_financier/'+ id)
    console.log('data', res)
    return res
  } catch (error){
    console.log(error)
    return error
  }
}