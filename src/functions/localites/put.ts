import { instance } from "../../axios"

export const create = async () =>{
    try {
    const res = await instance.put('niveau_localite_config/')
    return res.data
    } catch (error) {
        return error
    }
}