import { instance } from "../../axios"
import { typeNiveauLocalite } from "./types"

export const update = async (data:typeNiveauLocalite) =>{
    try {
        const res = await instance.put("niveau_localite_config/"+ data.id_nlc +"/", data)
        return res
    } catch (error) {
        return error
    }
}