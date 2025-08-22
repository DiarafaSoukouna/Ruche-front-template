import { instance } from "../../axios"

export const deletePartFinancier = async (id: number) => {
    try {
        const res = await instance.delete("PartFinancier/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}