import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DataTable from "../../../components/DataTable";
import Button from "../../../components/Button";
import { apiClient } from "../../../lib/api";
import { Convention } from "../../../types/entities";

interface ConventionListProps {
  onEdit: (convention: Convention) => void;
  onAdd: () => void;
}

export default function ConventionList({ onEdit, onAdd }: ConventionListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.request(`/convention/${id}/`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/convention/"] });
      toast.success("Convention supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la convention");
    },
  });

  const handleDelete = (convention: Convention) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette convention ?")
    ) {
      deleteMutation.mutate(convention.id_convention!);
    }
  };

  const columns = [
    {
      header: "Code",
      accessor: "code_convention" as keyof Convention,
    },
    {
      header: "Intitulé",
      accessor: "intutile_conv" as keyof Convention,
    },
    {
      header: "Référence",
      accessor: "reference_conv" as keyof Convention,
    },
    {
      header: "Montant",
      accessor: ((convention: Convention) => {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
        }).format(convention.montant_conv);
      }) as (row: Convention) => React.ReactNode,
    },
    {
      header: "Date signature",
      accessor: ((convention: Convention) => {
        return new Date(convention.date_signature_conv).toLocaleDateString(
          "fr-FR"
        );
      }) as (row: Convention) => React.ReactNode,
    },
    {
      header: "État",
      accessor: ((convention: Convention) => {
        const stateColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          en_cours: "bg-blue-100 text-blue-800",
          terminee: "bg-purple-100 text-purple-800",
          suspendue: "bg-yellow-100 text-yellow-800",
        };

        const colorClass =
          stateColors[convention.etat_conv as keyof typeof stateColors] ||
          "bg-gray-100 text-gray-800";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {convention.etat_conv}
          </span>
        );
      }) as (row: Convention) => React.ReactNode,
    },
    {
      header: "Partenaire",
      accessor: ((convention: Convention) => {
        if (!convention.partenaire_conv) {
          return <span className="text-gray-400">Aucun</span>;
        }

        const acteur = convention.partenaire_conv;
        return acteur ? (
          <span className="text-gray-900">
            {acteur.nom_acteur} ({acteur.code_acteur})
          </span>
        ) : (
          <span className="text-red-500">Acteur introuvable</span>
        );
      }) as (row: Convention) => React.ReactNode,
    },
    {
      header: "Actions",
      accessor: ((convention: Convention) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(convention)}
            className="p-1"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(convention)}
            className="p-1 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500"
            disabled={deleteMutation.isPending}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )) as (row: Convention) => React.ReactNode,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Conventions
        </h2>
        <Button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Plus size={20} />
          Nouvelle Convention
        </Button>
      </div>

      <DataTable<Convention>
        columns={columns}
        rowKey={(convention) => convention.id_convention!}
        endpoint="/convention/"
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
}
