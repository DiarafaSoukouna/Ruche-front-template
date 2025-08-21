import { useEffect, useState } from 'react'
import Modal from '../../../components/Modal'
import { getAllCategories } from '../../../functions/categoriesActeurs/gets'
import Button from '../../../components/Button'
import { ActeurType, FormProps } from './types'
import { add } from '../../../functions/acteurs/post'
import { getAllActeurs } from '../../../functions/acteurs/gets'

const Form: React.FC<FormProps> = ({
  showModal,
  setShowModal,
  editActeur,
  setEditActeur,
  isEdit,
  setIsEdit,
}) => {
  const [categories, setCategories] = useState([])

  const [acteur, setActeur] = useState<ActeurType>({
    code_acteur: '',
    nom_acteur: '',
    description_acteur: '',
    personne_responsable: '',
    contact: '',
    adresse_email: '',
    categorie_acteur: 1,
  })

  const close = () => {
    setShowModal(false)
    setIsEdit(false)
    setEditActeur({
      code_acteur: '',
      nom_acteur: '',
      description_acteur: '',
      personne_responsable: '',
      contact: '',
      adresse_email: '',
      categorie_acteur: 1,
    })
  }

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      setCategories(res)
    } catch (error) {
      console.error(error)
    }
  }
  const fetchActeurs = async () => {
    try {
      const res = await getAllActeurs()
      if (res) {
        console.log(res)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (isEdit) {
        console.log(editActeur)
      } else {
        const res = add(acteur)
        if (res) {
          console.log(res)
          fetchActeurs()
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])
  return (
    <Modal
      isOpen={showModal}
      onClose={() => close()}
      title={isEdit ? "Modifier l'acteur" : 'Nouvel acteur'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code acteur
            </label>
            <input
              type="text"
              value={editActeur?.code_acteur || ''}
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
              value={editActeur?.nom_acteur || ''}
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
              Description
            </label>
            <input
              type="text"
              value={editActeur?.description_acteur || ''}
              onChange={(e) =>
                setActeur({ ...acteur, description_acteur: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez une description de l'acteur"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable
            </label>
            <input
              type="text"
              value={editActeur?.personne_responsable || ''}
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
              value={editActeur?.contact || ''}
              onChange={(e) =>
                setActeur({ ...acteur, contact: e.target.value })
              }
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
              value={editActeur?.adresse_email || ''}
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
            Catégorie
          </label>
          <select
            value={acteur.categorie_acteur}
            onChange={(e) =>
              setActeur({ ...acteur, categorie_acteur: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories &&
              categories.map((cat: any) => (
                <option key={cat.id_categorie} value={cat.id_categorie}>
                  {cat.nom_categorie}
                </option>
              ))}
          </select>
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
    </Modal>
  )
}
export default Form
