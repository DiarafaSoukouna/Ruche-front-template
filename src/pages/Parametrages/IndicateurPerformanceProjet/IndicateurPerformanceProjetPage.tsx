import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal";
import IndicateurPerformanceProjetList from "./IndicateurPerformanceProjetList";
import IndicateurPerformanceProjetForm from "./IndicateurPerformanceProjetForm";
import type { IndicateurPerformanceProjet } from "../../../types/entities";
import indicateurPerformanceProjetService from "../../../services/indicateurPerformanceProjetService";

type ViewMode = "list" | "form" | "detail";

export default function IndicateurPerformanceProjetPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurPerformanceProjet | null>(null);

  // Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => indicateurPerformanceProjetService.delete(id),
    onSuccess: () => {
      toast.success("Indicateur de performance supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["indicateurs-performance"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'indicateur");
    },
  });

  const handleAdd = () => {
    setSelectedIndicateur(null);
    setViewMode("form");
  };

  const handleEdit = (indicateur: IndicateurPerformanceProjet) => {
    setSelectedIndicateur(indicateur);
    setViewMode("form");
  };

  const handleDelete = (indicateur: IndicateurPerformanceProjet) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'indicateur "${indicateur.intitule_indicateur_tache}" ?\n\nCette action est irréversible.`
      )
    ) {
      deleteMutation.mutate(indicateur.id_indicateur_performance);
    }
  };

  const handleClose = () => {
    setViewMode("list");
    setSelectedIndicateur(null);
  };

  const handleSuccess = () => {
    setViewMode("list");
    setSelectedIndicateur(null);
  };

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des Indicateurs de Performance Projet
        </h1>
      </div>

      {/* Liste */}
      {viewMode === "list" && (
        <IndicateurPerformanceProjetList
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal Formulaire */}
      <Modal
        isOpen={viewMode === "form"}
        onClose={handleClose}
        title={
          selectedIndicateur
            ? "Modifier l'indicateur de performance"
            : "Ajouter un indicateur de performance"
        }
        size="xl"
      >
        <IndicateurPerformanceProjetForm
          indicateur={selectedIndicateur}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
}
