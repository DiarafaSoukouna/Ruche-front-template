import { useState } from "react";
import Modal from "../../../components/Modal";
import IndicateurCmrList from "./IndicateurCmrList";
import IndicateurCmrForm from "./IndicateurCmrForm";
import IndicateurCmrDetail from "./IndicateurCmrDetail";
import type { IndicateurCmr, CibleCmrProjet } from "../../../types/entities";
import CibleCmrProjetList from "./cible-cmr-projet/CibleCmrProjetList";
import CibleCmrProjetForm from "./cible-cmr-projet/CibleCmrProjetForm";
import CibleCmrProjetDetail from "./cible-cmr-projet/CibleCmrProjetDetail";

export default function IndicateurCmrPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCiblesCmrOpen, setIsCiblesCmrOpen] = useState(false);
  const [isCibleFormOpen, setIsCibleFormOpen] = useState(false);
  const [isCibleDetailOpen, setIsCibleDetailOpen] = useState(false);
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurCmr | null>(null);
  const [selectedIndicateurId, setSelectedIndicateurId] = useState<
    number | null
  >(null);
  const [selectedCible, setSelectedCible] = useState<CibleCmrProjet | null>(null);
  const [viewingCible, setViewingCible] = useState<CibleCmrProjet | null>(null);

  const handleCreate = () => {
    setSelectedIndicateur(null);
    setIsFormOpen(true);
  };

  const handleEdit = (indicateur: IndicateurCmr) => {
    setSelectedIndicateur(indicateur);
    setIsFormOpen(true);
  };

  const handleView = (indicateurId: number) => {
    setSelectedIndicateurId(indicateurId);
    setIsDetailOpen(true);
  };

  const handleEditFromDetail = () => {
    if (selectedIndicateurId) {
      setIsDetailOpen(false);
    }
  };

  const handleDeleteFromDetail = () => {
    setIsDetailOpen(false);
    setSelectedIndicateurId(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedIndicateur(null);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedIndicateurId(null);
  };

  const handleOpenCiblesCmr = () => {
    setIsCiblesCmrOpen(true);
    setSelectedIndicateurId(null);
  };

  // Handlers pour les cibles CMR
  const handleAddCible = () => {
    setSelectedCible(null);
    setIsCiblesCmrOpen(false);
    setIsCibleFormOpen(true);
  };

  const handleEditCible = (cible: CibleCmrProjet) => {
    setSelectedCible(cible);
    setIsCiblesCmrOpen(false);
    setIsCibleFormOpen(true);
  };

  const handleViewCible = (cible: CibleCmrProjet) => {
    setViewingCible(cible);
    setIsCiblesCmrOpen(false);
    setIsCibleDetailOpen(true);
  };

  const closeCibleForm = () => {
    setIsCibleFormOpen(false);
    setSelectedCible(null);
    setIsCiblesCmrOpen(true); // Retour à la liste des cibles
  };

  const closeCibleDetail = () => {
    setIsCibleDetailOpen(false);
    setViewingCible(null);
    setIsCiblesCmrOpen(true); // Retour à la liste des cibles
  };

  return (
    <div className="space-y-6">
      <IndicateurCmrList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
        onOpenCiblesCmr={handleOpenCiblesCmr}
      />

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          selectedIndicateur
            ? "Modifier l'indicateur CMR"
            : "Créer un indicateur CMR"
        }
        size="lg"
      >
        <IndicateurCmrForm
          indicateur={selectedIndicateur || undefined}
          onClose={closeForm}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title="Détails de l'indicateur CMR"
        size="lg"
      >
        {selectedIndicateurId && (
          <IndicateurCmrDetail
            indicateurId={selectedIndicateurId}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
            onClose={closeDetail}
          />
        )}
      </Modal>

      {/* Cibles CMR List Modal */}
      <Modal
        isOpen={isCiblesCmrOpen}
        onClose={() => setIsCiblesCmrOpen(false)}
        title="Cibles CMR"
        size="xl"
      >
        <CibleCmrProjetList
          onAdd={handleAddCible}
          onEdit={handleEditCible}
          onView={handleViewCible}
        />
      </Modal>

      {/* Cible CMR Form Modal */}
      <Modal
        isOpen={isCibleFormOpen}
        onClose={closeCibleForm}
        title={
          selectedCible
            ? "Modifier la cible CMR projet"
            : "Ajouter une cible CMR projet"
        }
        size="lg"
      >
        <CibleCmrProjetForm cible={selectedCible || undefined} onClose={closeCibleForm} />
      </Modal>

      {/* Cible CMR Detail Modal */}
      <Modal
        isOpen={isCibleDetailOpen}
        onClose={closeCibleDetail}
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
