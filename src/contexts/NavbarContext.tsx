import React, { createContext, useContext, useState } from "react";
import { useRoot } from "./RootContext";

interface contextType {
    showChangeProjectModal: boolean;
    setShowChangeProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleChangeCurrentProgramme: (idProgramme: number) => void;
}

const NavbarContext = createContext<contextType | undefined>(undefined)

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
    const { setCurrentProgramme, programmeList } = useRoot();
    const [showChangeProjectModal, setShowChangeProjectModal] = useState(false);

    const handleChangeCurrentProgramme = (idProgramme: number) => {
        setCurrentProgramme(programmeList.find(
            ({ id_programme }) => id_programme === idProgramme
        ));
        setShowChangeProjectModal(false);
    }

    return (
        <NavbarContext.Provider value={{
            showChangeProjectModal,
            setShowChangeProjectModal,
            handleChangeCurrentProgramme
        }}>
            {children}
        </NavbarContext.Provider>
    )
}

export const useNavbar = (): contextType => {
    const context = useContext(NavbarContext);

    if (context === undefined) {
        throw new Error("useNavbar must be used within an NavbarProvider");
    }

    return context;
};
