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

const Ugls = () => {
  //   const [acteurs, setUgls] = useState([])
  // const [acteurs, set]
  const [showModal, setShowModal] = useState(false)
  const [ugls, setUgls] = useState<typeUgl[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDelete, setIsDelete] = useState(false)
  const [ugl, setUgl] = useState<typeUgl>({
    id_ugl: 0,
    code_ugl: '',
    abrege_ugl: '',
    chef_lieu_ugl: 0,
    couleur_ugl: '',
    region_concerne_ugl: [],
    nom_ugl: '',
  })
  const clean = () => {
    setUgl({
      id_ugl: 0,
      code_ugl: '',
      abrege_ugl: '',
      chef_lieu_ugl: 0,
      couleur_ugl: '',
      region_concerne_ugl: [],
      nom_ugl: '',
    })
  }
  const fetchUgls = async () => {
    setLoading(true)
    try {
      const res = await allUgl()
      setUgls(res)
    } catch (error) {
      toast.error("Erreur lors de la recuperation de l'unité de gestion")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteActeur = async (id: number) => {
    try {
      await deleteUgl(id)
      setIsDelete(false)
      toast.success('Unité de gestion supprimé avec succès')
      fetchUgls()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la suppression de l'unité de gestion")
    }
  }

  const close = () => {
    setShowModal(false)
    setIsEdit(false)
    setIsDelete(false)
    clean()
  }
  const [isEdit, setIsEdit] = useState(false)

  const onEdit = (ugl: any) => {
    setUgl(ugl)
    setShowModal(true)
    setIsEdit(true)
  }

  const columns = [
    {
      key: 'code_ugl',
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
      key: 'abrege_ugl',
      title: 'Abréviation',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'nom_ugl',
      title: 'Libellé',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'chef_lieu_ugl',
      title: "Zone d'intervation",
      render: (value: String, row: any) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {row.chef_lieu_ugl?.intitule_loca || 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'region_concerne_ugl',
      title: 'Régions concernées',
      render: (value: String, row: any) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {row.region_concerne_ugl.map(
                (reg: any) => reg.intitule_loca + '/ '
              )}
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
              setUgl(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  useEffect(() => {
    fetchUgls()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Unités de gestion
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
            Nouvelle Unité de gestion
          </Button>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => close()}
        title={isEdit ? "Modifier l'acteur" : 'Nouvel acteur'}
        size="lg"
      >
        <FormPartFinancier
          ugl={ugl}
          all={fetchUgls}
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
            <Button variant="danger" onClick={() => deleteActeur(ugl.id_ugl!)}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
      {loading ? (
        <div className="text-center">
          <RiseLoader color="green" />
        </div>
      ) : (
        <Table title='Liste des unités de gestion' columns={columns} data={ugls} itemsPerPage={5} />
      )}
    </div>
  )
}
export default Ugls
