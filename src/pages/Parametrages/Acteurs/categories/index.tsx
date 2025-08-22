import { useEffect, useState } from 'react'
import Card from '../../../../components/Card'
import Table from '../../../../components/Table'
import Button from '../../../../components/Button'
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { getAllCategories } from '../../../../functions/categoriesActeurs/gets'
import { updateCategorie } from '../../../../functions/categoriesActeurs/put'
import Form from '../categories/form'

const CategorieActeur = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [categorieActeur, setCategorieActeur] = useState({
    id_categorie: 0,
    code_cat: '',
    nom_categorie: '',
  })
  const [showForm, setShowForm] = useState<Boolean>(false)
  const [editRow, setEditRow] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (isEdit) {
        console.log(categorieActeur)
      } else {
        console.log(categorieActeur)
      }
    } catch (error) {
      console.error(error)
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
            onClick={() => (setEditRow(row), setShowForm(true))}
          >
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button variant="danger" size="sm">
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      setCategories(res)
    } catch (error) {
      console.error(error)
    }
  }
  // const del = async (id:number) => {
  //     try {
  //         const res = await deleteN(id);
  //         all()
  //     } catch (error) {
  //         console.error(error)
  //     }
  // }
  useEffect(() => {
    fetchCategories()
  }, [])
  return (
    <Card>
      {!showForm ? (
        <>
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
        </>
      ) : (
        <Form
          categorie={categorieActeur}
          setCategorie={setCategorieActeur}
          isEdit={isEdit}
          handleSubmit={handleSubmit}
        />
      )}
    </Card>
  )
}
export default CategorieActeur
