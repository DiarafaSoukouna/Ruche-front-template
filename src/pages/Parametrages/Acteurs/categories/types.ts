export interface CategorieTypes {
  id_categorie: number
  nom_categorie: string
  code_cat: string
}
export interface FormProps {
  categorie: CategorieTypes
  setCategorie: (value: CategorieTypes) => void
  isEdit: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
