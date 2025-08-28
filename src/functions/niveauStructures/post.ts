import { toast } from "react-toastify";
import { instance } from "../../axios"
import { typeNiveauStructure } from "./types"

export const addNiveauStructure = async (data: typeNiveauStructure) => {
    try {
        const res = await instance.post("niveau_structure_config/", data)
        toast.success("Niveau localité mise à jour avec succès");
        return res
    } catch (error) {
        return error
    }
}