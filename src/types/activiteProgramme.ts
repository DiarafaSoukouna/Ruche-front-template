// Type pour l'entité ActiviteProgramme
export interface ActiviteProgramme {
  id_ap: number;
  code_ap: string;
  intutile: string;
  niveau_ap: number;
  code_relai_ap: string;
  parent_ap?: number | ActiviteProgramme | null;
  id_programme?: number | null;
}
