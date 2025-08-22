import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import Button from "../../../components/Button";
import { planSiteService } from "../../../services/planSiteService";
import type { PlanSite } from "../../../types/entities";

interface PlanSiteListProps {
  onEdit: (planSite: PlanSite) => void;
  onAdd: () => void;
}

export default function PlanSiteList({ onEdit, onAdd }: PlanSiteListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: planSiteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/plan_site/"] });
      toast.success("Plan de site supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce plan de site ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Code",
      accessor: "code_ds" as keyof PlanSite,
    },
    {
      header: "Intitulé",
      accessor: "intutile_ds" as keyof PlanSite,
    },
    {
      header: "Niveau",
      accessor: "niveau_ds" as keyof PlanSite,
    },
    {
      header: "Parent",
      accessor: "parent_ds" as keyof PlanSite,
    },
    {
      header: "Code Relai",
      accessor: "code_relai_ds" as keyof PlanSite,
    },
    {
      header: "Actions",
      accessor: (planSite: PlanSite) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(planSite)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(planSite.id_ds!)}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Plans de Site</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un plan de site
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      <DataTable<PlanSite>
        columns={columns}
        rowKey={(planSite) => planSite.id_ds!}
        endpoint="/plan_site/"
        className="min-h-[400px]"
      />
    </div>
  );
}
