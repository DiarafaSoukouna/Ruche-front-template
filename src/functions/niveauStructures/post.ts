import { toast } from "react-toastify";
import { instance } from "../../axios"
import { typeNiveauStructure } from "./types"

export const addNiveauStructure = async (data: typeNiveauStructure) => {
    try {
        const res = await instance.post("niveau_structure_config/", data)
        return res
    } catch (error) {
        throw error
    }
}