import { typeLocalite } from "../functions/localites/types";
import { Acteur } from "./entities";

export interface Projet {
  id_projet: number;
  code_projet: string;
  sigle_projet: string;
  intitule_projet: string;
  duree_projet: number;
  date_signature_projet: string;
  date_demarrage_projet: string;
  partenaire_projet?: Acteur;
  programme_projet?: number;
  structure_projet: Acteur[];
  signataires_projet: Acteur[];
  partenaires_execution_projet: Acteur[];
  zone_projet: typeLocalite[];
}

export type ProjetFormData = Omit<Projet, 'id_projet'>;

export interface ProjetSelectOption {
  value: number;
  label: string;
  projet: Projet;
}
