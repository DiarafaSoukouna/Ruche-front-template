import React, { useEffect, useState } from "react";
import { EditIcon, MapPinIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import NiveauLocalite from "./niveau";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { RiseLoader } from "react-spinners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/Tabs";
import { toast } from "react-toastify"
import ConfirmModal from "../../../components/ConfirModal";
import FormPlanSite from "./form";
import { typeNiveauStructure } from "../../../functions/niveauStructures/types";
import { typePlanSite } from "../../../functions/planSites/types";
import { allNiveauStructure, oneNiveauStructure } from "../../../functions/niveauStructures/gets";
import { deletePlanStie } from "../../../functions/planSites/delete";

const PlanSitePage: React.FC = () => {
    const [niveauStructures, setNiveauStructures] = useState<typeNiveauStructure[]>([]);
    const [planSites, setStructures] = useState<typePlanSite[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingNiv, setLoadingNiv] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editRow, setEditRow] = useState<typePlanSite>();
    const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
    const [tabActive, setTabActive] = useState<string>('')
    const [loadNiveau, setLoadNiveau] = useState<boolean>(false)
    const [isDelete, setIsDelete] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState(0);
    const AllNiveau = async () => {
        setLoadingNiv(true)
        try {
            const res = await allNiveauStructure();
            setNiveauStructures(res)
<<<<<<< HEAD
            setAddBoutonLabel(res[0]?.libelle_nsc || '');
            setCurrentId(res[0]?.id_nsc || '');
            setTabActive(res[0]?.nombre_nsc || 0);
=======
            setAddBoutonLabel(res[2]?.libelle_nsc || '');
            setCurrentId(res[2]?.id_nsc || '');
            setTabActive(res[2]?.nombre_nsc || 0);
>>>>>>> a5f5566 (Plan site corriger)
            setLoadingNiv(false)
            console.log(res);
        } catch (error) {
            toast.error('Erreur lors de la recuperation des niveaux localités')
            setLoadingNiv(false)
            console.log('error', error)
        }
    }
    const OneNiveau = async (id: number) => {
        setLoading(true)
        try {
            const res = await oneNiveauStructure(id);
            setStructures(res.plansites)
            console.log('planSites', res);
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
            await deletePlanStie(id);
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
    const getParentHierarchy = (plan:any) => {
        const hierarchy = [];
        let currentParent = plan.parent_ds;

        while (currentParent && typeof currentParent === 'object') {
            hierarchy.push(currentParent);
            currentParent = currentParent.parent_ds;
        }

        return hierarchy;
    };
    useEffect(() => {
        AllNiveau();
        if (niveauStructures.length) {
            OneNiveau(niveauStructures[0].id_nsc!);
        }
    }, [niveauStructures.length])

    const handleAddForm = (bool: boolean) => {
        setShowForm(bool);
        setEditRow(undefined)
        console.log(showForm)
    };
    const handleDelete = (localite: typePlanSite) => {
        setIsDelete(true)
        setEditRow(localite)

    };
    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
<<<<<<< HEAD
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Plan sites  </h1>
=======
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Plan sites {tabActive} </h1>
>>>>>>> a5f5566 (Plan site corriger)
                </div>
                <Button variant="outline" onClick={() => setLoadNiveau(true)}>
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    Niveau Structure
                </Button>
            </div>
            <Modal onClose={() => setLoadNiveau(false)} isOpen={loadNiveau} title="Espace de configuration des niveaux de structure" size="lg">
                <NiveauLocalite allNiveau={AllNiveau} />
            </Modal>
            <Tabs defaultValue={`1`}>
                <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <TabsList className="flex space-x-2">
                            {niveauStructures.length ? (
                                niveauStructures.map((nivStruct: typeNiveauStructure) => (
                                    <div
                                        key={nivStruct.nombre_nsc}
                                        onClick={() =>
                                            handleTabClick(
                                                nivStruct.nombre_nsc,
                                                nivStruct.libelle_nsc,
                                                nivStruct.id_nsc!
                                            )
                                        }
                                    >
                                        <TabsTrigger
                                            key={nivStruct.nombre_nsc}
                                            value={String(nivStruct.nombre_nsc)}
                                        >
                                            {nivStruct.libelle_nsc}
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
                                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Rechercher..."
                            />
                        </div>

                        <Button
                            onClick={() => handleAddForm(true)}
                        >
                            <PlusIcon size={16} className="mr-2" />
                            Ajouter {addBoutonLabel}
                        </Button>
                    </div>
                </div>

                {loading ? <div className="text-center"><RiseLoader color="green" /></div> :
                    niveauStructures.length ?
                        niveauStructures.map((nivStruct: typeNiveauStructure) =>
                        (
                            <div key={nivStruct.nombre_nsc}>

                                <TabsContent value={String(nivStruct.nombre_nsc)}>

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
                                                        niveauStructures.slice(0, Number(tabActive) - 1).sort((a,b)=>b.nombre_nsc - a.nombre_nsc).map((niv) =>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                {niv.libelle_nsc}
                                                            </th>
                                                        )
                                                    }
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {planSites.length ?
<<<<<<< HEAD
                                                    (planSites).map((plan) => {
                                                        const parentHierarchy = getParentHierarchy(plan)
                                                        return (

                                                            <tr key={plan.id_ds} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" width={50}>
                                                                    {plan.code_relai_ds}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {plan.intutile_ds}
                                                                </td>
                                                                {niveauStructures.slice(0, Number(tabActive) - 1).map((niv, index) => (
                                                                    <td key={niv.id_nsc} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {parentHierarchy[index] ? parentHierarchy[index].intutile_ds : "-"}
                                                                    </td>
                                                                ))}
                                                                <td className="px-6 space-x-2 py-4 whitespace-nowrap text-sm font-medium" width={50}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => (setEditRow(plan), setShowForm(true))}
                                                                    >
                                                                        <EditIcon className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(plan)}
                                                                    >
                                                                        <TrashIcon className="w-3 h-3" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
=======
                                                    (planSites).map((plan) => (
                                                        <tr key={plan.id_ds} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" width={50}>
                                                                {plan.code_relai_ds}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {plan.intutile_ds}
                                                            </td>
                                                            {
                                                                niveauStructures.slice(0, Number(tabActive) - 1).map((niv) => (
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                        {typeof plan.parent_ds === 'object' && plan.parent_ds !== null ?
                                                                            (plan.parent_ds as typePlanSite).intutile_ds :
                                                                            "-"
                                                                        }
                                                                        {niv.id_nsc}
                                                                    </th>
                                                                )
                                                                )
                                                            }
                                                            <td className="px-6 space-x-2 py-4 whitespace-nowrap text-sm font-medium" width={50}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => (setEditRow(plan), setShowForm(true))}
                                                                >
                                                                    <EditIcon className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(plan)}
                                                                >
                                                                    <TrashIcon className="w-3 h-3" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
>>>>>>> a5f5566 (Plan site corriger)
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
                <FormPlanSite onClose={() => setShowForm(false)} niveau={Number(tabActive)} currentId={currentId} niveauStructures={niveauStructures} editRow={editRow || null} planByNiveau={OneNiveau} />
            </Modal>
            <ConfirmModal
                isOpen={isDelete}
                onClose={() => setIsDelete(false)}
                title={'Supprimer cette localité'}
                size="md"
                confimationButon={() => DeleteLocalite(editRow?.id_ds!)}
            >
            </ConfirmModal>
        </>
    );
}
export default PlanSitePage;