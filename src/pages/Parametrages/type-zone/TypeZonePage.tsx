import { useState } from "react";
import TypeZoneList from "./TypeZoneList";
import TypeZoneForm from "./TypeZoneForm";
import type { TypeZone } from "../../../types/entities";
import Modal from "../../../components/Modal";

export default function TypeZonePage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTypeZone, setEditingTypeZone] = useState<
    TypeZone | undefined
  >();

  const handleAdd = () => {
    setEditingTypeZone(undefined);
    setShowForm(true);
  };

  const handleEdit = (typeZone: TypeZone) => {
    setEditingTypeZone(typeZone);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTypeZone(undefined);
  };

  return (
    <div>
      <TypeZoneList onAdd={handleAdd} onEdit={handleEdit} />
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={
          editingTypeZone
            ? "Modifier le type de zone"
            : "Ajouter un type de zone"
        }
        size="md"
      >
        <TypeZoneForm typeZone={editingTypeZone} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
