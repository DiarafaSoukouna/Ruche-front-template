import { TrashIcon } from 'lucide-react'

interface Props {
  setFormInputs: (row: any[]) => void
  formInputs: any[]
  niveauLength: number
}

const FormNiveau: React.FC<Props> = ({
  formInputs,
  niveauLength,
  setFormInputs,
}) => {
  const removeFormRow = (index: number) => {
    const newFormInputs: any[] = [...formInputs]
    newFormInputs.splice(index, 1)
    setFormInputs(newFormInputs)
  }
  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newFormInputs = [...formInputs]
    if (field === 'taille_code_niveau_ap') {
      ;(newFormInputs[index] as any)[field] = Number(value)
    } else {
      ;(newFormInputs[index] as any)[field] = value
    }
    setFormInputs(newFormInputs)
    console.log('ok', newFormInputs)
  }
  return (
    <>
      {formInputs.map((input, index) => (
        <tr key={index} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {index + 1 + niveauLength}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="text"
              placeholder="Libelle..."
              value={input.libelle_niveau_ap}
              onChange={(e) =>
                handleInputChange(index, 'libelle_niveau_ap', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="number"
              placeholder="Taille code..."
              min={1}
              value={input.taille_code_niveau_ap}
              onChange={(e) =>
                handleInputChange(
                  index,
                  'taille_code_niveau_ap',
                  Number(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              type="button"
              onClick={() => removeFormRow(index)}
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
              title="Supprimer cette ligne"
            >
              <TrashIcon size={18} />
            </button>
          </td>
        </tr>
      ))}
    </>
  )
}

export default FormNiveau
