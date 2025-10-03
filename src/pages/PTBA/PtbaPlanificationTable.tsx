import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Filter, Plus } from "lucide-react";
import Button from "../../components/Button";
import SelectInput from "../../components/SelectInput";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/Tabs";
import versionPtbaService from "../../services/versionPtbaService";
import ptbaService from "../../services/ptbaService";
import { planSiteService } from "../../services/planSiteService";
import { getMoisOptions } from "../../schemas/ptbaSchemas";
import type {
  VersionPtba,
  Ptba,
  PlanSite,
  TypeActivite,
} from "../../types/entities";
import { allLocalite } from "../../functions/localites/gets";
import { typeLocalite } from "../../functions/localites/types";
import typeActiviteService from "../../services/typeActiviteService";
import PtbaForm from "./activite-ptba/PtbaForm";
import TacheActivitePtbaManager from "./tache-activite-ptba/TacheActivitePtbaManager";
import IndicateurTacheManager from "./indicateur-tache/IndicateurTacheManager";

export default function PtbaPlanificationTable() {
  const [selectedPlanSite, setSelectedPlanSite] = useState<string>("");
  const [affichage, setAffichage] = useState<number>(10);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedAnneeForForm, setSelectedAnneeForForm] = useState<
    number | null
  >(null);
  const [showTacheManager, setShowTacheManager] = useState<boolean>(false);
  const [selectedActiviteForTaches, setSelectedActiviteForTaches] =
    useState<Ptba | null>(null);
  const [showIndicateurManager, setShowIndicateurManager] =
    useState<boolean>(false);
  const [selectedActiviteForIndicateurs, setSelectedActiviteForIndicateurs] =
    useState<Ptba | null>(null);

  // Fetch data
  const { data: versions = [] } = useQuery<VersionPtba[]>({
    queryKey: ["versions-ptba"],
    queryFn: versionPtbaService.getAll,
  });

  const { data: plansSites = [] } = useQuery<PlanSite[]>({
    queryKey: ["plans-sites"],
    queryFn: planSiteService.getAll,
  });

  const { data: activites = [] } = useQuery<Ptba[]>({
    queryKey: ["ptba-activites-all"],
    queryFn: ptbaService.getAll,
  });

  const { data: typesActivites = [] } = useQuery<TypeActivite[]>({
    queryKey: ["ptba-types-activites"],
    queryFn: () => typeActiviteService.getAll(),
  });

  const { data: localites = [] } = useQuery<typeLocalite[]>({
    queryKey: ["ptba-localites"],
    queryFn: () => allLocalite() as Promise<typeLocalite[]>,
  });

  // Obtenir les années uniques des versions (ordre ascendant)
  const anneesDisponibles = [
    ...new Set(versions.map((v) => v.annee_ptba)),
  ].sort((a, b) => a - b);

  // Fonction pour filtrer les activités par année
  const getActivitesByAnnee = (annee: number) => {
    const versionsDeAnnee = versions.filter((v) => v.annee_ptba === annee);
    const idsVersionsDeAnnee = versionsDeAnnee.map((v) => v.id_version_ptba);

    return activites.filter((activite) => {
      // Filtrer par année (via les versions de cette année)
      if (!idsVersionsDeAnnee.includes(activite.version_ptba)) {
        return false;
      }
      if (
        selectedPlanSite &&
        (activite.responsable?.code_ds || activite.responsable_ptba) !==
          selectedPlanSite
      ) {
        return false;
      }
      return true;
    });
  };

  // L'année par défaut est la plus récente
  const anneeParDefaut =
    anneesDisponibles.length > 0
      ? anneesDisponibles[anneesDisponibles.length - 1]
      : null;

  // Fonctions de gestion du formulaire
  const handleAddActivite = (annee: number) => {
    setSelectedAnneeForForm(annee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedAnneeForForm(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedAnneeForForm(null);
    // Rafraîchir les données
    window.location.reload();
  };

  // Fonctions de gestion des tâches
  const handleOpenTacheManager = (activite: Ptba) => {
    setSelectedActiviteForTaches(activite);
    setShowTacheManager(true);
  };

  const handleCloseTacheManager = () => {
    setShowTacheManager(false);
    setSelectedActiviteForTaches(null);
  };

  // Fonctions de gestion des indicateurs
  const handleOpenIndicateurManager = (activite: Ptba) => {
    setSelectedActiviteForIndicateurs(activite);
    setShowIndicateurManager(true);
  };

  const handleCloseIndicateurManager = () => {
    setShowIndicateurManager(false);
    setSelectedActiviteForIndicateurs(null);
  };

  // Pas besoin d'options de versions, on utilise les tabs d'années

  const planSiteOptions = [
    { value: "", label: "Tous les plans sites" },
    ...plansSites.map((ps) => ({
      value: ps.code_ds,
      label: ps.intutile_ds,
    })),
  ];

  const affichageOptions = [
    { value: 10, label: "10 éléments" },
    { value: 25, label: "25 éléments" },
    { value: 50, label: "50 éléments" },
    { value: 100, label: "100 éléments" },
  ];

  // Mois pour les colonnes
  const moisOptions = getMoisOptions();

  // Fonction pour vérifier si un mois est concerné par une activité
  const isMoisConcerne = (activite: Ptba, moisValue: string): boolean => {
    if (!activite.chronogramme) return false;
    const moisConcernes = activite.chronogramme.split(",").map((m) => m.trim());
    return moisConcernes.includes(moisValue);
  };

  return (
    <div className="space-y-6">
      {/* Tabs des années */}
      {anneesDisponibles.length > 0 && (
        <Tabs
          defaultValue={anneeParDefaut?.toString() || ""}
          className="w-full"
        >
          <TabsList className="flex w-full gap-2 h-auto p-2">
            {anneesDisponibles.map((annee) => (
              <TabsTrigger
                key={annee}
                value={annee.toString()}
                className="flex items-center gap-2 px-3 py-2 h-auto text-sm"
              >
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{annee}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {anneesDisponibles.map((annee) => (
            <TabsContent key={annee} value={annee.toString()} className="mt-6">
              {/* Header avec bouton nouvelle activité */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Activités PTBA {annee}
                  </h3>
                </div>
                <Button
                  onClick={() => handleAddActivite(annee)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle activité
                </Button>
              </div>

              {/* Filtres pour l'année sélectionnée */}
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    Filtres pour {annee}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan site
                    </label>
                    <SelectInput
                      options={planSiteOptions}
                      value={planSiteOptions.find(
                        (opt) => opt.value === selectedPlanSite
                      )}
                      onChange={(option) => {
                        if (option && !Array.isArray(option)) {
                          setSelectedPlanSite(String(option.value || ""));
                        } else {
                          setSelectedPlanSite("");
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affichage
                    </label>
                    <SelectInput
                      options={affichageOptions}
                      value={affichageOptions.find(
                        (opt) => opt.value === affichage
                      )}
                      onChange={(option) => {
                        if (option && !Array.isArray(option)) {
                          setAffichage(Number(option.value) || 10);
                        } else {
                          setAffichage(10);
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlanSite("");
                        setAffichage(10);
                      }}
                      className="w-full"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tableau de planification */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    {/* En-tête */}
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[80px]">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[120px]">
                          Source
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[300px]">
                          Activité
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[150px]">
                          Responsable
                        </th>
                        {moisOptions.map((mois) => (
                          <th
                            key={mois.value}
                            className="px-2 py-3 text-center font-medium text-gray-900 min-w-[40px]"
                            title={mois.label}
                          >
                            {mois.value}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-center font-medium text-gray-900 min-w-[80px]">
                          Tâches
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-900 min-w-[120px]">
                          Indicateurs
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-900 min-w-[100px]">
                          Coût ($)
                        </th>
                      </tr>
                    </thead>

                    {/* Corps du tableau */}
                    <tbody className="divide-y divide-gray-200">
                      {getActivitesByAnnee(annee)
                        .slice(0, affichage)
                        .map((activite: Ptba) => {
                          return (
                            <tr
                              key={activite.id_ptba}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 font-mono text-xs">
                                {activite.code_activite_ptba}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                {
                                  (typesActivites.find(
                                    (t) => t.id_type === activite.type_activite
                                  )?.intitule_type_activite || "N/A") as string
                                }
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900 text-sm">
                                  {activite.intitule_activite_ptba}
                                </div>
                                {activite.observation && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {activite.observation.length > 100
                                      ? `${activite.observation.substring(
                                          0,
                                          100
                                        )}...`
                                      : activite.observation}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                {plansSites.find(
                                  (p) => p.id_ds === activite.responsable_ptba
                                )?.intutile_ds || "Non assigné"}
                              </td>

                              {/* Colonnes des mois */}
                              {moisOptions.map((mois) => {
                                const isConcerne = isMoisConcerne(
                                  activite,
                                  mois.value
                                );
                                return (
                                  <td
                                    key={mois.value}
                                    className="px-2 py-3 text-center"
                                  >
                                    <div
                                      className={`w-6 h-6 mx-auto rounded ${
                                        isConcerne
                                          ? "bg-gray-400 text-xs flex items-center justify-center"
                                          : "bg-gray-200"
                                      }`}
                                      title={
                                        isConcerne
                                          ? `Activité prévue en ${mois.label}`
                                          : ""
                                      }
                                    ></div>
                                  </td>
                                );
                              })}

                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenTacheManager(activite)
                                  }
                                  className="text-xs"
                                >
                                  Ajouter
                                </Button>
                              </td>

                              {/* Colonne Indicateurs */}
                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenIndicateurManager(activite)
                                  }
                                  className="text-xs"
                                >
                                  Ajouter
                                </Button>
                              </td>

                              {/* Colonne Coût ($) */}
                              <td className="px-4 py-3 text-center">
                                <span className="text-xs text-gray-500">-</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Footer avec pagination info */}
                <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
                  {(() => {
                    const activitesAnnee = getActivitesByAnnee(annee);
                    return (
                      <>
                        Affichage de 1 à{" "}
                        {Math.min(affichage, activitesAnnee.length)} sur{" "}
                        {activitesAnnee.length} éléments
                        {activitesAnnee.length > affichage && (
                          <span className="ml-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAffichage((prev) => prev + 10)}
                            >
                              Suivant →
                            </Button>
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Formulaire de création d'activité */}
      {showForm && selectedAnneeForForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Nouvelle activité PTBA
                </h2>
                <Button
                  variant="outline"
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              {(() => {
                return (
                  <PtbaForm
                    onClose={handleCloseForm}
                    onSuccess={handleFormSuccess}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des tâches */}
      {showTacheManager && selectedActiviteForTaches && (
        <TacheActivitePtbaManager
          activite={selectedActiviteForTaches}
          onClose={handleCloseTacheManager}
        />
      )}

      {/* Modal de gestion des indicateurs */}
      {showIndicateurManager && selectedActiviteForIndicateurs && (
        <IndicateurTacheManager
          activite={selectedActiviteForIndicateurs}
          onClose={handleCloseIndicateurManager}
        />
      )}
    </div>
  );
}
