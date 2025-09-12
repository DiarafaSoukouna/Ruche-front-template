import { instance } from '../../axios'
import { typePlanSite } from './types'

export const allPlanSite = async () => {
  try {
    const res = await instance.get('plan_site/')
    return res.data as typePlanSite[]
  } catch (error){
    console.log(error)
    return error
  }
}

export const onePlanSite = (id:number) => {
  try {
    const res = instance.get('plan_site/'+ id )
    console.log('data', res)
    return res
  } catch (error){
    console.log(error)
    return error
  }
}

export const planSiteByParent = async (id:number | null) =>{
  try {
    const res = instance.get('plan_site/' + id + '/')
    return res
  } catch (error) {
    return error
  }
}