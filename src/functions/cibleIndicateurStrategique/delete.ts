import { instance } from "../../axios"

export const deleteCibleIndicStrategique = async (id: number) => {
    try {
        const res = await instance.delete("cible_indicateur_strategique/" + id + "/")
        return res
    } catch (error) {
        throw error
    }
}