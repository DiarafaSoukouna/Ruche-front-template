import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Settings, Edit2, TrashIcon } from "lucide-react";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";
import ActiviteProjetForm from "./ActiviteProjetForm";
import NiveauActiviteProjetTableForm from "./NiveauActiviteProjetTableForm";
import type {
  ActiviteProjet,
  NiveauActiviteProjet,
} from "../../../types/entities";
import activiteProjetService from "../../../services/activiteProjetService";
import niveauActiviteProjetService from "../../../services/niveauActiviteProjetService";
import { AxiosError } from "axios";

type ModalState = "form" | "niveaux";

export default function ActiviteProjetPage() {
  const [showModal, setShowModal] = useState<ModalState | null>(null);
  const [selectedActivite, setSelectedActivite] =
    useState<ActiviteProjet | null>(null);
  const [tabActive, setTabActive] = useState<string>("");
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch niveaux
  const { data: niveaux = [] } = useQuery<NiveauActiviteProjet[]>({
    queryKey: ["niveaux-activite-projet"],
    queryFn: niveauActiviteProjetService.getAll,
  });

  // Fetch activités
  const { data: activites = [] } = useQuery<ActiviteProjet[]>({
    queryKey: ["activites-projet"],
    queryFn: activiteProjetService.getAll,
  });

  // Trier les niveaux par nombre
  const sortedNiveaux = useMemo(() => {
    return [...niveaux].sort(
      (a, b) =>
        a.nombre_niveau_activite_projet - b.nombre_niveau_activite_projet
    );
  }, [niveaux]);

  // Définir le premier niveau par défaut
  useEffect(() => {
    if (sortedNiveaux.length > 0 && tabActive === "") {
      const firstNiveau = sortedNiveaux[0];
      handleTabClick(
        firstNiveau.nombre_niveau_activite_projet,
        firstNiveau.libelle_niveau_activite_projet
      );
    }
  }, [sortedNiveaux, tabActive]);

  // Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: (id: number) => activiteProjetService.delete(id),
    onSuccess: () => {
      toast.success("Activité supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["activites-projet"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression de l'activité"
      );
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

  const handleEdit = (activite: ActiviteProjet) => {
    setSelectedActivite(activite);
    setShowModal("form");
  };

  const handleDelete = (activite: ActiviteProjet) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer l'activité "${activite.code_activite_projet}" ?`
      )
    ) {
      deleteMutation.mutate(activite.id_activite_projet);
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
    return activites.filter(
      (activite) => activite.niveau_activite_projet === currentNiveau
    );
  }, [activites, tabActive]);

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Activités Projet
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

      {/* Vérifier si des niveaux sont configurés */}
      {sortedNiveaux.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Settings className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Configuration requise
          </h3>
          <p className="text-yellow-700 mb-4">
            Veuillez d'abord configurer les niveaux d'activité projet avant de
            pouvoir ajouter des activités.
          </p>
          <Button onClick={() => setShowModal("niveaux")} variant="primary">
            <Settings className="h-4 w-4 mr-2" />
            Configurer les niveaux
          </Button>
        </div>
      ) : (
        <Tabs
          key={sortedNiveaux.length}
          defaultValue={
            tabActive ||
            String(sortedNiveaux[0]?.nombre_niveau_activite_projet || "1")
          }
          className="w-full"
        >
          {/* Tabs Header avec bouton Ajouter */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <TabsList className="flex-1 overflow-x-auto">
              {sortedNiveaux.map((niveau) => (
                <div
                  key={niveau.id_niveau_activite_projet}
                  onClick={() =>
                    handleTabClick(
                      niveau.nombre_niveau_activite_projet,
                      niveau.libelle_niveau_activite_projet
                    )
                  }
                >
                  <TabsTrigger
                    key={niveau.id_niveau_activite_projet}
                    value={String(niveau.nombre_niveau_activite_projet)}
                    className="whitespace-nowrap"
                  >
                    {niveau.libelle_niveau_activite_projet}
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>

            <Button onClick={handleAdd} variant="primary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter {addBoutonLabel}
            </Button>
          </div>

          {/* Tabs Content */}
          {sortedNiveaux.map((niveau) => (
            <TabsContent
              key={niveau.id_niveau_activite_projet}
              value={String(niveau.nombre_niveau_activite_projet)}
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
                      {niveau.nombre_niveau_activite_projet > 1 && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {
                            niveaux.find(
                              (n) =>
                                n.nombre_niveau_activite_projet ===
                                niveau.nombre_niveau_activite_projet - 1
                            )?.libelle_niveau_activite_projet
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
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Aucune activité pour ce niveau
                        </td>
                      </tr>
                    ) : (
                      filteredActivites.map((activite) => {
                        const parentActivite =
                          typeof activite.parent_activite_projet === "object" &&
                          activite.parent_activite_projet
                            ? activites.find(
                                (a) =>
                                  a.id_activite_projet ===
                                  activite.parent_activite_projet
                              )
                            : activites.find(
                                (a) =>
                                  a.id_activite_projet ===
                                  activite.parent_activite_projet
                              );

                        const parentActiviteIntitule = parentActivite
                          ? parentActivite.code_activite_projet +
                            " - " +
                            parentActivite.intitule_activite_projet
                          : "-";

                        return (
                          <tr
                            key={activite.id_activite_projet}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {activite.code_activite_projet}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {activite.intitule_activite_projet}
                            </td>
                            {niveau.nombre_niveau_activite_projet > 1 && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {parentActiviteIntitule}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleEdit(activite)}
                                  variant="outline"
                                  title="Modifier"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(activite)}
                                  variant="outline"
                                  className="text-red-600 hover:text-red-900"
                                  title="Supprimer"
                                >
                                  <TrashIcon className="h-4 w-4" />
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

      {/* Modal Gestion des Niveaux */}
      <Modal
        isOpen={showModal === "niveaux"}
        onClose={handleClose}
        title="Configuration des niveaux d'activité projet"
        size="xl"
      >
        <NiveauActiviteProjetTableForm />
      </Modal>

      {/* Modal Formulaire */}
      <Modal
        isOpen={showModal === "form"}
        onClose={handleClose}
        title={
          selectedActivite
            ? "Modifier une activité projet"
            : `Ajouter ${addBoutonLabel}`
        }
        size="xl"
      >
        <ActiviteProjetForm
          activite={selectedActivite}
          niveau={parseInt(tabActive)}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
}
