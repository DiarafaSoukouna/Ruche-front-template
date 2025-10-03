import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, BarChart3, Target, TrendingUp, Calendar } from "lucide-react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import type { IndicateurTache } from "../../../types/indicateurTache";
import type { Ptba, UniteIndicateur } from "../../../types/entities";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";

interface ValeurCible {
  id?: number;
  mois: string;
  valeur_cible: number;
  valeur_realisee?: number;
  anag?: string;
  type_indicateur?: string;
}

interface IndicateurTacheDetailManagerProps {
  indicateur: IndicateurTache;
  activite: Ptba;
  onClose: () => void;
}

export default function IndicateurTacheDetailManager({
  indicateur,
  activite,
  onClose,
}: IndicateurTacheDetailManagerProps) {
  const [activeTab, setActiveTab] = useState<string>("Janvier");
  
  // Mois de l'année
  const moisOptions = [
    { value: "Janvier", label: "Janvier", abbr: "Jan" },
    { value: "Février", label: "Février", abbr: "Fév" },
    { value: "Mars", label: "Mars", abbr: "Mar" },
    { value: "Avril", label: "Avril", abbr: "Avr" },
    { value: "Mai", label: "Mai", abbr: "Mai" },
    { value: "Juin", label: "Juin", abbr: "Jun" },
    { value: "Juillet", label: "Juillet", abbr: "Jul" },
    { value: "Août", label: "Août", abbr: "Aoû" },
    { value: "Septembre", label: "Septembre", abbr: "Sep" },
    { value: "Octobre", label: "Octobre", abbr: "Oct" },
    { value: "Novembre", label: "Novembre", abbr: "Nov" },
    { value: "Décembre", label: "Décembre", abbr: "Déc" },
  ];

  const [valeursCibles, setValeursCibles] = useState<ValeurCible[]>(
    moisOptions.map(mois => ({
      mois: mois.value,
      valeur_cible: 0,
      valeur_realisee: 0,
      anag: "",
      type_indicateur: "Oui/Non"
    }))
  );

  const queryClient = useQueryClient();

  // Fetch unité de mesure
  const { data: unites = [] } = useQuery({
    queryKey: ["unites-mesure"],
    queryFn: () => uniteIndicateurService.getAll(),
  });

  const unite = unites.find(
    (u: UniteIndicateur) => String(u.id_unite) === String(indicateur.unite_ind_tache)
  );

  // Mutation pour sauvegarder les valeurs cibles
  const saveValeursCiblesMutation = useMutation({
    mutationFn: async (data: ValeurCible[]) => {
      // Simuler l'API call - remplacer par le vrai service
      console.log("Sauvegarde des valeurs cibles:", data);
      return data;
    },
    onSuccess: () => {
      toast.success("Valeurs cibles sauvegardées avec succès");
      queryClient.invalidateQueries({
        queryKey: ["indicateurs-activite", activite.id_ptba],
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la sauvegarde";
      toast.error(errorMessage);
    },
  });

  const handleValeurCibleChange = (
    mois: string,
    field: keyof ValeurCible,
    value: string | number
  ) => {
    setValeursCibles((prev) =>
      prev.map((vc) =>
        vc.mois === mois ? { ...vc, [field]: value } : vc
      )
    );
  };

  const handleSave = () => {
    saveValeursCiblesMutation.mutate(valeursCibles);
  };

  const getMoisLabel = (mois: string) => {
    const moisOption = moisOptions.find(m => m.value === mois);
    return moisOption ? moisOption.label : mois;
  };

  const calculateProgress = (valeurRealisee: number, valeurCible: number) => {
    if (valeurCible === 0) return 0;
    return Math.min((valeurRealisee / valeurCible) * 100, 100);
  };

  const getTotalCible = () => {
    return valeursCibles.reduce((sum, vc) => sum + vc.valeur_cible, 0);
  };

  const getTotalRealisee = () => {
    return valeursCibles.reduce((sum, vc) => sum + (vc.valeur_realisee || 0), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestion des indicateurs
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activite.intitule_activite_ptba}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Header vert avec titre */}
        <div className="bg-green-600 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h3 className="font-medium">Indicateurs d'activités</h3>
          </div>
        </div>

        {/* Tabs des mois */}
        <div className="border-b bg-gray-50">
          <div className="flex overflow-x-auto">
            {moisOptions.map((mois) => (
              <button
                key={mois.value}
                onClick={() => setActiveTab(mois.value)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === mois.value
                    ? "border-green-600 text-green-600 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {mois.abbr}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Partie gauche - Formulaire de saisie */}
            <div className="space-y-6">
              {/* Informations de l'indicateur */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {indicateur.intitule_indicateur_tache}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Code:</span>{" "}
                    {indicateur.code_indicateur_ptba}
                  </p>
                  <p>
                    <span className="font-medium">Responsable:</span>{" "}
                    {indicateur.Responsable_ind_tache}
                  </p>
                  <p>
                    <span className="font-medium">Unité:</span>{" "}
                    {unite?.unite_ui || "Non définie"}
                  </p>
                </div>
              </div>

              {/* Formulaire pour le mois actif */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">
                  Valeurs pour {getMoisLabel(activeTab)}
                </h5>

                {/* ANAG */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ANAG
                  </label>
                  <Input
                    value={
                      valeursCibles.find((vc) => vc.mois === activeTab)
                        ?.anag || ""
                    }
                    onChange={(e) =>
                      handleValeurCibleChange(activeTab, "anag", e.target.value)
                    }
                    placeholder="Ex: nombre de sites devant abriter les aménagements"
                  />
                </div>

                {/* Type d'indicateur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'indicateur
                  </label>
                  <div className="space-y-2">
                    {/* Indicateur numérique */}
                    {unite?.definition_ui?.toLowerCase().includes("nombre") && (
                      <div>
                        <Input
                          type="number"
                          value={
                            valeursCibles.find((vc) => vc.mois === activeTab)
                              ?.valeur_cible || 0
                          }
                          onChange={(e) =>
                            handleValeurCibleChange(
                              activeTab,
                              "valeur_cible",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Valeur cible"
                        />
                      </div>
                    )}

                    {/* Indicateur Oui/Non */}
                    {!unite?.definition_ui?.toLowerCase().includes("nombre") && (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`indicateur_${activeTab}`}
                            value="Non"
                            checked={
                              valeursCibles.find((vc) => vc.mois === activeTab)
                                ?.type_indicateur === "Non"
                            }
                            onChange={(e) =>
                              handleValeurCibleChange(
                                activeTab,
                                "type_indicateur",
                                e.target.value
                              )
                            }
                            className="text-pink-500"
                          />
                          <span className="text-sm text-gray-700">Non</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`indicateur_${activeTab}`}
                            value="Oui"
                            checked={
                              valeursCibles.find((vc) => vc.mois === activeTab)
                                ?.type_indicateur === "Oui"
                            }
                            onChange={(e) =>
                              handleValeurCibleChange(
                                activeTab,
                                "type_indicateur",
                                e.target.value
                              )
                            }
                            className="text-pink-500"
                          />
                          <span className="text-sm text-gray-700">Oui</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Partie droite - Valeurs cibles et statistiques */}
            <div className="space-y-6">
              {/* Tableau des valeurs cibles */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h5 className="font-medium text-gray-900">Valeur cible</h5>
                </div>
                <div className="p-4 space-y-4">
                  {valeursCibles.map((vc) => (
                    <div
                      key={vc.mois}
                      className={`p-3 rounded border ${
                        activeTab === vc.mois
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {getMoisLabel(vc.mois)}
                        </span>
                        {unite?.definition_ui?.toLowerCase().includes("nombre") && (
                          <span className="text-lg font-bold text-gray-900">
                            {vc.valeur_cible}
                          </span>
                        )}
                      </div>
                      
                      {/* Barre de progression pour les indicateurs numériques */}
                      {unite?.definition_ui?.toLowerCase().includes("nombre") && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Réalisé: {vc.valeur_realisee || 0}</span>
                            <span>
                              {calculateProgress(
                                vc.valeur_realisee || 0,
                                vc.valeur_cible
                              ).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${calculateProgress(
                                  vc.valeur_realisee || 0,
                                  vc.valeur_cible
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Affichage pour les indicateurs Oui/Non */}
                      {!unite?.definition_ui?.toLowerCase().includes("nombre") && (
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              vc.type_indicateur === "Oui"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vc.type_indicateur || "Non défini"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistiques globales */}
              {unite?.definition_ui?.toLowerCase().includes("nombre") && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Statistiques globales
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {getTotalCible()}
                      </div>
                      <div className="text-sm text-blue-800">Total cible</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {getTotalRealisee()}
                      </div>
                      <div className="text-sm text-green-800">Total réalisé</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progression globale</span>
                      <span>
                        {calculateProgress(getTotalRealisee(), getTotalCible()).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${calculateProgress(
                            getTotalRealisee(),
                            getTotalCible()
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <Calendar className="h-4 w-4 inline mr-1" />
              Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveValeursCiblesMutation.isPending}
              >
                {saveValeursCiblesMutation.isPending
                  ? "Sauvegarde..."
                  : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
