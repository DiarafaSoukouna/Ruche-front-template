import Button from '../../../../components/Button'
import { FormProps } from './types'
// import { getAllActeurs } from '../../../functions/acteurs/gets'

const Form: React.FC<FormProps> = ({
  categorie,
  setCategorie,
  isEdit,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code catégorie
          </label>
          <input
            type="text"
            value={categorie?.code_cat || ''}
            onChange={(e) =>
              setCategorie({ ...categorie, code_cat: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le code de la catégorie"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom catégorie
          </label>
          <input
            type="text"
            value={categorie.nom_categorie}
            onChange={(e) =>
              setCategorie({ ...categorie, nom_categorie: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom de la catégorie"
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
