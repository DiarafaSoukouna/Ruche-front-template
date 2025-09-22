import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Code,
  DollarSign,
  Layers,
  Building,
  FolderTree,
  Briefcase,
  Info,
} from "lucide-react";
import type { CadreStrategique } from "../../../types/entities";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";

interface CadreStrategiqueDetailProps {
  cadreId: number;
}

export default function CadreStrategiqueDetail({
  cadreId,
}: CadreStrategiqueDetailProps) {
  const { data: cadre, isLoading } = useQuery<CadreStrategique>({
    queryKey: ["cadreStrategique", cadreId],
    queryFn: () => cadreStrategiqueService.getById(cadreId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cadre) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Cadre stratégique non trouvé</p>
      </div>
    );
  }

  const getEtatColor = (etat?: number) => {
    return etat === 1
      ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
      : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {cadre.intutile_cs}
            </h2>
            <p className="text-muted-foreground mt-1">{cadre.abgrege_cs}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEtatColor(
                cadre.etat
              )}`}
            >
              {cadre.etat === 1 ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Code className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Code du cadre
              </h4>
              <p className="text-sm text-muted-foreground font-mono">
                {cadre.code_cs}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Niveau hiérarchique
              </h4>
              <p className="text-sm text-muted-foreground">
                Niveau {cadre.niveau_cs}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Coût de l'axe
              </h4>
              <p className="text-sm text-muted-foreground font-medium">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                }).format(cadre.cout_axe)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {cadre.partenaire_cs && (
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Partenaire
                </h4>
                <p className="text-sm text-muted-foreground">
                  {cadre.partenaire_cs.nom_acteur} (
                  {cadre.partenaire_cs.code_acteur})
                </p>
              </div>
            </div>
          )}

          {cadre.parent_cs && (
            <div className="flex items-start space-x-3">
              <FolderTree className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Cadre parent
                </h4>
                <p className="text-sm text-muted-foreground">
                  {typeof cadre.parent_cs === "object"
                    ? cadre.parent_cs.intutile_cs
                    : cadre.parent_cs}{" "}
                  (
                  {typeof cadre.parent_cs === "object"
                    ? cadre.parent_cs.code_cs
                    : cadre.parent_cs}
                  )
                </p>
              </div>
            </div>
          )}

          {cadre.projet_cs && (
            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Projet/Programme
                </h4>
                <p className="text-sm text-muted-foreground">
                  {cadre.projet_cs.nom_programme} (
                  {cadre.projet_cs.code_programme})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Informations de suivi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">
                Enregistrement
              </div>
              <div className="text-sm font-medium text-foreground">
                {new Date(cadre.date_enregistrement).toLocaleDateString(
                  "fr-FR"
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Modification</div>
              <div className="text-sm font-medium text-foreground">
                {new Date(cadre.date_modification).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Code</div>
          <div className="text-sm font-medium text-foreground font-mono">
            {cadre.code_cs}
          </div>
        </div>
        <div className="border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Niveau</div>
          <div className="text-sm font-medium text-foreground">
            {cadre.niveau_cs}
          </div>
        </div>
        <div className="border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground">État</div>
          <div className="text-sm font-medium text-foreground">
            {cadre.etat === 1 ? "Actif" : "Inactif"}
          </div>
        </div>
        <div className="border border-border rounded-lg p-3">
          <div className="text-xs text-muted-foreground">Coût (K XOF)</div>
          <div className="text-sm font-medium text-foreground">
            {(cadre.cout_axe / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Résumé</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Intitulé:</strong> {cadre.intutile_cs}
              </p>
              <p>
                <strong>Abrégé:</strong> {cadre.abgrege_cs}
              </p>
              {cadre.partenaire_cs && (
                <p>
                  <strong>Partenaire:</strong> {cadre.partenaire_cs.nom_acteur}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
