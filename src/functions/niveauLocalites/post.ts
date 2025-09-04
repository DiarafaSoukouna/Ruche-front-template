import { toast } from "react-toastify";
import { instance } from "../../axios"
import { typeNiveauLocalite } from "./types"

export const addNiveauLocalite = async (data: typeNiveauLocalite[]) => {
    try {
        const res = await instance.post("niveau_localite_config/", data)
        return res
    } catch (error) {
        return error
    }
}