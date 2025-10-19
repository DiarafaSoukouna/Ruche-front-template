import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  EditIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import NiveauCadreStrategiqueTableForm from "./NiveauCadreStrategiqueTableForm";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { RiseLoader } from "react-spinners";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirModal";
import type {
  CadreStrategique,
  NiveauCadreStrategique,
  Programme,
} from "../../../types/entities";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";
import { niveauCadreStrategiqueService } from "../../../services/niveauCadreStrategiqueService";
import CadreStrategiqueForm from "./CadreStrategiqueForm";
import { useRoot } from "../../../contexts/RootContext";

const CadreStrategiquePage: React.FC = () => {
  const [niveauCadreStrategiques, setNiveauCadreStrategiques] = useState<
    NiveauCadreStrategique[]
  >([]);
  const [cadreStrategiques, setCadreStrategiques] = useState<
    CadreStrategique[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setLoadingNiv] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<CadreStrategique>();
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>("");
  const [tabActive, setTabActive] = useState<string>("");
  const [loadNiveau, setLoadNiveau] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const { currentProgramme } = useRoot();
  const filteredNiveauCadreStrategiques = useMemo(() => {
    if (!currentProgramme) return niveauCadreStrategiques;
    return niveauCadreStrategiques.filter(
      (niveau) =>
        niveau.programme === currentProgramme.code_programme ||
        (niveau.programme as Programme)?.code_programme ===
          currentProgramme.code_programme
    );
  }, [niveauCadreStrategiques, currentProgramme]);

  const AllNiveau = useCallback(async () => {
    setLoadingNiv(true);
    try {
      const res = await niveauCadreStrategiqueService.getAll();
      setNiveauCadreStrategiques(res);
      // La sélection du premier niveau par défaut est maintenant gérée dans useEffect
    } catch (error) {
      toast.error(
        "Erreur lors de la récupération des niveaux du cadre stratégique"
      );
      console.log("error", error);
    } finally {
      setLoadingNiv(false);
    }
  }, []);

  const DeleteCadreStrategique = async (id: number) => {
    setLoading(true);
    try {
      await cadreStrategiqueService.delete(id);
      toast.success("Cadre stratégique supprimé avec succès");
      setIsDelete(false);
      getCadreStrategiques();
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression du cadre stratégique");
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleTabClick = async (code: number, libelle: string) => {
    setTabActive(String(code));
    setAddBoutonLabel(libelle);
  };

  const getCadreStrategiques = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cadreStrategiqueService.getAll(
        currentProgramme?.id_programme
      );
      setCadreStrategiques(res);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setLoading(false);
    }
  }, [currentProgramme?.id_programme]);

  useEffect(() => {
    getCadreStrategiques();
    AllNiveau();
  }, [AllNiveau, getCadreStrategiques]); // Exécuter seulement au montage du composant

  // Effet séparé pour définir le premier niveau par défaut
  useEffect(() => {
    if (niveauCadreStrategiques.length > 0 && tabActive === "") {
      const firstNiveau = niveauCadreStrategiques[0];
      handleTabClick(firstNiveau.code_number_nsc, firstNiveau.libelle_nsc);
    }
  }, [niveauCadreStrategiques, tabActive]);

  const handleAddForm = (bool: boolean) => {
    setShowForm(bool);
    setEditRow(undefined);
  };

  const handleDelete = (cadre: CadreStrategique) => {
    setIsDelete(true);
    setEditRow(cadre);
  };

  const getParentHierarchy = (cadre: CadreStrategique) => {
    const hierarchy = new Set<CadreStrategique | number>();
    let currentParent = cadre.parent_cs;
    while (currentParent) {
      if (typeof currentParent === "object") {
        hierarchy.add(currentParent);
        currentParent = currentParent.parent_cs;
      } else {
        const parent = cadreStrategiques.find((c) => c.id_cs === currentParent);
        if (parent) {
          hierarchy.add(parent);
          currentParent = parent.parent_cs;
        }
      }
    }
    return hierarchy;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cadre stratégique</h1>
        <Button variant="outline" onClick={() => setLoadNiveau(true)}>
          <MapPinIcon className="w-4 h-4 mr-2" />
          Gestion des niveaux
        </Button>
      </div>

      <Modal
        onClose={() => setLoadNiveau(false)}
        isOpen={loadNiveau}
        title="Configuration des niveaux du cadre stratégique"
        size="xl"
      >
        <NiveauCadreStrategiqueTableForm />
      </Modal>

      {niveauCadreStrategiques.length > 0 && (
        <Tabs
          key={niveauCadreStrategiques.length}
          defaultValue={tabActive || "1"}
        >
          <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="flex space-x-2">
              {filteredNiveauCadreStrategiques.length > 0
                ? filteredNiveauCadreStrategiques.map(
                    (nivLib: NiveauCadreStrategique) => (
                      <div
                        key={nivLib.id_nsc}
                        onClick={() =>
                          handleTabClick(
                            nivLib.code_number_nsc,
                            nivLib.libelle_nsc
                          )
                        }
                      >
                        <TabsTrigger value={String(nivLib.code_number_nsc)}>
                          {nivLib.libelle_nsc}
                        </TabsTrigger>
                      </div>
                    )
                  )
                : "Niveaux du cadre stratégique non disponibles"}
            </TabsList>

            <div className="flex gap-3 items-center">
              <div className="relative">
                <SearchIcon
                  size={16}
                  className="absolute left-3 top-2 text-gray-400"
                />
                <input
                  type="text"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Rechercher..."
                />
              </div>
              {niveauCadreStrategiques.length > 0 && (
                <Button onClick={() => handleAddForm(true)}>
                  <PlusIcon size={16} className="mr-2" />
                  Ajouter {addBoutonLabel}
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <RiseLoader color="green" />
            </div>
          ) : (
            filteredNiveauCadreStrategiques.map(
              (nivLib: NiveauCadreStrategique) => (
                <TabsContent
                  key={nivLib.id_nsc}
                  value={String(nivLib.code_number_nsc)}
                >
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Libellé
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Abrégé
                          </th>
                          {niveauCadreStrategiques
                            .slice(0, Number(tabActive) - 1)
                            .map((niv) => (
                              <th
                                key={niv.id_nsc}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase"
                              >
                                {niv.libelle_nsc}
                              </th>
                            ))}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cadreStrategiques.length > 0 ? (
                          cadreStrategiques
                            .filter(
                              (cadre) =>
                                cadre.niveau_cs === Number(tabActive) ||
                                cadre.niveau_cs === tabActive
                            )
                            .map((cadre) => {
                              const parentHierarchy = getParentHierarchy(cadre);

                              return (
                                <tr
                                  key={cadre.id_cs}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {cadre.code_cs}
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {cadre.intutile_cs}
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {cadre.abgrege_cs}
                                  </td>
                                  {niveauCadreStrategiques
                                    .slice(0, Number(tabActive) - 1)
                                    .map((niv, i) => {
                                      const parentArray =
                                        Array.from(parentHierarchy);
                                      return (
                                        <td
                                          key={niv.id_nsc}
                                          className="px-6 py-4 text-sm text-gray-500"
                                        >
                                          {parentArray[i]
                                            ? typeof parentArray[i] === "object"
                                              ? parentArray[i]?.intutile_cs
                                              : "-"
                                            : "-"}
                                        </td>
                                      );
                                    })}
                                  <td className="px-6 py-4 text-sm font-medium space-x-2 whitespace-nowrap">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditRow(cadre);
                                        setShowForm(true);
                                      }}
                                    >
                                      <EditIcon className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDelete(cadre)}
                                    >
                                      <TrashIcon className="w-3 h-3" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center py-4">
                              Aucune donnée trouvée
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              )
            )
          )}
        </Tabs>
      )}

      {niveauCadreStrategiques.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            Aucun niveau de cadre stratégique configuré
          </div>
          <Button onClick={() => setLoadNiveau(true)}>
            <MapPinIcon className="w-4 h-4 mr-2" />
            Configurer les niveaux
          </Button>
        </div>
      )}

      <Modal
        onClose={() => setShowForm(false)}
        isOpen={showForm}
        title={`${editRow ? "Mise à jour d'un" : "Ajout"} ${addBoutonLabel}`}
        size="lg"
      >
        <CadreStrategiqueForm
          onClose={() => setShowForm(false)}
          niveau={Number(tabActive)}
          editRow={editRow || null}
          cadreByNiveau={getCadreStrategiques}
          dataCadreStrategique={cadreStrategiques}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        title="Supprimer ce cadre stratégique"
        size="md"
        confimationButon={() =>
          editRow?.id_cs && DeleteCadreStrategique(editRow.id_cs)
        }
      />
    </>
  );
};

export default CadreStrategiquePage;
