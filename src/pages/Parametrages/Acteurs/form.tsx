import { useEffect, useState } from 'react'
import { getAllCategories } from '../../../functions/categoriesActeurs/gets'
import Button from '../../../components/Button'
import { FormProps } from './types'
import Select from 'react-select'
import { CategorieTypes } from './categories/types'
// import { getAllActeurs } from '../../../functions/acteurs/gets'

const Form: React.FC<FormProps> = ({
  acteur,
  setActeur,
  isEdit,
  handleSubmit,
}) => {
  const [categories, setCategories] = useState<CategorieTypes[]>([])

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      setCategories(res)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code acteur
          </label>
          <input
            type="text"
            value={acteur?.code_acteur || ''}
            onChange={(e) =>
              setActeur({ ...acteur, code_acteur: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le code de l'acteur"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet
          </label>
          <input
            type="text"
            value={acteur.nom_acteur}
            onChange={(e) =>
              setActeur({ ...acteur, nom_acteur: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom complet de l'acteur"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <Select
            value={
              categories.find(
                (cat: any) => cat.id_categorie === acteur.categorie_acteur
              )
                ? {
                    value: acteur.categorie_acteur,
                    label: categories.find(
                      (cat: any) => cat.id_categorie === acteur.categorie_acteur
                    )?.nom_categorie,
                  }
                : null
            }
            onChange={(selected) =>
              setActeur({
                ...acteur,
                categorie_acteur: Number(selected?.value),
              })
            }
            options={categories.map((cat: any) => ({
              value: cat.id_categorie, // garder number
              label: cat.nom_categorie,
            }))}
            placeholder="Sélectionner une catégorie"
            isClearable
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable
          </label>
          <input
            type="text"
            value={acteur?.personne_responsable || ''}
            onChange={(e) =>
              setActeur({ ...acteur, personne_responsable: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom du responsable"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact
          </label>
          <input
            type="text"
            value={acteur?.contact || ''}
            onChange={(e) => setActeur({ ...acteur, contact: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le numéro de contact"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse e-mail
          </label>
          <input
            type="email"
            value={acteur?.adresse_email || ''}
            onChange={(e) =>
              setActeur({ ...acteur, adresse_email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez l'adresse e-mail"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={acteur?.description_acteur || ''}
          onChange={(e) =>
            setActeur({ ...acteur, description_acteur: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Entrez une description de l'acteur"
        />
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
