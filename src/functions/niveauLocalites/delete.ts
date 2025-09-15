import { toast } from "react-toastify"
import { instance } from "../../axios"

export const deleteNiveauLocalite = async (id:number) =>{
    try {
        const res = await instance.delete("niveau_localite_config/" + id+"/")
        return res;
    } catch (error) {
        throw error
    }
}