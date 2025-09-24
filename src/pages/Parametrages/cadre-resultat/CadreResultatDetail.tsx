import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/Button";
import { cadreResultatService } from "../../../services/cadreResultatService";
import { niveauCadreResultatService } from "../../../services/niveauCadreResultatService";
import { acteurService } from "../../../services/acteurService";
import { programmeService } from "../../../services/programmeService";
import type {
  CadreResultat,
  NiveauCadreResultat,
  Acteur,
  Programme,
} from "../../../types/entities";
import {
  Edit,
  Trash2,
  Code,
  FileText,
  DollarSign,
  Calendar,
  Users,
  Layers,
  Building,
  FolderOpen,
} from "lucide-react";

interface CadreResultatDetailProps {
  cadreId: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function CadreResultatDetail({
  cadreId,
  onEdit,
  onDelete,
  onClose,
}: CadreResultatDetailProps) {
  const { data: cadre, isLoading } = useQuery<CadreResultat>({
    queryKey: ["cadreResultat", cadreId],
    queryFn: () => cadreResultatService.getById(cadreId),
  });

  // Fetch related data for lookups
  const { data: niveaux = [] } = useQuery<NiveauCadreResultat[]>({
    queryKey: ["niveauxCadreResultat"],
    queryFn: niveauCadreResultatService.getAll,
  });

  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["acteurs"],
    queryFn: acteurService.getAll,
  });

  const { data: programmes = [] } = useQuery<Programme[]>({
    queryKey: ["programmes"],
    queryFn: programmeService.getAll,
  });

  const { data: cadresResultat = [] } = useQuery<CadreResultat[]>({
    queryKey: ["cadresResultat"],
    queryFn: () => cadreResultatService.getAll(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!cadre) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Cadre de résultat non trouvé</div>
      </div>
    );
  }

  // Find related entities
  const niveau = niveaux.find((n) => n.id_ncr === cadre.niveau_cr);
  const partenaire = acteurs.find((a) => a.code_acteur === cadre.partenaire_cr);
  const parent = cadresResultat.find((c) => c.id_cr === cadre.parent_cr);
  const projet = programmes.find((p) => p.id_programme === cadre.projet_cr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {cadre.intutile_cr}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Code: {cadre.code_cr} • Abrégé: {cadre.abgrege_cr}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            cadre.etat
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {cadre.etat ? "Actif" : "Inactif"}
        </span>
      </div>

      {/* Cost Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Coût de l'axe
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 font-mono">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
              }).format(cadre.cout_axe)}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Code</h4>
              <p className="text-sm text-muted-foreground font-mono">
                {cadre.code_cr}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Abrégé</h4>
              <p className="text-sm text-muted-foreground">
                {cadre.abgrege_cr}
              </p>
            </div>
          </div>

          {niveau && (
            <div className="flex items-start space-x-3">
              <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Niveau</h4>
                <p className="text-sm text-muted-foreground">
                  {niveau.nombre_ncr} - {niveau.libelle_ncr}
                </p>
              </div>
            </div>
          )}

          {parent && (
            <div className="flex items-start space-x-3">
              <FolderOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Cadre parent
                </h4>
                <p className="text-sm text-muted-foreground">
                  {parent.code_cr} - {parent.intutile_cr}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {partenaire && (
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Partenaire
                </h4>
                <p className="text-sm text-muted-foreground">
                  {partenaire.code_acteur} - {partenaire.nom_acteur}
                </p>
              </div>
            </div>
          )}

          {projet && (
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Projet</h4>
                <p className="text-sm text-muted-foreground">
                  {projet.code_programme} - {projet.nom_programme}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Date d'enregistrement
              </h4>
              <p className="text-sm text-muted-foreground">
                {new Date(cadre.date_enregistrement).toLocaleDateString(
                  "fr-FR"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Dernière modification
              </h4>
              <p className="text-sm text-muted-foreground">
                {new Date(cadre.date_modification).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Informations système
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">ID:</span>
            <p className="font-mono">{cadre.id_cr}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button type="button" variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </div>
  );
}
