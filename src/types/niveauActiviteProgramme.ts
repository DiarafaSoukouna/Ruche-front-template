// Type pour l'entité NiveauActiviteConfigProgramme
export interface NiveauActiviteProgramme {
  id_niveau_ap: number;
  nombre_niveau_ap: number;
  taille_code_niveau_ap: number;
  code_programme?: string | null;
  libelle_niveau_ap: string;
}
