import { instance } from "../../axios"
import { typeNiveauStructure } from "./types"

export const allNiveauStructure = async () => {
    try {
        const res = await instance.get("niveau_structure_config/")
        return res.data as typeNiveauStructure
    } catch (error) {
        return error
    }
}
export const oneNiveauStructure = async (id:number|undefined) => {
    try {
        const res = await instance.get("niveau_structure_config/" + id + "/")
        return res.data
    } catch (error) {
        return error
    }
}