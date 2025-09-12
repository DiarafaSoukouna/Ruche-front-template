import { toast } from "react-toastify";
import { instance } from "../../axios"
import { typeNiveauStructure } from "./types"

export const updateNiveauStructure = async (data: typeNiveauStructure) => {
    try {
        const res = await instance.put("niveau_Structure_config/" + data.id_nsc + "/", data)
        return res
    } catch (error) {
        throw error
    }
}