import { useEffect, useState } from 'react'
import Card from '../../../../components/Card'
import Table from '../../../../components/Table'
import Button from '../../../../components/Button'
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { getAllTypeZones } from '../../../../functions/typeZone/gets'
import { updateTypeZone } from '../../../../functions/typeZone/put'
import { addTypeZone } from '../../../../functions/typeZone/post'
import { DeleteTypeZone } from '../../../../functions/typeZone/delete'
import Form from './form'
import { RiseLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { TypesZoneTypes } from './types'

const TypeZone = () => {
  const [typesZone, setTypesZone] = useState<TypesZoneTypes[]>([])
  const [typeZone, setTypeZone] = useState<TypesZoneTypes>({
    id_type_zone: 0,
    code_type_zone: '',
    nom_type_zone: '',
  })
  const [loading, setLoading] = useState<boolean>(false)

  const clean = () => {
    setIsEdit(false)
    setIsDelete(false)
    setShowForm(false)
    setTypeZone({
      id_type_zone: 0,
      code_type_zone: '',
      nom_type_zone: '',
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
        const res = await updateTypeZone(typeZone)
        if (res) {
          fetchTypesZone()
          clean()
          toast.success('Type de zone mis à jour avec succès')
        }
      } else {
        const res = await addTypeZone(typeZone)
        if (res) {
          fetchTypesZone()
          clean()
          toast.success('Type de zone créé avec succès')
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
      key: 'id_type_zone',
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
      key: 'code_type_zone',
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
      key: 'nom_type_zone',
      title: 'Nom type de zone',
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
              setTypeZone(row), setIsEdit(true), setShowForm(true)
            )}
          >
            <EditIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsDelete(true), setTypeZone(row)
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ]
  const fetchTypesZone = async () => {
    try {
      setLoading(true)

      const res = await getAllTypeZones()
      setTypesZone(res)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  const deleteTypeZone = async (id: number) => {
    try {
      const res = await DeleteTypeZone(id)
      fetchTypesZone()
      setIsDelete(false)
      clean()
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchTypesZone()
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
                    Types de zone
                  </label>
                </div>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <Table columns={columns} data={typesZone} itemsPerPage={5} />
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
                  Êtes-vous sûr(e) de vouloir supprimer ce type de zone ? Cette
                  action est irréversible.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setIsDelete(false)}>
                    Annuler
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      deleteTypeZone(typeZone.id_type_zone)
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
          typeZone={typeZone}
          setTypeZone={setTypeZone}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setShowForm={setShowForm}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
export default TypeZone
