import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { addNiveauLocalite } from "../../../functions/niveauLocalites/post";
import { typeNiveauLocalite } from "../../../functions/niveauLocalites/types";
import { updateNiveauLocalite } from "../../../functions/niveauLocalites/put";

interface Props {
    showModal: () => void;
    all: () => void;
    editRow: typeNiveauLocalite | null;
}

const FormNiveau: React.FC<Props> = ({ showModal, editRow, all }) => {

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const payload: typeNiveauLocalite = {
            libelle_nlc: data.libelle_nlc as string,
            Code_number_nlc: data.Code_number_nlc as string,
            nombre_nlc: Number(data.nombre_nlc),
            id_nlc: editRow?.id_nlc,
        };
        console.log("Form values:", payload);
        try {
            let res;
            if (editRow) {
                res = await updateNiveauLocalite(payload);
                console.log("Updated:", res);
            } else {
                res = await addNiveauLocalite(payload);
                form.reset();
                console.log("Created:", res);
            }
            all();
            showModal();
        } catch (error) {
            console.log("error", error);
        }
    };
    return (
        <div className="space-y-4">
            <form onSubmit={submit} name="niveauLocaliteForm">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Libelle
                        </label>
                        <Input
                            name="libelle_nlc"
                            placeholder="Entrer le libelle"
                            defaultValue={editRow?.libelle_nlc || ""}
                        />
                    </div>
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code
                        </label>
                        <Input
                            name="Code_number_nlc"
                            placeholder="Entrer le code"
                            defaultValue={editRow?.Code_number_nlc || ""}
                        />
                    </div>
                    <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <Input
                            name="nombre_nlc"
                            type="number"
                            placeholder="Entrer le nombre"
                            defaultValue={editRow?.nombre_nlc?.toString() || ""}
                        />
                    </div>
                </div>

                <div className="flex space-x-3 pt-4">
                    <Button className="flex-1" type="submit">
                        {editRow ? "Mettre à jour" : "Créer"}
                    </Button>
                    <Button variant="secondary" onClick={showModal}  className="flex-1" type="button">
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormNiveau;
