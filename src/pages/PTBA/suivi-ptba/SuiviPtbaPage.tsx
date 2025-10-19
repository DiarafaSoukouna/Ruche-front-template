import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";
import SelectInput from "../../../components/SelectInput";
import versionPtbaService from "../../../services/versionPtbaService";
import ptbaService from "../../../services/ptbaService";
import type { VersionPtba, Ptba, Programme } from "../../../types/entities";
import { useRoot } from "../../../contexts/RootContext";
import SuiviPtbaTable from "./SuiviPtbaTable";

export default function SuiviPtbaPage() {
  const [tabActive, setTabActive] = useState<string>("");
  const [selectedSousComposante, setSelectedSousComposante] =
    useState<string>("");
  const [affichage, setAffichage] = useState<number>(10);
  const { currentProgramme }: { currentProgramme: Programme } = useRoot();

  // Fetch versions PTBA
  const { data: versions = [] } = useQuery<VersionPtba[]>({
    queryKey: ["versions-ptba"],
    queryFn: versionPtbaService.getAll,
  });

  // Filtrer les versions par programme
  const filteredVersions = useMemo(() => {
    const vs = versions.filter(
      (version) =>
        version.programme === currentProgramme?.code_programme ||
        (version.programme as Programme)?.code_programme ===
          currentProgramme?.code_programme
    );
    vs.sort((a, b) => a.annee_ptba - b.annee_ptba);
    if (vs.length > 0 && !tabActive) {
      setTabActive(vs[0].id_version_ptba.toString());
    }
    return vs;
  }, [versions, currentProgramme, tabActive]);

  // Fetch activités PTBA
  const { data: activites = [] } = useQuery<Ptba[]>({
    queryKey: ["ptba"],
    queryFn: () => ptbaService.getAll(currentProgramme?.code_programme),
  });

  // Fonction pour gérer le clic sur un onglet
  const handleTabClick = (versionId: number) => {
    setTabActive(versionId.toString());
  };

  // Options d'affichage
  const affichageOptions = [
    { value: 10, label: "10 éléments" },
    { value: 25, label: "25 éléments" },
    { value: 50, label: "50 éléments" },
    { value: 100, label: "100 éléments" },
  ];

  // Filtrer les activités par version
  const getActivitesByVersion = (versionId: number) => {
    return activites.filter((activite) => activite.version_ptba === versionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suivi du PTBA</h1>
        </div>
      </div>

      {/* Filtres globaux */}
      {filteredVersions.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-Composante
              </label>
              <SelectInput
                options={[
                  { value: "", label: "-- Toutes les sous-composantes --" },
                  // TODO: Ajouter les options de sous-composantes
                ]}
                value={{
                  value: selectedSousComposante,
                  label:
                    selectedSousComposante ||
                    "-- Toutes les sous-composantes --",
                }}
                onChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    setSelectedSousComposante(String(option.value || ""));
                  } else {
                    setSelectedSousComposante("");
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
                value={affichageOptions.find((opt) => opt.value === affichage)}
                onChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    setAffichage(Number(option.value) || 10);
                  } else {
                    setAffichage(10);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs des versions */}
      {filteredVersions.length > 0 ? (
        <Tabs
          defaultValue={filteredVersions[0].id_version_ptba.toString()}
          className="w-full"
        >
          <TabsList className="flex w-full gap-2 h-auto p-2">
            {filteredVersions.map((version) => (
              <div
                key={version.id_version_ptba}
                onClick={() => handleTabClick(version.id_version_ptba)}
              >
                <TabsTrigger
                  value={version.id_version_ptba.toString()}
                  className="flex items-center gap-2 px-3 py-2 h-auto text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">
                    {version.annee_ptba} {version.version_ptba}
                  </span>
                </TabsTrigger>
              </div>
            ))}
          </TabsList>

          {filteredVersions.map((version) => (
            <TabsContent
              key={version.id_version_ptba}
              value={version.id_version_ptba.toString()}
              className="mt-6"
            >
              {/* Tableau de suivi */}
              <SuiviPtbaTable
                activites={getActivitesByVersion(version.id_version_ptba).slice(
                  0,
                  affichage
                )}
              />

              {/* Footer avec pagination info */}
              <div className="mt-4 px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
                {(() => {
                  const activitesVersion = getActivitesByVersion(
                    version.id_version_ptba
                  );
                  return (
                    <>
                      Affichage de 1 à{" "}
                      {Math.min(affichage, activitesVersion.length)} sur{" "}
                      {activitesVersion.length} activité(s)
                    </>
                  );
                })()}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="bg-card p-6 flex items-center justify-center h-full">
          <p className="text-foreground text-xl">Aucune version PTBA trouvée</p>
        </div>
      )}
    </div>
  );
}
