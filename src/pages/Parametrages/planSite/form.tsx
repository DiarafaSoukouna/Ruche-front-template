import Button from "../../../components/Button";
import { typeLocalite } from "../../../functions/localites/types";
import Select from "react-select";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { oneNiveauStructure } from "../../../functions/niveauStructures/gets";
import { typeNiveauStructure } from "../../../functions/niveauStructures/types";
import { typePlanSite } from "../../../functions/planSites/types";
import { updatePlanSite } from "../../../functions/planSites/put";
import { addPlanSite } from "../../../functions/planSites/post";

interface Props {
    onClose: () => void;
    planByNiveau: (id: number) => void;
    niveau: number;
    currentId: number;
    niveauStructures: typeNiveauStructure[];
    editRow: typePlanSite | null;
}

type Errors = {
    intitule_ds?: string;
    code_relai_ds?: string;
    code_ds?: string;
};

const FormPlanSite: React.FC<Props> = ({ editRow, onClose, niveauStructures, niveau, currentId, planByNiveau }) => {

    const parentIndex = niveau - 2;
    const parentInfo = niveauStructures[parentIndex]
    const curentInfo = niveauStructures[niveau - 1]
    const [localiteByNiv, setLocaliteByNiv] = useState<typeLocalite[]>([])
    const [errors, setErrors] = useState<Errors>({});

    const validate = (data: Record<string, any>) => {
        const newErrors: Errors = {};

        if (!data.intitule_loca || data.intitule_loca.trim() === "") {
            newErrors.intitule_ds = "Le libellé est obligatoire.";
        }

        if (!data.code_national_loca || data.code_national_loca.trim() === "") {
            newErrors.code_relai_ds = "Le code national est obligatoire.";
        } else if (data.code_relai_ds.length !== Number(curentInfo.code_number_nsc)) {
            newErrors.code_relai_ds = `Le code doit contenir exactementh ${curentInfo.code_number_nsc } caractères.`;
        }

        if (!data.code_ds || data.code_ds.trim() === "") {
            newErrors.code_ds = "Le code est obligatoire.";
        }

        return newErrors;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validation
        const newErrors = validate(data);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; 
        }
        setErrors({});

        let payload: typePlanSite;
        if (parentInfo) {
            payload = {
                intitule_ds: data.intitule_ds as string,
                code_relai_ds: data.code_relai_ds as string,
                code_ds: data.code_ds as string,
                parent_ds: data.parent_ds as string,
                niveau_ds: currentId,
                id_ds: editRow?.id_ds,
            };
        } else {
            payload = {
                intitule_ds: data.intitule_ds as string,
                code_relai_ds: data.code_relai_ds as string,
                code_ds: data.code_ds as string,
                niveau_ds: currentId,
                id_ds: editRow?.id_ds,
            };
        }

        try {
            let res;
            if (editRow) {
                res = await updatePlanSite(payload);
            } else {
                res = await addPlanSite(payload);
                form.reset();
            }
            toast.success(editRow ?
                "Localité mise à jour avec succès" :
                "Localité ajoutée avec succès"
            );
            onClose()
            planByNiveau(currentId)
        } catch (error) {
            console.log("error", error);
        }
    };

    const OneNiveau = async (id: number) => {
        try {
            const res = await oneNiveauStructure(id);
            setLocaliteByNiv(res.localites);
        } catch (error) {
            toast.error('Erreur lors de la recuperation du niveau localité')
        }
    }

    useEffect(() => {
        if (parentInfo) {
            OneNiveau(parentInfo.id_nsc!)
        }
    }, [])

    const defaultValue = typeof editRow?.parent_ds === 'object' && editRow.parent_ds !== null ?
        editRow.parent_ds as typePlanSite :
        ''
    console.log(curentInfo, niveau)
    return (
        <div className="space-y-4">
            <form onSubmit={submit} name="niveauLocaliteForm">
                <div className="grid grid-cols-12 gap-4">

                    {/* Libellé */}
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Libellé
                        </label>
                        <input
                            name="intitule_ds"
                            placeholder="Entrer le libellé"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                              ${errors.intitule_ds ? "border-red-500" : "border-gray-300"}`}
                            defaultValue={editRow?.intitule_ds || ""}
                        />
                        {errors.intitule_ds && (
                            <p className="text-red-500 text-sm mt-1">{errors.intitule_ds}</p>
                        )}
                    </div>


                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code
                        </label>
                        <input
                            name="code_ds"
                            placeholder="Entrer le code"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                              ${errors.code_ds ? "border-red-500" : "border-gray-300"}`}
                            defaultValue={editRow?.code_ds || ""}
                        />
                        {errors.code_ds && (
                            <p className="text-red-500 text-sm mt-1">{errors.code_ds}</p>
                        )}
                    </div>
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code rélai
                        </label>
                        <input
                            name="code_relai_ds"
                            placeholder="Entrer le code national"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 
                              ${errors.code_relai_ds ? "border-red-500" : "border-gray-300"}`}
                            defaultValue={editRow?.code_relai_ds || ""}
                        />
                        {errors.code_relai_ds && (
                            <p className="text-red-500 text-sm mt-1">{errors.code_relai_ds}</p>
                        )}
                    </div>
                    {parentInfo &&
                        <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {parentInfo.libelle_nsc}
                            </label>
                            <Select
                                name="parent_ds"
                                defaultValue={defaultValue ? {
                                    value: String(defaultValue?.id_ds),
                                    label: defaultValue.intitule_ds
                                } : null}
                                options={localiteByNiv.map(item => ({
                                    value: String(item.id_loca),
                                    label: item.intitule_loca
                                }))}
                                isClearable
                                placeholder="Sélectionner un parent..."
                            />
                        </div>
                    }
                </div>

                <div className="flex space-x-3 pt-4 justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button type="submit">
                        {editRow ? "Mettre à jour" : "Valider"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormPlanSite;
