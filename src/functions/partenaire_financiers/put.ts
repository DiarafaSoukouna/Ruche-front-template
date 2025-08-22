import { toast } from "react-toastify";
import { instance } from "../../axios"
import { typePartFinancier } from "./types"

export const updatePartFinancier = async (data: typePartFinancier) => {
    try {
        const res = await instance.put("partenaire_financier/" + data.id_partenaire + "/", data)
        toast.success("Parténaire financier mise à jour avec succès");
        return res
    } catch (error) {
        return error
    }
}