import { instance } from "../../axios"

export const deleteLocalite = async (id: number) => {
    try {
        const res = await instance.delete("localite/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}