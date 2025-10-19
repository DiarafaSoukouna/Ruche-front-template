import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type {
  Ptba,
  IndicateurActivitePtba,
  SuiviIndicateurActivite,
} from "../../../../types/entities";
import Button from "../../../../components/Button";
import SuiviIndicateurList from "./SuiviIndicateurList";
import SuiviIndicateurForm from "./SuiviIndicateurForm";
import IndicateurActivitePtbaForm from "../IndicateurActivitePtbaForm";
import indicateurActivitePtbaService from "../../../../services/indicateurActivitePtbaService";
import { toast } from "react-toastify";

interface SuiviIndicateurManagerProps {
  activite: Ptba;
}

export default function SuiviIndicateurManager({
  activite,
}: SuiviIndicateurManagerProps) {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "indicateur-form" | "suivi-form">(
    "list"
  );
  const [selectedIndicateur, setSelectedIndicateur] =
    useState<IndicateurActivitePtba | null>(null);
  const [editingIndicateur, setEditingIndicateur] =
    useState<IndicateurActivitePtba | null>(null);
  const [editingSuivi, setEditingSuivi] =
    useState<SuiviIndicateurActivite | null>(null);

  // Fetch indicateurs pour cette activité
  const { data: indicateurs = [], isLoading } = useQuery<
    IndicateurActivitePtba[]
  >({
    queryKey: ["indicateurs-activite", activite.code_activite_ptba],
    queryFn: () =>
      indicateurActivitePtbaService.getByActivite(activite.code_activite_ptba),
    enabled: !!activite.code_activite_ptba,
  });

  // Mutation pour supprimer un indicateur
  const deleteMutation = useMutation({
    mutationFn: (id: number) => indicateurActivitePtbaService.delete(id),
    onSuccess: () => {
      toast.success("Indicateur supprimé avec succès");
      onMutationSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'indicateur");
    },
  });

  const onMutationSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["versions-ptba", activite.code_activite_ptba],
    });
    queryClient.invalidateQueries({
      queryKey: ["ptba", activite.code_activite_ptba],
    });
    queryClient.invalidateQueries({
      queryKey: ["indicateurs-activite", activite.code_activite_ptba],
    });
    queryClient.invalidateQueries({
      queryKey: ["indicateurs-activite-ptba-all"],
    });
  };

  const handleAddSuivi = (indicateur: IndicateurActivitePtba) => {
    setSelectedIndicateur(indicateur);
    setEditingSuivi(null);
    setView("suivi-form");
  };

  const handleEditSuivi = (suivi: SuiviIndicateurActivite) => {
    // Trouver l'indicateur associé au suivi
    const codeIndicateur =
      typeof suivi.indicateur_activite === "object" && suivi.indicateur_activite
        ? suivi.indicateur_activite.code_indicateur_activite
        : suivi.indicateur_activite;

    const indicateur = indicateurs.find(
      (ind) => ind.code_indicateur_activite === codeIndicateur
    );

    if (indicateur) {
      setSelectedIndicateur(indicateur);
      setEditingSuivi(suivi);
      setView("suivi-form");
    }
  };

  const handleCloseSuiviForm = () => {
    setView("list");
    setSelectedIndicateur(null);
    setEditingSuivi(null);
  };

  const handleSuiviFormSuccess = () => {
    setView("list");
    setSelectedIndicateur(null);
    setEditingSuivi(null);
    // Rafraîchir les suivis
    queryClient.invalidateQueries({
      queryKey: ["suivis-indicateurs-all"],
    });
  };

  const handleAddIndicateur = () => {
    setEditingIndicateur(null);
    setView("indicateur-form");
  };

  const handleEditIndicateur = (indicateur: IndicateurActivitePtba) => {
    setEditingIndicateur(indicateur);
    setView("indicateur-form");
  };

  const handleCloseIndicateurForm = () => {
    setView("list");
    setEditingIndicateur(null);
  };

  const handleIndicateurFormSuccess = () => {
    setView("list");
    setEditingIndicateur(null);
    // Rafraîchir les indicateurs
    queryClient.invalidateQueries({
      queryKey: ["indicateurs-activite", activite.code_activite_ptba],
    });
    queryClient.invalidateQueries({
      queryKey: ["indicateurs-activite-ptba-all"],
    });
  };

  const handleDeleteIndicateur = (indicateur: IndicateurActivitePtba) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'indicateur "${indicateur.intitule_indicateur_tache}" ?\n\nCette action supprimera également tous les suivis associés.`
      )
    ) {
      deleteMutation.mutate(indicateur.id_indicateur_activite);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chargement des indicateurs...
      </div>
    );
  }

  // Rendu conditionnel selon la vue
  if (view === "indicateur-form") {
    return (
      <div className="space-y-4">
        {/* Header avec bouton retour */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <Button
            onClick={handleCloseIndicateurForm}
            size="sm"
            variant="outline"
          >
            ← Retour à la liste
          </Button>
          <span className="text-lg font-semibold">
            {editingIndicateur
              ? "Modifier l'indicateur"
              : "Ajouter un indicateur"}
          </span>
          <div className="w-24"></div> {/* Spacer pour centrer le titre */}
        </div>
        <IndicateurActivitePtbaForm
          activite={activite}
          indicateur={editingIndicateur}
          onClose={handleCloseIndicateurForm}
          onSuccess={handleIndicateurFormSuccess}
        />
      </div>
    );
  }

  if (view === "suivi-form" && selectedIndicateur) {
    return (
      <div className="space-y-4">
        {/* Header avec bouton retour */}
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <Button onClick={handleCloseSuiviForm} size="sm" variant="outline">
            ← Retour à la liste
          </Button>
          <span className="text-lg font-semibold">
            {editingSuivi ? "Modifier" : "Ajouter"} un suivi -{" "}
            {selectedIndicateur.intitule_indicateur_tache}
          </span>
          <div className="w-24"></div> {/* Spacer pour centrer le titre */}
        </div>
        <SuiviIndicateurForm
          indicateur={selectedIndicateur}
          suivi={editingSuivi}
          onClose={handleCloseSuiviForm}
          onSuccess={handleSuiviFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header avec bouton */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <span className="text-lg font-semibold">Suivi des indicateurs</span>
        <Button onClick={handleAddIndicateur} size="sm" variant="primary">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un indicateur
        </Button>
      </div>

      {/* Liste des indicateurs */}
      <div className="space-y-4 p-4">
        {indicateurs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="font-medium">
              Aucun indicateur trouvé pour cette activité
            </p>
            <p className="text-sm mt-2">
              Cliquez sur "Ajouter un indicateur" pour commencer
            </p>
          </div>
        ) : (
          indicateurs.map((indicateur) => (
            <div
              key={indicateur.id_indicateur_activite}
              className="space-y-2 border border-gray-200 rounded-lg p-3"
            >
              {/* En-tête de l'indicateur */}
              <div className="bg-gray-100 px-4 py-2 rounded flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">
                    {indicateur.intitule_indicateur_tache}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    (
                    {typeof indicateur.abrege_unite === "object"
                      ? indicateur.abrege_unite?.unite_ui
                      : "Unité"}
                    )
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    Code: {indicateur.code_indicateur_activite}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleAddSuivi(indicateur)}
                    size="sm"
                    variant="primary"
                    className="flex items-center gap-1"
                    title="Ajouter un suivi"
                  >
                    <Plus className="h-4 w-4" />
                    Suivi
                  </Button>
                  <Button
                    onClick={() => handleEditIndicateur(indicateur)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    title="Modifier l'indicateur"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteIndicateur(indicateur)}
                    size="sm"
                    variant="danger"
                    className="flex items-center gap-1"
                    title="Supprimer l'indicateur"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Liste des suivis pour cet indicateur */}
              <SuiviIndicateurList
                indicateurCode={indicateur.code_indicateur_activite}
                onEdit={handleEditSuivi}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
