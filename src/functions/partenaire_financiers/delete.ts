import { instance } from "../../axios"

export const deletePartFinancier = async (id: number) => {
    try {
        const res = await instance.delete("partenaire_financier/" + id + "/")
    } catch (error) {
        return error
    }
}