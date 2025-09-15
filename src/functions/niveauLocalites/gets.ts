import { instance } from "../../axios"
import { typeLocalite } from "../localites/types"
import { typeNiveauLocalite } from "./types"

export const allNiveauLocalite = async () => {
    try {
        const res = await instance.get("niveau_localite_config/")
        return res.data as typeNiveauLocalite[]
    } catch (error) {
        throw error
    }
}
export const oneNiveauLocalite = async (id:number|undefined) => {
    try {
        const res = await instance.get("niveau_localite_config/" + id + "/")
        return res.data
    } catch (error) {
        throw error
    }
}