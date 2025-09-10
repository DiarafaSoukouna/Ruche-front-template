import React, { createContext, useContext } from "react";

// le typage
interface contextType {

}

// l'instanciation du context
const ProjetContext = createContext<contextType | undefined>(undefined)

// le provider
export const ProjetProvider = ({ children }: { children: React.ReactNode }) => {

    return (
        <ProjetContext.Provider value={{

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
