import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Table from "../../../components/Table";
import { TitrePersonnel } from "../../../types/entities";
import { titrePersonnelService } from "../../../services/titrePersonnelService";

interface TitrePersonnelListProps {
  onEdit: (titre: TitrePersonnel) => void;
  onAdd: () => void;
}

export default function TitrePersonnelList({ onEdit, onAdd }: TitrePersonnelListProps) {
  const queryClient = useQueryClient();

  // Fetch titres data
  const { data: titres = [], isLoading } = useQuery<TitrePersonnel[]>({
    queryKey: ["titresPersonnel"],
    queryFn: titrePersonnelService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: titrePersonnelService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titresPersonnel"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce titre ?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "id_titre" as keyof TitrePersonnel,
      title: "ID",
    },
    {
      key: "libelle_titre" as keyof TitrePersonnel,
      title: "Libellé",
      render: (_: TitrePersonnel[keyof TitrePersonnel], titre: TitrePersonnel) => (
        <span className="font-medium">{titre.libelle_titre}</span>
      ),
    },
    {
      key: "description_titre" as keyof TitrePersonnel,
      title: "Description",
      render: (_: TitrePersonnel[keyof TitrePersonnel], titre: TitrePersonnel) => (
        <span className="text-gray-600">{titre.description_titre}</span>
      ),
    },
    {
      key: "id_titre" as keyof TitrePersonnel,
      title: "Actions",
      render: (_: TitrePersonnel[keyof TitrePersonnel], titre: TitrePersonnel) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(titre)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(titre.id_titre)}
            className="p-1 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500"
            disabled={deleteMutation.isPending}
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
        <h2 className="text-2xl font-bold">Titres de Personnel</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un titre
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : (
        <Card title="Liste des titres" className="overflow-hidden">
          <Table<TitrePersonnel & { id?: string | number }>
            columns={columns}
            data={titres.map((t) => ({ ...t, id: t.id_titre }))}
            className="min-h-[400px]"
          />
        </Card>
      )}
    </div>
  );
}
