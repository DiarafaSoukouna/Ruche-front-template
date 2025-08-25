import { useState } from "react";
import NiveauStructureConfigList from "./NiveauStructureConfigList";
import NiveauStructureConfigForm from "./NiveauStructureConfigForm";
import type { NiveauStructureConfig } from "../../../types/entities";
import Modal from "../../../components/Modal";

export default function NiveauStructureConfigPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<NiveauStructureConfig | undefined>();

  const handleAdd = () => {
    setEditingConfig(undefined);
    setShowForm(true);
  };

  const handleEdit = (config: NiveauStructureConfig) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConfig(undefined);
  };

  return (
    <div className="p-6">
      <NiveauStructureConfigList 
        onAdd={handleAdd} 
        onEdit={(_, config) => handleEdit(config)} 
      />
      
      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingConfig ? "Modifier le niveau" : "Nouveau niveau"}
        size="lg"
      >
        <NiveauStructureConfigForm 
          config={editingConfig} 
          onClose={handleCloseForm} 
        />
      </Modal>
    </div>
  );
}
