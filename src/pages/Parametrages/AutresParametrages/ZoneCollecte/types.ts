export interface ZoneCollecteTypes {
  id_zone_collecte: number
  code_zone: string
  nom_zone: string
  type_zone: string
}
export interface TypesZoneTypes {
  id_type_zone: number
  code_type_zone: string
  nom_type_zone: string
}
export interface FormProps {
  zoneCollecte: ZoneCollecteTypes
  setZoneCollecte: (value: ZoneCollecteTypes) => void
  isEdit: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
