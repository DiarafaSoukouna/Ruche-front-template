import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { apiClient } from "../../../lib/api";
import type { PlanSite, NiveauStructureConfig } from "../../../types/entities";

interface PlanSiteListProps {
  onEdit: (planSite: PlanSite) => void;
  onAdd: () => void;
  onViewDetails?: (planSiteId: number) => void;
}

export default function PlanSiteList({ onAdd, onEdit, onViewDetails }: PlanSiteListProps) {
  const queryClient = useQueryClient();

  // Fetch plan site data
  const { data: planSites = [], isLoading } = useQuery<PlanSite[]>({
    queryKey: ["/plan_site/"],
    queryFn: async (): Promise<PlanSite[]> => {
      const response = await apiClient.request("/plan_site/");
      return Array.isArray(response) ? response : [];
    },
  });

  // Fetch niveau structure config data
  const { data: niveauConfigs = [] } = useQuery<NiveauStructureConfig[]>({
    queryKey: ["/niveau_structure_config/"],
    queryFn: async (): Promise<NiveauStructureConfig[]> => {
      const response = await apiClient.request("/niveau_structure_config/");
      return Array.isArray(response) ? response : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.request(`/plan_site/${id}/`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/plan_site/"] });
      toast.success("Structure supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette structure ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Get level name helper using niveau_structure_config
  const getLevelName = (level: number) => {
    const config = niveauConfigs.find(c => c.nombre_nsc === level);
    return config?.libelle_nsc || `Niveau ${level}`;
  };

  // Get level color helper
  const getLevelColor = (level: number) => {
    const colors = [
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-pink-100 text-pink-800 border-pink-200"
    ];
    return colors[(level - 1) % colors.length] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const columns = [
    {
      key: "code_ds" as keyof PlanSite,
      title: "Code",
      render: (_: PlanSite[keyof PlanSite], planSite: PlanSite) => (
        <span className="font-mono text-sm">{planSite.code_ds}</span>
      ),
    },
    {
      key: "intutile_ds" as keyof PlanSite,
      title: "Intitulé",
      render: (_: PlanSite[keyof PlanSite], planSite: PlanSite) => {
        const parent = planSites.find(p => p.id_ds === planSite.parent_ds);
        const indent = (planSite.niveau_ds - 1) * 20;
        
        return (
          <div style={{ paddingLeft: `${indent}px` }} className="flex items-center">
            <span className="text-gray-400 mr-2">
              {"└".repeat(Math.max(0, planSite.niveau_ds - 1))}
            </span>
            <div>
              <div className="font-medium">{planSite.intutile_ds}</div>
              {parent && (
                <div className="text-xs text-gray-500">
                  Sous: {parent.intutile_ds}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "niveau_ds" as keyof PlanSite,
      title: "Niveau",
      render: (_: PlanSite[keyof PlanSite], planSite: PlanSite) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(planSite.niveau_ds)}`}>
          {getLevelName(planSite.niveau_ds)}
        </span>
      ),
    },
    {
      key: "parent_ds" as keyof PlanSite,
      title: "Structure parente",
      render: (_: PlanSite[keyof PlanSite], planSite: PlanSite) => {
        if (!planSite.parent_ds) {
          return <span className="text-gray-400 italic">Structure racine</span>;
        }
        const parent = planSites.find(p => p.id_ds === planSite.parent_ds);
        return parent ? (
          <span className="text-sm">
            {parent.intutile_ds} ({parent.code_ds})
          </span>
        ) : (
          <span className="text-red-500 text-sm">Parent introuvable</span>
        );
      },
    },
    {
      key: "code_relai_ds" as keyof PlanSite,
      title: "Code Relai",
      render: (_: PlanSite[keyof PlanSite], planSite: PlanSite) => (
        <span className="font-mono text-sm">
          {planSite.code_relai_ds || <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      key: "id_ds" as keyof PlanSite,
      title: "Actions",
      render: (_: PlanSite[keyof PlanSite], planSite: PlanSite) => (
        <div className="flex gap-1">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(planSite.id_ds!)}
              className="p-1"
              title="Voir détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(planSite)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(planSite.id_ds!)}
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
          <h2 className="text-2xl font-bold">Structures Organisationnelles</h2>
          <p className="text-gray-600 mt-1">
            Gestion des structures hiérarchiques
          </p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle structure
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : (
        <Table<PlanSite & { id?: string | number }>
          columns={columns}
          data={planSites.map(p => ({ ...p, id: p.id_ds }))}
          className="min-h-[400px]"
        />
      )}
    </div>
  );
}
