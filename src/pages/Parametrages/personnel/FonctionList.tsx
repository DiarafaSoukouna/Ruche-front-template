import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { fonctionService } from "../../../services/fonctionService";
import type { Fonction } from "../../../types/entities";
import Card from "../../../components/Card";

interface FonctionListProps {
  onEdit: (fonction: Fonction) => void;
  onAdd: () => void;
}

export default function FonctionList({ onEdit, onAdd }: FonctionListProps) {
  const queryClient = useQueryClient();

  // Fetch fonctions data
  const { data: fonctions = [], isLoading } = useQuery<Fonction[]>({
    queryKey: ["fonctions"],
    queryFn: fonctionService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: fonctionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonctions"] });
      toast.success("Fonction supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette fonction ?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "id_fonction" as keyof Fonction,
      title: "ID",
    },
    {
      key: "nom_fonction" as keyof Fonction,
      title: "Nom de la fonction",
    },
    {
      key: "description_fonction" as keyof Fonction,
      title: "Description",
      render: (value: Fonction[keyof Fonction]) => (
        <div className="max-w-xs truncate" title={String(value)}>
          {String(value)}
        </div>
      ),
    },
    {
      key: "id_fonction" as keyof Fonction,
      title: "Actions",
      render: (_: Fonction[keyof Fonction], fonction: Fonction) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(fonction)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(fonction.id_fonction!)}
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
        <h2 className="text-2xl font-bold">Fonctions</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une fonction
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : (
        <Card title="Liste des acteurs" className="overflow-hidden">
          <Table<Fonction & { id?: string | number }>
            columns={columns}
            data={fonctions.map((f) => ({ ...f, id: f.id_fonction }))}
            className="min-h-[400px]"
          />
        </Card>
      )}
    </div>
  );
}
