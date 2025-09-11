import { instance } from "../../axios"

export const deleteProgram = async (id: number) => {
    try {
        const res = await instance.delete("programme/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}