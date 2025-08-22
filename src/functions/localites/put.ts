import { instance } from "../../axios"
import { typeLocalite } from "./types"

export const updateLocalite = async (data:typeLocalite) =>{
    try {
    const res = await instance.put('niveau_localite_config/', data)
    return res.data
    } catch (error) {
        return error
    }
}