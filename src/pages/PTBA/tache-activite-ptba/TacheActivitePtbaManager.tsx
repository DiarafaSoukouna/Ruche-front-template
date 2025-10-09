import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TacheActivitePtbaList from "./TacheActivitePtbaList";
import TacheActivitePtbaForm from "./TacheActivitePtbaForm";
import tacheActivitePtbaService from "../../../services/tacheActivitePtbaService";
import type { TacheActivitePtba, Ptba } from "../../../types/entities";

interface TacheActivitePtbaManagerProps {
  activite: Ptba;
}

export default function TacheActivitePtbaManager({
  activite,
}: TacheActivitePtbaManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTache, setEditingTache] = useState<
    TacheActivitePtba | undefined
  >();

  // Fetch tâches pour cette activité
  const { data: taches = [], refetch } = useQuery({
    queryKey: ["taches-activite", activite.id_ptba],
    queryFn: () => tacheActivitePtbaService.getByActivite(activite.id_ptba),
  });

  const filteredTaches = useMemo(() => {
    const vs = taches.filter((tache) => tache.id_activite === activite.id_ptba);
    return vs;
  }, [taches, activite.id_ptba]);

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
    <>
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
                  : "Ajoutez une nouvelle tâche à cette activité"}
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
              taches={filteredTaches}
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
              {filteredTaches.length} tâche(s) associée(s)
            </div>
          </div>
        </div>
      )}
    </>
  );
}
