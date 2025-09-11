import { useState, useEffect } from 'react'
import Card from '../../../components/Card'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import { RiseLoader } from 'react-spinners'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import Table from '../../../components/Table'
import FormPartFinancier from './form'
import { allUgl } from '../../../functions/ugl/gets'
import { deleteUgl } from '../../../functions/ugl/delete'
import { typeUgl } from '../../../functions/ugl/types'
import { toast } from 'react-toastify'
import { typeReferentiel } from '../../../functions/referentiels/types'
import FormReferentiel from './form'
import { allReferentiel } from '../../../functions/referentiels/gets'

const Referentiels = () => {
  //   const [acteurs, setReferentiels] = useState([])
  // const [acteurs, set]
  const [showModal, setShowModal] = useState(false)
  const [referentiels, setReferentiels] = useState<typeReferentiel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDelete, setIsDelete] = useState(false)
  const [referentiel, setReferentiel] = useState<typeReferentiel>({
    id_ref_ind_ref: 0,
    code_ref_ind: '',
    intitule_ref_ind: '',
    echelle: '',
    unite_cmr: '',
    typologie: '',
    fonction_agregat_cmr: '',
    seuil_maximum: '',
    seuil_minimum: '',
    responsable_collecte_cmr: 0,
  })
  const clean = () => {
    setReferentiel({
      id_ref_ind_ref: 0,
      code_ref_ind: '',
      intitule_ref_ind: '',
      echelle: '',
      unite_cmr: '',
      typologie: '',
      fonction_agregat_cmr: '',
      seuil_maximum: '',
      seuil_minimum: '',
      responsable_collecte_cmr: 0,
    })
  }
  const fetchReferentiels = async () => {
    setLoading(true)
    try {
      const res = await allReferentiel()
      setReferentiels(res)
    } catch (error) {
      toast.error("Erreur lors de la recuperation de l'indicateur referentiel")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteReferentiel = async (id: number) => {
    try {
      await deleteReferentiel(id)
      setIsDelete(false)
      toast.success('Indicateur supprimé avec succès')
      fetchReferentiels()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la suppression de l'indicateur referentiel")
    }
  }

  const close = () => {
    setShowModal(false)
    setIsEdit(false)
    setIsDelete(false)
    clean()
  }
  const [isEdit, setIsEdit] = useState(false)

  const onEdit = (referentiel: any) => {
    setReferentiel(referentiel)
    setShowModal(true)
    setIsEdit(true)
  }

  const columns = [
    {
      key: 'code_ref_ind',
      title: 'Code',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },

    {
      key: 'intitule_ref_ind',
      title: 'Intitulé',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'unite_cmr',
      title: 'Unité',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    // {
    //   key: 'chef_lieu_ugl',
    //   title: "Zone d'intervation",
    //   render: (value: String, row: any) => (
    //     <div className="flex items-center">
    //       <div>
    //         <div className="font-medium text-gray-900">
    //           {row.chef_lieu_ugl?.intitule_loca || 'N/A'}
    //         </div>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      key: 'fonction_agregat_cmr',
      title: 'Agrégat',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {value}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'responsable_collecte_cmr',
      title: 'Responsables',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {value}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsDelete(true)
              setReferentiel(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  useEffect(() => {
    fetchReferentiels()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dictionnaire d'indicateurs
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowModal(true), setIsEdit(false)
            }}
            size="md"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouveau Indicateur
          </Button>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => close()}
        title={isEdit ? "Modifier l'acteur" : 'Nouvel acteur'}
        size="lg"
      >
        <FormReferentiel
          referentiel={referentiel}
          all={() => fetchReferentiels}
          isEdit={isEdit}
          onClose={() => close()}
        />
      </Modal>
      <Modal
        isOpen={isDelete}
        onClose={() => close()}
        title={'Supprimer un acteur'}
        size="md"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Êtes-vous sûr(e) de vouloir supprimer cet acteur ? Cette action est
            irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => close()}>
              Annuler
            </Button>
            <Button variant="danger" onClick={() => deleteReferentiel(referentiel.id_ref_ind_ref!)}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
      {loading ? (
        <div className="text-center">
          <RiseLoader color="green" />
        </div>
      ) :
        referentiels.length > 0 ?
          (
            'ok'
            // <Table title='Liste des unités de gestion' columns={columns} data={referentiels} itemsPerPage={5} />
          ) :
          <div className='text-center'>Indicateur non disponible</div>
      }
    </div>
  )
}
export default Referentiels
