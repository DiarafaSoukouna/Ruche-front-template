import { typeNbc } from "../nbc/types"

export interface typeProgram {
    id_programme?: number
    code_programme: string 
    sigle_programme: string 
    nom_programme: string 
    vision_programme: string 
    objectif_programme: string 
    actif_programme: boolean 
    annee_debut_programme: string
    annee_fin_programme: string 
    id_nbc_programme: typeNbc 
}
export interface typeProgramNbc {
    id_programme?: number
    code_programme: string 
    sigle_programme: string 
    nom_programme: string 
    vision_programme: string 
    objectif_programme: string 
    actif_programme: boolean 
    annee_debut_programme: string
    annee_fin_programme: string 
    id_nbc?: number
    code_number_nbc: string 
    nombre_nbc: number 
    libelle_nbc: string 
}
