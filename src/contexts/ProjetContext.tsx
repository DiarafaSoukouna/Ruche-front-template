import React, { createContext, useContext, useEffect, useState } from "react";
import { Projet } from "../types/projet";
import { deleteProjet, getAllProjet } from "../functions/projet";
import { useRoot } from "./RootContext";
import { toast } from "react-toastify";

// le typage
interface contextType {
    projetList: Projet[];
    setProjetList: React.Dispatch<React.SetStateAction<Projet[]>>;
    selectedProject?: Projet;
    setselectedProject: React.Dispatch<React.SetStateAction<Projet | undefined>>;
    openForm: boolean;
    setopenForm: React.Dispatch<React.SetStateAction<boolean>>;
    openDeleteModal: boolean;
    setopenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: () => void
}

// l'instanciation du context
const ProjetContext = createContext<contextType | undefined>(undefined)

// le provider
export const ProjetProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentProgramme } = useRoot();

    const [projetList, setProjetList] = useState<Projet[]>([]);
    const [openForm, setopenForm] = useState(false);
    const [openDeleteModal, setopenDeleteModal] = useState(false);

    const [selectedProject, setselectedProject] = useState<undefined | Projet>(undefined);

    const loadProjet = async () => {
        try {
            const res = await getAllProjet();

            if (!currentProgramme || !res) return;

            const filtered = res;

            // const filtered = res.filter(({ programme_projet }) => programme_projet === currentProgramme?.id_programme);
            setProjetList(filtered);

            console.log('la liste des projets filtrés', filtered);
        } catch (error) { }
    }

    const handleDelete = async () => {
        try {
            if (!selectedProject?.id_projet) return;

            const res = await deleteProjet(selectedProject?.id_projet);

            if (!res) {
                toast.error("Une erreur est survenue lors de la suppression");
                return;
            }

            setProjetList(
                (prev) => prev.filter(({ id_projet }) => (id_projet != selectedProject.id_projet))
            );
            toast.success("L'elément à été supprimé avec succès");
            setselectedProject(undefined);
            setopenDeleteModal(false);
        } catch (error) {
            toast.error("Une erreur est survenue lors de la suppression");
        }
    }

    useEffect(() => {
        loadProjet();
    }, [currentProgramme]);

    return (
        <ProjetContext.Provider value={{
            projetList,
            setselectedProject,
            selectedProject,
            openForm,
            setopenForm,
            setProjetList,
            openDeleteModal,
            setopenDeleteModal,
            handleDelete
        }}>
            {children}
        </ProjetContext.Provider>
    )
}

// le hook custom pour recuperer les valeurs
export const useProjet = (): contextType => {
    const context = useContext(ProjetContext);

    if (context === undefined) {
        throw new Error("useProjet must be used within an ProjetProvider");
    }

    return context;
};
