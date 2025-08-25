import { useState } from "react";
import ConventionList from "./ConventionList";
import ConventionForm from "./ConventionForm";
import { Convention } from "../../../types/entities";
import Modal from "../../../components/Modal";

export default function ConventionPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingConvention, setEditingConvention] = useState<
    Convention | undefined
  >();

  const handleAdd = () => {
    setEditingConvention(undefined);
    setShowForm(true);
  };

  const handleEdit = (convention: Convention) => {
    setEditingConvention(convention);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConvention(undefined);
  };

  return (
    <div className="p-6">
      <ConventionList onAdd={handleAdd} onEdit={handleEdit} />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={
          editingConvention
            ? "Modifier la convention"
            : "Ajouter une convention"
        }
        size="xl"
      >
        <ConventionForm
          convention={editingConvention}
          onClose={handleCloseForm}
        />
      </Modal>
    </div>
  );
}
