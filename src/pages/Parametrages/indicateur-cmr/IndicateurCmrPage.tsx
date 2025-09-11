import { useState } from "react";
import Modal from "../../../components/Modal";
import IndicateurCmrList from "./IndicateurCmrList";
import IndicateurCmrForm from "./IndicateurCmrForm";
import IndicateurCmrDetail from "./IndicateurCmrDetail";
import type { IndicateurCmr } from "../../../types/entities";

export default function IndicateurCmrPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurCmr | null>(null);
  const [selectedIndicateurId, setSelectedIndicateurId] = useState<
    number | null
  >(null);

  const handleCreate = () => {
    setSelectedIndicateur(null);
    setIsFormOpen(true);
  };

  const handleEdit = (indicateur: IndicateurCmr) => {
    setSelectedIndicateur(indicateur);
    setIsFormOpen(true);
  };

  const handleView = (indicateurId: number) => {
    setSelectedIndicateurId(indicateurId);
    setIsDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    if (selectedIndicateurId) {
      setIsDetailOpen(false);
    }
  };

  const handleDeleteFromDetail = () => {
    setIsDetailOpen(false);
    setSelectedIndicateurId(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedIndicateur(null);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedIndicateurId(null);
  };

  return (
    <div className="space-y-6">
      <IndicateurCmrList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          selectedIndicateur
            ? "Modifier l'indicateur CMR"
            : "Créer un indicateur CMR"
        }
        size="lg"
      >
        <IndicateurCmrForm
          indicateur={selectedIndicateur || undefined}
          onClose={closeForm}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title="Détails de l'indicateur CMR"
        size="lg"
      >
        {selectedIndicateurId && (
          <IndicateurCmrDetail
            indicateurId={selectedIndicateurId}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
            onClose={closeDetail}
          />
        )}
      </Modal>
    </div>
  );
}
