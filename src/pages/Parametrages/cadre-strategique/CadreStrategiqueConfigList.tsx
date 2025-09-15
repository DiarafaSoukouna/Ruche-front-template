import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import type { CadreStrategiqueConfig } from "../../../types/entities";
import { cadreStrategiqueConfigService } from "../../../services/cadreStrategiqueConfigService";
import { getTypeLabel } from "../../../schemas/cadreStrategiqueSchemas";

interface CadreStrategiqueConfigListProps {
  onEdit: (config: CadreStrategiqueConfig) => void;
  onCreate: () => void;
}

export default function CadreStrategiqueConfigList({
  onEdit,
  onCreate,
}: CadreStrategiqueConfigListProps) {
  const queryClient = useQueryClient();

  // Fetch configurations data
  const { data: configs = [] } = useQuery<CadreStrategiqueConfig[]>({
    queryKey: ["cadresStrategiquesConfigs"],
    queryFn: cadreStrategiqueConfigService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: cadreStrategiqueConfigService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiquesConfigs"] });
    },
  });

  const handleDelete = (config: CadreStrategiqueConfig) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la configuration "${config.libelle_csc}" ?`
      )
    ) {
      deleteMutation.mutate(config.id_csc);
    }
  };

  const getTypeColor = (type: 1 | 2 | 3) => {
    const colors = {
      1: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20", // Effet
      2: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20", // Produit
      3: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20", // Impact
    };
    return colors[type];
  };

  const columns = [
    {
      key: "id_csc" as keyof CadreStrategiqueConfig,
      title: "ID",
    },
    {
      key: "libelle_csc" as keyof CadreStrategiqueConfig,
      title: "Libellé",
    },
    {
      key: "nombre" as keyof CadreStrategiqueConfig,
      title: "Nombre",
    },
    {
      key: "type_csc" as keyof CadreStrategiqueConfig,
      title: "Type",
      render: (_: CadreStrategiqueConfig[keyof CadreStrategiqueConfig], row: CadreStrategiqueConfig) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
            row.type_csc
          )}`}
        >
          {getTypeLabel(row.type_csc)}
        </span>
      ),
    },
    {
      key: "programme" as keyof CadreStrategiqueConfig,
      title: "Programme",
      render: (_: CadreStrategiqueConfig[keyof CadreStrategiqueConfig], row: CadreStrategiqueConfig) => (
        <span className="text-sm">
          {row.programme?.nom_programme || "Non défini"}
        </span>
      ),
    },
    {
      key: "etat" as keyof CadreStrategiqueConfig,
      title: "État",
      render: (_: CadreStrategiqueConfig[keyof CadreStrategiqueConfig], row: CadreStrategiqueConfig) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            row.etat === 1
              ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
              : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
          }`}
        >
          {row.etat === 1 ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "actions" as keyof CadreStrategiqueConfig,
      title: "Actions",
      render: (_: CadreStrategiqueConfig[keyof CadreStrategiqueConfig], row: CadreStrategiqueConfig) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Configurations des Cadres Stratégiques
          </h2>
          <p className="text-muted-foreground">
            Gestion des configurations par type (Effet, Produit, Impact)
          </p>
        </div>
        <Button onClick={onCreate} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle configuration</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {configs.length}
          </div>
          <div className="text-sm text-muted-foreground">Total configurations</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {configs.filter((c) => c.type_csc === 1).length}
          </div>
          <div className="text-sm text-muted-foreground">Effets</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {configs.filter((c) => c.type_csc === 2).length}
          </div>
          <div className="text-sm text-muted-foreground">Produits</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {configs.filter((c) => c.type_csc === 3).length}
          </div>
          <div className="text-sm text-muted-foreground">Impacts</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<CadreStrategiqueConfig & { id: string | number }>
          title="Liste des configurations"
          data={configs.map((c) => ({ ...c, id: c.id_csc }))}
          columns={columns}
        />
      </div>
    </div>
  );
}
