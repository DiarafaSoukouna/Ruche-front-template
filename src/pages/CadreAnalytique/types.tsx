export interface CadreAnalytiqueTypes {
  id_loca?: number
  niveau_loca: number
  parent_loca?: CadreAnalytiqueTypes | string | undefined
  code_loca: string
  code_national_loca: string
  intitule_loca: string
}
