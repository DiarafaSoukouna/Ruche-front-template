import { instance } from "../../axios"
import { typeIndicStrategique } from "./types"

export const updateIndicStrategique = async (data:typeIndicStrategique, id:number) =>{
    try {
    const res = await instance.put('indicateur_strategique/'+ id + "/", data)
    return res.data
    } catch (error) {
        throw error
    }
}