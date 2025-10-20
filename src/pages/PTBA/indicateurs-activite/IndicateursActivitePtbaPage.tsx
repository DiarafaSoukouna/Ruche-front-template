import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { IndicateurActivitePtba } from "../../../types/entities";
import indicateurActivitePtbaService from "../../../services/indicateurActivitePtbaService";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import IndicateursActivitePtbaForm from "./IndicateursActivitePtbaForm";
import { toast } from "react-toastify";

export default function IndicateursActivitePtbaPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurActivitePtba | null>(null);

  // Fetch tous les indicateurs
  const { data: indicateurs = [], isLoading } = useQuery<
    IndicateurActivitePtba[]
  >({
    queryKey: ["indicateurs-activite-ptba"],
    queryFn: () => indicateurActivitePtbaService.getAll(),
  });

  // Mutation pour supprimer un indicateur
  const deleteMutation = useMutation({
    mutationFn: (id: number) => indicateurActivitePtbaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["indicateurs-activite-ptba"],
      });
      toast.success("Indicateur supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'indicateur");
    },
  });

  const handleEdit = (indicateur: IndicateurActivitePtba) => {
    setSelectedIndicateur(indicateur);
    setShowModal(true);
  };

  const handleDelete = (indicateur: IndicateurActivitePtba) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'indicateur "${indicateur.intitule_indicateur_tache}" ?`
      )
    ) {
      deleteMutation.mutate(indicateur.id_indicateur_activite!);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIndicateur(null);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    handleCloseAddModal();
    queryClient.invalidateQueries({ queryKey: ["indicateurs-activite-ptba"] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Indicateurs d'Activités PTBA
          </h1>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Ajouter un indicateur
        </Button>
      </div>

      {/* Liste des indicateurs */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intitulé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité PTBA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unité
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {indicateurs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-gray-500">Aucun indicateur trouvé</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Cliquez sur "Ajouter un indicateur" pour commencer
                    </p>
                  </td>
                </tr>
              ) : (
                indicateurs.map((indicateur) => (
                  <tr
                    key={indicateur.id_indicateur_activite}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {indicateur.code_indicateur_activite}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {indicateur.intitule_indicateur_tache}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {typeof indicateur.activite_ptba === "string"
                        ? indicateur.activite_ptba
                        : indicateur.activite_ptba?.intitule_activite_ptba ||
                          "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof indicateur.abrege_unite === "number"
                        ? "N/A"
                        : indicateur.abrege_unite?.unite_ui || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleEdit(indicateur)}
                          size="sm"
                          variant="outline"
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(indicateur)}
                          size="sm"
                          variant="outline"
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de modification */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Modifier l'indicateur"
        size="lg"
      >
        {selectedIndicateur && (
          <IndicateursActivitePtbaForm
            indicateur={selectedIndicateur}
            onSuccess={handleFormSuccess}
            onClose={handleCloseModal}
          />
        )}
      </Modal>

      {/* Modal d'ajout */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        title="Ajouter un indicateur"
        size="lg"
      >
        <IndicateursActivitePtbaForm
          onSuccess={handleFormSuccess}
          onClose={handleCloseAddModal}
        />
      </Modal>
    </div>
  );
}
