import { useState } from "react";
import FonctionList from "./FonctionList";
import FonctionForm from "./FonctionForm";
import Modal from "../../../../components/Modal";
import type { Fonction } from "../../../../types/entities";

export default function FonctionPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingFonction, setEditingFonction] = useState<
    Fonction | undefined
  >();

  const handleAdd = () => {
    setEditingFonction(undefined);
    setShowForm(true);
  };

  const handleEdit = (fonction: Fonction) => {
    setEditingFonction(fonction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFonction(undefined);
  };

  return (
    <div>
      <FonctionList onAdd={handleAdd} onEdit={handleEdit} />
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={
          editingFonction ? "Modifier la fonction" : "Ajouter une fonction"
        }
        size="lg"
      >
        <FonctionForm fonction={editingFonction} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
