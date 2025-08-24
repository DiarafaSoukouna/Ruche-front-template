import { instance } from "../../axios"
import { typeLocalite } from "./types"

export const updateLocalite = async (data:typeLocalite) =>{
    try {
    const res = await instance.put('localite/', data)
    return res.data
    } catch (error) {
        return error
    }
}