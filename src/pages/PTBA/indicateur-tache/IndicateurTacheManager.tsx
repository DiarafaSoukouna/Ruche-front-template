import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, BarChart3 } from "lucide-react";
import Button from "../../../components/Button";
import IndicateurTacheList from "./IndicateurTacheList";
import IndicateurTacheForm from "./IndicateurTacheForm";
import IndicateurTacheDetailManager from "./IndicateurTacheDetailManager";
import indicateurTacheService from "../../../services/indicateurTacheService";
import type { IndicateurTache } from "../../../types/indicateurTache";
import type { Ptba } from "../../../types/entities";

interface IndicateurTacheManagerProps {
  activite: Ptba;
  onClose: () => void;
}

export default function IndicateurTacheManager({
  activite,
  onClose,
}: IndicateurTacheManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndicateur, setEditingIndicateur] = useState<
    IndicateurTache | undefined
  >();
  const [showDetailManager, setShowDetailManager] = useState(false);
  const [selectedIndicateur, setSelectedIndicateur] = useState<
    IndicateurTache | undefined
  >();

  // Fetch indicateurs pour cette activité
  const { data: indicateurs = [], refetch } = useQuery({
    queryKey: ["indicateurs-activite", activite.id_ptba],
    queryFn: () => indicateurTacheService.getByActivite(activite.id_ptba),
  });

  const handleAdd = () => {
    setEditingIndicateur(undefined);
    setShowForm(true);
  };

  const handleEdit = (indicateur: IndicateurTache) => {
    setEditingIndicateur(indicateur);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIndicateur(undefined);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingIndicateur(undefined);
    refetch();
  };

  const handleViewDetails = (indicateur: IndicateurTache) => {
    setSelectedIndicateur(indicateur);
    setShowDetailManager(true);
  };

  const handleCloseDetailManager = () => {
    setShowDetailManager(false);
    setSelectedIndicateur(undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestion des indicateurs
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activite.intitule_activite_ptba}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {activite.code_activite_ptba}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto">
          {showForm ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingIndicateur
                    ? "Modifier l'indicateur"
                    : "Nouvel indicateur"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingIndicateur
                    ? "Modifiez les informations de l'indicateur"
                    : "Ajoutez un nouvel indicateur de performance à cette activité"}
                </p>
              </div>

              <IndicateurTacheForm
                indicateur={editingIndicateur}
                idActivite={activite.id_ptba}
                onClose={handleCloseForm}
                onSuccess={handleSuccess}
              />
            </div>
          ) : (
            <div className="p-6">
              <IndicateurTacheList
                indicateurs={indicateurs}
                idActivite={activite.id_ptba}
                onEdit={handleEdit}
                onAdd={handleAdd}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}
        </div>

        {/* Footer avec informations sur l'activité */}
        {!showForm && (
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <div>
                  <span className="font-medium">Statut:</span>{" "}
                  {activite.statut_activite}
                </div>
                {activite.chronogramme && (
                  <div>
                    <span className="font-medium">Chronogramme:</span>{" "}
                    {activite.chronogramme}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {indicateurs.length} indicateur(s) associé(s)
              </div>
            </div>
          </div>
        )}

        {/* Modal de gestion détaillée des indicateurs */}
        {showDetailManager && selectedIndicateur && (
          <IndicateurTacheDetailManager
            indicateur={selectedIndicateur}
            activite={activite}
            onClose={handleCloseDetailManager}
          />
        )}
      </div>
    </div>
  );
}
