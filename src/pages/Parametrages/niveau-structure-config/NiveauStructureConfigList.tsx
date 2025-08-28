import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { niveauStructureConfigService } from "../../../services/niveauStructureConfigService";
import type { NiveauStructureConfig } from "../../../types/entities";

interface NiveauStructureConfigListProps {
  onEdit: (id: number, config: NiveauStructureConfig) => void;
  onAdd: () => void;
}

export default function NiveauStructureConfigList({
  onAdd,
  onEdit,
}: NiveauStructureConfigListProps) {
  const queryClient = useQueryClient();

  // Fetch niveau structure config data
  const { data: configs = [], isLoading } = useQuery<NiveauStructureConfig[]>({
    queryKey: ["/niveau_structure_config/"],
    queryFn: niveauStructureConfigService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: niveauStructureConfigService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/niveau_structure_config/"],
      });
      queryClient.invalidateQueries({ queryKey: ["/plan_site/"] }); // Refresh plan sites too
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette configuration de niveau ?"
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Sort configs by niveau (nombre_nsc)
  const sortedConfigs = [...configs].sort(
    (a, b) => a.nombre_nsc - b.nombre_nsc
  );

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-pink-100 text-pink-800 border-pink-200",
    ];
    return (
      colors[(level - 1) % colors.length] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const columns = [
    {
      key: "nombre_nsc" as keyof NiveauStructureConfig,
      title: "Niveau",
      render: (
        _: NiveauStructureConfig[keyof NiveauStructureConfig],
        config: NiveauStructureConfig
      ) => (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(
              config.nombre_nsc
            )}`}
          >
            {config.nombre_nsc}
          </span>
          {config.nombre_nsc === 1 && (
            <span className="text-xs text-gray-500">(Racine)</span>
          )}
        </div>
      ),
    },
    {
      key: "libelle_nsc" as keyof NiveauStructureConfig,
      title: "Libellé",
      render: (
        _: NiveauStructureConfig[keyof NiveauStructureConfig],
        config: NiveauStructureConfig
      ) => (
        <div>
          <div className="font-medium">{config.libelle_nsc}</div>
          <div className="text-xs text-gray-500">
            Code: {config.code_number_nsc}
          </div>
        </div>
      ),
    },
    {
      key: "id_programme" as keyof NiveauStructureConfig,
      title: "Programme",
      render: (
        _: NiveauStructureConfig[keyof NiveauStructureConfig],
        config: NiveauStructureConfig
      ) => (
        <span className="text-sm text-gray-600">#{config.id_programme}</span>
      ),
    },
    {
      key: "usage" as keyof NiveauStructureConfig,
      title: "Utilisation",
      render: (
        _: NiveauStructureConfig[keyof NiveauStructureConfig],
        config: NiveauStructureConfig
      ) => {
        // This would need to be calculated from plan_site data
        // For now, we'll show a placeholder
        return (
          <div className="text-sm text-gray-500">
            <div>Structures: -</div>
            <div className="text-xs">En cours de calcul...</div>
          </div>
        );
      },
    },
    {
      key: "ordre" as keyof NiveauStructureConfig,
      title: "Ordre",
      render: (
        _: NiveauStructureConfig[keyof NiveauStructureConfig],
        config: NiveauStructureConfig
      ) => {
        const currentIndex = sortedConfigs.findIndex(
          (c) => c.id_nsc === config.id_nsc
        );
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === sortedConfigs.length - 1;

        return (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* TODO: Implement reorder */
              }}
              disabled={isFirst}
              className="p-1"
              title="Monter"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* TODO: Implement reorder */
              }}
              disabled={isLast}
              className="p-1"
              title="Descendre"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      key: "id_nsc" as keyof NiveauStructureConfig,
      title: "Actions",
      render: (
        _: NiveauStructureConfig[keyof NiveauStructureConfig],
        config: NiveauStructureConfig
      ) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(config.id_nsc!, config)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(config.id_nsc!)}
            className="p-1 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500"
            disabled={deleteMutation.isPending}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuration des Niveaux</h2>
          <p className="text-gray-600 mt-1">
            Gestion des niveaux hiérarchiques des structures organisationnelles
          </p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau niveau
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {configs.length}
          </div>
          <div className="text-sm text-gray-600">Niveaux configurés</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {configs.length > 0
              ? Math.max(...configs.map((c) => c.nombre_nsc))
              : 0}
          </div>
          <div className="text-sm text-gray-600">Profondeur maximale</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">-</div>
          <div className="text-sm text-gray-600">Structures utilisant</div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : (
        <Table<NiveauStructureConfig & { id?: string | number }>
          columns={columns}
          data={sortedConfigs.map((c) => ({ ...c, id: c.id_nsc }))}
          className="min-h-[400px]"
        />
      )}
    </div>
  );
}
