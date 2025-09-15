import { useState, useEffect } from 'react'
import {
  CalendarIcon,
  CheckCircleIcon,
  EditIcon,
  EyeIcon,
  PlusIcon,
  TargetIcon,
  TrashIcon,
  XCircleIcon,
} from 'lucide-react'
import { RiseLoader } from 'react-spinners'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import { toast } from 'react-toastify'
import ConfirmModal from '../../../components/ConfirModal'
import { deleteProgram } from '../../../functions/Programme/delete'
import { getAllProgrammesNbc } from '../../../functions/Programme/gets'
import { typeProgram, typeProgramNbc } from '../../../functions/Programme/types'
import FormProgram from './form'
import Card from '../../../components/Card'

const Programmes = () => {
  //   const [acteurs, setProgrammes] = useState([])
  // const [acteurs, set]
  const [showModal, setShowModal] = useState(false)
  const [programmes, setProgrammes] = useState<typeProgram[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDelete, setIsDelete] = useState(false)
  const [programme, setProgramme] = useState<typeProgram>({
    id_programme: 0,
    code_programme: '',
    sigle_programme: '',
    nom_programme: '',
    vision_programme: '',
    objectif_programme: '',
    annee_debut_programme: '',
    annee_fin_programme: '',
    actif_programme: true,
    id_nbc_programme: {
      id_nbc: 0,
      code_number_nbc: '',
      nombre_nbc: 1,
      libelle_nbc: '',
    },
  })

  const clean = () => {
    setProgramme({
      id_programme: 0,
      code_programme: '',
      sigle_programme: '',
      nom_programme: '',
      vision_programme: '',
      objectif_programme: '',
      annee_debut_programme: '',
      annee_fin_programme: '',
      actif_programme: true,
      id_nbc_programme: {
        id_nbc: 0,
        code_number_nbc: '',
        nombre_nbc: 1,
        libelle_nbc: '',
      },
    })
  }
  const fetchProgrammes = async () => {
    setLoading(true)
    try {
      const res = await getAllProgrammesNbc()
      if (res) {
        setProgrammes(res)
      }
      console.log('res', res)
    } catch (error) {
      toast.error('Erreur lors de la récupération du programme')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProgramme = async (id: number) => {
    try {
      await deleteProgram(id)
      setIsDelete(false)
      toast.success('Parténaire finanicié supprimé avec succès')
      fetchProgrammes()
    } catch (error) {
      toast.error('Erreur lors de la suppression du parténaire finanicié')
      console.error(error)
    }
  }

  const close = () => {
    setShowModal(false)
    setIsEdit(false)
    setIsDelete(false)
    clean()
  }
  const [isEdit, setIsEdit] = useState(false)
  const handleDelete = (programme: typeProgram) => {
    setProgramme(programme), setIsDelete(true)
  }
  const onEdit = (programme: any) => {
    setProgramme(programme)
    setShowModal(true)
    setIsEdit(true)
  }

  useEffect(() => {
    fetchProgrammes()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programmes</h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowModal(true), setIsEdit(false)
            }}
            size="md"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouveau Programme
          </Button>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => close()}
        title={isEdit ? 'Modifier programme' : 'Nouveau programme'}
        size="xl"
      >
        <FormProgram
          programme={programme}
          all={fetchProgrammes}
          isEdit={isEdit}
          onClose={() => close()}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDelete}
        onClose={() => close()}
        title={'Supprimer cet partenaire'}
        size="md"
        confimationButon={() => deleteProgramme(programme.id_programme!)}
      ></ConfirmModal>

      {loading ? (
        <div className="text-center">
          <RiseLoader color="green" />
        </div>
      ) : programmes.length > 0 ? (
        <div className="grid grid-cols-12 gap-4">
          {programmes.map((prod) => (
            <div className="col-span-4">
              <Card
                title={`Programme #${prod.code_programme}`}
                className={`border-l-4 ${
                  prod.actif_programme
                    ? 'border-l-green-500'
                    : 'border-l-gray-400'
                } relative overflow-hidden`}
                headerAction={
                  <div className="flex space-x-2">
                    <EditIcon
                      color="blue"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => onEdit(prod)}
                    />
                    <TrashIcon
                      color="red"
                      onClick={() => {
                        handleDelete(prod)
                      }}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                }
              >
                <div className="space-y-4 p-2">
                  {/* Statut */}
                  <div className="flex items-center">
                    {prod.actif_programme ? (
                      <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Actif
                      </div>
                    ) : (
                      <div className="flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        <XCircleIcon className="w-4 h-4 mr-1" />
                        Inactif
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {prod.nom_programme}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sigle: {prod.sigle_programme}
                    </p>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                    <span>
                      Du{' '}
                      {new Date(prod.annee_debut_programme).toLocaleDateString(
                        'fr-FR'
                      ) + ' au '}
                      {new Date(prod.annee_fin_programme).toLocaleDateString(
                        'fr-FR'
                      )}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <TargetIcon className="w-4 h-4 mr-2 mt-1 text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Objectif
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {prod.objectif_programme}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <EyeIcon className="w-4 h-4 mr-2 mt-1 text-indigo-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Vision
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {prod.vision_programme}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="border-t pt-2 mt-2">
                                            <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-500" />
                                                Configuration NBC
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center">
                                                    <HashtagIcon className="w-3 h-3 mr-1 text-gray-500" />
                                                    <span>Code: {prod.id_nbc_programme.code_nbc}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <NumbersIcon className="w-3 h-3 mr-1 text-gray-500" />
                                                    <span>Nombre: {prod.id_nbc_programme.nombre_nbc}</span>
                                                </div>
                                                <div className="col-span-2 flex items-start">
                                                    <LabelIcon className="w-3 h-3 mr-1 mt-0.5 text-gray-500 flex-shrink-0" />
                                                    <span className="truncate">Libellé: {prod.id_nbc_programme.libelle_nbc}</span>
                                                </div>
                                            </div>
                                        </div> */}
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">Programme non disponible disponible</div>
      )}
    </div>
  )
}
export default Programmes
