import { useState } from "react";
import Modal from "../../../../components/Modal";
import UniteIndicateurList from "./UniteIndicateurList";
import UniteIndicateurForm from "./UniteIndicateurForm";
import type { UniteIndicateur } from "../../../../types/entities";

export default function UniteIndicateurPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnite, setSelectedUnite] = useState<
    UniteIndicateur | undefined
  >();

  const handleAdd = () => {
    setSelectedUnite(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (unite: UniteIndicateur) => {
    setSelectedUnite(unite);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUnite(undefined);
  };

  return (
    <div className="space-y-6">
      <UniteIndicateurList onAdd={handleAdd} onEdit={handleEdit} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedUnite
            ? "Modifier l'unité d'indicateur"
            : "Nouvelle unité d'indicateur"
        }
        size="md"
      >
        <UniteIndicateurForm unite={selectedUnite} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
