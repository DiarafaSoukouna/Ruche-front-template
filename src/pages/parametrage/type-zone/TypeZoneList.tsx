import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import Button from "../../../components/Button";
import { typeZoneService } from "../../../services/typeZoneService";
import type { TypeZone } from "../../../types/entities";

interface TypeZoneListProps {
  onEdit: (typeZone: TypeZone) => void;
  onAdd: () => void;
  onRefresh?: () => void;
}

export default function TypeZoneList({ onEdit, onAdd }: TypeZoneListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: typeZoneService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/type_zone/"] });
      toast.success("Type de zone supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce type de zone ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Code",
      accessor: "code_type_zone" as keyof TypeZone,
    },
    {
      header: "Nom",
      accessor: "nom_type_zone" as keyof TypeZone,
    },
    {
      header: "Actions",
      accessor: (typeZone: TypeZone) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(typeZone)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(typeZone.id_type_zone!)}
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
        <h2 className="text-2xl font-bold">Gestion des Types de Zone</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un type de zone
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

      <DataTable
        columns={columns}
        rowKey={(typeZone) => typeZone.id_type_zone!}
        endpoint="/type_zone/"
        className="min-h-[400px]"
      />
    </div>
  );
}
