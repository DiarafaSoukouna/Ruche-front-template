import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  Ptba,
  IndicateurActivitePtba,
  SuiviIndicateurActivite,
} from "../../../types/entities";
import Modal from "../../../components/Modal";
import SuiviIndicateurManager from "./suivi-indicateur/SuiviIndicateurManager";
import ObservationPtbaManager from "./observations/ObservationPtbaManager";
import suiviIndicateurActiviteService from "../../../services/suiviIndicateurActiviteService";
import indicateurActivitePtbaService from "../../../services/indicateurActivitePtbaService";

interface SuiviPtbaTableProps {
  activites: Ptba[];
}

export default function SuiviPtbaTable({ activites }: SuiviPtbaTableProps) {
  const [selectedActivite, setSelectedActivite] = useState<Ptba | null>(null);
  const [showSuiviModal, setShowSuiviModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [observationActivite, setObservationActivite] = useState<Ptba | null>(
    null
  );

  // Récupérer tous les suivis pour calculer les pourcentages
  const { data: allSuivis = [] } = useQuery<SuiviIndicateurActivite[]>({
    queryKey: ["suivis-indicateurs-all"],
    queryFn: () => suiviIndicateurActiviteService.getAll(),
  });

  const { data: allIndicateurs = [] } = useQuery<IndicateurActivitePtba[]>({
    queryKey: ["indicateurs-activite-ptba-all"],
    queryFn: () => indicateurActivitePtbaService.getAll(),
  });

  const handleIndicateurClick = (activite: Ptba) => {
    setSelectedActivite(activite);
    setShowSuiviModal(true);
  };

  const handleCloseSuiviModal = () => {
    setShowSuiviModal(false);
    setSelectedActivite(null);
  };

  const handleObservationClick = (activite: Ptba) => {
    setObservationActivite(activite);
    setShowObservationModal(true);
  };

  const handleCloseObservationModal = () => {
    setShowObservationModal(false);
    setObservationActivite(null);
  };

  /**
   * Calcule le pourcentage de réalisation d'une activité basé sur ses indicateurs
   * Formule : (somme des valeurs réalisées / nombre d'indicateurs) * 100
   */
  const calculatePercentage = (activite: Ptba): number => {
    // Récupérer les indicateurs de l'activité
    const indicateurs = allIndicateurs.filter((indicateur) =>
      typeof indicateur.activite_ptba === "string"
        ? indicateur.activite_ptba
        : indicateur.activite_ptba?.code_activite_ptba ===
          activite.code_activite_ptba
    );

    if (!Array.isArray(indicateurs) || indicateurs.length === 0) {
      return 0; // Pas d'indicateurs = 0%
    }

    let totalRealisation = 0;
    let nombreIndicateursAvecSuivi = 0;

    // Pour chaque indicateur, calculer sa réalisation
    indicateurs.forEach((indicateur: IndicateurActivitePtba) => {
      const codeIndicateur = indicateur.code_indicateur_activite;

      // Trouver les suivis de cet indicateur
      const suivisIndicateur = allSuivis.filter((suivi) => {
        const suiviCode =
          typeof suivi.indicateur_activite === "string"
            ? suivi.indicateur_activite
            : suivi.indicateur_activite?.code_indicateur_activite;
        return suiviCode === codeIndicateur;
      });

      if (suivisIndicateur.length > 0) {
        // Calculer la moyenne des valeurs de suivi pour cet indicateur
        const sommeValeurs = suivisIndicateur.reduce(
          (sum, suivi) => sum + (suivi.valeur_suivi_indicateur || 0),
          0
        );
        const moyenneIndicateur = sommeValeurs / suivisIndicateur.length;

        // Convertir en pourcentage (si la valeur est entre 0 et 1, multiplier par 100)
        const pourcentageIndicateur =
          suivisIndicateur.length > 1 && moyenneIndicateur <= 1
            ? moyenneIndicateur * 100
            : moyenneIndicateur;

        totalRealisation += pourcentageIndicateur;
        nombreIndicateursAvecSuivi++;
      }
    });

    // Si aucun indicateur n'a de suivi, retourner 0%
    if (nombreIndicateursAvecSuivi === 0) {
      return 0;
    }

    // Calculer le pourcentage moyen de réalisation
    const pourcentageMoyen = totalRealisation / nombreIndicateursAvecSuivi;

    // Arrondir et limiter entre 0 et 100
    return Math.min(Math.max(Math.round(pourcentageMoyen), 0), 100);
  };

  // Fonction pour obtenir la couleur de la barre de progression
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-600";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-red-600";
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* En-tête */}
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[150px]">
                  Code
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[300px]">
                  Activité
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[120px]">
                  Période
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900 min-w-[150px]">
                  Indicateurs
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[150px]">
                  Observations
                </th>
              </tr>
            </thead>

            {/* Corps du tableau */}
            <tbody className="divide-y divide-gray-200">
              {activites.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Aucune activité trouvée
                  </td>
                </tr>
              ) : (
                activites.map((activite) => {
                  const percentage = calculatePercentage(activite);
                  const progressColor = getProgressColor(percentage);

                  return (
                    <tr key={activite.id_ptba} className="hover:bg-gray-50">
                      {/* Code */}
                      <td className="px-4 py-3 font-mono text-xs">
                        {activite.code_activite_ptba || "N/A"}
                      </td>

                      {/* Activité */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">
                          {activite.intitule_activite_ptba}
                        </div>
                      </td>

                      {/* Période */}
                      <td className="px-4 py-3 text-xs">
                        {activite.chronogramme
                          ? activite.chronogramme.split(",")[0] +
                            " - " +
                            activite.chronogramme.split(",")[
                              activite.chronogramme.split(",").length - 1
                            ]
                          : "N/A"}
                      </td>

                      {/* Indicateurs avec barre de progression */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleIndicateurClick(activite)}
                          className="w-full cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                              <div
                                className={`${progressColor} h-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-300`}
                                style={{ width: `${percentage}%` }}
                              >
                                {percentage > 20 && `${percentage}%`}
                              </div>
                            </div>
                            {percentage <= 20 && (
                              <span className="text-xs font-semibold text-gray-700">
                                {percentage}%
                              </span>
                            )}
                          </div>
                        </button>
                      </td>

                      {/* Observations */}
                      <td className="px-4 py-3 text-xs">
                        <button
                          onClick={() => handleObservationClick(activite)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          Observations
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de suivi des indicateurs */}
      <Modal
        isOpen={showSuiviModal}
        onClose={handleCloseSuiviModal}
        title={
          selectedActivite
            ? `${selectedActivite.code_activite_ptba}: ${selectedActivite.intitule_activite_ptba}`
            : "Suivi des indicateurs"
        }
        size="xl"
      >
        {selectedActivite && (
          <SuiviIndicateurManager activite={selectedActivite} />
        )}
      </Modal>

      {/* Modal des observations */}
      <Modal
        isOpen={showObservationModal}
        onClose={handleCloseObservationModal}
        title="Observations"
        size="lg"
      >
        {observationActivite && (
          <ObservationPtbaManager activite={observationActivite} />
        )}
      </Modal>
    </>
  );
}
