import { instance } from "../../axios"
import { typeUgl } from "./types"

export const updateUgl = async (data:typeUgl) =>{
    try {
    const res = await instance.put('ugl/', data)
    return res.data
    } catch (error) {
        return error
    }
}