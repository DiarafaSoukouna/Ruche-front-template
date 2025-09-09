import { instance } from "../../axios"
import { typeProgram } from "./types"

export const addProgram = async (data:typeProgram) =>{
    try {
    const res = await instance.post('programme_nbc/', data)
    return res.data
    } catch (error) {
        return error
    }
}