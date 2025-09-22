import { useMemo, useState } from 'react'
import Card from '../../../../components/Card'
import Table from '../../../../components/Table'
import { useProjet } from '../../../../contexts/ProjetContext'
import { fieldToExclude, tabList } from './data'
import DeleteModal from './DeleteModal'

interface Column<T> {
  key: keyof T
  title: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export default () => {
  const { selectedProject } = useProjet()

  if (!selectedProject) return null

  const [selectedTab, setselectedTab] = useState(tabList[0])

  const tableData = useMemo(() => {
    //@ts-ignore
    const correctField: any[] = selectedProject[selectedTab.key] || []

    if (!Array.isArray(correctField) || correctField.length === 0)
      return { columns: [], rows: [] }

    const firstElement = correctField[0]

    // Clés scalaires uniquement
    const filteredKeys = Object.keys(firstElement).filter(
      (key) => typeof firstElement[key] !== 'object'
    )

    // Construire les colonnes en excluant certains champs
    const columns: Column<any>[] = filteredKeys
      .filter(
        (key) =>
          !fieldToExclude
            .map((value) => value.toLowerCase())
            .includes(key.toLowerCase())
      )
      .map((key) => ({
        key,
        title: key.replace(/_/g, ' ').toUpperCase(),
      }))

    const columnKeys = columns.map((col) => col.key)

    // Construire les lignes uniquement avec les colonnes autorisées
    const rows = correctField.map((item, index) => {
      const row: Record<string, any> = { id: index }
      columnKeys.forEach((key) => {
        //@ts-ignore
        row[key] = item[key]
      })
      return row
    })

    return { columns, rows }
  }, [selectedProject, selectedTab, fieldToExclude])

  return (
    <div className="flex gap-4">
      <Card className="hover:scale-105 transform transition-transform duration-300 rounded-2xl shadow-md max-w-xs">
        <div className="gap-2 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white font-bold text-lg">
              {selectedProject.intitule_projet.charAt(0).toUpperCase()}
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-700">
                #{selectedProject.code_projet}
              </h4>
              <p className="text-sm">{selectedProject.sigle_projet}</p>
            </div>
          </div>

          <p>
            <span className="font-semibold">Sigle:</span>{' '}
            {selectedProject.intitule_projet}
          </p>
          <p>
            <span className="font-semibold">Durée:</span>{' '}
            {selectedProject.duree_projet} ans
          </p>
          <p>
            <span className="font-semibold">Date de démarrage:</span>{' '}
            {selectedProject.duree_projet}
          </p>
          <p>
            <span className="font-semibold">Date de signature:</span>{' '}
            {selectedProject.date_signature_projet}
          </p>
          <p>
            <span className="font-semibold">Partenaire:</span>{' '}
            {selectedProject?.partenaire_projet?.nom_acteur}
          </p>
        </div>
      </Card>

      <div className="flex-1 overflow-x-scroll ag-scrollbar-invisible">
        <Card>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {tabList.map((value) => (
                <button
                  key={value.key}
                  className={`px-3 py-2 rounded-full text-xs font-semibold ${
                    selectedTab.key === value.key
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setselectedTab(value)}
                >
                  {value.name}
                </button>
              ))}
            </div>

            <Table
              columns={tableData.columns as any}
              data={tableData.rows}
              itemsPerPage={50}
            />
          </div>
        </Card>
      </div>

      <DeleteModal />
    </div>
  )
}
