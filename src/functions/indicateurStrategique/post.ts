import { instance } from "../../axios"
import { typeIndicStrategique } from "./types"

export const addIndicStrategique = async (data:typeIndicStrategique) =>{
    try {
    const res = await instance.post('indicateur_strategique/', data)
    return res.data
    } catch (error) {
        throw error
    }
}