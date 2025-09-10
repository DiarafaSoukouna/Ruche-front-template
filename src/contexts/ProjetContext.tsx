import React, { createContext, useContext, useEffect, useState } from "react";
import { Projet } from "../types/projet";
import { getAllProjet } from "../functions/projet";
import { useRoot } from "./RootContext";

// le typage
interface contextType {
    projetList: Projet[];
    selectedProject?: Projet;
    setselectedProject: React.Dispatch<React.SetStateAction<Projet | undefined>>;
    openForm: boolean;
    setopenForm: React.Dispatch<React.SetStateAction<boolean>>;

}

// l'instanciation du context
const ProjetContext = createContext<contextType | undefined>(undefined)

// le provider
export const ProjetProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentProgramme } = useRoot();
    const [projetList, setProjetList] = useState<Projet[]>([]);
    const [openForm, setopenForm] = useState(true);

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

    useEffect(() => {
        loadProjet();
    }, [currentProgramme]);

    return (
        <ProjetContext.Provider value={{
            projetList,
            setselectedProject,
            selectedProject,
            openForm,
            setopenForm
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
