import { useState } from "react";
import PersonnelList from "./PersonnelList";
import PersonnelForm from "./PersonnelForm";
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
    <div className="p-6">
      <PersonnelList onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <PersonnelForm personnel={editingPersonnel} onClose={handleCloseForm} />
      )}
    </div>
  );
}
