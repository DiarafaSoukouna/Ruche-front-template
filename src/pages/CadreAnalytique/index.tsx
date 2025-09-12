import React, { useEffect, useState } from 'react'
import {
  EditIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'
import NiveauCadreAnalytique from './niveau_cadre_analytique'
import FormCadreAnalytique from './form'
import { CadreAnalytiqueConfigTypes } from '../../types/cadreAnalytiqueConfig'
import Button from '../../components/Button'
import { oneNiveauLocalite } from '../../functions/niveauLocalites/gets'
import Modal from '../../components/Modal'
import { RiseLoader } from 'react-spinners'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs'
import { toast } from 'react-toastify'
import { deleteLocalite } from '../../functions/localites/delete'
import ConfirmModal from '../../components/ConfirModal'
import { CadreAnalytiqueTypes } from '../../types/cadreAnalytique'
import { useRoot } from '../../contexts/RootContext'
import { getAllCadreAnalytique } from '../../functions/cadreAnalytique/gets'
import { getCadreAnalytiqueConfigByProgramme } from '../../functions/cadreAnalytiqueConfig/gets'
import { stringToTableau } from './others'

const CadreAnalytique: React.FC = () => {
  const [niveauCadreAnalytiques, setNiveauCadreAnalytiques] = useState<any[]>(
    []
  )
  const [cadreAnalytiques, setCadreAnalytiques] = useState<
    CadreAnalytiqueTypes[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingNiv, setLoadingNiv] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editRow, setEditRow] = useState<CadreAnalytiqueTypes>()
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
  const [tabActive, setTabActive] = useState<string>('default')
  const [loadNiveau, setLoadNiveau] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState(0)
  const { currentProgramme } = useRoot()

  const AllNiveau = async () => {
    setLoadingNiv(true)
    try {
      const res = await getCadreAnalytiqueConfigByProgramme(
        currentProgramme?.id_programme!
      )
      if (res && res.length > 0) {
        const libelles = res[0].libelle_csa
          ? stringToTableau(res[0].libelle_csa)
          : []
        const types = res[0].type_csa ? stringToTableau(res[0].type_csa) : []

        const niveaux = libelles.map((libelle_csa, index) => ({
          libelle_csa,
          type_csa: types[index] ?? null,
          nombre: res[0].nombre ?? 0,
          id_csa: res[0].id_csa ?? 0,
        }))

        setNiveauCadreAnalytiques(niveaux)
        setAddBoutonLabel(res[0].libelle_nlc ?? '')
        setCurrentId(res[0].id_nlc ?? 0)
      }
    } catch (error) {
      toast.error(
        'Erreur lors de la récupération des niveaux du cadre analytique'
      )
      console.log('error', error)
    } finally {
      setLoadingNiv(false)
    }
  }

  // const OneNiveau = async (id: number) => {
  //   setLoading(true)
  //   try {
  //     const res = await oneNiveauLocalite(id)
  //     setCadreAnalytiques(res.localites || [])
  //     setLoading(false)
  //   } catch (error) {
  //     toast.error('Erreur lors de la récupération du cadre analytique')
  //     console.log('error', error)
  //     setLoading(false)
  //   }
  // }

  const DeleteCadreAnalytique = async (id: number) => {
    setLoading(true)
    try {
      await deleteLocalite(id)
      toast.success('Cadre analytique supprimé avec succès')
      setIsDelete(false)
      // await OneNiveau(currentId)
      setLoading(false)
    } catch (error) {
      toast.error('Erreur lors de la suppression du cadre analytique')
      console.log('error', error)
      setLoading(false)
    }
  }

  const handleTabClick = async (niv: number, libelle: string, id: number) => {
    setTabActive(String(niv))
    setAddBoutonLabel(libelle)
    setCurrentId(id)
    // await OneNiveau(id)
  }

  const getCadreAnalytiques = async () => {
    setLoading(true)
    try {
      const res = await getAllCadreAnalytique()
      setCadreAnalytiques(res)
      setLoading(false)
    } catch (error) {
      toast.error('Erreur lors de la récupération des cadres analytiques')
      console.log('error', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    AllNiveau()
    getCadreAnalytiques()
    if (niveauCadreAnalytiques.length) {
      // OneNiveau(niveauCadreAnalytiques[0].id_csa!)
    }
  }, [niveauCadreAnalytiques.length])

  const handleAddForm = (bool: boolean) => {
    setShowForm(bool)
    setEditRow(undefined)
  }

  const handleDelete = (cadre: CadreAnalytiqueTypes) => {
    setIsDelete(true)
    setEditRow(cadre)
  }

  const getParentHierarchy = (plan: any) => {
    const hierarchy = []
    let currentParent = plan.parent_ds
    while (currentParent && typeof currentParent === 'object') {
      hierarchy.push(currentParent)
      currentParent = currentParent.parent_ds
    }
    return hierarchy
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cadre Analytique</h1>
        <Button variant="outline" onClick={() => setLoadNiveau(true)}>
          <MapPinIcon className="w-4 h-4 mr-2" />
          Niveaux du Cadre Analytique {tabActive}
        </Button>
      </div>

      <Modal
        onClose={() => setLoadNiveau(false)}
        isOpen={loadNiveau}
        title="Configuration des niveaux du cadre analytique"
        size="lg"
      >
        <NiveauCadreAnalytique allNiveau={AllNiveau} />
      </Modal>

      <Tabs defaultValue="default">
        <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="flex space-x-2">
            <div onClick={() => setTabActive('default')}>
              <TabsTrigger value="default">Accueil</TabsTrigger>
            </div>

            {niveauCadreAnalytiques.length > 0
              ? niveauCadreAnalytiques.map((nivLib: any, index: number) => (
                  <div
                    onClick={() =>
                      handleTabClick(
                        index + 1,
                        nivLib.libelle_csa,
                        nivLib.id_csa!
                      )
                    }
                  >
                    <TabsTrigger key={nivLib.id_csa} value={String(index + 1)}>
                      {nivLib.libelle_csa}
                    </TabsTrigger>
                  </div>
                ))
              : 'Niveaux du cadre analytique non disponibles'}
          </TabsList>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <SearchIcon
                size={16}
                className="absolute left-3 top-2 text-gray-400"
              />
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Rechercher..."
              />
            </div>
            {tabActive !== 'default' && (
              <Button onClick={() => handleAddForm(true)}>
                <PlusIcon size={16} className="mr-2" />
                Nouveau {addBoutonLabel}
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="default">
          <div className="p-4">
            {cadreAnalytiques.length > 0 ? (
              cadreAnalytiques.map((cadre) => (
                <div
                  key={cadre.id_ca}
                  className="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {cadre.intutile_ca}
                  </h2>
                  <p className="text-gray-600">Code: {cadre.code_ca}</p>
                  <p className="text-gray-600">
                    Coût axe: {cadre.cout_axe ?? 'N/A'}
                  </p>
                </div>
              ))
            ) : (
              <p>Aucun cadre analytique trouvé</p>
            )}
          </div>
        </TabsContent>

        {loading ? (
          <div className="text-center">
            <RiseLoader color="green" />
          </div>
        ) : (
          niveauCadreAnalytiques.map(
            (nivLib: CadreAnalytiqueConfigTypes, index: number) => (
              <TabsContent key={nivLib.id_csa} value={String(index + 1)}>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Libellé
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Coût axe
                        </th>
                        {niveauCadreAnalytiques
                          .slice(0, Number(tabActive) - 1)
                          .map((niv) => (
                            <th
                              key={niv.id_csa}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase"
                            >
                              {niv.libelle_csa}
                            </th>
                          ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cadreAnalytiques.length > 0 ? (
                        cadreAnalytiques
                          .filter(
                            (cadre) => cadre.niveau_ca === Number(tabActive)
                          )
                          .map((cadre) => {
                            const parentHierarchy = getParentHierarchy(cadre)
                            return (
                              <tr
                                key={cadre.id_ca}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {cadre.code_ca}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                  {cadre.intutile_ca}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {cadre.cout_axe}
                                </td>
                                {niveauCadreAnalytiques
                                  .slice(0, Number(tabActive) - 1)
                                  .map((niv, i) => (
                                    <td
                                      key={niv.id_csa}
                                      className="px-6 py-4 text-sm text-gray-500"
                                    >
                                      {parentHierarchy[i]
                                        ? parentHierarchy[i].parent_ca
                                        : '-'}
                                    </td>
                                  ))}
                                <td className="px-6 py-4 text-sm font-medium space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditRow(cadre)
                                      setShowForm(true)
                                    }}
                                  >
                                    <EditIcon className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(cadre)}
                                  >
                                    <TrashIcon className="w-3 h-3" />
                                  </Button>
                                </td>
                              </tr>
                            )
                          })
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            Aucune donnée trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            )
          )
        )}
      </Tabs>

      <Modal
        onClose={() => setShowForm(false)}
        isOpen={showForm}
        title={`${
          editRow ? 'Mise à jour d’un' : 'Ajout d’un'
        } ${addBoutonLabel}`}
        size="lg"
      >
        <FormCadreAnalytique
          onClose={() => setShowForm(false)}
          niveau={Number(tabActive)}
          currentId={currentId}
          niveauCadreAnalytique={niveauCadreAnalytiques}
          editRow={editRow || null}
          cadreByNiveau={getCadreAnalytiques}
          dataCadreAnalytique={cadreAnalytiques}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        title="Supprimer ce cadre analytique"
        size="md"
        confimationButon={() => DeleteCadreAnalytique(editRow?.id_ca!)}
      />
    </>
  )
}

export default CadreAnalytique
