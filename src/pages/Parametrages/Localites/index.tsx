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
import Card from "../../../components/Card";
import Tabs from "../../../components/TabLocalites";
import { RiseLoader } from "react-spinners";

const Localites: React.FC = () => {
    const [niveauLocalites, setNiveauLocalites] = useState<typeNiveauLocalite[]>([]);
    const [localites, setLocalites] = useState<typeLocalite[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editRow, setEditRow] = useState<typeLocalite>();
    const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
    const [tabActive, setTabActive] = useState<number>(0)
    const [loadNiveau, setLoadNiveau] = useState<boolean>(false)
    const [parent, setParent] = useState(0);

    const AllNiveau = async () => {
        try {
            const res = await allNiveauLocalite();
            setNiveauLocalites(res)
            setAddBoutonLabel(res[0].libelle_nlc)
            setTabActive(res[0]?.id_nlc)
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
    const handleAddTab = (bool: boolean, niveau: number, parent: number) => {
        setShowForm(bool);
        setTabActive(niveau);
        setParent(parent);
        console.log(showForm)
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Localités </h1>
                </div>
                <Button variant="outline" onClick={() => setLoadNiveau(true)}>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Localités
                </Button>
            </div>
            <Modal onClose={() => setLoadNiveau(false)} isOpen={loadNiveau} title="Espace de configuration des niveau de localité" size="lg">
                <NiveauLocalite />
            </Modal>
            {loading ?
                (<div className="text-center">
                    <RiseLoader color='blue' />
                </div>
                ) :
                <Card >

                    {niveauLocalites.length > 0 ?
                        (<Tabs
                            defaultActiveTab={String(niveauLocalites[0]?.id_nlc)}
                            onAddTab={handleAddTab} parentProp={setParent} tabActiveProps={setTabActive}
                            defaulBoutonLabel={addBoutonLabel}
                            setAddBoutonLabel={(label: string) => handleAddBoutonLabel(label)}
                        >

                            {niveauLocalites.map((nivLoc: typeNiveauLocalite) =>
                            (<Tabs.Tab key={nivLoc.id_nlc} id={String(nivLoc.id_nlc)} label={nivLoc.libelle_nlc}>
                                {/* <Table
                                    columns={columns}
                                    data={localites}
                                    itemsPerPage={5}
                                /> */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Code
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Libellé
                                                </th>
                                                {
                                                    niveauLocalites.slice(0, parent).map((niv) =>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                            {niv.libelle_nlc}
                                                        </th>
                                                    )
                                                }
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {localites.filter((niv) => niv.niveau_loca == tabActive).length > 0 ?

                                                (localites.filter((niv) => niv.niveau_loca == tabActive).map((localite) => (
                                                    <tr key={localite.id_loca} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" width={50}>
                                                            {localite.code_national_loca}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {localite.intitule_loca}
                                                        </td>
                                                        {
                                                            niveauLocalites.slice(0, parent).map((niv) => (
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    {typeof localite.parent_loca === 'object' && localite.parent_loca !== null ?
                                                                        (localite.parent_loca as typeLocalite).intitule_loca :
                                                                        "-"
                                                                    }
                                                                </th>
                                                            )
                                                            )
                                                        }
                                                        <td className="px-6 space-x-2 py-4 whitespace-nowrap text-sm font-medium" width={50}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => (setEditRow(localite), setShowForm(true))}
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
                                                        </td>
                                                    </tr>
                                                )
                                                )) :
                                                (
                                                    <td colSpan={8} className="text-center" >
                                                        Aucune donnée Trouvée
                                                    </td>

                                                )}
                                        </tbody>

                                    </table>

                                </div>

                            </Tabs.Tab>
                            ))}

                        </Tabs>) :
                        (<div className="text-center">
                            Aucune Localités Trouvée
                        </div>
                        )
                    }
                </Card>
            }

            <Modal onClose={() => setShowForm(false)} isOpen={showForm} title={`Ajout d'une ${addBoutonLabel}`} size="lg">
                <FormLocalite onClose={() => setShowForm(false)} niveau={tabActive} parent={parent} localites={localites} niveauLocalites={niveauLocalites} editRow={editRow || null} all={() => AllLocalite()} />
            </Modal>
        </div>
    )
}
export default Localites;