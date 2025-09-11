import { TrashIcon } from 'lucide-react'
import { typeNiveauLocalite } from '../../../functions/niveauLocalites/types'

interface Props {
  setFormInputs: (row: typeNiveauLocalite[]) => void
  formInputs: typeNiveauLocalite[]
  niveauLocalitesLength: number
}

const FormNiveau: React.FC<Props> = ({
  formInputs,
  niveauLocalitesLength,
  setFormInputs,
}) => {
  const removeFormRow = (index: number) => {
    const newFormInputs: typeNiveauLocalite[] = [...formInputs]
    newFormInputs.splice(index, 1)
    setFormInputs(newFormInputs)
  }
  const handleInputChange = (index: number, field: string, value: string) => {
    const newFormInputs = [...formInputs]

    if (field === 'nombre_nlc') {
      ;(newFormInputs[index] as any)[field] = Number(value)
    } else if (field === 'Code_number_nlc') {
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
            {index + 1 + niveauLocalitesLength}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="text"
              placeholder="Ex: Région, Département..."
              value={input.libelle_nlc}
              onChange={(e) =>
                handleInputChange(index, 'libelle_nlc', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="number"
              placeholder="Ex: 2, 3..."
              value={input.Code_number_nlc}
              onChange={(e) =>
                handleInputChange(index, 'Code_number_nlc', e.target.value)
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
