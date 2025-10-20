import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type {
  Ptba,
  IndicateurActivitePtba,
  SuiviIndicateurActivite,
} from "../../../../types/entities";
import Button from "../../../../components/Button";
import SuiviIndicateurList from "./SuiviIndicateurList";
import SuiviIndicateurForm from "./SuiviIndicateurForm";
import indicateurActivitePtbaService from "../../../../services/indicateurActivitePtbaService";
import suiviIndicateurActiviteService from "../../../../services/suiviIndicateurActiviteService";

interface SuiviIndicateurManagerProps {
  activite: Ptba;
}

export default function SuiviIndicateurManager({
  activite,
}: SuiviIndicateurManagerProps) {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"list" | "suivi-form">("list");
  const [selectedIndicateur, setSelectedIndicateur] =
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

  // Fetch suivis pour cette activité
  const { data: suivis = [] } = useQuery<SuiviIndicateurActivite[]>({
    queryKey: ["suivis-indicateurs-all"],
    queryFn: () => suiviIndicateurActiviteService.getAll(),
    enabled: !!activite.code_activite_ptba,
  });

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

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chargement des indicateurs...
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
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <span className="text-lg font-semibold">Suivi des indicateurs</span>
      </div>

      {/* Liste des indicateurs */}
      <div className="space-y-4 p-4">
        {indicateurs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p className="font-medium">
              Aucun indicateur trouvé pour cette activité
            </p>
            <p className="text-sm mt-2">
              Les indicateurs doivent être créés dans la section Programmation
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
                <Button
                  onClick={() => handleAddSuivi(indicateur)}
                  size="sm"
                  variant="primary"
                  className="flex items-center gap-1"
                  title="Ajouter un suivi"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un suivi
                </Button>
              </div>

              {/* Liste des suivis pour cet indicateur */}
              <SuiviIndicateurList
                suivis={suivis.filter(
                  (suivi) =>
                    (typeof suivi.indicateur_activite === "string" &&
                      suivi.indicateur_activite ===
                        indicateur.code_indicateur_activite) ||
                    (typeof suivi.indicateur_activite === "object" &&
                      suivi.indicateur_activite?.code_indicateur_activite ===
                        indicateur.code_indicateur_activite)
                )}
                onEdit={handleEditSuivi}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
