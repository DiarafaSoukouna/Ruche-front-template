import { useState } from "react";
import Modal from "../../../components/Modal";
import IndicateurCadreResultatList from "./IndicateurCadreResultatList";
import IndicateurCadreResultatForm from "./IndicateurCadreResultatForm";
import IndicateurCadreResultatDetail from "./IndicateurCadreResultatDetail";
import type { IndicateurCadreResultat } from "../../../types/entities";

export default function IndicateurCadreResultatPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurCadreResultat | null>(null);
  const [selectedIndicateurId, setSelectedIndicateurId] = useState<
    number | null
  >(null);

  const handleCreate = () => {
    setSelectedIndicateur(null);
    setIsFormOpen(true);
  };

  const handleEdit = (indicateur: IndicateurCadreResultat) => {
    setSelectedIndicateur(indicateur);
    setIsFormOpen(true);
  };

  const handleView = (indicateur: IndicateurCadreResultat) => {
    setSelectedIndicateur(indicateur);
    setIsDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    if (selectedIndicateurId) {
      // We need to fetch the indicateur data or pass it differently
      // For now, we'll close detail and let the list handle the edit
      setIsDetailOpen(false);
      // The edit will be handled by the list component
    }
  };

  const handleDeleteFromDetail = () => {
    // The delete will be handled by the detail component
    // After successful delete, close the modal
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
      <IndicateurCadreResultatList
        onEdit={handleEdit}
        onAdd={handleCreate}
        onView={handleView}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          selectedIndicateur ? "Modifier l'indicateur" : "Créer un indicateur"
        }
        size="lg"
      >
        <IndicateurCadreResultatForm
          indicateur={selectedIndicateur || undefined}
          onClose={closeForm}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title="Détails de l'indicateur"
        size="lg"
      >
        {selectedIndicateurId && (
          <IndicateurCadreResultatDetail
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
