import { useEffect, useState } from 'react'
import Card from '../../../../components/Card'
import Table from '../../../../components/Table'
import Button from '../../../../components/Button'
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { getAllCategories } from '../../../../functions/categoriesActeurs/gets'
import { updateCategorie } from '../../../../functions/categoriesActeurs/put'
import { addCategorie } from '../../../../functions/categoriesActeurs/post'
import { DeleteCategorie } from '../../../../functions/categoriesActeurs/delete'
import Form from '../categories/form'
import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'

const CategorieActeur = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [categorieActeur, setCategorieActeur] = useState({
    id_categorie: 0,
    code_cat: '',
    nom_categorie: '',
  })
  const [loading, setLoading] = useState<boolean>(false)

  const clean = () => {
    setIsEdit(false)
    setIsDelete(false)
    setShowForm(false)
    setCategorieActeur({
      id_categorie: 0,
      code_cat: '',
      nom_categorie: '',
    })
  }
  const [showForm, setShowForm] = useState<Boolean>(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isEdit) {
        const res = await updateCategorie(categorieActeur)
        if (res) {
          fetchCategories()
          clean()
          toast.success('Catégorie mise à jour avec succès')
        }
      } else {
        const res = await addCategorie(categorieActeur)
        if (res) {
          fetchCategories()
          clean()
          toast.success('Catégorie créee à jour avec succès')
        }
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error("erreur lors de l'action")
    }
  }

  const columns = [
    {
      key: 'id_categorie',
      title: 'ID',
      render: (value: string) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'code_cat',
      title: 'Code',
      render: (value: string) => (
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'nom_categorie',
      title: 'Nom catégorie',
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
              setCategorieActeur(row), setIsEdit(true), setShowForm(true)
            )}
          >
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsDelete(true), setCategorieActeur(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  const fetchCategories = async () => {
    try {
      setLoading(true)

      const res = await getAllCategories()
      setCategories(res)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  const deleteCategorie = async (id: number) => {
    try {
      const res = await DeleteCategorie(id)
      fetchCategories()
      setIsDelete(false)
      clean()
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchCategories()
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
                    Catégories d'acteurs
                  </label>
                </div>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <Table columns={columns} data={categories} itemsPerPage={5} />
            </div>
          )}
          {loading && (
            <div className="text-center">
              <RiseLoader color="blue" />
            </div>
          )}
          {isDelete && (
            <Card className="">
              <div className="space-y-6 w-100">
                <p className="text-gray-700">
                  Êtes-vous sûr(e) de vouloir supprimer cet acteur ? Cette
                  action est irréversible.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsDelete(false)}>
                    Annuler
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      deleteCategorie(categorieActeur.id_categorie)
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Form
          categorie={categorieActeur}
          setCategorie={setCategorieActeur}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setShowForm={setShowForm}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
export default CategorieActeur
