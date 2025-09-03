import Button from '../../../../components/Button'
import { FormProps } from './types'

const Form: React.FC<FormProps> = ({
  uniteIndicateur,
  setUniteIndicateur,
  isEdit,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="">
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unité
          </label>
          <input
            type="text"
            value={uniteIndicateur?.unite_ui || ''}
            onChange={(e) =>
              setUniteIndicateur({
                ...uniteIndicateur,
                unite_ui: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez l'unité"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Définition
          </label>
          <input
            type="text"
            value={uniteIndicateur?.definition_ui || ''}
            onChange={(e) =>
              setUniteIndicateur({
                ...uniteIndicateur,
                definition_ui: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez la définition"
          />
        </div>
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
