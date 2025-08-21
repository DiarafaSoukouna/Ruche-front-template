import { instance } from "../../axios"

export const create = async () =>{
    try {
    const res = await instance.post('niveau_localite_config/')
    return res.data
    } catch (error) {
        return error
    }
}