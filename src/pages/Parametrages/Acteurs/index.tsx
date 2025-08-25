import { useState, useEffect } from 'react'
import Card from '../../../components/Card'
import {
  Pencil,
  Trash,
  PlusIcon,
  EditIcon,
  TrashIcon,
  ListTreeIcon,
} from 'lucide-react'
import Button from '../../../components/Button'
import Form from './form'
import { ActeurType } from './types'
import { CategorieTypes } from './categories/types'
import Modal from '../../../components/Modal'
import { addActeur } from '../../../functions/acteurs/post'
import { UpdateActeur } from '../../../functions/acteurs/put'
import { getAllActeurs } from '../../../functions/acteurs/gets'
import { DeleteActeur } from '../../../functions/acteurs/delete'

import Table from '../../../components/Table'
import { getAllCategories } from '../../../functions/categoriesActeurs/gets'
import CategorieActeur from './categories/index'
import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const Acteurs = () => {
  //   const [acteurs, setActeurs] = useState([])
  // const [acteurs, set]
  const [showModal, setShowModal] = useState(false)
  const [allActeurs, setAllActeurs] = useState<ActeurType[]>([])
  const [categories, setCategories] = useState<CategorieTypes[]>([])
  const [isDelete, setIsDelete] = useState(false)
  const [showModalCategorie, setShowModalCategorie] = useState(false)
  const [acteur, setActeur] = useState<ActeurType>({
    id_acteur: undefined,
    code_acteur: '',
    nom_acteur: '',
    description_acteur: '',
    personne_responsable: '',
    contact: '',
    adresse_email: '',
    categorie_acteur: 1,
  })
  const [loading, setLoading] = useState<boolean>(false)

  const clean = () => {
    setActeur({
      id_acteur: undefined,
      code_acteur: '',
      nom_acteur: '',
      description_acteur: '',
      personne_responsable: '',
      contact: '',
      adresse_email: '',
      categorie_acteur: 1,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isEdit) {
        const { id_acteur, ...data } = acteur
        if (!id_acteur) return
        const res = await UpdateActeur(data, id_acteur)
        if (res) {
          setShowModal(false)
          fetchActeurs()
          clean()
          toast.success('Acteur modifié avec succès')
        }
      } else {
        const res = await addActeur(acteur)
        if (res) {
          setShowModal(false)
          fetchActeurs()
          clean()
          toast.success('Acteur crée avec succès')
        }
        console.log(acteur)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de l'action")
    }
  }
  const fetchActeurs = async () => {
    try {
      setLoading(true)
      const res = await getAllActeurs()
      if (res?.data) {
        setAllActeurs(res.data)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteActeur = async (id: number) => {
    try {
      setLoading(true)

      await DeleteActeur(id)
      setIsDelete(false)
      fetchActeurs()
      clean()
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      if (res) {
        setCategories(res)
      }
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
    setActeur(acteur)
    setShowModal(true)
    setIsEdit(true)
  }

  const columns = [
    {
      key: 'code_acteur',
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
      key: 'nom_acteur',
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
      key: 'description_acteur',
      title: 'Description',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'personne_responsable',
      title: 'Responsable',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'adresse_email',
      title: 'Email',
      render: (value: String) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'categorie_acteur',
      title: 'Catégorie',
      render: (value: number) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">
              {/* {returnCategories(value)} */}
              {
                categories.find(({ id_categorie }) => id_categorie == value)
                  ?.nom_categorie
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
              setActeur(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  useEffect(() => {
    fetchActeurs()
    fetchCategories()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acteurs</h1>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowModal(true)
            }}
            size="md"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouvel acteur
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowModalCategorie(true)
            }}
            size="md"
          >
            <ListTreeIcon className="w-4 h-4 mr-2" />
            Catégorie acteur
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => close()}
        title={isEdit ? "Modifier l'acteur" : 'Nouvel acteur'}
        size="xl"
      >
        <Form
          acteur={acteur}
          setActeur={setActeur}
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
              onClick={() => deleteActeur(acteur.id_acteur!)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showModalCategorie}
        onClose={() => setShowModalCategorie(false)}
        title={"Espace de configuration des catégories d'acteur"}
        size="xl"
      >
        <CategorieActeur />
      </Modal>

      <Card title="Liste des acteurs" className="overflow-hidden">
        <Table columns={columns} data={allActeurs} itemsPerPage={5} />
      </Card>
    </div>
  )
}
export default Acteurs
