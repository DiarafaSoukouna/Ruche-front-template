import { useState } from "react";
import CibleCmrProjetList from "./CibleCmrProjetList";
import CibleCmrProjetForm from "./CibleCmrProjetForm";
import CibleCmrProjetDetail from "./CibleCmrProjetDetail";
import Modal from "../../../components/Modal";
import type { CibleCmrProjet } from "../../../types/entities";

export default function CibleCmrProjetPage() {
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingCible, setEditingCible] = useState<
    CibleCmrProjet | undefined
  >();
  const [viewingCible, setViewingCible] = useState<
    CibleCmrProjet | undefined
  >();

  const handleAdd = () => {
    setEditingCible(undefined);
    setShowForm(true);
  };

  const handleEdit = (cible: CibleCmrProjet) => {
    setEditingCible(cible);
    setShowForm(true);
  };

  const handleView = (cible: CibleCmrProjet) => {
    setViewingCible(cible);
    setShowDetail(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCible(undefined);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setViewingCible(undefined);
  };

  return (
    <div>
      <CibleCmrProjetList 
        onAdd={handleAdd} 
        onEdit={handleEdit}
        onView={handleView}
      />
      
      {/* Modal pour le formulaire */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={
          editingCible ? "Modifier la cible CMR projet" : "Ajouter une cible CMR projet"
        }
        size="lg"
      >
        <CibleCmrProjetForm 
          cible={editingCible} 
          onClose={handleCloseForm} 
        />
      </Modal>

      {/* Modal pour les détails */}
      <Modal
        isOpen={showDetail}
        onClose={handleCloseDetail}
        title="Détails de la cible CMR projet"
        size="xl"
      >
        {viewingCible && (
          <div className="p-4">
            <CibleCmrProjetDetail />
          </div>
        )}
      </Modal>
    </div>
  );
}
