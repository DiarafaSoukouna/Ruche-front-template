export interface NbcProgramme {
  id_nbc: number
  nombre_nbc: number
  libelle_nbc: string
  code_number_nbc: string
}

export interface ProgrammeProjet {
  id_programme: number
  code_programme: string
  sigle_programme: string
  nom_programme: string
  vision_programme: string
  objectif_programme: string
  annee_debut_programme: string
  annee_fin_programme: string
  actif_programme: boolean
  id_nbc_programme: NbcProgramme
}

export interface PartenaireProjet {
  code_acteur: string
  nom_acteur: string
  description_acteur: string
  personne_responsable: string
  contact: string
  adresse_email: string
  statut: string | null
  categorie_acteur: any[] // peut être typé plus précisément si tu as le type exact
}

export interface Projet {
  id_projet: number
  code_projet: string
  sigle_projet: string
  intitule_projet: string
  duree_projet: number
  date_signature_projet: string
  date_demarrage_projet: string
  partenaire_projet: PartenaireProjet
  programme_projet: ProgrammeProjet
  structure_projet: any[] // à typer si tu as le type exact
  signataires_projet: any[]
  partenaires_execution_projet: any[]
  zone_projet: any[]
}

export interface ActivitePtba {
  id_ptba: number
  localites_ptba: any[]
  partenaire_conserne_ptba: any[]
  code_activite_ptba: string
  intitule_activite_ptba: string
  chronogramme: any | null
  observation: string | null
  statut_activite: string
  code_crp: string | null
  cadre_analytique: any | null
  direction_ptba: any | null
  responsable_ptba: number
  code_programme: string | null
  version_ptba: any | null
  type_activite: any | null
}

export interface SuiviDecaissement {
  id_suivi_dec: number
  sources: any[] // tu peux typer plus précisément si tu connais le type
  periode_suivi_dec: string
  montant_decaisse: number
  taux_dollars_jour: number
  date_suivi_dec: string
  observation: string
  date_enregistrement: string
  date_modification: string
  activite_ptba: ActivitePtba
  projet: Projet
  structure_projet: any[] // type du tableau vide remplacé par un tableau
  signataires_projet: any[]
  partenaires_execution_projet: any[]
  zone_projet: any[]
  programme_projet: ProgrammeProjet
}
