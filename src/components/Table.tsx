import React, { useState, useMemo } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Card from './Card'

interface Column<T> {
  key: keyof T
  title: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  itemsPerPage?: number
  className?: string
  title?: string
  onRowClick?: (row: T) => void
}

type SortOrder = 'asc' | 'desc' | null

function Table<T extends { id?: string | number }>({
  columns,
  data,
  itemsPerPage = 10,
  className = '',
  title = '',
  onRowClick,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    order: SortOrder
  } | null>(null)

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key]
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, columns])

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData
    const { key, order } = sortConfig
    return [...filteredData].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal
      }

      return order === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = sortedData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleSort = (key: keyof T) => {
    if (sortConfig?.key === key) {
      // Toggle order: asc -> desc -> null
      setSortConfig({
        key,
        order:
          sortConfig.order === 'asc'
            ? 'desc'
            : sortConfig.order === 'desc'
              ? null
              : 'asc',
      })
    } else {
      setSortConfig({ key, order: 'asc' })
    }
  }

  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key || !sortConfig.order) return null
    return sortConfig.order === 'asc' ? (
      <ChevronUpIcon className="w-3 h-3 inline ml-1" />
    ) : (
      <ChevronDownIcon className="w-3 h-3 inline ml-1" />
    )
  }

  return (
    <div
      className={`bg-background rounded-xl shadow-sm border border-border ${className}`}
    >
      {/* Barre de recherche */}
      <Card>
        {title &&
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-semibold text-foreground">{title}</h4>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Recherche..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        }


        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-muted text-muted-foreground border-b border-border">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.title} {getSortIcon(column.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-muted text-foreground">
              {currentData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`transition-colors duration-150 hover:bg-primary-50 ${onRowClick ? 'cursor-pointer' : ''
                    }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-background text-foreground">
            <div className="text-sm text-foreground">
              Affichage de {startIndex + 1} à{' '}
              {Math.min(endIndex, sortedData.length)} sur {sortedData.length}{' '}
              résultats
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Table
