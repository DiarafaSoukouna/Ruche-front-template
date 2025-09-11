import { instance } from "../../axios"

export const deleteReferentiel = async (id: number) => {
    try {
        const res = await instance.delete("ugl/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}