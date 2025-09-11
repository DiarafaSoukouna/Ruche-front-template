import { useState } from "react";
import Modal from "../../../components/Modal";
import CadreSecteurList from "./CadreSecteurList";
import CadreSecteurForm from "./CadreSecteurForm";
import CadreSecteurDetail from "./CadreSecteurDetail";
import type { CadreSecteur } from "../../../types/entities";

export default function CadreSecteurPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCadre, setSelectedCadre] = useState<CadreSecteur | undefined>();

  const handleAdd = () => {
    setSelectedCadre(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (cadre: CadreSecteur) => {
    setSelectedCadre(cadre);
    setIsFormModalOpen(true);
  };

  const handleView = (cadre: CadreSecteur) => {
    setSelectedCadre(cadre);
    setIsDetailModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCadre(undefined);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCadre(undefined);
  };

  const handleEditFromDetail = (cadre: CadreSecteur) => {
    setIsDetailModalOpen(false);
    setSelectedCadre(cadre);
    setIsFormModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <CadreSecteurList onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={selectedCadre ? "Modifier le cadre logique" : "Nouveau cadre logique"}
        size="lg"
      >
        <CadreSecteurForm
          cadre={selectedCadre}
          onClose={handleCloseFormModal}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        title="Détail du cadre logique"
        size="xl"
      >
        {selectedCadre && (
          <CadreSecteurDetail
            cadre={selectedCadre}
            onEdit={handleEditFromDetail}
            onClose={handleCloseDetailModal}
          />
        )}
      </Modal>
    </div>
  );
}
