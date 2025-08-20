import { instance } from "../../axios"

export const deleteN = async (id:number) =>{
    try {
        const res = await instance.delete("niveau_localite_config/" + id+"/")
        return res
    } catch (error) {
        return error
    }
}