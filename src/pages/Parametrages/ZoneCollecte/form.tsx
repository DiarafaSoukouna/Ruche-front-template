import { useEffect, useState } from 'react'
import Select from 'react-select'
import { getAllTypeZones } from '../../../functions/typeZone/gets'
import Button from '../../../components/Button'
import { FormProps } from './types'
// import { getAllActeurs } from '../../../functions/acteurs/gets'

const Form: React.FC<FormProps> = ({
  zoneCollecte,
  setZoneCollecte,
  isEdit,
  handleSubmit,
}) => {
  const [typesZone, setTypesZone] = useState([])

  const fetchTypesZone = async () => {
    try {
      const res = await getAllTypeZones()
      setTypesZone(res)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTypesZone()
  }, [])
  const options = typesZone.map((type: any) => ({
    value: type.id_type_zone,
    label: type.nom_type_zone,
  }))
  const selectedOption =
    options.find((option) => option.value === zoneCollecte?.type_zone) || null
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="">
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code zone
          </label>
          <input
            type="text"
            value={zoneCollecte?.code_zone || ''}
            onChange={(e) =>
              setZoneCollecte({ ...zoneCollecte, code_zone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le code de la zone"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom zone
          </label>
          <input
            type="text"
            value={zoneCollecte?.nom_zone || ''}
            onChange={(e) =>
              setZoneCollecte({ ...zoneCollecte, nom_zone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom de la zone"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de zone
        </label>
        <Select
          options={options}
          value={selectedOption}
          onChange={(selected) =>
            setZoneCollecte({ ...zoneCollecte, type_zone: selected?.value })
          }
          placeholder="Sélectionner un type de zone"
          isClearable
        />
      </div>
      <div className="flex space-x-3 pt-4 justify-end">
        <Button variant="outline" onClick={() => close()} className="">
          Annuler
        </Button>
        <Button className="" type="submit">
          {isEdit ? 'Mettre à jour' : 'Valider'}
        </Button>
      </div>
    </form>
  )
}
export default Form
