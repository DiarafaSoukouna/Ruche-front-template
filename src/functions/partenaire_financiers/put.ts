import { instance } from "../../axios"
import { typePartFinancier } from "./types"

export const updatePartFinancier = async (data:typePartFinancier) =>{
    try {
    const res = await instance.put('partenaire_financier/', data)
    return res.data
    } catch (error) {
        return error
    }
}