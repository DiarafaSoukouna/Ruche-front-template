export interface CadreAnalytiqueType {
  id_ca: number;
  code_ca: string;
  intutile_ca: string;
  abgrege_ca: string;
  niveau_ca: number | string;
  cout_axe: number;
  partenaire_ca: number | null;
  parent_ca: number | null;
  programme_ca: number | null;
}
