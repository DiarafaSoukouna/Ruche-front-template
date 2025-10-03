import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import typeActiviteService from "../../../services/typeActiviteService";
import type { TypeActivite } from "../../../types/entities";
import TypeActiviteForm from "./TypeActiviteForm";

export default function TypeActiviteManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<TypeActivite | undefined>();

  // Fetch types d'activité
  const { data: typesActivite = [] } = useQuery<TypeActivite[]>({
    queryKey: ["types-activite"],
    queryFn: typeActiviteService.getAll,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: typeActiviteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types-activite"] });
      toast.success("Type d'activité supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  // Handlers
  const handleAdd = () => {
    setEditingType(undefined);
    setShowForm(true);
  };

  const handleEdit = (type: TypeActivite) => {
    setEditingType(type);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce type d'activité ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingType(undefined);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["types-activite"] });
    handleCloseForm();
  };

  const columns = [
    {
      key: "code_type" as keyof TypeActivite,
      title: "Code",
      render: (value: TypeActivite[keyof TypeActivite]) => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
    {
      key: "intutile_type" as keyof TypeActivite,
      title: "Intitulé",
      render: (value: TypeActivite[keyof TypeActivite]) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "description" as keyof TypeActivite,
      title: "Description",
      render: (value: TypeActivite[keyof TypeActivite]) => (
        <span className="text-sm text-gray-600">
          {String(value).length > 100
            ? `${String(value).substring(0, 100)}...`
            : String(value)}
        </span>
      ),
    },
    {
      key: "actions" as keyof TypeActivite,
      title: "Actions",
      render: (_: TypeActivite[keyof TypeActivite], type: TypeActivite) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(type)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(type.id_type)}
            disabled={deleteMutation.isPending}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      {!showForm && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Types d'activités
            </h3>
            <p className="text-gray-600 mt-1">
              Gérez les différents types d'activités PTBA
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau type
          </Button>
        </div>
      )}

      {/* Stats */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {typesActivite.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Types d'activités
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {
                typesActivite.filter(
                  (t) => t.description && t.description.length > 0
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">
              Avec description
            </div>
          </div>
        </div>
      )}

      {/* Affichage conditionnel : Table ou Formulaire */}
      {showForm ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingType
                ? "Modifier le type d'activité"
                : "Créer un nouveau type d'activité"}
            </h3>
            <Button
              variant="outline"
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour à la liste
            </Button>
          </div>
          <TypeActiviteForm
            type={editingType}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg">
          <Table<TypeActivite & { id: string | number }>
            title="Liste des types d'activités"
            columns={columns}
            data={typesActivite.map((t) => ({ ...t, id: t.id_type }))}
          />
        </div>
      )}
    </div>
  );
}
