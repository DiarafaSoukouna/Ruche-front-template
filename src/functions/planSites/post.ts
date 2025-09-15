import { instance } from "../../axios"
import { typePlanSite } from "./types"

export const addPlanSite = async (data:typePlanSite) =>{
    try {
    const res = await instance.post('plan_site/', data)
    return res.data
    } catch (error) {
        throw error
    }
}