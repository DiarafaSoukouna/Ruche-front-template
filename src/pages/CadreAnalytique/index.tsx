import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  EditIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import FormCadreAnalytique from "./form";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { RiseLoader } from "react-spinners";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/Tabs";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirModal";
import { CadreAnalytiqueType } from "../../types/cadreAnalytique";
import { useRoot } from "../../contexts/RootContext";
import type {
  Acteur,
  NiveauCadreAnalytique,
  Programme,
} from "../../types/entities";
import { getAllCadreAnalytique } from "../../functions/cadreAnalytique/gets";
import { niveauCadreAnalytiqueService } from "../../services/niveauCadreAnalytiqueService";
import { acteurService } from "../../services/acteurService";
import { deleteCadreAnalytique } from "../../functions/cadreAnalytique/delete";
import NiveauCadreAnalytiqueTableForm from "./NiveauCadreAnalytiqueTableForm";

const CadreAnalytique: React.FC = () => {
  const [niveauCadreAnalytiques, setNiveauCadreAnalytiques] = useState<
    NiveauCadreAnalytique[]
  >([]);
  const [cadreAnalytiques, setCadreAnalytiques] = useState<
    CadreAnalytiqueType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingNiv, setLoadingNiv] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<CadreAnalytiqueType>();
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>("");
  const [tabActive, setTabActive] = useState<string>("");
  const [loadNiveau, setLoadNiveau] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState(0);
  const [acteurs, setActeurs] = useState<Acteur[]>([]);
  const { currentProgramme }: { currentProgramme: Programme | undefined } =
    useRoot();

  // Filter niveaux by current programme
  const niveauxDuProgramme = useMemo(() => {
    if (!currentProgramme) return niveauCadreAnalytiques;
    return niveauCadreAnalytiques.filter(
      (niveau) =>
        niveau.programme === currentProgramme.code_programme ||
        (niveau.programme as Programme)?.code_programme ===
          currentProgramme.code_programme
    );
  }, [niveauCadreAnalytiques, currentProgramme]);

  const AllNiveau = async () => {
    setLoadingNiv(true);
    try {
      const res = await niveauCadreAnalytiqueService.getAll();
      setNiveauCadreAnalytiques(res);
      // La sélection du premier niveau par défaut est maintenant gérée dans useEffect
    } finally {
      setLoadingNiv(false);
    }
  };

  const getActeurs = async () => {
    const res = await acteurService.getAll();
    setActeurs(res);
  };

  // const OneNiveau = async (id: number) => {
  //   setLoading(true)
  //   try {
  //     const res = await oneNiveauLocalite(id)
  //     setCadreAnalytiques(res.localites || [])
  //     setLoading(false)
  //   } catch (error) {
  //     toast.error('Erreur lors de la récupération du cadre analytique')
  //     console.log('error', error)
  //     setLoading(false)
  //   }
  // }

  const DeleteCadreAnalytique = async (id: number) => {
    setLoading(true);
    try {
      await deleteCadreAnalytique(id);
      toast.success("Cadre analytique supprimé avec succès");
      setIsDelete(false);
      // await OneNiveau(currentId)
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression du cadre analytique");
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleTabClick = async (code: number, libelle: string, id: number) => {
    setTabActive(String(code));
    setAddBoutonLabel(libelle);
    setCurrentId(id);
    // await OneNiveau(id)
  };

  const getCadreAnalytiques = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllCadreAnalytique(currentProgramme?.id_programme);
      setCadreAnalytiques(res);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres analytiques");
      console.log("error", error);
      setLoading(false);
    }
  }, [currentProgramme]);

  useEffect(() => {
    AllNiveau();
    getCadreAnalytiques();
    getActeurs();
  }, [currentProgramme, getCadreAnalytiques]); // Exécuter seulement au montage du composant

  // Effet séparé pour définir le premier niveau par défaut
  useEffect(() => {
    if (niveauxDuProgramme.length > 0 && tabActive === "") {
      const firstNiveau = niveauxDuProgramme[0];
      setTabActive(String(firstNiveau.code_number_nca));
      setAddBoutonLabel(firstNiveau.libelle_nca ?? "");
      setCurrentId(firstNiveau.id_nca!);
    }
  }, [niveauxDuProgramme, tabActive]);

  const handleAddForm = (bool: boolean) => {
    setShowForm(bool);
    setEditRow(undefined);
  };

  const handleDelete = (cadre: CadreAnalytiqueType) => {
    setIsDelete(true);
    setEditRow(cadre);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cadre analytique</h1>
        <Button variant="outline" onClick={() => setLoadNiveau(true)}>
          <MapPinIcon className="w-4 h-4 mr-2" />
          Gestion des niveaux
        </Button>
      </div>

      <Modal
        onClose={() => setLoadNiveau(false)}
        isOpen={loadNiveau}
        title="Configuration des niveaux du cadre analytique"
        size="xl"
      >
        <NiveauCadreAnalytiqueTableForm />
      </Modal>

      {niveauxDuProgramme.length > 0 && (
        <Tabs
          key={niveauxDuProgramme.length}
          defaultValue={
            tabActive || String(niveauxDuProgramme[0].code_number_nca)
          }
        >
          <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="flex space-x-2">
              {niveauxDuProgramme.length > 0
                ? niveauxDuProgramme.map(
                    (nivLib: NiveauCadreAnalytique) => (
                      <div
                        key={nivLib.id_nca}
                        onClick={() =>
                          handleTabClick(
                            nivLib.code_number_nca,
                            nivLib.libelle_nca,
                            nivLib.id_nca!
                          )
                        }
                      >
                        <TabsTrigger value={String(nivLib.code_number_nca)}>
                          {nivLib.libelle_nca}
                        </TabsTrigger>
                      </div>
                    )
                  )
                : "Niveaux du cadre analytique non disponibles"}
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
              <Button onClick={() => handleAddForm(true)}>
                <PlusIcon size={16} className="mr-2" />
                Nouveau {addBoutonLabel}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <RiseLoader color="green" />
            </div>
          ) : (
            niveauxDuProgramme.map((nivLib: NiveauCadreAnalytique) => (
              <TabsContent
                key={nivLib.id_nca}
                value={String(nivLib.code_number_nca)}
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
                          Coût axe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Parent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Partenaire
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cadreAnalytiques.length > 0 ? (
                        cadreAnalytiques
                          .filter(
                            (cadre) =>
                              cadre.niveau_ca === Number(tabActive) ||
                              cadre.niveau_ca === tabActive
                          )
                          .map((cadre) => {
                            // Trouver le parent dans la liste des cadres analytiques
                            const parent = cadreAnalytiques.find(
                              (c) => c.id_ca === cadre.parent_ca
                            );
                            // Trouver le partenaire dans la liste des acteurs
                            const partenaire = acteurs.find(
                              (a) => a.id_acteur === cadre.partenaire_ca
                            );

                            return (
                              <tr
                                key={cadre.id_ca}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {cadre.code_ca}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                  <div>
                                    <div className="font-medium">
                                      {cadre.intutile_ca}
                                    </div>
                                    {cadre.abgrege_ca && (
                                      <div className="text-xs text-gray-500">
                                        {cadre.abgrege_ca}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "XOF",
                                  }).format(cadre.cout_axe)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {parent ? (
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {parent.intutile_ca}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {parent.code_ca}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 italic">
                                      Racine
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {partenaire ? (
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {partenaire.nom_acteur}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {partenaire.code_acteur}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">
                                      Non défini
                                    </span>
                                  )}
                                </td>
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
                          <td colSpan={6} className="text-center py-4">
                            Aucune donnée trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))
          )}
        </Tabs>
      )}

      {niveauxDuProgramme.length === 0 && !loadingNiv && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            Aucun niveau de cadre analytique configuré
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
        title={`${
          editRow ? "Mise à jour d’un" : "Ajout d’un"
        } ${addBoutonLabel}`}
        size="lg"
      >
        <FormCadreAnalytique
          onClose={() => setShowForm(false)}
          niveau={Number(tabActive)}
          currentId={currentId}
          editRow={editRow || null}
          cadreByNiveau={getCadreAnalytiques}
          dataCadreAnalytique={cadreAnalytiques}
          acteurs={acteurs}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        title="Supprimer ce cadre analytique"
        size="md"
        confimationButon={() => DeleteCadreAnalytique(editRow!.id_ca!)}
      />
    </>
  );
};

export default CadreAnalytique;
