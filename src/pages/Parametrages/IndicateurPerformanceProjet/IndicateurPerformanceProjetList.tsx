import { useQuery } from "@tanstack/react-query";
import { Edit2, Plus, TrashIcon } from "lucide-react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import type {
  IndicateurPerformanceProjet,
  UniteIndicateur,
} from "../../../types/entities";
import indicateurPerformanceProjetService from "../../../services/indicateurPerformanceProjetService";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";

interface IndicateurPerformanceProjetListProps {
  onAdd: () => void;
  onEdit: (indicateur: IndicateurPerformanceProjet) => void;
  onDelete: (indicateur: IndicateurPerformanceProjet) => void;
}

// Type étendu pour inclure l'id requis par Table
type IndicateurWithId = IndicateurPerformanceProjet & {
  id: number;
};

export default function IndicateurPerformanceProjetList({
  onAdd,
  onEdit,
  onDelete,
}: IndicateurPerformanceProjetListProps) {
  // Fetch indicateurs
  const { data: indicateurs = [], isLoading } = useQuery<
    IndicateurPerformanceProjet[]
  >({
    queryKey: ["indicateurs-performance"],
    queryFn: indicateurPerformanceProjetService.getAll,
  });

  const { data: unites = [], isLoading: isLoadingUnites } = useQuery<
    UniteIndicateur[]
  >({
    queryKey: ["unites-indicateur"],
    queryFn: uniteIndicateurService.getAll,
  });

  if (isLoading || isLoadingUnites) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chargement des indicateurs de performance...
      </div>
    );
  }

  // Mapper les données pour ajouter l'id requis par Table
  const dataWithId: IndicateurWithId[] = indicateurs.map((ind) => ({
    ...ind,
    id: ind.id_indicateur_performance,
  }));

  // Définir les colonnes
  const columns: Array<{
    key: keyof IndicateurWithId;
    title: string;
    render?: (value: unknown, row: IndicateurWithId) => React.ReactNode;
  }> = [
    {
      key: "code_indicateur_performance",
      title: "Code",
      render: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "intitule_indicateur_tache",
      title: "Intitulé",
    },
    {
      key: "unite_indicateur_performance",
      title: "Unité",
      render: (_, row: IndicateurWithId) => {
        if (
          typeof row.unite_indicateur_performance === "object" &&
          row.unite_indicateur_performance
        ) {
          const unite = unites.find(
            (unite) =>
              unite.id_unite ===
              (row.unite_indicateur_performance as UniteIndicateur)?.id_unite
          );
          return unite?.unite_ui + " - " + unite?.definition_ui;
        }

        const unite = unites.find(
          (unite) => unite.id_unite === row.unite_indicateur_performance
        );
        return unite?.unite_ui + " - " + unite?.definition_ui;
      },
    },
    {
      key: "code_activite_projet",
      title: "Activité Projet",
      render: (value: unknown) => {
        if (
          typeof value === "object" &&
          value &&
          "code_activite_projet" in value
        ) {
          return String(value.code_activite_projet);
        }
        return value ? String(value) : "N/A";
      },
    },
    {
      key: "id",
      title: "Actions",
      render: (_: unknown, row: IndicateurWithId) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            variant="outline"
            title="Modifier"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            variant="outline"
            className="bg-red-600 hover:bg-red-600/90 text-white hover:text-white"
            title="Supprimer"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bouton Ajouter */}
      <div className="flex justify-end">
        <Button onClick={onAdd} variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>

      {/* Table avec recherche et pagination intégrées */}
      <Table
        columns={columns}
        data={dataWithId}
        itemsPerPage={10}
        title="Indicateurs de Performance Projet"
      />
    </div>
  );
}
