export interface Projet {
  id_projet: number;
  code_projet: string;
  sigle_projet: string;
  intitule_projet: string;
  duree_projet: number;
  date_signature_projet: string;
  date_demarrage_projet: string;
  partenaire_projet: string | null;
  programme_projet: number;
  structure_projet: any[];
  signataires_projet: any[];
  partenaires_execution_projet: any[];
  zone_projet: any[];
}

export type ProjetFormData = Omit<Projet, 'id_projet'>;

export interface ProjetSelectOption {
  value: number;
  label: string;
  projet: Projet;
}
