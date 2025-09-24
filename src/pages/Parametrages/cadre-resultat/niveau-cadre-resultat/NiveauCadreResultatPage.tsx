import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../../../../components/Modal";
import NiveauCadreResultatList from "./NiveauCadreResultatList";
import NiveauCadreResultatMultiForm from "./NiveauCadreResultatMultiForm";
import NiveauCadreResultatDetail from "./NiveauCadreResultatDetail";
import type { NiveauCadreResultat } from "../../../../types/entities";

export default function NiveauCadreResultatPage() {
  const [currentView, setCurrentView] = useState<"list" | "form" | "detail">(
    "list"
  );
  const [selectedNiveau, setSelectedNiveau] =
    useState<NiveauCadreResultat | null>(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleCreate = () => {
    setSelectedNiveau(null);
    setCurrentView("form");
  };

  const handleEdit = (niveau: NiveauCadreResultat) => {
    setSelectedNiveau(niveau);
    setCurrentView("form");
  };

  const handleView = (niveauId: number) => {
    setSelectedNiveauId(niveauId);
    setCurrentView("detail");
  };

  const handleBack = () => {
    setCurrentView("list");
    setSelectedNiveau(null);
    setSelectedNiveauId(null);
  };

  const handleSuccess = () => {
    // Actualiser les données
    queryClient.invalidateQueries({ queryKey: ["niveauxCadreResultat"] });
  };

  const handleEditFromDetail = () => {
    if (selectedNiveauId) {
      setCurrentView("form");
      // Vous pourriez vouloir charger les données du niveau ici
    }
  };

  const handleDeleteFromDetail = () => {
    setCurrentView("list");
    setSelectedNiveauId(null);
  };

  // Rendu conditionnel basé sur la vue actuelle
  if (currentView === "form") {
    return (
      <NiveauCadreResultatMultiForm
        onBack={handleBack}
        onSuccess={handleSuccess}
        editingNiveau={selectedNiveau || undefined}
      />
    );
  }

  if (currentView === "detail" && selectedNiveauId) {
    return (
      <div className="space-y-6">
        <Modal
          isOpen={true}
          onClose={handleBack}
          title="Détails du niveau de cadre de résultat"
          size="lg"
        >
          <NiveauCadreResultatDetail
            niveauId={selectedNiveauId}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
            onClose={handleBack}
          />
        </Modal>
      </div>
    );
  }

  // Vue par défaut : liste
  return (
    <div className="space-y-6">
      <NiveauCadreResultatList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />
    </div>
  );
}
