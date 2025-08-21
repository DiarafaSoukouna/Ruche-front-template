import { useState } from 'react'
import DataTable from '../components/DataTable'
import Card from '../components/Card'

const Acteurs = () => {
  const [acteurs, setActeurs] = useState([])

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
              header: 'ID',
              accessor: 'id',
            },
            {
              header: 'Client',
              accessor: (row: Record<string, unknown>) => (
                <div>
                  <div className="font-medium text-gray-900">
                    {String(row.customer)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {String(row.email)}
                  </div>
                </div>
              ),
            },
            {
              header: 'Produit',
              accessor: 'product',
            },
            {
              header: 'Catégorie',
              accessor: (row: Record<string, unknown>) => (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.category === 'Électronique'
                      ? 'bg-blue-100 text-blue-800'
                      : row.category === 'Vêtements'
                      ? 'bg-green-100 text-green-800'
                      : row.category === 'Maison'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {String(row.category)}
                </span>
              ),
            },
            {
              header: 'Montant',
              accessor: (row: Record<string, unknown>) => (
                <span className="font-medium text-gray-900">
                  €{Number(row.amount).toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Statut',
              accessor: (row: Record<string, unknown>) => (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'Payé'
                      ? 'bg-green-100 text-green-800'
                      : row.status === 'En attente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : row.status === 'Annulé'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {String(row.status)}
                </span>
              ),
            },
            {
              header: 'Date',
              accessor: (row: Record<string, unknown>) => (
                <span className="text-sm text-gray-600">
                  {new Date(String(row.date)).toLocaleDateString('fr-FR')}
                </span>
              ),
            },
            {
              header: 'Actions',
              accessor: () => (
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Voir
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 text-sm">
                    Modifier
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
