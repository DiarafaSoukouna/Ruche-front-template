import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import { RiseLoader } from 'react-spinners'
import FormNiveau from './form'
import { toast } from 'react-toastify'
import { getAllNiveauActions } from '../../../functions/niveauActions/gets'
import { useRoot } from '../../../contexts/RootContext'
import { addNiveauActions } from '../../../functions/niveauActions/post'
import { DeleteAction } from '../../../functions/niveauActions/delete'
import { NiveauActionTypes } from '../../../types/niveauAction'

const ActionsConfig: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [formInputs, setFormInputs] = useState<NiveauActionTypes[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { currentProgramme } = useRoot()
  const [AllNiveau, setAllNiveau] = useState<NiveauActionTypes[]>([])

  const del = async (id: number) => {
    try {
      const res = await DeleteAction(id)
      if (res) {
        toast.success('Niveau supprimé avec succès')
        getNiveauConfig()
      }
    } catch (error) {
      console.error(error)
    }
  }
  const addFormRow = () => {
    setFormInputs([
      ...formInputs,
      {
        id_niveau_ap: 0,
        code_programme: currentProgramme?.code_programme!,
        libelle_niveau_ap: '',
        taille_code_niveau_ap: 0,
      },
    ])
  }
  const submitAll = async () => {
    setSubmitting(true)
    try {
      const res = await addNiveauActions(formInputs)
      if (res) {
        toast.success('Niveau ajouté avec succès')
        setFormInputs([])
        getNiveauConfig()
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout du niveau")
      console.error("Erreur lors de l'envoi des données:", error)
    } finally {
      setSubmitting(false)
    }
  }
  const getNiveauConfig = async () => {
    try {
      const res = await getAllNiveauActions(currentProgramme?.code_programme!)
      if (res) {
        setAllNiveau(res)
      }
      console.log('testteeeee', res)
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    getNiveauConfig()
  }, [])

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Niveaux des actions
          </h3>
        </div>
        <Button variant="primary" onClick={addFormRow} size="sm">
          <PlusIcon className="w-4 h-4" /> Ajouter
        </Button>
      </div>
      <div className="">
        {loading ? (
          <div className="text-center">
            <RiseLoader color="blue" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Libellé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Taille code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {AllNiveau.map((niveau: NiveauActionTypes, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {niveau.libelle_niveau_ap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {niveau.taille_code_niveau_ap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {index === AllNiveau.length - 1 && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Êtes-vous sûr de vouloir supprimer ce niveau ?'
                                )
                              ) {
                                del(niveau.id_niveau_ap)
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                            title="Supprimer"
                          >
                            <TrashIcon size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <FormNiveau
                  formInputs={formInputs}
                  niveauLength={AllNiveau.length}
                  setFormInputs={setFormInputs}
                />
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end float-r space-x-3 mt-3 ">
          {/* <Button variant="outline" onClick={() => onClose}>
                        Annuler
                    </Button> */}
          <Button
            variant="primary"
            onClick={submitAll}
            disabled={
              submitting ||
              formInputs.some(
                (input) =>
                  !input.libelle_niveau_ap || !input.taille_code_niveau_ap
              )
            }
            className=""
          >
            {submitting ? (
              <div className="flex items-center">
                <RiseLoader color="#ffffff" size={6} className="mr-2" />
                Envoi...
              </div>
            ) : (
              <div className="flex items-center">Valider</div>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ActionsConfig
