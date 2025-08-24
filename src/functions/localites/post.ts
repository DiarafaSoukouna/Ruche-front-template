import { instance } from "../../axios"
import { typeLocalite } from "./types"

export const addLocalite = async (data:typeLocalite) =>{
    try {
    const res = await instance.post('localite/', data)
    return res.data
    } catch (error) {
        return error
    }
}