import { instance } from "../../axios"

export const deleteIndicStrategique = async (id: number) => {
    try {
        const res = await instance.delete("indicateur_strategique/" + id + "/")
        return res
    } catch (error) {
        return error
    }
}