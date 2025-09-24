export interface CadreAnalytique {
  id_loca?: number;
  niveau_loca: number;
  parent_loca?: CadreAnalytique | string | undefined;
  code_loca: string;
  code_national_loca: string;
  intitule_loca: string;
}
