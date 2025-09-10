// components/ProjectForm.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { addProjet, editProjet } from "../../../functions/projet";
import { useProjet } from "../../../contexts/ProjetContext";
import { useRoot } from "../../../contexts/RootContext";
import { ProjectCreateData, projectCreateSchema } from "../../../schemas/projetSchema";
import { Check } from "lucide-react";
import Step1 from "./Step1";
import Step2 from "./Step2";

const ProjectForm = () => {
    const { currentProgramme } = useRoot();
    const { openForm, setopenForm, selectedProject } = useProjet();
    const [step, setStep] = useState(1);

    // Valeurs par défaut
    const defaultValues: ProjectCreateData = {
        code_projet: selectedProject?.code_projet || "",
        sigle_projet: selectedProject?.sigle_projet || "",
        intitule_projet: selectedProject?.intitule_projet || "",
        duree_projet: selectedProject?.duree_projet || 0,
        date_signature_projet: selectedProject?.date_signature_projet || "",
        date_demarrage_projet: selectedProject?.date_demarrage_projet || "",
        //@ts-ignore
        partenaire_projet: selectedProject?.partenaire_projet || 0,
        programme_projet: selectedProject?.programme_projet || currentProgramme?.id_programme || 0,
        structure_projet: selectedProject?.structure_projet || [],
        signataires_projet: selectedProject?.signataires_projet || [],
        partenaires_execution_projet: selectedProject?.partenaires_execution_projet || [],
        zone_projet: selectedProject?.zone_projet || [],
    };

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ProjectCreateData>({
        resolver: zodResolver(projectCreateSchema),
        defaultValues,
    });

    const onSubmit = async (data: ProjectCreateData) => {
        try {
            if (selectedProject) {
                await editProjet(selectedProject.id_projet, data);
                console.log("Projet modifié :", data);
            } else {
                // Création
                await addProjet(data);
                console.log("Projet créé :", data);
            }
            setopenForm(false);
        } catch (err) {
            console.error("Erreur :", err);
        }
    };

    // Reset le formulaire si selectedProject change
    useEffect(() => {
        reset(defaultValues);
    }, [selectedProject]);


    return (
        <Modal isOpen={openForm} onClose={() => setopenForm(false)} size="lg">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("programme_projet")} />

                <h3 className="font-bold text-lg">Ajouter un projet</h3>

                {step === 1 && <Step1 register={register} errors={errors} />}
                
                {step === 2 && <Step2
                    control={control}
                    errors={errors}
                />}


                <div className="flex gap-2 justify-end">
                    {step > 1 && (
                        <Button type="button" variant="danger" onClick={() => setStep(step - 1)}>
                            Précédent
                        </Button>
                    )}
                    {step < 2 && (
                        <Button type="button" onClick={() => setStep(step + 1)}>
                            Suivant
                        </Button>
                    )}
                    {step === 2 && (
                        <Button type="submit">
                            Valider <Check />
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default ProjectForm;
