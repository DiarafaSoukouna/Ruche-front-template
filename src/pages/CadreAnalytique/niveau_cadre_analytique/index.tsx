import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'
import Button from '../../../components/Button'
import { allNiveauLocalite } from '../../../functions/niveauLocalites/gets'
import { deleteNiveauLocalite } from '../../../functions/niveauLocalites/delete'
import { addNiveauLocalite } from '../../../functions/niveauLocalites/post'
import Card from '../../../components/Card'
import { RiseLoader } from 'react-spinners'
import { typeNiveauLocalite } from '../../../functions/niveauLocalites/types'
import FormNiveau from './form'
import { toast } from 'react-toastify'
interface NivSTrProps {
  allNiveau: () => void
}
const NiveauLocalite: React.FC<NivSTrProps> = ({ allNiveau }) => {
  const [niveauLocalites, setNiveauLocalites] = useState([])
  const [loading, setLoading] = useState(false)
  const [formInputs, setFormInputs] = useState<typeNiveauLocalite[]>([])
  const [submitting, setSubmitting] = useState(false)

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
      await deleteNiveauLocalite(id)
      allNiveau()
      all()
    } catch (error) {
      console.error(error)
    }
  }
  const addFormRow = () => {
    setFormInputs([
      ...formInputs,
      {
        libelle_nlc: '',
        nombre_nlc: niveauLocalites.length + formInputs.length + 1,
        Code_number_nlc: 0,
      },
    ])
  }

  const submitAll = async () => {
    setSubmitting(true)
    try {
      console.log('formInouts', formInputs)
      await addNiveauLocalite(formInputs)
      toast.success('Niveau localité ajouté avec succès')
      console.log
      allNiveau()
      setFormInputs([])
      all()
    } catch (error) {
      toast.error("Erreur lors de l'ajout du niveau localité")
      console.error("Erreur lors de l'envoi des données:", error)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    all()
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
                    Taille code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {niveauLocalites.map((niveau: typeNiveauLocalite, index) => (
                  <tr
                    key={niveau.id_nlc}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {niveau.nombre_nlc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {niveau.libelle_nlc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {niveau.Code_number_nlc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {index === niveauLocalites.length - 1 && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Êtes-vous sûr de vouloir supprimer ce niveau ?'
                                )
                              ) {
                                del(niveau.id_nlc!)
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
                  niveauLocalitesLength={niveauLocalites.length}
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
                  !input.libelle_nlc ||
                  input.nombre_nlc <= 0 ||
                  input.Code_number_nlc <= 0
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

export default NiveauLocalite
