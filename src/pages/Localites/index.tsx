import React, { lazy, useEffect, useState } from "react";
import Button from "../../components/Button";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Modal from "../../components/Modal";
import NiveauLocalite from "./niveau";
import Tabs from "../../components/Tabs";
import { allNiveauLocalite } from "../../functions/niveauLocalites/gets";
import { typeNiveauLocalite } from "../../functions/niveauLocalites/types";
import LoadingScreen from "../../components/LoadingScreen";
import Card from "../../components/Card";

const Localites: React.FC = () => {
    const [niveauLocalites, setNiveauLocalites] = useState<typeNiveauLocalite[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const AllNiveau = async () => {
        try {
            const res = await allNiveauLocalite();
            setLoading(false)
            setNiveauLocalites(res)
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        AllNiveau();
    }, [])
    const handleAddTab = () => {
        console.log(4);
    };
    const [loadNiveau, setLoadNiveau] = useState<Boolean>(false)
    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Localités{niveauLocalites.length > 0 ? "tab" + niveauLocalites[0].id_nlc : "tab1"}</h1>
                </div>
                <Button variant="outline" onClick={() => setLoadNiveau(true)}>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Localités
                </Button>
            </div>
            <Modal onClose={() => setLoadNiveau(false)} isOpen={loadNiveau} title="Espace de configuration des niveau de localité" size="xl">
                <NiveauLocalite />
            </Modal>
            {loading ? (<LoadingScreen />) :

                <Card>
                    <Tabs
                        defaultActiveTab={niveauLocalites.length > 0 ? "tab" + niveauLocalites[0].id_nlc : "tab1"}
                        onAddTab={handleAddTab}
                        addButtonLabel="Nouvel onglet"
                    >
                        {niveauLocalites.length > 0 ?

                            niveauLocalites.map((nivLoc: typeNiveauLocalite) =>
                            (<Tabs.Tab id={"tab" + nivLoc.id_nlc} label={nivLoc.libelle_nlc} count={5}>
                                <div>
                                    <h3>Contenu du premier onglet</h3>
                                    {"tab" + nivLoc.id_nlc}
                                    <p>5 éléments dans cet onglet</p>
                                </div>
                            </Tabs.Tab>
                            )
                            ) :
                            <Tabs.Tab id="tabs1" label="Onglet 1" count={0}>
                                <div>
                                    <h3>Contenu du premier onglet</h3>
                                </div>
                            </Tabs.Tab>
                        }


                    </Tabs>
                </Card>
            }

        </div>
    )
}
export default Localites;