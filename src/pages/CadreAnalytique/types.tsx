export interface CadreAnalytique {
  code_ca: string;
  id_loca?: number;
  niveau_loca: number;
  parent_loca?: CadreAnalytique | string | undefined;
  code_loca: string;
  code_national_loca: string;
  intitule_loca: string;
}
