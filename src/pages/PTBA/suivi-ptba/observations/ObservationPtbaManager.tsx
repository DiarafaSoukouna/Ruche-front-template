import { useState } from "react";
import { Plus } from "lucide-react";
import type { Ptba, ObservationPtba } from "../../../../types/entities";
import Button from "../../../../components/Button";
import ObservationPtbaList from "./ObservationPtbaList";
import ObservationPtbaForm from "./ObservationPtbaForm";

interface ObservationPtbaManagerProps {
  activite: Ptba;
}

export default function ObservationPtbaManager({
  activite,
}: ObservationPtbaManagerProps) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingObservation, setEditingObservation] =
    useState<ObservationPtba | null>(null);

  const handleAdd = () => {
    setEditingObservation(null);
    setView("form");
  };

  const handleEdit = (observation: ObservationPtba) => {
    setEditingObservation(observation);
    setView("form");
  };

  const handleClose = () => {
    setView("list");
    setEditingObservation(null);
  };

  const handleSuccess = () => {
    setView("list");
    setEditingObservation(null);
  };

  if (view === "form") {
    return (
      <div className="space-y-4">
        {/* Header avec bouton retour */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <Button onClick={handleClose} size="sm" variant="outline">
            ← Retour à la liste
          </Button>
          <span className="text-lg font-semibold">
            {editingObservation ? "Modifier" : "Ajouter"} une observation
          </span>
          <div className="w-24"></div> {/* Spacer pour centrer le titre */}
        </div>
        <ObservationPtbaForm
          activite={activite}
          observation={editingObservation}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header avec bouton */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Observations - {activite.intitule_activite_ptba}
        </h3>
        <Button
          onClick={handleAdd}
          size="sm"
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une observation
        </Button>
      </div>

      {/* Liste des observations */}
      <div className="px-4 pb-4">
        <ObservationPtbaList
          activiteCode={activite.code_activite_ptba}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
