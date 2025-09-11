import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/Button";
import { indicateurCadreResultatService } from "../../../services/indicateurCadreResultatService";
import type { IndicateurCadreResultat } from "../../../types/entities";
import {
  Edit,
  Trash2,
  FileText,
  Target,
  Calendar,
  User,
  Database,
} from "lucide-react";

interface IndicateurCadreResultatDetailProps {
  indicateurId: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function IndicateurCadreResultatDetail({
  indicateurId,
  onEdit,
  onDelete,
  onClose,
}: IndicateurCadreResultatDetailProps) {
  const { data: indicateur, isLoading } = useQuery<IndicateurCadreResultat>({
    queryKey: ["indicateurCadreResultat", indicateurId],
    queryFn: () => indicateurCadreResultatService.getById(indicateurId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!indicateur) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Indicateur non trouvé</div>
      </div>
    );
  }

  const getNiveauLabel = (niveau?: number) => {
    if (!niveau) return "Non défini";
    const labels = {
      1: "Niveau 1 - Objectif",
      2: "Niveau 2 - Axe stratégique",
      3: "Niveau 3 - Action majeure",
      4: "Niveau 4 - Sous-action",
      5: "Niveau 5 - Activité",
    };
    return labels[niveau as keyof typeof labels] || `Niveau ${niveau}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {indicateur.intitule_indicateur_cr_iop}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Code: {indicateur.code_indicateur_cr_iop}
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Niveau IOP
              </h4>
              <p className="text-sm text-muted-foreground">
                {getNiveauLabel(indicateur.niveau_iop)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Code CR IOP
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.code_cr_iop}
              </p>
            </div>
          </div>

          {indicateur.structure_iop && (
            <div className="flex items-start space-x-3">
              <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Structure IOP
                </h4>
                <p className="text-sm text-muted-foreground">
                  {indicateur.structure_iop}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Responsable IOP
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.responsable_iop}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Périodicité IOP
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.periodicite_iop}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Source IOP
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.source_iop}
              </p>
            </div>
          </div>

          {indicateur.projet_iop && (
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Projet IOP
                </h4>
                <p className="text-sm text-muted-foreground">
                  {indicateur.projet_iop}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">
          Description
        </h4>
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          {indicateur.description_iop}
        </p>
      </div>


      {/* Metadata */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Informations système
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">ID:</span>
            <p className="font-mono">{indicateur.id_indicateur_cr_iop}</p>
          </div>
          {indicateur.created_at && (
            <div>
              <span className="text-muted-foreground">Créé le:</span>
              <p>{new Date(indicateur.created_at).toLocaleDateString()}</p>
            </div>
          )}
          {indicateur.updated_at && (
            <div>
              <span className="text-muted-foreground">Modifié le:</span>
              <p>{new Date(indicateur.updated_at).toLocaleDateString()}</p>
            </div>
          )}
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
