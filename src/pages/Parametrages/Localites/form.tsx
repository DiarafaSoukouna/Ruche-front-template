import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { addLocalite } from "../../../functions/localites/post";
import { updateLocalite } from "../../../functions/localites/put";
import { typeLocalite } from "../../../functions/localites/types";
import Select from "react-select";
import { typeNiveauLocalite } from "../../../functions/niveauLocalites/types";
import { localiteByParent } from "../../../functions/localites/gets";
import { useEffect, useState } from "react";

interface Props {
    all: () => void;
    onClose: () => void;
    niveau: number;
    parent: number;
    niveauLocalites: typeNiveauLocalite[];
    editRow: typeLocalite | null;
}

const FormLocalite: React.FC<Props> = ({ editRow, all, onClose, parent, niveauLocalites, niveau }) => {

    const parentIndex = parent - 1;
    const parentInfo = niveauLocalites[parentIndex]
    const [localite, setLocalite] = useState<typeLocalite[]>([])
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let payload: typeLocalite;
        if (parentInfo) {
            payload = {
                intitule_loca: data.intitule_loca as string,
                code_national_loca: data.code_national_loca as string,
                code_loca: data.code_loca as string,
                parent_loca: data.parent_loca as string,
                niveau_loca: niveau,
                id_loca: editRow?.id_loca,
            };
        } else {
            payload = {
                intitule_loca: data.intitule_loca as string,
                code_national_loca: data.code_national_loca as string,
                code_loca: data.code_loca as string,
                niveau_loca: niveau,
                id_loca: editRow?.id_loca,
            };
        }
        try {
            let res;
            if (editRow) {
                res = await updateLocalite(payload);
                console.log("Updated:", res);
            } else {
                res = await addLocalite(payload);
                form.reset();
                console.log("Created:", res);
            }
            all();
        } catch (error) {
            console.log("error", error);
        }
    };

    const LocaliteByParent = async (id: number| null) => {
        try {
            const res = await localiteByParent(id)
            // setLocalite()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        LocaliteByParent(null)
    }, [])
    console.log('parent', parentIndex, niveau)
    console.log('parentInfo', parentInfo)
    return (
        <div className="space-y-4">
            <form onSubmit={submit} name="niveauLocaliteForm">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Libelle
                        </label>
                        <Input
                            name="intitule_loca"
                            placeholder="Entrer le libelle"
                            defaultValue={editRow?.intitule_loca || ""}
                        />
                    </div>
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code national
                        </label>
                        <Input
                            name="code_national_loca"
                            placeholder="Entrer le code natonal"
                            defaultValue={editRow?.code_national_loca || ""}
                        />
                    </div>
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code
                        </label>
                        <Input
                            name="code_loca"
                            placeholder="Entrer le code"
                            defaultValue={editRow?.code_loca || ""}
                        />
                    </div>
                    {parentInfo &&
                        <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {parentInfo.libelle_nlc}
                            </label>
                            <Select
                                defaultValue={editRow?.parent_loca ? {
                                    value: editRow.parent_loca,
                                    label: editRow.parent_loca
                                } : null}
                                options={niveauLocalites.map(item => ({
                                    value: String(item.id_nlc),
                                    label: item.libelle_nlc
                                }))}
                                isClearable
                                placeholder="Sélectionner un parent..."
                            />
                        </div>
                    }

                </div>
                <div className="flex space-x-3 pt-4 justify-end">
                    <Button variant="outline" onClick={onClose} className="">
                        Annuler
                    </Button>
                    <Button className="" type="submit">
                        {editRow ? "Mettre à jour" : "Valider"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormLocalite;
