import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, TrashIcon, Plus } from "lucide-react";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table";
import type { UniteIndicateur } from "../../../../types/entities";
import { uniteIndicateurService } from "../../../../services/uniteIndicateurService";

interface UniteIndicateurListProps {
  onEdit: (unite: UniteIndicateur) => void;
  onAdd: () => void;
}

export default function UniteIndicateurList({
  onEdit,
  onAdd,
}: UniteIndicateurListProps) {
  const queryClient = useQueryClient();

  // Fetch unités data
  const { data: unites = [] } = useQuery<UniteIndicateur[]>({
    queryKey: ["unitesIndicateur"],
    queryFn: uniteIndicateurService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: uniteIndicateurService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitesIndicateur"] });
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette unité d'indicateur ?"
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "unite_ui" as keyof UniteIndicateur,
      title: "Unité",
    },
    {
      key: "definition_ui" as keyof UniteIndicateur,
      title: "Définition",
    },
    {
      key: "actions" as keyof UniteIndicateur,
      title: "Actions",
      render: (
        _: UniteIndicateur[keyof UniteIndicateur],
        unite: UniteIndicateur
      ) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(unite)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(unite.id_unite)}
            disabled={deleteMutation.isPending}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-foreground font-bold">
          Unités d'indicateur
        </h2>
        <Button variant="primary" onClick={onAdd}>
          <Plus size={20} />
          Nouvelle unité
        </Button>
      </div>

      <Table<UniteIndicateur & { id?: string | number }>
        title="Liste des unités d'indicateur"
        columns={columns}
        data={unites.map((u) => ({ ...u, id: u.id_unite }))}
      />
    </div>
  );
}
