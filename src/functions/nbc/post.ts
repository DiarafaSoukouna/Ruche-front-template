import { instance } from "../../axios"
import { typeUgl } from "./types"

export const addUgl = async (data:typeUgl) =>{
    try {
    const res = await instance.post('ugl/', data)
    return res.data
    } catch (error) {
        return error
    }
}