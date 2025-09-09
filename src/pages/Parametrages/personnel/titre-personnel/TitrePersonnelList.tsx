import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, TrashIcon, Plus } from "lucide-react";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table";
import { TitrePersonnel } from "../../../../types/entities";
import { titrePersonnelService } from "../../../../services/titrePersonnelService";

interface TitrePersonnelListProps {
  onEdit: (titre: TitrePersonnel) => void;
  onAdd: () => void;
}

export default function TitrePersonnelList({
  onEdit,
  onAdd,
}: TitrePersonnelListProps) {
  const queryClient = useQueryClient();

  // Fetch titres data
  const { data: titres = [] } = useQuery<TitrePersonnel[]>({
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
      render: (
        _: TitrePersonnel[keyof TitrePersonnel],
        titre: TitrePersonnel
      ) => <span className="font-medium">{titre.libelle_titre}</span>,
    },
    {
      key: "description_titre" as keyof TitrePersonnel,
      title: "Description",
      render: (
        _: TitrePersonnel[keyof TitrePersonnel],
        titre: TitrePersonnel
      ) => <span className="text-gray-600">{titre.description_titre}</span>,
    },
    {
      key: "actions" as keyof TitrePersonnel,
      title: "Actions",
      render: (
        _: TitrePersonnel[keyof TitrePersonnel],
        titre: TitrePersonnel
      ) => (
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
            variant="danger"
            size="sm"
            onClick={() => handleDelete(titre.id_titre)}
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
          <h1 className="text-3xl font-bold text-gray-900">
            Titres de Personnel
          </h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un titre
          </Button>
        </div>
      </div>

      <Table<TitrePersonnel & { id?: string | number }>
        title="Liste des titres"
        columns={columns}
        data={titres.map((t) => ({ ...t, id: t.id_titre }))}
      />
    </div>
  );
}
