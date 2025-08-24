import { instance } from "../../axios"
import { api } from "../../lib/api"

export const allNiveauLocalite = async () => {
    try {
        const res = await instance.get("niveau_localite_config/")
        return res.data
    } catch (error) {
        return error
    }
}
export const getOne = async (id:Number) => {
    try {
        const res = await instance.get("niveau_localite_config/" + id)
        return res.data
    } catch (error) {
        return error
    }
}