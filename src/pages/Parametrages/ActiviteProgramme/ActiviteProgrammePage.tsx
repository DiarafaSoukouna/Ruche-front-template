import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Settings, Pencil, Trash2 } from "lucide-react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";
import ActiviteProgrammeForm from "./ActiviteProgrammeForm";
import NiveauActiviteProgrammeTableForm from "./NiveauActiviteProgrammeTableForm";
import type { ActiviteProgramme } from "../../../types/activiteProgramme";
import type { NiveauActiviteProgramme } from "../../../types/niveauActiviteProgramme";
import activiteProgrammeService from "../../../services/activiteProgrammeService";
import niveauActiviteProgrammeService from "../../../services/niveauActiviteProgrammeService";
import { useRoot } from "../../../contexts/RootContext";
import { Programme } from "../../../types/entities";

type ModalState = "form" | "niveaux";

export default function ActiviteProgrammePage() {
  const [showModal, setShowModal] = useState<ModalState | null>(null);
  const [selectedActivite, setSelectedActivite] =
    useState<ActiviteProgramme | null>(null);
  const [tabActive, setTabActive] = useState<string>("");
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>("");
  const queryClient = useQueryClient();
  const { currentProgramme }: { currentProgramme: Programme } = useRoot();

  // Fetch activités
  const { data: activites = [] } = useQuery<ActiviteProgramme[]>({
    queryKey: ["activites-programme"],
    queryFn: () =>
      activiteProgrammeService.getAll(currentProgramme?.id_programme),
  });

  // Fetch niveaux
  const { data: niveaux = [] } = useQuery<NiveauActiviteProgramme[]>({
    queryKey: ["niveaux-activite-programme"],
    queryFn: () =>
      niveauActiviteProgrammeService.getAll(currentProgramme?.code_programme),
  });

  // Trier les niveaux par nombre_niveau_ap
  const sortedNiveaux = useMemo(() => {
    return [...niveaux].sort((a, b) => a.nombre_niveau_ap - b.nombre_niveau_ap);
  }, [niveaux]);

  // Initialiser le premier onglet
  useEffect(() => {
    if (sortedNiveaux.length > 0 && tabActive === "") {
      const firstNiveau = sortedNiveaux[0];
      handleTabClick(
        firstNiveau.nombre_niveau_ap,
        firstNiveau.libelle_niveau_ap
      );
    }
  }, [sortedNiveaux, tabActive]);

  // Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => activiteProgrammeService.delete(id),
    onSuccess: () => {
      toast.success("Activité supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["activites-programme"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'activité");
    },
  });

  const handleTabClick = async (code: number, libelle: string) => {
    setTabActive(String(code));
    setAddBoutonLabel(libelle);
  };

  const handleAdd = () => {
    setSelectedActivite(null);
    setShowModal("form");
  };

  const handleEdit = (activite: ActiviteProgramme) => {
    setSelectedActivite(activite);
    setShowModal("form");
  };

  const handleDelete = (activite: ActiviteProgramme) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'activité "${activite.code_ap}" ?`
      )
    ) {
      deleteMutation.mutate(activite.id_ap);
    }
  };

  const handleClose = () => {
    setShowModal(null);
    setSelectedActivite(null);
  };

  const handleSuccess = () => {
    setShowModal(null);
    setSelectedActivite(null);
  };

  // Filtrer les activités par niveau
  const filteredActivites = useMemo(() => {
    const currentNiveau = parseInt(tabActive);
    return activites.filter((activite) => activite.niveau_ap === currentNiveau);
  }, [activites, tabActive]);

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Activités Programme
          </h1>
        </div>
        <Button
          onClick={() => setShowModal("niveaux")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Gestion des niveaux
        </Button>
      </div>

      {/* Vérifier si des niveaux existent */}
      {sortedNiveaux.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucun niveau configuré
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par configurer les niveaux d'activité programme.
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowModal("niveaux")}>
              <Settings className="h-4 w-4 mr-2" />
              Configurer les niveaux
            </Button>
          </div>
        </div>
      ) : (
        <Tabs
          key={sortedNiveaux.length}
          defaultValue={
            tabActive || String(sortedNiveaux[0]?.nombre_niveau_ap || "1")
          }
        >
          <div className="flex items-center justify-between mb-6 gap-4">
            <TabsList className="flex-1 overflow-x-auto">
              {sortedNiveaux.map((niveau) => (
                <div
                  key={niveau.id_niveau_ap}
                  onClick={() =>
                    handleTabClick(
                      niveau.nombre_niveau_ap,
                      niveau.libelle_niveau_ap
                    )
                  }
                >
                  <TabsTrigger
                    key={niveau.id_niveau_ap}
                    value={String(niveau.nombre_niveau_ap)}
                    className="whitespace-nowrap"
                  >
                    {niveau.libelle_niveau_ap}
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>

            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter {addBoutonLabel}
            </Button>
          </div>

          {sortedNiveaux.map((niveau) => (
            <TabsContent
              key={niveau.id_niveau_ap}
              value={String(niveau.nombre_niveau_ap)}
            >
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Intitulé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code Relai
                      </th>
                      {niveau.nombre_niveau_ap > 1 && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {
                            niveaux.find(
                              (n) =>
                                n.nombre_niveau_ap ===
                                niveau.nombre_niveau_ap - 1
                            )?.libelle_niveau_ap
                          }
                        </th>
                      )}
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredActivites.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-gray-500"
                        >
                          Aucune activité pour ce niveau
                        </td>
                      </tr>
                    ) : (
                      filteredActivites.map((activite) => {
                        const parentActivite =
                          typeof activite.parent_ap === "object"
                            ? activites.find(
                                (a) =>
                                  a.id_ap ===
                                  (activite.parent_ap as ActiviteProgramme)
                                    ?.id_ap
                              )
                            : activites.find(
                                (a) => a.id_ap === activite.parent_ap
                              );

                        const parentActiviteIntutile = parentActivite
                          ? parentActivite.code_ap +
                            " - " +
                            parentActivite.intutile
                          : "-";

                        return (
                          <tr key={activite.id_ap} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {activite.code_ap}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {activite.intutile}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {activite.code_relai_ap}
                            </td>
                            {niveau.nombre_niveau_ap > 1 && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {parentActiviteIntutile}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(activite)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(activite)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Modal Gestion des niveaux */}
      <Modal
        isOpen={showModal === "niveaux"}
        onClose={handleClose}
        title="Configuration des niveaux d'activité programme"
        size="xl"
      >
        <NiveauActiviteProgrammeTableForm />
      </Modal>

      {/* Modal Formulaire */}
      <Modal
        isOpen={showModal === "form"}
        onClose={handleClose}
        title={
          selectedActivite
            ? "Modifier une activité programme"
            : `Ajouter ${addBoutonLabel}`
        }
        size="xl"
      >
        <ActiviteProgrammeForm
          activite={selectedActivite}
          niveau={parseInt(tabActive)}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
}
