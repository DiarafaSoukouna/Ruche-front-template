import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'
import Button from '../../../components/Button'
import { allNiveauLocalite } from '../../../functions/niveauLocalites/gets'
import Card from '../../../components/Card'
import { RiseLoader } from 'react-spinners'
import FormNiveau from './form'
import { toast } from 'react-toastify'
import { getCadreAnalytiqueConfigByProgramme } from '../../../functions/cadreAnalytiqueConfig/gets'
import { useRoot } from '../../../contexts/RootContext'
import { addCadreAnalytiqueConfig } from '../../../functions/cadreAnalytiqueConfig/post'
import { stringToTableau, tableauToString } from '../others'
import { updateCadreAnalytiqueConfig } from '../../../functions/cadreAnalytiqueConfig/put'
import { DeleteCadreAnalytiqueConfig } from '../../../functions/cadreAnalytiqueConfig/delete'

interface NivSTrProps {
  allNiveau: () => void
}
const CadreAnalytiqueConfig: React.FC<NivSTrProps> = ({ allNiveau }) => {
  const [niveauLocalites, setNiveauLocalites] = useState([])
  const [loading, setLoading] = useState(false)
  const [formInputs, setFormInputs] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const { programmeList, currentProgramme } = useRoot()
  const [AllNiveau, setAllNiveau] = useState<any[]>([])
  const [idCadreConfig, setIdCadreConfig] = useState<number | null>(null)

  const all = async () => {
    setLoading(true)
    try {
      const res = await allNiveauLocalite()
      setNiveauLocalites(res)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const del = async (id: number) => {
    try {
      if (AllNiveau.length === 1) {
        await DeleteCadreAnalytiqueConfig(id)
        allNiveau()
      } else {
        const newNiveaux = AllNiveau.slice(0, -1)
        const updatedConfig = {
          id_csa: idCadreConfig!,
          programme: currentProgramme?.id_programme!,
          libelle_csa: newNiveaux.map((niv) => niv.libelle).join(','),
          type_csa: newNiveaux.map((niv) => niv.type).join(','),
          nombre: newNiveaux.length,
        }
        const res = await updateCadreAnalytiqueConfig(updatedConfig)
        if (res) {
          toast.success('Niveau supprimé avec succès')
          allNiveau()
          getCadreConfig()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  const addFormRow = () => {
    setFormInputs([
      ...formInputs,
      {
        libelle_csa: '',
        type_csa: '',
      },
    ])
  }
  const type = (index: string) => {
    if (index === '1') {
      return 'Produit'
    } else if (index === '2') {
      return 'Effet'
    } else if (index === '3') {
      return 'Impact'
    }
  }
  const submitAll = async () => {
    setSubmitting(true)
    try {
      if (!idCadreConfig) {
        const newConfig = {
          id_csa: 0,
          programme: currentProgramme?.id_programme!,
          libelle_csa: formInputs.map((input) => input.libelle_csa).join(','),
          type_csa: formInputs.map((input) => input.type_csa).join(','),
          nombre: formInputs.length,
        }
        const res = await addCadreAnalytiqueConfig(newConfig)
        if (res) {
          toast.success('Niveau ajouté avec succès')
          setFormInputs([])
          allNiveau()
          getCadreConfig()
        }
      } else {
        const oldLibelles = AllNiveau.map((niv) => niv.libelle)
        const oldTypes = AllNiveau.map((niv) => niv.type)
        const combinedLibelles = [
          ...oldLibelles,
          ...formInputs.map((input) => input.libelle_csa),
        ].join(',')
        const combinedTypes = [
          ...oldTypes,
          ...formInputs.map((input) => input.type_csa),
        ].join(',')
        const updatedConfig = {
          id_csa: idCadreConfig,
          programme: currentProgramme?.id_programme!,
          libelle_csa: combinedLibelles,
          type_csa: combinedTypes,
          nombre: combinedLibelles.split(',').length,
        }
        const res = await updateCadreAnalytiqueConfig(updatedConfig)
        if (res) {
          toast.success('Niveau mis à jour avec succès')
          setFormInputs([])
          allNiveau()
          getCadreConfig()
        }
        // console.log('updatedConfig', updatedConfig)
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout du niveau")
      console.error("Erreur lors de l'envoi des données:", error)
    } finally {
      setSubmitting(false)
    }
  }
  const getCadreConfig = async () => {
    try {
      const res = await getCadreAnalytiqueConfigByProgramme(
        currentProgramme?.id_programme!
      )
      if (res) {
        const libelles = stringToTableau(res[0].libelle_csa as string)
        const types = stringToTableau(res[0].type_csa as string)

        const niveaux = libelles.map((libelle, index) => ({
          libelle,
          type: types[index] ?? null,
        }))
        setAllNiveau(niveaux)
        setIdCadreConfig(res[0].id_csa)
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    all()
    getCadreConfig()
  }, [])

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Niveaux des cadres analytiques
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {AllNiveau.map((niveau: any, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {niveau.libelle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type(niveau.type)}
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
                                del(idCadreConfig!)
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
                  niveauLength={niveauLocalites.length}
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
              formInputs.some((input) => !input.libelle_csa || !input.type_csa)
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

export default CadreAnalytiqueConfig
