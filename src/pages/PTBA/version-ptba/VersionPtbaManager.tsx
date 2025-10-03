import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, CheckCircle, Archive } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import versionPtbaService from "../../../services/versionPtbaService";
import {
  getStatutVersionLabel,
  getStatutVersionColor,
} from "../../../schemas/ptbaSchemas";
import type { VersionPtba } from "../../../types/entities";
import VersionPtbaForm from "./VersionPtbaForm";

export default function VersionPtbaManager() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingVersion, setEditingVersion] = useState<
    VersionPtba | undefined
  >();

  // Fetch versions
  const { data: versions = [] } = useQuery<VersionPtba[]>({
    queryKey: ["versions-ptba"],
    queryFn: versionPtbaService.getAll,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: versionPtbaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions-ptba"] });
      toast.success("Version supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const validerMutation = useMutation({
    mutationFn: versionPtbaService.valider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions-ptba"] });
      toast.success("Version validée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la validation");
    },
  });

  const archiverMutation = useMutation({
    mutationFn: versionPtbaService.archiver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions-ptba"] });
      toast.success("Version archivée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage");
    },
  });

  // Handlers
  const handleAdd = () => {
    setEditingVersion(undefined);
    setShowForm(true);
  };

  const handleEdit = (version: VersionPtba) => {
    setEditingVersion(version);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette version ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleValider = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir valider cette version ?")) {
      validerMutation.mutate(id);
    }
  };

  const handleArchiver = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir archiver cette version ?")) {
      archiverMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVersion(undefined);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["versions-ptba"] });
    handleCloseForm();
  };

  const columns = [
    {
      key: "version_ptba" as keyof VersionPtba,
      title: "Version",
      render: (value: VersionPtba[keyof VersionPtba]) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "annee_ptba" as keyof VersionPtba,
      title: "Année",
      render: (value: VersionPtba[keyof VersionPtba]) => (
        <span className="font-mono">{String(value)}</span>
      ),
    },
    {
      key: "statut_version" as keyof VersionPtba,
      title: "Statut",
      render: (_: VersionPtba[keyof VersionPtba], version: VersionPtba) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatutVersionColor(
            version.statut_version
          )}`}
        >
          {getStatutVersionLabel(version.statut_version)}
        </span>
      ),
    },
    {
      key: "date_creation" as keyof VersionPtba,
      title: "Date de création",
      render: (value: VersionPtba[keyof VersionPtba]) => (
        <span className="text-sm">
          {new Date(String(value)).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "date_validation" as keyof VersionPtba,
      title: "Date de validation",
      render: (value: VersionPtba[keyof VersionPtba]) => (
        <span className="text-sm">
          {value ? new Date(String(value)).toLocaleDateString("fr-FR") : "-"}
        </span>
      ),
    },
    {
      key: "actions" as keyof VersionPtba,
      title: "Actions",
      render: (_: VersionPtba[keyof VersionPtba], version: VersionPtba) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(version)}
            className="p-1"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>

          {version.statut_version === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleValider(version.id_version_ptba)}
              disabled={validerMutation.isPending}
              className="p-1 text-green-600 hover:text-green-700"
              title="Valider"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}

          {version.statut_version === 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArchiver(version.id_version_ptba)}
              disabled={archiverMutation.isPending}
              className="p-1 text-orange-600 hover:text-orange-700"
              title="Archiver"
            >
              <Archive className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(version.id_version_ptba)}
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
    <div className="space-y-6">
      {/* Header */}
      {!showForm && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Gestion des versions PTBA
            </h2>
            <p className="text-gray-600 mt-1">
              Créez et gérez les différentes versions de votre PTBA
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle version
          </Button>
        </div>
      )}

      {/* Affichage conditionnel : Table ou Formulaire */}
      {showForm ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingVersion
                ? "Modifier la version PTBA"
                : "Créer une nouvelle version PTBA"}
            </h3>
            <Button
              variant="outline"
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour à la liste
            </Button>
          </div>
          <VersionPtbaForm
            version={editingVersion}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg">
          <Table<VersionPtba & { id: string | number }>
            title="Liste des versions PTBA"
            columns={columns}
            data={versions.map((v) => ({ ...v, id: v.id_version_ptba }))}
          />
        </div>
      )}
    </div>
  );
}
