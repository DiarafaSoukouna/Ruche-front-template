import { Check } from "lucide-react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useProjet } from "../../contexts/ProjetContext";
import { useEffect, useState } from "react";
import { addProjet } from "../../functions/projet";
import { useRoot } from "../../contexts/RootContext";

const ProjectForm = () => {
    const { currentProgramme } = useRoot();
    const { openForm, setopenForm } = useProjet();

    const [step, setStep] = useState(1);

    const [partenaires, setPartenaires] = useState<{ id: number; name: string }[]>([]);
    const [structures, setStructures] = useState<{ id: number; name: string }[]>([]);
    const [signataires, setSignataires] = useState<{ id: number; name: string }[]>([]);
    const [zones, setZones] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        // Remplir les selects dynamiquement
        // Exemple fetch:
        // fetch("/api/partenaires").then(r => r.json()).then(setPartenaires)
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const value = {
            // Étape 1
            code_projet: formData.get("code_projet") as string,
            sigle_projet: formData.get("sigle_projet") as string,
            intitule_projet: formData.get("intitule_projet") as string,
            duree_projet: parseInt(formData.get("duree_projet") as string, 10),
            date_signature_projet: formData.get("date_signature_projet") as string,
            date_demarrage_projet: formData.get("date_demarrage_projet") as string,
            partenaire_projet: parseInt(formData.get("partenaire_projet") as string, 10),
            programme_projet: parseInt(formData.get("programme_projet") as string, 10),

            // Étape 2 (multi-selects)
            structure_projet: (formData.getAll("structure_projet") as string[]).map(Number),
            signataires_projet: (formData.getAll("signataires_projet") as string[]).map(Number),
            partenaires_execution_projet: (formData.getAll("partenaires_execution_projet") as string[]).map(Number),
            zone_projet: (formData.getAll("zone_projet") as string[]).map(Number),
        };

        console.log("Données sérialisées :", value);

        try {
            const projet = await addProjet(value);
            console.log("Projet créé :", projet);
            setopenForm(false);
        } catch (err) {
            console.error("Erreur création projet :", err);
        }
    };

    return (
        <Modal isOpen={openForm} onClose={() => setopenForm(false)} size="lg">
            <form className="flex flex-col gap-4 space-y-4" onSubmit={handleSubmit}>
                <input

                    type="hidden"
                    name="programme_projet"
                    value={currentProgramme?.id_programme}
                />

                <h3 className="font-bold text-lg">Ajouter un projet</h3>

                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Code *</label>
                            <input
                                name="code_projet"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sigle *</label>
                            <input
                                name="sigle_projet"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Intitulé *</label>
                            <input
                                name="intitule_projet"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Durée *</label>
                            <input
                                type="number"
                                name="duree_projet"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date de signature *</label>
                            <input
                                type="date"
                                name="date_signature_projet"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date de démarrage *</label>
                            <input
                                type="date"
                                name="date_demarrage_projet"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Partenaire *</label>
                            <select
                                name="partenaire_projet" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {partenaires.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Structures du projet *</label>
                            <select
                                name="structure_projet"
                                multiple
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {structures.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Signataires du projet *</label>
                            <select
                                name="signataires_projet"
                                multiple
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {signataires.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Partenaires d'exécution *</label>
                            <select
                                name="partenaires_execution_projet"
                                multiple
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {partenaires.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Zones *</label>
                            <select
                                name="zone_projet"
                                multiple
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 justify-end ">
                    {step > 1 && (
                        <Button
                            className="w-full"
                            type="button"
                            variant="danger"
                            onClick={() => setStep(step - 1)}
                        >Précédent</Button>
                    )}
                    {step < 2 && (
                        <Button
                            className="w-full"
                            type="button"
                            onClick={() => setStep(step + 1)}
                        >Suivant</Button>
                    )}
                    {step === 2 && (
                        <Button
                            className="w-full"
                            type="submit"
                        >
                            Valider <Check />
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default ProjectForm;