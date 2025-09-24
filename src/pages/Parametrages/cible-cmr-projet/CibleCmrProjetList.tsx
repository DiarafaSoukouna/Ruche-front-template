import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, TrashIcon, Eye } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { cibleCmrProjetService } from "../../../services/cibleCmrProjetService";
import { formatValeurCible } from "../../../schemas/cibleCmrProjetSchema";
import type { CibleCmrProjet } from "../../../types/entities";

interface CibleCmrProjetListProps {
  onEdit: (cible: CibleCmrProjet) => void;
  onAdd: () => void;
  onView: (cible: CibleCmrProjet) => void;
}

export default function CibleCmrProjetList({
  onEdit,
  onAdd,
  onView,
}: CibleCmrProjetListProps) {
  const queryClient = useQueryClient();

  // Fetch cibles data
  const { data: cibles = [] } = useQuery<CibleCmrProjet[]>({
    queryKey: ["cibles-cmr-projet"],
    queryFn: cibleCmrProjetService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: cibleCmrProjetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cibles-cmr-projet"] });
      toast.success("Cible CMR projet supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette cible CMR projet ?"
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "annee" as keyof CibleCmrProjet,
      title: "Année",
      render: (value: CibleCmrProjet[keyof CibleCmrProjet]) => (
        <span className="font-medium text-blue-600">{String(value)}</span>
      ),
    },
    {
      key: "valeur_cible_indcateur_crp" as keyof CibleCmrProjet,
      title: "Valeur cible",
      render: (value: CibleCmrProjet[keyof CibleCmrProjet]) => (
        <span className="font-semibold text-green-600">
          {formatValeurCible(Number(value))}
        </span>
      ),
    },
    {
      key: "code_indicateur_crp" as keyof CibleCmrProjet,
      title: "Code indicateur",
      render: (value: CibleCmrProjet[keyof CibleCmrProjet]) => (
        <span className="text-gray-600">
          {value ? String(value) : "Non défini"}
        </span>
      ),
    },
    {
      key: "code_ug" as keyof CibleCmrProjet,
      title: "Code UGL",
      render: (value: CibleCmrProjet[keyof CibleCmrProjet]) => (
        <span className="text-gray-600">
          {value ? String(value) : "Non défini"}
        </span>
      ),
    },
    {
      key: "code_projet" as keyof CibleCmrProjet,
      title: "Code projet",
      render: (value: CibleCmrProjet[keyof CibleCmrProjet]) => (
        <span className="text-gray-600">
          {value ? String(value) : "Non défini"}
        </span>
      ),
    },
    {
      key: "actions" as keyof CibleCmrProjet,
      title: "Actions",
      render: (
        _: CibleCmrProjet[keyof CibleCmrProjet],
        cible: CibleCmrProjet
      ) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(cible)}
            className="p-1"
            title="Voir les détails"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(cible)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(cible.id_cible_indicateur_crp!)}
            disabled={deleteMutation.isPending}
            title="Supprimer"
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
            Cibles CMR Projet
          </h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une cible
          </Button>
        </div>
      </div>

      <Table<CibleCmrProjet & { id?: string | number }>
        title="Liste des cibles CMR projet"
        columns={columns}
        data={cibles.map((c) => ({ ...c, id: c.id_cible_indicateur_crp }))}
      />
    </div>
  );
}
