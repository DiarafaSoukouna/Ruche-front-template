export interface ActeurType {
  id_acteur?: number
  code_acteur: string
  nom_acteur: string
  description_acteur?: string
  personne_responsable: string
  contact: string
  adresse_email: string
  categorie_acteur: number
}
export interface FormProps {
  showModal: boolean
  setShowModal: (value: boolean) => void
  editActeur: ActeurType
  setEditActeur: (value: ActeurType) => void
  isEdit: boolean
  setIsEdit: (value: boolean) => void
}
