import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/Button";
import { indicateurCmrService } from "../../../services/indicateurCmrService";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";
import type { IndicateurCmr, UniteIndicateur } from "../../../types/entities";
import {
  Edit,
  Trash2,
  Target,
  Calendar,
  User,
  Database,
  TrendingUp,
} from "lucide-react";

interface IndicateurCmrDetailProps {
  indicateurId: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function IndicateurCmrDetail({
  indicateurId,
  onEdit,
  onDelete,
  onClose,
}: IndicateurCmrDetailProps) {
  const { data: indicateur, isLoading } = useQuery<IndicateurCmr>({
    queryKey: ["indicateurCmr", indicateurId],
    queryFn: () => indicateurCmrService.getById(indicateurId),
  });

  // Fetch related data for lookups
  const { data: unites = [] } = useQuery<UniteIndicateur[]>({
    queryKey: ["unitesIndicateur"],
    queryFn: uniteIndicateurService.getAll,
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

  // Find related entities
  const unite = unites.find(
    (u) => u.id_unite === indicateur.unite_cmr?.id_unite
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {indicateur.intitule_ref_ind}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Code: {indicateur.code_ref_ind}
          </p>
        </div>
      </div>

      {/* Résultat CMR */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Résultat CMR
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {indicateur.resultat_cmr}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Référence CMR
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.reference_cmr}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Année de référence
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.annee_reference}
              </p>
            </div>
          </div>

          {unite && (
            <div className="flex items-start space-x-3">
              <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Unité de mesure
                </h4>
                <p className="text-sm text-muted-foreground">
                  {unite.unite_ui} - {unite.definition_ui}
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
                Responsable collecte
              </h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.responsable_collecte_cmr}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Cible CMR</h4>
              <p className="text-sm text-muted-foreground">
                {indicateur.cible_cmr}
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
            <p className="font-mono">{indicateur.id_ref_ind_cmr}</p>
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
