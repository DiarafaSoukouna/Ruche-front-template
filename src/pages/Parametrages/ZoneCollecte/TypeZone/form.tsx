import Button from '../../../../components/Button'
import { FormProps } from './types'
// import { getAllActeurs } from '../../../functions/acteurs/gets'

const Form: React.FC<FormProps> = ({
  typeZone,
  setTypeZone,
  isEdit,
  setIsEdit,
  setShowForm,
  handleSubmit,
}) => {
  const close = () => {
    setIsEdit(false)
    setShowForm(false)
    setTypeZone({
      id_type_zone: 0,
      code_type_zone: '',
      nom_type_zone: '',
    })
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code type de zone
          </label>
          <input
            type="text"
            value={typeZone?.code_type_zone || ''}
            onChange={(e) =>
              setTypeZone({ ...typeZone, code_type_zone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le code du type de zone"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom type de zone
          </label>
          <input
            type="text"
            value={typeZone.nom_type_zone}
            onChange={(e) =>
              setTypeZone({ ...typeZone, nom_type_zone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom du type de zone"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4 justify-end">
        <Button className="" type="submit">
          {isEdit ? 'Mettre à jour' : 'Créer'}
        </Button>
        <Button variant="secondary" onClick={() => close()} className="">
          Annuler
        </Button>
      </div>
    </form>
  )
}
export default Form
