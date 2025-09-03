import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { conventionService } from "../../../services/conventionService";
import { Convention } from "../../../types/entities";

interface ConventionListProps {
  onEdit: (convention: Convention) => void;
  onAdd: () => void;
}

export default function ConventionList({ onEdit, onAdd }: ConventionListProps) {
  const queryClient = useQueryClient();

  // Fetch convention data
  const { data: conventions = [] } = useQuery<Convention[]>({
    queryKey: ["/convention/"],
    queryFn: conventionService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: conventionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/convention/"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
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
      key: "code_convention" as keyof Convention,
      title: "Code",
    },
    {
      key: "intutile_conv" as keyof Convention,
      title: "Intitulé",
    },
    {
      key: "reference_conv" as keyof Convention,
      title: "Référence",
    },
    {
      key: "montant_conv" as keyof Convention,
      title: "Montant",
      render: (_: Convention[keyof Convention], convention: Convention) => {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "XOF",
        }).format(convention.montant_conv);
      },
    },
    {
      key: "date_signature_conv" as keyof Convention,
      title: "Date signature",
      render: (_: Convention[keyof Convention], convention: Convention) => {
        return new Date(convention.date_signature_conv).toLocaleDateString(
          "fr-FR"
        );
      },
    },
    {
      key: "etat_conv" as keyof Convention,
      title: "État",
      render: (_: Convention[keyof Convention], convention: Convention) => {
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
      },
    },
    {
      key: "partenaire_conv" as keyof Convention,
      title: "Partenaire",
      render: (_: Convention[keyof Convention], convention: Convention) => {
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
      },
    },
    {
      key: "actions" as keyof Convention,
      title: "Actions",
      render: (_: Convention[keyof Convention], convention: Convention) => (
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
            variant="danger"
            size="sm"
            onClick={() => handleDelete(convention)}
            disabled={deleteMutation.isPending}
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div></div>
        <Button variant={"primary"} onClick={onAdd}>
          <Plus size={20} />
          Nouvelle Convention
        </Button>
      </div>

      <Table<Convention & { id?: string | number }>
        title="Liste des conventions"
        columns={columns}
        data={conventions.map((c) => ({ ...c, id: c.id_convention }))}
      />
    </div>
  );
}
