import { useState } from "react";
import Modal from "../../../components/Modal";
import CadreStrategiqueList from "./CadreStrategiqueList";
import CadreStrategiqueForm from "./CadreStrategiqueForm";
import CadreStrategiqueDetail from "./CadreStrategiqueDetail";
import CadreStrategiqueConfigList from "./CadreStrategiqueConfigList";
import CadreStrategiqueConfigForm from "./CadreStrategiqueConfigForm";
import type { CadreStrategique, CadreStrategiqueConfig } from "../../../types/entities";

export default function CadreStrategiquePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isConfigFormOpen, setIsConfigFormOpen] = useState(false);
  const [selectedCadre, setSelectedCadre] = useState<CadreStrategique | undefined>();
  const [selectedCadreId, setSelectedCadreId] = useState<number | undefined>();
  const [selectedConfig, setSelectedConfig] = useState<CadreStrategiqueConfig | undefined>();

  const handleCreate = () => {
    setSelectedCadre(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (cadre: CadreStrategique) => {
    setSelectedCadre(cadre);
    setIsFormOpen(true);
  };

  const handleView = (cadreId: number) => {
    setSelectedCadreId(cadreId);
    setIsDetailOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCadre(undefined);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedCadreId(undefined);
  };

  const handleOpenConfig = () => {
    setIsConfigModalOpen(true);
  };

  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
    setIsConfigFormOpen(false);
    setSelectedConfig(undefined);
  };

  const handleCreateConfig = () => {
    setSelectedConfig(undefined);
    setIsConfigFormOpen(true);
  };

  const handleEditConfig = (config: CadreStrategiqueConfig) => {
    setSelectedConfig(config);
    setIsConfigFormOpen(true);
  };

  const closeConfigForm = () => {
    setIsConfigFormOpen(false);
    setSelectedConfig(undefined);
  };

  return (
    <div className="space-y-6">
      <CadreStrategiqueList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
        onOpenConfig={handleOpenConfig}
      />

      {/* Main Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          selectedCadre ? "Modifier le cadre stratégique" : "Créer un cadre stratégique"
        }
        size="lg"
      >
        <CadreStrategiqueForm cadre={selectedCadre} onClose={closeForm} />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title="Détails du cadre stratégique"
        size="lg"
      >
        {selectedCadreId && (
          <CadreStrategiqueDetail cadreId={selectedCadreId} />
        )}
      </Modal>

      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={closeConfigModal}
        title="Configurations des Cadres Stratégiques"
        size="xl"
      >
        <div className="space-y-6">
          {!isConfigFormOpen ? (
            <CadreStrategiqueConfigList
              onEdit={handleEditConfig}
              onCreate={handleCreateConfig}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {selectedConfig ? "Modifier la configuration" : "Créer une configuration"}
                </h3>
                <button
                  onClick={closeConfigForm}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Retour à la liste
                </button>
              </div>
              <CadreStrategiqueConfigForm
                config={selectedConfig}
                onClose={closeConfigForm}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
