import { instance } from "../../axios"
import { typeReferentiel } from "./types"

export const addReferentiel = async (data:typeReferentiel) =>{
    try {
    const res = await instance.post('dictionnaire_indicateur/', data)
    return res.data
    } catch (error) {
        return error
    }
}