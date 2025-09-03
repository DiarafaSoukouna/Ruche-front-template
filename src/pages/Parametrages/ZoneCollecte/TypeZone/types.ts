export interface TypesZoneTypes {
  id_type_zone: number
  code_type_zone: string
  nom_type_zone: string
}
export interface FormProps {
  typeZone: TypesZoneTypes
  setTypeZone: (value: TypesZoneTypes) => void
  isEdit: boolean
  setIsEdit: (value: boolean) => void
  setShowForm: (value: boolean) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
