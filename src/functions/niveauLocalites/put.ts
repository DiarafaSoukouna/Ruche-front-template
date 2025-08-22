import { toast } from "react-toastify";
import { instance } from "../../axios"
import { typeNiveauLocalite } from "./types"

export const updateNiveauLocalite = async (data: typeNiveauLocalite) => {
    try {
        const res = await instance.put("niveau_localite_config/" + data.id_nlc + "/", data)
        toast.success("Niveau localité mise à jour avec succès");
        return res
    } catch (error) {
        return error
    }
}