import { toast } from "react-toastify"
import { instance } from "../../axios"

export const deleteNiveauLocalite = async (id:number) =>{
    try {
        const res = await instance.delete("niveau_localite_config/" + id+"/")
        return res
        toast.success("Niveau localité supprimé avec succès");
    } catch (error) {
        return error
    }
}