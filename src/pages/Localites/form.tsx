import Button from "../../components/Button";
import Input from "../../components/Input";
import { typeLocalite } from "../../functions/localites/types";
import { addLocalite } from "../../functions/localites/post";
import { updateLocalite } from "../../functions/localites/put";


interface Props {
    all: () => void;
    onClose: () => void;
    niveau: number;
    editRow: typeLocalite | null;
}

const FormLocalite: React.FC<Props> = ({ editRow, all, onClose, niveau }) => {

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const payload: typeLocalite = {
            intitule_loca: data.intitule_loca as string,
            code_national_loca: data.code_national_loca as string,
            code_loca: data.code_loca as string,
            parent_loca: "0",
            // parent_loca: data.parent_loca as string,
            niveau_loca: niveau,
            id_loca: editRow?.id_loca,
        };
        console.log("Form values:", payload);
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
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Parent
                        </label>
                        <Input
                            name="parent_loca"
                            type="number"
                            placeholder="Entrer le nombre"
                            defaultValue={editRow?.parent_loca?.toString() || ""}
                        />
                    </div>
                </div>

                <div className="flex space-x-3 pt-4">
                    <Button className="flex-1" type="submit">
                        {editRow ? "Mettre à jour" : "Créer"}
                    </Button>
                    <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormLocalite;
