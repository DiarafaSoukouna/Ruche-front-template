import { useState } from "react";
import TypeZoneList from "./TypeZoneList";
import TypeZoneForm from "./TypeZoneForm";
import type { TypeZone } from "../../../types/entities";

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
    <div className="p-6">
      <TypeZoneList onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <TypeZoneForm typeZone={editingTypeZone} onClose={handleCloseForm} />
      )}
    </div>
  );
}
