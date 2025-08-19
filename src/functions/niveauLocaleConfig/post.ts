import { instance } from "../../axios"

export const create = async () =>{
    try {
    const res = await instance.post('niveau_localite_config')
    
    } catch (error) {
        return error
    }
}