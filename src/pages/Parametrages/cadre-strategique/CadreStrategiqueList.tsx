import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Eye, Plus, Settings } from "lucide-react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import type { CadreStrategique } from "../../../types/entities";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";
import { useRoot } from "../../../contexts/RootContext";

interface CadreStrategiqueListProps {
  onEdit: (cadre: CadreStrategique) => void;
  onCreate: () => void;
  onView: (cadreId: number) => void;
  onOpenConfig: () => void;
}

export default function CadreStrategiqueList({
  onEdit,
  onCreate,
  onView,
  onOpenConfig,
}: CadreStrategiqueListProps) {
  const queryClient = useQueryClient();
  const { currentProgramme } = useRoot();

  // Fetch cadres strategiques data
  const { data: cadres = [] } = useQuery<CadreStrategique[]>({
    queryKey: ["cadresStrategiques"],
    queryFn: () => cadreStrategiqueService.getAll(currentProgramme?.id_programme ?? 0),
  });

  const deleteMutation = useMutation({
    mutationFn: cadreStrategiqueService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiques"] });
    },
  });

  const handleDelete = (cadre: CadreStrategique) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le cadre stratégique "${cadre.intutile_cs}" ?`
      )
    ) {
      deleteMutation.mutate(cadre.id_cs);
    }
  };

  const columns = [
    {
      key: "id_cs" as keyof CadreStrategique,
      title: "ID",
    },
    {
      key: "code_cs" as keyof CadreStrategique,
      title: "Code",
    },
    {
      key: "intutile_cs" as keyof CadreStrategique,
      title: "Intitulé",
      render: (
        _: CadreStrategique[keyof CadreStrategique],
        row: CadreStrategique
      ) => (
        <div>
          <div className="font-medium text-foreground">{row.intutile_cs}</div>
          <div className="text-xs text-muted-foreground">{row.abgrege_cs}</div>
        </div>
      ),
    },
    {
      key: "niveau_cs" as keyof CadreStrategique,
      title: "Niveau",
    },
    {
      key: "cout_axe" as keyof CadreStrategique,
      title: "Coût",
      render: (
        _: CadreStrategique[keyof CadreStrategique],
        row: CadreStrategique
      ) => (
        <span className="text-sm font-medium">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
          }).format(row.cout_axe)}
        </span>
      ),
    },
    {
      key: "parent_cs" as keyof CadreStrategique,
      title: "Parent",
      render: (
        _: CadreStrategique[keyof CadreStrategique],
        row: CadreStrategique
      ) => (
        <div className="text-sm">
          {row.parent_cs ? (
            <div>
              <div className="font-medium text-foreground">
                {typeof row.parent_cs === "object"
                  ? row.parent_cs.intutile_cs
                  : row.parent_cs}
              </div>
              <div className="text-xs text-muted-foreground">
                {typeof row.parent_cs === "object"
                  ? row.parent_cs.code_cs
                  : row.parent_cs}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Racine</span>
          )}
        </div>
      ),
    },
    {
      key: "partenaire_cs" as keyof CadreStrategique,
      title: "Partenaire",
      render: (
        _: CadreStrategique[keyof CadreStrategique],
        row: CadreStrategique
      ) => (
        <span className="text-sm">
          {row.partenaire_cs?.nom_acteur || "Non défini"}
        </span>
      ),
    },
    {
      key: "actions" as keyof CadreStrategique,
      title: "Actions",
      render: (
        _: CadreStrategique[keyof CadreStrategique],
        row: CadreStrategique
      ) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.id_cs)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Cadres Stratégiques
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onOpenConfig}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configurations</span>
          </Button>
          <Button onClick={onCreate} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau cadre</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {cadres.length}
          </div>
          <div className="text-sm text-muted-foreground">Total cadres</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {cadres.filter((c) => c.etat === 1).length}
          </div>
          <div className="text-sm text-muted-foreground">Actifs</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {new Set(cadres.map((c) => c.niveau_cs)).size}
          </div>
          <div className="text-sm text-muted-foreground">Niveaux</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {cadres
              .reduce((sum, c) => sum + c.cout_axe, 0)
              .toLocaleString("fr-FR")}
          </div>
          <div className="text-sm text-muted-foreground">Coût total (XOF)</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg">
        <Table<CadreStrategique & { id: string | number }>
          title="Liste des cadres stratégiques"
          data={cadres.map((c) => ({ ...c, id: c.id_cs }))}
          columns={columns}
        />
      </div>
    </div>
  );
}
