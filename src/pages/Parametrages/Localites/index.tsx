import React, { useEffect, useState } from "react";
import { EditIcon, MapPinIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import NiveauLocalite from "./niveau";
import FormLocalite from "./form";
import { typeNiveauLocalite } from "../../../functions/niveauLocalites/types";
import { typeLocalite } from "../../../functions/localites/types";
import Button from "../../../components/Button";
import { allNiveauLocalite, oneNiveauLocalite } from "../../../functions/niveauLocalites/gets";
import Modal from "../../../components/Modal";
import { RiseLoader } from "react-spinners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/Tabs";
import { toast } from "react-toastify";
import { deleteLocalite } from "../../../functions/localites/delete";
import ConfirmModal from "../../../components/ConfirModal";

const Localites: React.FC = () => {
    const [niveauLocalites, setNiveauLocalites] = useState<typeNiveauLocalite[]>([]);
    const [localites, setLocalites] = useState<typeLocalite[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingNiv, setLoadingNiv] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editRow, setEditRow] = useState<typeLocalite>();
    const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
    const [tabActive, setTabActive] = useState<string>('')
    const [loadNiveau, setLoadNiveau] = useState<boolean>(false)
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState(0);
    const AllNiveau = async () => {
        setLoadingNiv(true)
        try {
            const res = await allNiveauLocalite();
            if (res) {
                setNiveauLocalites(res)
                setAddBoutonLabel(res[0].libelle_nlc)
                setCurrentId(res[0].id_nlc)
                setTabActive(res[0].nombre_nlc)
                setLoadingNiv(false)
            }
        } catch (error) {
            toast.error('Erreur lors de la recuperation des niveaux localités')
            setLoadingNiv(false)
            console.log('error', error)
        }
    }
    const OneNiveau = async (id: number) => {
        setLoading(true)
        try {
            const res = await oneNiveauLocalite(id);
            setLocalites(res.localites)
            console.log('localites', res.localites);
            setLoading(false)
        } catch (error) {
            toast.error('Erreur lors de la recuperation des localités')
            console.log('error', error)
            setLoading(false)
        }
    }

    const DeleteLocalite = async (id: number) => {
        setLoading(true)
        try {
            await deleteLocalite(id);
            toast.success('Localités supprimé avec succès')
            setIsDelete(false)
            await OneNiveau(currentId)
            setLoading(false)
        } catch (error) {
            toast.error('Erreur lors de la suppression de la localité')
            console.log('error', error)
            setLoading(false)
        }
    }
    const handleTabClick = async (niv: number, libelle: string, id: number) => {
        setTabActive(String(niv))
        setAddBoutonLabel(libelle)
        setCurrentId(id)
        await OneNiveau(id)

    };
    useEffect(() => {
        AllNiveau();
        if (niveauLocalites.length) {
            OneNiveau(niveauLocalites[0].id_nlc!);
        }
    }, [niveauLocalites.length])

    const handleAddForm = (bool: boolean) => {
        setShowForm(bool);
        setEditRow(undefined)
        console.log(showForm)
    };
    const handleDelete = (localite: typeLocalite) => {
        setIsDelete(true)
        setEditRow(localite)

    };


    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Localités </h1>
                </div>
                <Button variant="outline" onClick={() => setLoadNiveau(true)}>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Localités
                </Button>
            </div>
            <Modal onClose={() => setLoadNiveau(false)} isOpen={loadNiveau} title="Espace de configuration des niveaux de localité" size="lg">
                <NiveauLocalite />
            </Modal>
            <Tabs defaultValue={`1`}>
                <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <TabsList className="flex space-x-2">
                            {niveauLocalites.length ? (
                                niveauLocalites.map((nivLoc: typeNiveauLocalite) => (
                                    <div
                                        key={nivLoc.nombre_nlc}
                                        onClick={() =>
                                            handleTabClick(
                                                nivLoc.nombre_nlc,
                                                nivLoc.libelle_nlc,
                                                nivLoc.id_nlc!
                                            )
                                        }
                                    >
                                        <TabsTrigger
                                            key={nivLoc.nombre_nlc}
                                            value={String(nivLoc.nombre_nlc)}
                                        >
                                            {nivLoc.libelle_nlc}
                                        </TabsTrigger>
                                    </div>
                                ))
                            ) : (
                                "Niveau localité non disponible"
                            )}
                        </TabsList>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Rechercher..."
                            />
                        </div>

                        <button
                            onClick={() => handleAddForm(true)}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon size={16} className="mr-2" />
                            Nouvelle {addBoutonLabel}
                        </button>
                    </div>
                </div>

                {loading ? <div className="text-center"><RiseLoader color="blue" /></div> :
                    niveauLocalites.length ?
                        niveauLocalites.map((nivLoc: typeNiveauLocalite) =>
                        (
                            <div key={nivLoc.nombre_nlc}>

                                <TabsContent value={String(nivLoc.nombre_nlc)}>

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
                                                        niveauLocalites.slice(0, Number(tabActive) - 1).map((niv) =>
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
                                                {localites.length ?
                                                    (localites).map((localite) => (
                                                        <tr key={localite.id_loca} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" width={50}>
                                                                {localite.code_national_loca}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {localite.intitule_loca}
                                                            </td>
                                                            {
                                                                niveauLocalites.slice(0, Number(tabActive) - 1).map((niv) => (
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                        {typeof localite.parent_loca === 'object' && localite.parent_loca !== null ?
                                                                            (localite.parent_loca as typeLocalite).intitule_loca :
                                                                            "-"
                                                                        }
                                                                        {niv.id_nlc}
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
                                                                    onClick={() => handleDelete(localite)}
                                                                >
                                                                    <TrashIcon className="w-3 h-3" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                    ) :
                                                    (
                                                        <td colSpan={8} className="text-center" >
                                                            Aucune donnée Trouvée
                                                        </td>

                                                    )}
                                            </tbody>

                                        </table>

                                    </div>
                                </TabsContent>
                            </div>
                        )
                        )
                        : "Niveau localité non disponible"
                }
            </Tabs>
            <Modal onClose={() => setShowForm(false)} isOpen={showForm} title={`${editRow ? "Mise a jour d'une" : "Ajout d'une"} ${addBoutonLabel}`} size="lg">
                <FormLocalite onClose={() => setShowForm(false)} niveau={Number(tabActive)} currentId={currentId} niveauLocalites={niveauLocalites} editRow={editRow || null} localiteByNiveau={OneNiveau} />
            </Modal>
            <ConfirmModal
                isOpen={isDelete}
                onClose={() => setIsDelete(false)}
                title={'Supprimer cette localité'}
                size="md"
                confimationButon={() => DeleteLocalite(editRow?.id_loca!)}
            >
            </ConfirmModal>
        </>
    );
}
export default Localites;