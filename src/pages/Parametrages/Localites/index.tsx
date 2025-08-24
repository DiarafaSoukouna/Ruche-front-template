import React, { lazy, useEffect, useState } from "react";
import { EditIcon, MapPinIcon, PlusIcon, TrashIcon } from "lucide-react";
import NiveauLocalite from "./niveau";
import FormLocalite from "./form";
import { typeNiveauLocalite } from "../../../functions/niveauLocalites/types";
import { typeLocalite } from "../../../functions/localites/types";
import Button from "../../../components/Button";
import { allNiveauLocalite } from "../../../functions/niveauLocalites/gets";
import { allLocalite } from "../../../functions/localites/gets";
import Modal from "../../../components/Modal";
import LoadingScreen from "../../../components/LoadingScreen";
import Card from "../../../components/Card";
import Tabs from "../../../components/TabLocalites";
import Table from "../../../components/Table";
import { RiseLoader } from "react-spinners";

const Localites: React.FC = () => {
    const [niveauLocalites, setNiveauLocalites] = useState<typeNiveauLocalite[]>([]);
    const [localites, setLocalites] = useState<typeLocalite[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<Boolean>(false)
    const [editRow, setEditRow] = useState(null);
    const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
    const [tabActive, setTabActive] = useState<number>(0)
    const [loadNiveau, setLoadNiveau] = useState<Boolean>(false)
    const columns = [
        {
            key: 'code_national_loca',
            title: 'Code',
            render: (value: string) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'intitule_loca',
            title: 'Libellé',
            render: (value: string) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-medium text-gray-900">{value}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => (setEditRow(row), setShowForm(true))}
                    >
                        <EditIcon className="w-3 h-3" />
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => console.log(0)}
                    >
                        <TrashIcon className="w-3 h-3" />
                    </Button>
                </div>
            )
        }
    ]
    const AllNiveau = async () => {
        try {
            const res = await allNiveauLocalite();
            setNiveauLocalites(res)
            setAddBoutonLabel(res[0].libelle_nlc)
            setLoading(false)
        } catch (error) {
            console.log('error', error)
        }
    }
    const AllLocalite = async () => {
        try {
            const res = await allLocalite();
            setLocalites(res)
            setLoading(false)
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        AllNiveau();
        AllLocalite();
    }, [])
    const handleAddBoutonLabel = (label: string) => {
        setAddBoutonLabel(label)
    };
    const handleAddTab = (bool: boolean, niveau: number) => {
        setShowForm(bool);
        setTabActive(niveau);
        console.log(showForm)
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Localités</h1>
                </div>
                <Button variant="outline" onClick={() => setLoadNiveau(true)}>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Localités
                </Button>
            </div>
            <Modal onClose={() => setLoadNiveau(false)} isOpen={loadNiveau} title="Espace de configuration des niveau de localité" size="xl">
                <NiveauLocalite />
            </Modal>
            {loading ?
                (<div className="text-center">
                    <RiseLoader color='blue' />
                </div>
                ) :
                <Card >
                    <Tabs
                        defaultActiveTab={String(niveauLocalites[0].id_nlc)}
                        onAddTab={(bool: boolean, niveau: number) => handleAddTab(bool, niveau)}
                        defaulBoutonLabel={addBoutonLabel}
                        setAddBoutonLabel={(label: string) => handleAddBoutonLabel(label)}
                    >
                        {niveauLocalites.length > 0 ?

                            niveauLocalites.map((nivLoc: typeNiveauLocalite) =>
                            (<Tabs.Tab key={nivLoc.id_nlc} id={String(nivLoc.id_nlc)} label={nivLoc.libelle_nlc}>
                                <Table
                                    columns={columns}
                                    data={localites}
                                    itemsPerPage={5}
                                />

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

            <Modal onClose={() => setShowForm(false)} isOpen={showForm} title={`Ajout d'une ${addBoutonLabel}`} size="lg">
                <FormLocalite onClose={() => setShowForm(false)} niveau={tabActive} editRow={editRow || null} all={() => AllLocalite()} />
            </Modal>
        </div>
    )
}
export default Localites;