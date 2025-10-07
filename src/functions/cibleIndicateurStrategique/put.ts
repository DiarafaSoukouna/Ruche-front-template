import { instance } from "../../axios"
import { typeCibleIndicStrategique } from "./types"

export const updateCibleIndicStrategique = async (data:typeCibleIndicStrategique, id:number) =>{
    try {
    const res = await instance.put('cible_indicateur_strategique/'+ id + "/", data)
    return res.data
    } catch (error) {
        throw error
    }
}