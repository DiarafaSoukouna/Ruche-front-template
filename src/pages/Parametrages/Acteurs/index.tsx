import { useState } from 'react'
import DataTable from '../../../components/DataTable'
import Card from '../../../components/Card'
import { Pencil, Trash, PlusIcon } from 'lucide-react'
import Button from '../../../components/Button'
import Form from './form'
import { ActeurType } from './types'

const Acteurs = () => {
  //   const [acteurs, setActeurs] = useState([])
  // const [acteurs, set]
  const [showModal, setShowModal] = useState(false)
  const [editActeur, setEditActeur] = useState<ActeurType>({
    id_acteur: undefined,
    code_acteur: '',
    nom_acteur: '',
    description_acteur: '',
    personne_responsable: '',
    contact: '',
    adresse_email: '',
    categorie_acteur: 1,
  })
  const [isEdit, setIsEdit] = useState(false)
  const onEdit = (acteur: any) => {
    setEditActeur(acteur)
    setShowModal(true)
    setIsEdit(true)
  }

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acteurs</h1>
        </div>
        <div>
          <Button
            onClick={() => {
              setShowModal(true)
            }}
            size="sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nouvel acteur
          </Button>
        </div>
      </div>

      <Form
        showModal={showModal}
        setShowModal={setShowModal}
        editActeur={editActeur}
        setEditActeur={setEditActeur}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />

      <Card title="Liste des acteurs" className="overflow-hidden">
        <DataTable
          columns={[
            {
              header: 'Code',
              accessor: 'code_acteur',
            },
            {
              header: 'Nom',
              accessor: 'nom_acteur',
            },
            {
              header: 'Responsable',
              accessor: 'personne_responsable',
            },
            {
              header: 'Catégorie',
              accessor: 'categorie_acteur',
              // accessor: (row: Record<string, unknown>) => (
              //   <span
              //     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              //       row.category === 'Électronique'
              //         ? 'bg-blue-100 text-blue-800'
              //         : row.category === 'Vêtements'
              //         ? 'bg-green-100 text-green-800'
              //         : row.category === 'Maison'
              //         ? 'bg-purple-100 text-purple-800'
              //         : 'bg-gray-100 text-gray-800'
              //     }`}
              //   >
              //     {String(row.category)}
              //   </span>
              // ),
            },
            {
              header: 'Contact',
              accessor: (row: Record<string, unknown>) => (
                <div>
                  <div className="font-medium text-gray-900">
                    {String(row.contact)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {String(row.email)}
                  </div>
                </div>
              ),
            },

            {
              header: 'Actions',
              accessor: (row: Record<string, unknown>) => (
                <div className="flex items-center justify-center space-x-2 gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => onEdit(row)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-400 hover:text-gray-600 text-sm">
                    <Trash size={20} />
                  </button>
                </div>
              ),
            },
          ]}
          rowKey={(row: Record<string, unknown>) => String(row.id)}
          endpoint="acteur/"
          className="h-96"
        />
      </Card>
    </div>
  )
}
export default Acteurs
