export interface ProgrammeTypes {
  id_programme: number
  code_programme: string
  sigle_programme: string
  nom_programme: string
  vision_programme: string
  objectif_programme: string
  annee_debut_programme: string // Format: YYYY-MM-DD
  annee_fin_programme: string // Format: YYYY-MM-DD
  actif_programme: boolean
  id_nbc_programme: number
}

export type ProgrammeFormData = Omit<ProgrammeTypes, 'id_programme'>

export interface ProgrammeSelectOption {
  value: number
  label: string
  programme: ProgrammeTypes
}
