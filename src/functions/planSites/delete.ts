import { instance } from "../../axios"

export const deletePlanStie = async (id: number) => {
    try {
        const res = await instance.delete("plan_site/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}