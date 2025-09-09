import { useState } from "react";
import PersonnelList from "./PersonnelList";
import PersonnelForm from "./PersonnelForm";
import Modal from "../../../components/Modal";
import type { Personnel } from "../../../types/entities";

export default function PersonnelPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<
    Personnel | undefined
  >();

  const handleAdd = () => {
    setEditingPersonnel(undefined);
    setShowForm(true);
  };

  const handleEdit = (personnel: Personnel) => {
    setEditingPersonnel(personnel);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPersonnel(undefined);
  };

  return (
    <div>
      <PersonnelList onAdd={handleAdd} onEdit={handleEdit} />
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={
          editingPersonnel ? "Modifier l'utilisateur" : "Ajouter un utilisateur"
        }
        size="xl"
      >
        <PersonnelForm personnel={editingPersonnel} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
