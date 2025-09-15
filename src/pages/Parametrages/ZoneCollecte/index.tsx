import { useState, useEffect } from 'react'
import { PlusIcon, EditIcon, TrashIcon, ListTreeIcon } from 'lucide-react'
import Button from '../../../components/Button'
import Form from './form'
import { ZoneCollecteTypes } from './types'
import { TypesZoneTypes } from './TypeZone/types'
import Modal from '../../../components/Modal'
import { addZoneCollecte } from '../../../functions/zoneCollecte/post'
import { updateZoneCollecte } from '../../../functions/zoneCollecte/put'
import { getAllZoneCollecte } from '../../../functions/zoneCollecte/gets'
import { DeleteZoneCollecte } from '../../../functions/zoneCollecte/delete'
import { getAllTypeZones } from '../../../functions/typeZone/gets'
import TypeZone from './TypeZone/index'
import Table from '../../../components/Table'

import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const ZoneCollecte = () => {
  const [showModal, setShowModal] = useState(false)
  const [allZoneCollecte, setAllZoneCollecte] = useState<ZoneCollecteTypes[]>(
    []
  )
  const [showModalTypeZone, setShowModalTypeZone] = useState(false)
  const [typesZone, setTypesZone] = useState<TypesZoneTypes[]>([])
  const [isDelete, setIsDelete] = useState(false)
  const [zoneCollecte, setZoneCollecte] = useState<ZoneCollecteTypes>({
    id_zone_collecte: 0,
    code_zone: '',
    nom_zone: '',
    type_zone: '',
  })
  const [loading, setLoading] = useState<boolean>(false)

  const clean = () => {
    setZoneCollecte({
      id_zone_collecte: 0,
      code_zone: '',
      nom_zone: '',
      type_zone: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isEdit) {
        const res = await updateZoneCollecte(zoneCollecte)
        if (res) {
          setShowModal(false)
          fetchZoneCollectes()
          clean()
          toast.success('Acteur modifié avec succès')
        }
      } else {
        const res = await addZoneCollecte(zoneCollecte)
        if (res) {
          setShowModal(false)
          fetchZoneCollectes()
          clean()
          toast.success('Acteur crée avec succès')
        }
        console.log(zoneCollecte)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de l'action")
    }
  }
  const fetchZoneCollectes = async () => {
    try {
      setLoading(true)
      const res = await getAllZoneCollecte()
      if (res) {
        setAllZoneCollecte(res)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const fetchTypeZone = async () => {
    try {
      setLoading(true)
      const res = await getAllTypeZones()
      if (res) {
        setTypesZone(res)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteZoneCollecte = async (id: number) => {
    try {
      setLoading(true)

      await DeleteZoneCollecte(id)
      setIsDelete(false)
      fetchZoneCollectes()
      clean()
      setLoading(false)
    } catch (error) {
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

  const onEdit = (acteur: any) => {
    setZoneCollecte(acteur)
    setShowModal(true)
    setIsEdit(true)
  }

  const columns = [
    {
      key: 'code_zone',
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
      key: 'nom_zone',
      title: 'Nom',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },

    {
      key: 'type_zone',
      title: 'Type de zone',
      render: (value: number) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {/* {returnCategories(value)} */}
              {
                typesZone.find(({ id_type_zone }) => id_type_zone == value)
                  ?.nom_type_zone
              }
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
              setZoneCollecte(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  useEffect(() => {
    fetchZoneCollectes()
    fetchTypeZone()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zone de Collecte</h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowModal(true)
            }}
            size="md"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouvelle Zone
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setShowModalTypeZone(true)
            }}
          >
            <ListTreeIcon className="w-4 h-4 mr-2" />
            Types de zones
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => close()}
        title={isEdit ? 'Modifier la zone' : 'Nouvelle zone'}
        size="md"
      >
        <Form
          zoneCollecte={zoneCollecte}
          setZoneCollecte={setZoneCollecte}
          isEdit={isEdit}
          handleSubmit={handleSubmit}
        />
      </Modal>
      {loading && (
        <div className="text-center">
          <RiseLoader color="green" />
        </div>
      )}
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
            <Button
              variant="danger"
              onClick={() => deleteZoneCollecte(zoneCollecte.id_zone_collecte!)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showModalTypeZone}
        onClose={() => setShowModalTypeZone(false)}
        title={'Espace de configuration des types de zones'}
        size="xl"
      >
        <TypeZone />
      </Modal>
      <Table
        columns={columns}
        data={allZoneCollecte}
        itemsPerPage={5}
        title="Liste des zones de collecte"
      />
    </div>
  )
}
export default ZoneCollecte
