import { instance } from "../../axios"
import { typeUgl } from "./types"

export const updateUgl = async (data:typeUgl) =>{
    try {
    const res = await instance.put('ugl/'+ data.id_ugl + "/", data)
    return res.data
    } catch (error) {
        throw error
    }
}