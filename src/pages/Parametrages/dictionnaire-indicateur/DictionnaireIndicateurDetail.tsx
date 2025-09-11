import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/Button";
import { dictionnaireIndicateurService } from "../../../services/dictionnaireIndicateurService";
import type { DictionnaireIndicateur } from "../../../types/entities";
import {
  Edit,
  Trash2,
  Target,
  Calculator,
  User,
  Database,
  BarChart3,
} from "lucide-react";

interface DictionnaireIndicateurDetailProps {
  dictionnaireId: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function DictionnaireIndicateurDetail({
  dictionnaireId,
  onEdit,
  onDelete,
  onClose,
}: DictionnaireIndicateurDetailProps) {
  const { data: dictionnaire, isLoading } = useQuery<DictionnaireIndicateur>({
    queryKey: ["dictionnaireIndicateur", dictionnaireId],
    queryFn: () => dictionnaireIndicateurService.getById(dictionnaireId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!dictionnaire) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">
          Indicateur de référence non trouvé
        </div>
      </div>
    );
  }

  const getTypologieColor = (typologie?: string) => {
    const colors = {
      Impact: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
      Effet:
        "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20",
      Produit:
        "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20",
      Processus:
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20",
      Contexte:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20",
    };
    return typologie
      ? colors[typologie as keyof typeof colors] ||
          "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20"
      : "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {dictionnaire.intitule_ref_ind}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Code: {dictionnaire.code_ref_ind}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {dictionnaire.typologie && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTypologieColor(
                dictionnaire.typologie
              )}`}
            >
              {dictionnaire.typologie}
            </span>
          )}
          {dictionnaire.echelle && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              {dictionnaire.echelle.nom_type_zone}
            </span>
          )}
        </div>
      </div>

      {/* Fonction d'agrégation */}
      {dictionnaire.fonction_agregat_cmr && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Fonction d'agrégation
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {dictionnaire.fonction_agregat_cmr}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {dictionnaire.unite_cmr && (
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Unité de mesure
                </h4>
                <p className="text-sm text-muted-foreground">
                  {dictionnaire.unite_cmr
                    ? `${dictionnaire.unite_cmr.unite_ui} - ${dictionnaire.unite_cmr.definition_ui}`
                    : "Non défini"}
                </p>
              </div>
            </div>
          )}

          {dictionnaire.echelle && (
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Échelle</h4>
                <p className="text-sm text-muted-foreground">
                  {dictionnaire.echelle.nom_type_zone}
                </p>
              </div>
            </div>
          )}

          {dictionnaire.typologie && (
            <div className="flex items-start space-x-3">
              <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Typologie
                </h4>
                <p className="text-sm text-muted-foreground">
                  {dictionnaire.typologie}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {(dictionnaire.seuil_minimum !== undefined ||
            dictionnaire.seuil_maximum !== undefined) && (
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Seuils</h4>
                <p className="text-sm text-muted-foreground">
                  {dictionnaire.seuil_minimum !== undefined &&
                  dictionnaire.seuil_maximum !== undefined
                    ? `${dictionnaire.seuil_minimum} - ${dictionnaire.seuil_maximum}`
                    : dictionnaire.seuil_minimum !== undefined
                    ? `Minimum: ${dictionnaire.seuil_minimum}`
                    : `Maximum: ${dictionnaire.seuil_maximum}`}
                </p>
              </div>
            </div>
          )}

          {dictionnaire.responsable_collecte_cmr && (
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Responsable de collecte
                </h4>
                <p className="text-sm text-muted-foreground">
                  {dictionnaire.responsable_collecte_cmr &&
                  dictionnaire.responsable_collecte_cmr
                    ? dictionnaire.responsable_collecte_cmr.nom_acteur
                    : "Non défini"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note: Definition field removed as it's not in current schema */}

      {/* Caractéristiques techniques */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">
          Caractéristiques techniques
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Typologie</div>
            <div className="text-sm font-medium text-foreground">
              {dictionnaire.typologie || "Non défini"}
            </div>
          </div>
          <div className="border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Unité</div>
            <div className="text-sm font-medium text-foreground">
              {dictionnaire.unite_cmr
                ? dictionnaire.unite_cmr.unite_ui
                : "Non défini"}
            </div>
          </div>
          <div className="border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Échelle</div>
            <div className="text-sm font-medium text-foreground">
              {dictionnaire.echelle?.nom_type_zone || "Non défini"}
            </div>
          </div>
          <div className="border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              Fonction agrégat
            </div>
            <div className="text-sm font-medium text-foreground">
              {dictionnaire.fonction_agregat_cmr || "Non défini"}
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
            <p className="font-mono">{dictionnaire.id_ref_ind_ref}</p>
          </div>
          {dictionnaire.created_at && (
            <div>
              <span className="text-muted-foreground">Créé le:</span>
              <p>{new Date(dictionnaire.created_at).toLocaleDateString()}</p>
            </div>
          )}
          {dictionnaire.updated_at && (
            <div>
              <span className="text-muted-foreground">Modifié le:</span>
              <p>{new Date(dictionnaire.updated_at).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Responsable:</span>
            <p>
              {dictionnaire.responsable_collecte_cmr &&
              dictionnaire.responsable_collecte_cmr
                ? dictionnaire.responsable_collecte_cmr.nom_acteur
                : "Non défini"}
            </p>
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
