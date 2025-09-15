import { instance } from "../../axios"
import { typePlanSite } from "./types"

export const updatePlanSite = async (data:typePlanSite) =>{
    try {
    const res = await instance.put('plan_site/' +data.id_ds+ '/', data)
    return res.data
    } catch (error) {
        throw error
    }
}