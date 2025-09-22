import React, { useEffect, useState } from 'react'
import {
  EditIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'
import ActionsConfig from './niveau_action'
import FormActions from './form'
import { CadreAnalytiqueConfigTypes } from '../../types/cadreAnalytiqueConfig'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { RiseLoader } from 'react-spinners'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs'
import { toast } from 'react-toastify'
import ConfirmModal from '../../components/ConfirModal'
import { ActionsTypes } from '../../types/actions'
import { useRoot } from '../../contexts/RootContext'
import { getAllActions } from '../../functions/actions/gets'
import { getAllNiveauActions } from '../../functions/niveauActions/gets'
import { addActions } from '../../functions/actions/post'
import { updateActions } from '../../functions/actions/put'
import { DeleteAction } from '../../functions/niveauActions/delete'
import { NiveauActionTypes } from '../../types/niveauAction'

const Actions: React.FC = () => {
  const [niveauActions, setNiveauActions] = useState<any[]>([])
  const [actions, setActions] = useState<ActionsTypes[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingNiv, setLoadingNiv] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editRow, setEditRow] = useState<ActionsTypes>()
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>('')
  const [tabActive, setTabActive] = useState<string>('default')
  const [loadNiveau, setLoadNiveau] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState(0)
  const { currentProgramme } = useRoot()

  const AllNiveau = async () => {
    setLoadingNiv(true)
    try {
      const res = await getAllNiveauActions(currentProgramme?.code_programme!)
      if (res) {
        setNiveauActions(res)
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

  const Delete = async (id: number) => {
    setLoading(true)
    try {
      await DeleteAction(id)
      toast.success('Action supprimée avec succès')
      setIsDelete(false)
      // await OneNiveau(currentId)
      setLoading(false)
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'action")
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

  const getActions = async () => {
    setLoading(true)
    try {
      const res = await getAllActions(currentProgramme?.id_programme!)
      if (res) {
        setActions(res)
        setLoading(false)
      }
    } catch (error) {
      toast.error('Erreur lors de la récupération des cadres analytiques')
      console.log('error', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    AllNiveau()
    getActions()
    if (niveauActions.length) {
    }
  }, [niveauActions.length])

  const handleAddForm = (bool: boolean) => {
    setShowForm(bool)
    setEditRow(undefined)
  }

  const handleDelete = (action: ActionsTypes) => {
    setIsDelete(true)
    setEditRow(action)
  }

  const getParentHierarchy = (plan: any) => {
    const hierarchy = []
    let currentParent = plan.parent_ap
    while (currentParent) {
      hierarchy.push(currentParent)
      currentParent = currentParent.parent_ap
    }
    return hierarchy
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Actions des programmes
        </h1>
        <Button variant="outline" onClick={() => setLoadNiveau(true)}>
          <MapPinIcon className="w-4 h-4 mr-2" />
          Niveaux de l'action {tabActive}
        </Button>
      </div>

      <Modal
        onClose={() => setLoadNiveau(false)}
        isOpen={loadNiveau}
        title="Configuration des niveaux du cadre analytique"
        size="lg"
      >
        <ActionsConfig />
      </Modal>

      <Tabs defaultValue={`1`}>
        <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="flex space-x-2">
            {niveauActions.length > 0
              ? niveauActions.map((nivLib: any, index: number) => (
                  <div
                    onClick={() =>
                      handleTabClick(
                        index + 1,
                        nivLib.libelle_niveau_ap,
                        nivLib.id_niveau_ap!
                      )
                    }
                  >
                    <TabsTrigger
                      key={nivLib.id_niveau_ap}
                      value={String(index + 1)}
                    >
                      {nivLib.libelle_niveau_ap}
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

            <Button onClick={() => handleAddForm(true)}>
              <PlusIcon size={16} className="mr-2" />
              Ajouter {addBoutonLabel}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <RiseLoader color="green" />
          </div>
        ) : (
          niveauActions.map((nivLib: NiveauActionTypes, index: number) => (
            <TabsContent key={nivLib.id_niveau_ap} value={String(index + 1)}>
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

                      {niveauActions
                        .slice(0, Number(tabActive) - 1)
                        .map((niv) => (
                          <th
                            key={niv.id_niveau_ap}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase"
                          >
                            {niv.libelle_niveau_ap}
                          </th>
                        ))}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {niveauActions.length > 0 ? (
                      actions
                        .filter(
                          (action) => action.niveau_ap === Number(tabActive)
                        )
                        .map((action) => {
                          const parentHierarchy = getParentHierarchy(action)
                          return (
                            <tr key={action.id_ap} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {action.code_ap}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {action.intutile}
                              </td>

                              {niveauActions
                                .slice(0, Number(tabActive) - 1)
                                .map((niv, i) => (
                                  <td
                                    key={niv.id_niveau_ap}
                                    className="px-6 py-4 text-sm text-gray-500"
                                  >
                                    {parentHierarchy[i]
                                      ? parentHierarchy[i]
                                      : '-'}
                                  </td>
                                ))}
                              <td className="px-6 py-4 text-sm font-medium space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditRow(action)
                                    setShowForm(true)
                                  }}
                                >
                                  <EditIcon className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(action)}
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
          ))
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
        <FormActions
          onClose={() => setShowForm(false)}
          niveau={Number(tabActive)}
          dataActions={actions}
          editRow={editRow || null}
          refreshData={getActions}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        title="Supprimer ce cadre analytique"
        size="md"
        confimationButon={() => Delete(editRow?.id_ap!)}
      />
    </>
  )
}

export default Actions
