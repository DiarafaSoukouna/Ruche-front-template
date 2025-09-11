import { useQuery } from "@tanstack/react-query";
import {
  FolderTree,
  Calendar,
  Hash,
  ChevronRight,
} from "lucide-react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import type { CadreSecteur } from "../../../types/entities";
import { cadreSecteurService } from "../../../services/cadreSecteurService";

interface CadreSecteurDetailProps {
  cadre: CadreSecteur;
  onEdit: (cadre: CadreSecteur) => void;
  onClose: () => void;
}

export default function CadreSecteurDetail({
  cadre,
  onEdit,
  onClose,
}: CadreSecteurDetailProps) {
  // Fetch children cadres
  const { data: children = [] } = useQuery({
    queryKey: ["cadresSecteur", "children", cadre.id_cl],
    queryFn: () => cadreSecteurService.getChildren(cadre.id_cl),
  });

  // Fetch parent cadre
  const { data: parent } = useQuery({
    queryKey: ["cadresSecteur", cadre.parent_cl],
    queryFn: () =>
      cadre.parent_cl ? cadreSecteurService.getById(cadre.parent_cl) : null,
    enabled: !!cadre.parent_cl,
  });


  const getLevelLabel = (niveau: number) => {
    const labels = {
      1: "Objectif",
      2: "Axe stratégique",
      3: "Action majeure",
      4: "Sous-action",
      5: "Activité",
    };
    return labels[niveau as keyof typeof labels] || `Niveau ${niveau}`;
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-primary/10 text-primary border-primary/20",
      "bg-secondary/10 text-secondary-foreground border-secondary/20",
      "bg-tertiary/10 text-tertiary-foreground border-tertiary/20",
      "bg-accent/10 text-accent-foreground border-accent/20",
      "bg-muted/10 text-muted-foreground border-muted/20",
    ];
    return (
      colors[Math.min(level - 1, colors.length - 1)] ||
      colors[colors.length - 1]
    );
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FolderTree className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              {cadre.intitule_cl}
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(
                cadre.niveau_cl
              )}`}
            >
              {getLevelLabel(cadre.niveau_cl)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              {cadre.code_cl}
            </span>
            {cadre.abrege_cl && <span>({cadre.abrege_cl})</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(cadre)}>
            Modifier
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>


      {/* Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent */}
        {parent && (
          <Card title="Cadre parent">
            <div
              className={`p-3 rounded-lg border ${getLevelColor(
                parent.niveau_cl
              )}`}
            >
              <div className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                <span className="font-medium">{parent.intitule_cl}</span>
                <span className="text-xs px-2 py-1 bg-background/80 rounded-full">
                  {parent.code_cl}
                </span>
              </div>
              <p className="text-sm mt-1 opacity-75">
                {getLevelLabel(parent.niveau_cl)}
              </p>
            </div>
          </Card>
        )}

        {/* Children */}
        {children.length > 0 && (
          <Card title={`Éléments enfants (${children.length})`}>
            <div className="space-y-2">
              {children.map((child) => (
                <div
                  key={child.id_cl}
                  className={`p-3 rounded-lg border ${getLevelColor(
                    child.niveau_cl
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium">{child.intitule_cl}</span>
                    <span className="text-xs px-2 py-1 bg-background/80 rounded-full">
                      {child.code_cl}
                    </span>
                  </div>
                  <p className="text-sm mt-1 opacity-75">
                    {getLevelLabel(child.niveau_cl)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Metadata */}
      <Card title="Informations générales">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              ID Cadre
            </label>
            <p className="font-mono text-sm">{cadre.id_cl}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Niveau
            </label>
            <p>
              {cadre.niveau_cl} - {getLevelLabel(cadre.niveau_cl)}
            </p>
          </div>
          {cadre.id_programme && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID Programme
              </label>
              <p>{cadre.id_programme}</p>
            </div>
          )}
          {cadre.created_at && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(cadre.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
