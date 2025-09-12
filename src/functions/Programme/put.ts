import { instance } from "../../axios"
import { typeProgram } from "./types"

export const updateProgram = async (data:typeProgram, id:number) =>{
    try {
    const res = await instance.put('programme/'+ id + "/", data)
    return res.data
    } catch (error) {
        throw error
    }
}