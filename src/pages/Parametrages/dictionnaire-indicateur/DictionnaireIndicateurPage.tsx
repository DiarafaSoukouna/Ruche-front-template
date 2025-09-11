import { useState } from "react";
import Modal from "../../../components/Modal";
import DictionnaireIndicateurList from "./DictionnaireIndicateurList";
import DictionnaireIndicateurForm from "./DictionnaireIndicateurForm";
import DictionnaireIndicateurDetail from "./DictionnaireIndicateurDetail";
import type { DictionnaireIndicateur } from "../../../types/entities";

export default function DictionnaireIndicateurPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDictionnaire, setSelectedDictionnaire] =
    useState<DictionnaireIndicateur | null>(null);

  const handleCreate = () => {
    setSelectedDictionnaire(null);
    setIsFormOpen(true);
  };

  const handleEdit = (dictionnaire: DictionnaireIndicateur) => {
    setSelectedDictionnaire(dictionnaire);
    setIsFormOpen(true);
  };

  const handleView = (dictionnaire: DictionnaireIndicateur) => {
    setSelectedDictionnaire(dictionnaire);
    setIsDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    if (selectedDictionnaire) {
      setIsDetailOpen(false);
      handleEdit(selectedDictionnaire);
    }
  };

  const handleDeleteFromDetail = () => {
    setIsDetailOpen(false);
    setSelectedDictionnaire(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedDictionnaire(null);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedDictionnaire(null);
  };

  return (
    <div className="space-y-6">
      <DictionnaireIndicateurList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          selectedDictionnaire
            ? "Modifier l'indicateur"
            : "Ajouter un indicateur"
        }
        size="lg"
      >
        <DictionnaireIndicateurForm
          dictionnaire={selectedDictionnaire || undefined}
          onClose={closeForm}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title="Détails de l'indicateur"
        size="lg"
      >
        {selectedDictionnaire && (
          <DictionnaireIndicateurDetail
            dictionnaireId={selectedDictionnaire.id_ref_ind_ref}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
            onClose={closeDetail}
          />
        )}
      </Modal>
    </div>
  );
}
