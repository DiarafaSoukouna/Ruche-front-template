import { toast } from "react-toastify"
import { instance } from "../../axios"
import { typePartFinancier } from "./types"

export const addPartFinancier = async (data: typePartFinancier) => {
    try {
        const res = await instance.post('partenaire_financier/', data)
        return res.data
        toast.success("Parténaire financier mise à jour avec succès");
    } catch (error) {
        return error
    }
}