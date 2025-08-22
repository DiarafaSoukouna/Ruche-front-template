import { toast } from "react-toastify";
import { instance } from "../../axios"

export const deletePartFinancier = async (id: number) => {
    try {
        const res = await instance.delete("partenaire_financier/" + id + "/")
        toast.success("Parténaire financier supprimé avec succès");
    } catch (error) {
        return error
    }
}