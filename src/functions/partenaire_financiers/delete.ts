import { instance } from "../../axios"

export const deleteLocalite = async (id: number) => {
    try {
        const res = await instance.delete("partenaire_financier/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}