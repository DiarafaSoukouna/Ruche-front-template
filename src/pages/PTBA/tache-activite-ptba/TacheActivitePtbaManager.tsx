import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ListTodo } from "lucide-react";
import Button from "../../../components/Button";
import TacheActivitePtbaList from "./TacheActivitePtbaList";
import TacheActivitePtbaForm from "./TacheActivitePtbaForm";
import tacheActivitePtbaService from "../../../services/tacheActivitePtbaService";
import type { TacheActivitePtba, Ptba } from "../../../types/entities";

interface TacheActivitePtbaManagerProps {
  activite: Ptba;
  onClose: () => void;
}

export default function TacheActivitePtbaManager({
  activite,
  onClose,
}: TacheActivitePtbaManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTache, setEditingTache] = useState<TacheActivitePtba | undefined>();

  // Fetch tâches pour cette activité
  const { data: taches = [], refetch } = useQuery({
    queryKey: ["taches-activite", activite.id_ptba],
    queryFn: () => tacheActivitePtbaService.getByActivite(activite.id_ptba),
  });

  const handleAdd = () => {
    setEditingTache(undefined);
    setShowForm(true);
  };

  const handleEdit = (tache: TacheActivitePtba) => {
    setEditingTache(tache);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTache(undefined);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTache(undefined);
    refetch();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ListTodo className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestion des tâches
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activite.intitule_activite_ptba}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {activite.code_activite_ptba}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto">
          {showForm ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingTache ? "Modifier la tâche" : "Nouvelle tâche"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingTache 
                    ? "Modifiez les informations de la tâche"
                    : "Ajoutez une nouvelle tâche à cette activité"
                  }
                </p>
              </div>
              
              <TacheActivitePtbaForm
                tache={editingTache}
                idActivite={activite.id_ptba}
                onClose={handleCloseForm}
                onSuccess={handleSuccess}
              />
            </div>
          ) : (
            <div className="p-6">
              <TacheActivitePtbaList
                taches={taches}
                idActivite={activite.id_ptba}
                onEdit={handleEdit}
                onAdd={handleAdd}
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
                  <span className="font-medium">Statut:</span> {activite.statut_activite}
                </div>
                {activite.chronogramme && (
                  <div>
                    <span className="font-medium">Chronogramme:</span> {activite.chronogramme}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {taches.length} tâche(s) associée(s)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
