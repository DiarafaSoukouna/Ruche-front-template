import { instance } from "../../axios"
import { typeCibleIndicStrategique } from "./types"

export const addCibleIndicStrategique = async (data:typeCibleIndicStrategique) =>{
    try {
    const res = await instance.post('cible_indicateur_strategique/', data)
    return res.data
    } catch (error) {
        throw error
    }
}