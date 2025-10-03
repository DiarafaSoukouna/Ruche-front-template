import { useEffect, useState } from 'react'
import Card from '../../../../components/Card'
import Table from '../../../../components/Table'
import Button from '../../../../components/Button'
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import Form from './form'
import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { typeCibleIndicStrategique } from '../../../../functions/cibleIndicateurStrategique/types'
import FormCIble from './form'
import FormCible from './form'
import { allCibleIndicStrategique } from '../../../../functions/cibleIndicateurStrategique/gets'
import { deleteCibleIndicStrategique } from '../../../../functions/cibleIndicateurStrategique/delete'
import ConfirmModal from '../../../../components/ConfirModal'
interface FormProps {
  code_indicateur: string
}
const CibleIndicateur: React.FC<FormProps> = ({ code_indicateur }) => {
  const [cibleIndicateurs, setCibleIndicateurs] = useState<typeCibleIndicStrategique[]>([])
  const [cibleIndicateur, setCibleIndicateur] = useState({
    id_cible_indicateur_istr: 0,
    annee: '',
    code_indicateur_istr: '',
    code_ug: '',
    valeur_cible_indcateur_istr: 0
  })
  const [loading, setLoading] = useState<boolean>(false)

  const clean = () => {
    setIsEdit(false)
    setIsDelete(false)
    setShowForm(false)
    setCibleIndicateur({
      id_cible_indicateur_istr: 0,
      annee: '',
      code_indicateur_istr: '',
      code_ug: '',
      valeur_cible_indcateur_istr: 0
    })
  }
  const [showForm, setShowForm] = useState<Boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const fetchCibleIndicStrategiques = async () => {
    try {
      setLoading(true)
      const res = await allCibleIndicStrategique()
      const cible_indic = res.filter((cible: any) => cible.code_indicateur_istr.code_indicateur_istr === code_indicateur)
      setCibleIndicateurs(cible_indic)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const DeleteCIbleIndicStrategique = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette cible d'indicateur stratégique ?")) {
      try {
        await deleteCibleIndicStrategique(id)
        setIsDelete(false)
        toast.success("Cible d'indicateur stratégique supprimée avec succès")
        fetchCibleIndicStrategiques()
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors de la suppression de la cible d'indicateur stratégique")
      }
    }
  }

  const columns = [
    {
      key: 'code_ug',
      title: 'Unité de gestion',
      render: (value: string, row: any) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{row.code_ug.code_ugl + " " + row.code_ug.nom_ugl}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'annee',
      title: 'Année',
      render: (value: string) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'valeur_cible_indcateur_istr',
      title: 'cible',
      render: (value: string) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (
              setCibleIndicateur(row), setIsEdit(true), setShowForm(true)
            )}
          >
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              DeleteCIbleIndicStrategique(row.id_cible_indicateur_istr)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  console.log('code_indicateur', code_indicateur)
  useEffect(() => {
    fetchCibleIndicStrategiques()
  }, [])
  return (
    <div>
      {!showForm ? (
        <>
          {!isDelete && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-2xl font-bold text-gray-900">
                    Cible indicateur strategique
                  </label>
                </div>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <Table columns={columns} data={cibleIndicateurs} itemsPerPage={5} />
            </div>
          )}
          {loading && (
            <div className="text-center">
              <RiseLoader color="blue" />
            </div>
          )}
          {/* {isDelete && (
            <ConfirmModal
              isOpen={isDelete}
              onClose={() => setIsDelete(false)}
              title={'Supprimer cet indicateur'}
              size="md"
              confimationButon={() => DeleteCIbleIndicStrategique(cibleIndicateur.id_cible_indicateur_istr)}
            >
            </ConfirmModal>
          )} */}
        </>
      ) : (
        <FormCible
          row_cible={cibleIndicateur}
          code_indicateur={code_indicateur}
          isEdit={isEdit}
          all={fetchCibleIndicStrategiques}
          setIsEdit={() => setIsEdit}
          setShowForm={() => setShowForm(false)}
        />
      )}

    </div>
  )
}
export default CibleIndicateur
