export interface typePlanSite {
    id_ds?: number
    niveau_ds: number
    parent_ds?: typePlanSite | string | undefined 
    code_ds: string
    code_relai_ds: string
    intitule_ds: string
}