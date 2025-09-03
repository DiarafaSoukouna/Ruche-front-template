import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { typeZoneService } from "../../../services/typeZoneService";
import { apiClient } from "../../../lib/api";
import type { TypeZone } from "../../../types/entities";

interface TypeZoneListProps {
  onEdit: (typeZone: TypeZone) => void;
  onAdd: () => void;
  onRefresh?: () => void;
}

export default function TypeZoneList({ onEdit, onAdd }: TypeZoneListProps) {
  const queryClient = useQueryClient();

  // Fetch type zone data
  const { data: typeZones = [] } = useQuery<TypeZone[]>({
    queryKey: ["/type_zone/"],
    queryFn: async (): Promise<TypeZone[]> => {
      const response = await apiClient.request("/type_zone/");
      return Array.isArray(response) ? response : [];
    },
  });

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
      key: "code_type_zone" as keyof TypeZone,
      title: "Code",
    },
    {
      key: "nom_type_zone" as keyof TypeZone,
      title: "Nom",
    },
    {
      key: "actions" as keyof TypeZone,
      title: "Actions",
      render: (_: TypeZone[keyof TypeZone], typeZone: TypeZone) => (
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
            variant="danger"
            size="sm"
            onClick={() => handleDelete(typeZone.id_type_zone!)}
            disabled={deleteMutation.isPending}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Acteurs</h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un type de zone
          </Button>
        </div>
      </div>

      <Table<TypeZone & { id?: string | number }>
        title="Liste des types de zone"
        columns={columns}
        data={typeZones.map((t) => ({ ...t, id: t.id_type_zone }))}
        className="min-h-[400px]"
      />
    </div>
  );
}
