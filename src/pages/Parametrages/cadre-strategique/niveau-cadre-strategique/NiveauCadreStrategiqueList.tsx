import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import { niveauCadreStrategiqueService } from "../../../../services/niveauCadreStrategiqueService";
import { getTypeNiveauLabel } from "../../../../schemas/niveauCadreStrategiqueSchema";
import type { NiveauCadreStrategique } from "../../../../types/entities";
import NiveauCadreStrategiqueMultiForm from "./NiveauCadreStrategiqueMultiForm";

export default function NiveauCadreStrategiqueList() {
  const queryClient = useQueryClient();

  // États pour gérer l'affichage
  const [showForm, setShowForm] = useState(false);
  const [editingNiveau, setEditingNiveau] = useState<
    NiveauCadreStrategique | undefined
  >();

  // Fonctions de gestion
  const handleAdd = () => {
    setEditingNiveau(undefined);
    setShowForm(true);
  };

  const handleEdit = (niveau: NiveauCadreStrategique) => {
    setEditingNiveau(niveau);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingNiveau(undefined);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["niveaux-cadre-strategique"] });
  };

  // Fetch niveaux data
  const { data: niveaux = [] } = useQuery<NiveauCadreStrategique[]>({
    queryKey: ["niveaux-cadre-strategique"],
    queryFn: niveauCadreStrategiqueService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: niveauCadreStrategiqueService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["niveaux-cadre-strategique"],
      });
      toast.success("Niveau supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce niveau ?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "nombre_nsc" as keyof NiveauCadreStrategique,
      title: "Nombre",
      render: (value: NiveauCadreStrategique[keyof NiveauCadreStrategique]) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "libelle_nsc" as keyof NiveauCadreStrategique,
      title: "Libellé",
      render: (value: NiveauCadreStrategique[keyof NiveauCadreStrategique]) => (
        <span className="font-medium text-gray-900">{String(value)}</span>
      ),
    },
    {
      key: "code_number_nsc" as keyof NiveauCadreStrategique,
      title: "Code numérique",
      render: (value: NiveauCadreStrategique[keyof NiveauCadreStrategique]) => (
        <span className="text-gray-600">{String(value)}</span>
      ),
    },
    {
      key: "type_niveau" as keyof NiveauCadreStrategique,
      title: "Type",
      render: (
        _: NiveauCadreStrategique[keyof NiveauCadreStrategique],
        niveau: NiveauCadreStrategique
      ) => {
        const typeValue =
          typeof niveau.type_niveau === "string"
            ? parseInt(niveau.type_niveau)
            : niveau.type_niveau;
        const label = getTypeNiveauLabel(typeValue as 1 | 2 | 3);
        const colorClass =
          typeValue === 1
            ? "bg-blue-100 text-blue-800"
            : typeValue === 2
            ? "bg-green-100 text-green-800"
            : "bg-purple-100 text-purple-800";

        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "actions" as keyof NiveauCadreStrategique,
      title: "Actions",
      render: (
        _: NiveauCadreStrategique[keyof NiveauCadreStrategique],
        niveau: NiveauCadreStrategique
      ) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(niveau)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(niveau.id_nsc!)}
            disabled={deleteMutation.isPending}
            title="Supprimer"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Affichage conditionnel : formulaire ou liste
  if (showForm) {
    return (
      <NiveauCadreStrategiqueMultiForm
        onBack={handleBack}
        onSuccess={handleSuccess}
        editingNiveau={editingNiveau}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Niveaux de Cadre Stratégique
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les niveaux de votre cadre stratégique (Effet, Produit,
            Impact)
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un niveau
          </Button>
        </div>
      </div>

      <Table<NiveauCadreStrategique & { id?: string | number }>
        title="Liste des niveaux"
        columns={columns}
        data={niveaux.map((n) => ({ ...n, id: n.id_nsc }))}
      />
    </div>
  );
}
