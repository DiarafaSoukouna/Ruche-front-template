import React, { useCallback, useEffect, useState } from "react";
import {
  EditIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import NiveauCadreStrategiquePage from "./niveau-cadre-strategique/NiveauCadreStrategiquePage";
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
} from "../../../types/entities";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";
import { niveauCadreStrategiqueService } from "../../../services/niveauCadreStrategiqueService";
import CadreStrategiqueForm from "./CadreStrategiqueForm";

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
  const [currentId, setCurrentId] = useState(0);
  // const { currentProgramme } = useRoot();

  const AllNiveau = useCallback(async () => {
    setLoadingNiv(true);
    try {
      const res = await niveauCadreStrategiqueService.getAllOrdered();
      setNiveauCadreStrategiques(res);
      if (res.length > 0) {
        setAddBoutonLabel(res[0].libelle_nsc ?? "");
        setCurrentId(res[0].id_nsc ?? 0);
      }
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

  const handleTabClick = async (niv: number, libelle: string, id: number) => {
    setTabActive(String(niv));
    setAddBoutonLabel(libelle);
    setCurrentId(id);
  };

  const getCadreStrategiques = async () => {
    setLoading(true);
    try {
      const res = await cadreStrategiqueService.getAll();
      setCadreStrategiques(res);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCadreStrategiques();
    AllNiveau();
  }, [AllNiveau]);

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
        <h1 className="text-3xl font-bold text-gray-900">Cadre Stratégique</h1>
        <Button variant="outline" onClick={() => setLoadNiveau(true)}>
          <MapPinIcon className="w-4 h-4 mr-2" />
          Niveaux du Cadre Stratégique
        </Button>
      </div>

      <Modal
        onClose={() => setLoadNiveau(false)}
        isOpen={loadNiveau}
        title="Configuration des niveaux du cadre stratégique"
        size="lg"
      >
        <NiveauCadreStrategiquePage />
      </Modal>

      <Tabs defaultValue={niveauCadreStrategiques.length > 0 ? "1" : ""}>
        <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="flex space-x-2">
            {niveauCadreStrategiques.length > 0
              ? niveauCadreStrategiques.map(
                  (nivLib: NiveauCadreStrategique, index: number) => (
                    <div
                      key={nivLib.id_nsc}
                      onClick={() =>
                        handleTabClick(
                          index + 1,
                          nivLib.libelle_nsc,
                          nivLib.id_nsc!
                        )
                      }
                    >
                      <TabsTrigger value={String(index + 1)}>
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
                Nouveau {addBoutonLabel}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <RiseLoader color="green" />
          </div>
        ) : (
          niveauCadreStrategiques.map(
            (nivLib: NiveauCadreStrategique, index: number) => (
              <TabsContent key={nivLib.id_nsc} value={String(index + 1)}>
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
                          Coût axe
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
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {cadre.cout_axe}
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
                                <td className="px-6 py-4 text-sm font-medium space-x-2">
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

      <Modal
        onClose={() => setShowForm(false)}
        isOpen={showForm}
        title={`${
          editRow ? "Mise à jour d'un" : "Ajout d'un"
        } ${addBoutonLabel}`}
        size="lg"
      >
        <CadreStrategiqueForm
          onClose={() => setShowForm(false)}
          niveau={Number(tabActive)}
          currentId={currentId}
          niveauCadreStrategique={niveauCadreStrategiques}
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
