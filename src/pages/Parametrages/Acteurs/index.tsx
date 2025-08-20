import { useState } from 'react'
import DataTable from '../../../components/DataTable'
import Card from '../../../components/Card'
import { Eye, Trash } from 'lucide-react'

const Acteurs = () => {
  //   const [acteurs, setActeurs] = useState([])
  // const [acteurs, set]

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acteurs</h1>
        </div>
      </div>

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
              accessor: () => (
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    <Eye />
                  </button>
                  <button className="text-red-400 hover:text-gray-600 text-sm">
                    <Trash />
                  </button>
                </div>
              ),
            },
          ]}
          rowKey={(row: Record<string, unknown>) => String(row.id)}
          endpoint="mock/transactions"
          className="h-96"
        />
      </Card>
    </div>
  )
}
export default Acteurs
