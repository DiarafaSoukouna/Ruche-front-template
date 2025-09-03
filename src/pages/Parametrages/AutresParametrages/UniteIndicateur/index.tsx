import { useState, useEffect } from 'react'
import Card from '../../../../components/Card'
import {
  Pencil,
  Trash,
  PlusIcon,
  EditIcon,
  TrashIcon,
  ListTreeIcon,
} from 'lucide-react'
import Button from '../../../../components/Button'
import Form from './form'
import { UniteIndicateurTypes } from './types'

import Modal from '../../../../components/Modal'
import { addUniteIndicateur } from '../../../../functions/uniteIndicateur/post'
import { updateUniteIndicateur } from '../../../../functions/uniteIndicateur/put'
import { getAllUniteIndicateur } from '../../../../functions/uniteIndicateur/gets'
import { DeleteUniteIndicateur } from '../../../../functions/uniteIndicateur/delete'

import Table from '../../../../components/Table'

import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const UniteIndicateur = () => {
  const [showModal, setShowModal] = useState(false)
  const [unites, setUnites] = useState<UniteIndicateurTypes[]>([])
  const [uniteIndicateur, setUniteIndicateur] = useState<UniteIndicateurTypes>({
    id_unite: 0,
    unite_ui: '',
    definition_ui: '',
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const clean = () => {
    setUniteIndicateur({
      id_unite: 0,
      unite_ui: '',
      definition_ui: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isEdit) {
        const res = await updateUniteIndicateur(uniteIndicateur)
        if (res) {
          setShowModal(false)
          fetchUnites()
          clean()
          toast.success('Unité modifiée avec succès')
        }
      } else {
        const res = await addUniteIndicateur(uniteIndicateur)
        if (res) {
          setShowModal(false)
          fetchUnites()
          clean()
          toast.success('Unité créée avec succès')
        }
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de l'action")
    }
  }

  const fetchUnites = async () => {
    try {
      setLoading(true)
      const res = await getAllUniteIndicateur()
      if (res) {
        setUnites(res)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const deleteUnite = async (id: number) => {
    try {
      setLoading(true)
      await DeleteUniteIndicateur(id)
      setIsDelete(false)
      fetchUnites()
      clean()
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const close = () => {
    setShowModal(false)
    setIsEdit(false)
    setIsDelete(false)
    clean()
  }

  const onEdit = (unite: UniteIndicateurTypes) => {
    setUniteIndicateur(unite)
    setShowModal(true)
    setIsEdit(true)
  }

  const columns = [
    {
      key: 'unite_ui',
      title: 'Unité',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'definition_ui',
      title: 'Définition',
      render: (value: String) => (
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
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsDelete(true)
              setUniteIndicateur(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    fetchUnites()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"></div>

      <Modal
        isOpen={showModal}
        onClose={() => close()}
        title={isEdit ? 'Modifier une unité' : 'Nouvelle unité'}
        size="md"
      >
        <Form
          uniteIndicateur={uniteIndicateur}
          setUniteIndicateur={setUniteIndicateur}
          isEdit={isEdit}
          handleSubmit={handleSubmit}
        />
      </Modal>
      {loading && (
        <div className="text-center">
          <RiseLoader color="blue" />
        </div>
      )}
      <Modal
        isOpen={isDelete}
        onClose={() => close()}
        title={'Supprimer une unité'}
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Êtes-vous sûr(e) de vouloir supprimer cette unité ? Cette action est
            irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => close()}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteUnite(uniteIndicateur.id_unite!)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      <Card className="overflow-hidden">
        <div className="flex justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold">
              Liste des unités d’indicateurs
            </h1>
          </div>
          <Button
            onClick={() => {
              setShowModal(true)
            }}
            size="md"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouvelle unité
          </Button>
        </div>
        <Table columns={columns} data={unites} itemsPerPage={5} />
      </Card>
    </div>
  )
}
export default UniteIndicateur
