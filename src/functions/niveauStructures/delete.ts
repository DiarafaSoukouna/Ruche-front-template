import { toast } from "react-toastify"
import { instance } from "../../axios"

export const deleteNiveauStructure = async (id:number) =>{
    try {
        const res = await instance.delete("niveau_structure_config/" + id+"/")
        return res
    } catch (error) {
        throw error
    }
}