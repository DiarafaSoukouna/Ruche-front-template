import { useState } from "react";
import NiveauCadreStrategiqueList from "./NiveauCadreStrategiqueList";
import NiveauCadreStrategiqueForm from "./NiveauCadreStrategiqueForm";
import Modal from "../../../../components/Modal";
import type { NiveauCadreStrategique } from "../../../../types/entities";

export default function NiveauCadreStrategiquePage() {
  const [showForm, setShowForm] = useState(false);
  const [editingNiveau, setEditingNiveau] = useState<
    NiveauCadreStrategique | undefined
  >();

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNiveau(undefined);
  };

  return (
    <div>
      <NiveauCadreStrategiqueList />
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingNiveau ? "Modifier le niveau" : "Ajouter un niveau"}
        size="lg"
      >
        <NiveauCadreStrategiqueForm
          niveau={editingNiveau}
          onClose={handleCloseForm}
        />
      </Modal>
    </div>
  );
}
