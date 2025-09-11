import { instance } from "../../axios"
import { typeReferentiel } from "./types"

export const updateReferentiel = async (data:typeReferentiel) =>{
    try {
    const res = await instance.put('dictionnaire_indicateur/'+ data.id_ref_ind_ref + "/", data)
    return res.data
    } catch (error) {
        return error
    }
}