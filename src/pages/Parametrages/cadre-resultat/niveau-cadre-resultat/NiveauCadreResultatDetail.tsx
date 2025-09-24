import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/Button";
import { niveauCadreResultatService } from "../../../../services/niveauCadreResultatService";
import {
  getTypeNiveauLabel,
  getTypeNiveauColor,
} from "../../../../schemas/cadreResultatSchemas";
import type { NiveauCadreResultat } from "../../../../types/entities";
import { Edit, Trash2, Hash, Tag, FileText, Layers } from "lucide-react";

interface NiveauCadreResultatDetailProps {
  niveauId: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function NiveauCadreResultatDetail({
  niveauId,
  onEdit,
  onDelete,
  onClose,
}: NiveauCadreResultatDetailProps) {
  const { data: niveau, isLoading } = useQuery<NiveauCadreResultat>({
    queryKey: ["niveauCadreResultat", niveauId],
    queryFn: () => niveauCadreResultatService.getById(niveauId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!niveau) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Niveau non trouvé</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {niveau.libelle_ncr}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Niveau {niveau.nombre_ncr}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeNiveauColor(
            niveau.type_niveau
          )}`}
        >
          {getTypeNiveauLabel(niveau.type_niveau)}
        </span>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Nombre</h4>
              <p className="text-sm text-muted-foreground font-mono">
                {niveau.nombre_ncr}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Code numérique
              </h4>
              <p className="text-sm text-muted-foreground font-mono">
                {niveau.code_number_ncr}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Libellé</h4>
              <p className="text-sm text-muted-foreground">
                {niveau.libelle_ncr}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Type de niveau
              </h4>
              <p className="text-sm text-muted-foreground">
                {getTypeNiveauLabel(niveau.type_niveau)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Type Description */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Description du type
        </h4>
        <p className="text-sm text-muted-foreground">
          {niveau.type_niveau === 1 &&
            "Effet : Résultats directs des activités du programme, généralement à court terme."}
          {niveau.type_niveau === 2 &&
            "Produit : Biens et services produits par les activités du programme."}
          {niveau.type_niveau === 3 &&
            "Impact : Changements à long terme résultant des effets du programme."}
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
            <p className="font-mono">{niveau.id_ncr}</p>
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
