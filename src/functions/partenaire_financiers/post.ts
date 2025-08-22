import { instance } from "../../axios"
import { typePartFinancier } from "./types"

export const addPartFinancier = async (data:typePartFinancier) =>{
    try {
    const res = await instance.post('partenaire_financier/', data)
    return res.data
    } catch (error) {
        return error
    }
}