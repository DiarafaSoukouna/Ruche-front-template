import { useState } from "react";
import Modal from "../../../../components/Modal";
import { TitrePersonnel } from "../../../../types/entities";
import TitrePersonnelForm from "./TitrePersonnelForm";
import TitrePersonnelList from "./TitrePersonnelList";

export default function TitrePersonnelPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingTitre, setEditingTitre] = useState<
    TitrePersonnel | undefined
  >();

  const handleAdd = () => {
    setEditingTitre(undefined);
    setShowModal(true);
  };

  const handleEdit = (titre: TitrePersonnel) => {
    setEditingTitre(titre);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingTitre(undefined);
  };

  return (
    <div>
      <TitrePersonnelList onAdd={handleAdd} onEdit={handleEdit} />

      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingTitre ? "Modifier le titre" : "Ajouter un titre"}
        size="md"
      >
        <TitrePersonnelForm titre={editingTitre} onClose={handleClose} />
      </Modal>
    </div>
  );
}
