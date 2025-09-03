import { instance } from "../../axios"

export const allNiveauLocalite = async () => {
    try {
        const res = await instance.get("niveau_localite_config/")
        return res.data
    } catch (error) {
        return error
    }
}
export const oneNiveauLocalite = async (id:number|undefined) => {
    try {
        const res = await instance.get("niveau_localite_config/" + id + "/")
        return res.data
    } catch (error) {
        return error
    }
}