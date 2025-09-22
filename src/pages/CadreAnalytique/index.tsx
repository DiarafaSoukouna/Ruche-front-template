import React, { useEffect, useState } from "react";
import {
  EditIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import NiveauCadreAnalytiqueList from "./niveau-cadre-analytique/NiveauCadreAnalytiqueList";
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
import { deleteLocalite } from "../../functions/localites/delete";
import ConfirmModal from "../../components/ConfirModal";
import { CadreAnalytiqueTypes } from "../../types/cadreAnalytique";
import { useRoot } from "../../contexts/RootContext";
import type { Acteur, NiveauCadreAnalytique } from "../../types/entities";
import { getAllCadreAnalytique } from "../../functions/cadreAnalytique/gets";
import { niveauCadreAnalytiqueService } from "../../services/niveauCadreAnalytiqueService";
import { acteurService } from "../../services/acteurService";

const CadreAnalytique: React.FC = () => {
  const [niveauCadreAnalytiques, setNiveauCadreAnalytiques] = useState<
    NiveauCadreAnalytique[]
  >([]);
  const [cadreAnalytiques, setCadreAnalytiques] = useState<
    CadreAnalytiqueTypes[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingNiv, setLoadingNiv] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<CadreAnalytiqueTypes>();
  const [addBoutonLabel, setAddBoutonLabel] = useState<string>("");
  const [tabActive, setTabActive] = useState<string>("");
  const [loadNiveau, setLoadNiveau] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState(0);
  const [acteurs, setActeurs] = useState<Acteur[]>([]);

  const AllNiveau = async () => {
    setLoadingNiv(true);
    try {
      const res = await niveauCadreAnalytiqueService.getAllOrdered();
      setNiveauCadreAnalytiques(res);
      if (res.length > 0) {
        setTabActive(String(res[0].nombre_nca));
        setAddBoutonLabel(res[0].libelle_nca ?? "");
        setCurrentId(res[0].id_nca!);
      }
    } catch (_) {
    } finally {
      console.log("tabActive", tabActive);
      console.log("addBoutonLabel", addBoutonLabel);
      console.log("currentId", currentId);
      setLoadingNiv(false);
    }
  };

  const getActeurs = async () => {
    const res = await acteurService.getAll();
    setActeurs(res);
    console.log("acteurs", acteurs);
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
      await deleteLocalite(id);
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

  const handleTabClick = async (niv: number, libelle: string, id: number) => {
    setTabActive(String(niv));
    setAddBoutonLabel(libelle);
    setCurrentId(id);
    // await OneNiveau(id)
  };

  const getCadreAnalytiques = async () => {
    setLoading(true);
    try {
      const res = await getAllCadreAnalytique();
      setCadreAnalytiques(res);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors de la récupération des cadres analytiques");
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    AllNiveau();
    getCadreAnalytiques();
    getActeurs();
  }, [niveauCadreAnalytiques.length]);

  const handleAddForm = (bool: boolean) => {
    setShowForm(bool);
    setEditRow(undefined);
  };

  const handleDelete = (cadre: CadreAnalytiqueTypes) => {
    setIsDelete(true);
    setEditRow(cadre);
  };


  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cadre Analytique</h1>
        <Button variant="outline" onClick={() => setLoadNiveau(true)}>
          <MapPinIcon className="w-4 h-4 mr-2" />
          Niveaux du Cadre Analytique
        </Button>
      </div>

      <Modal
        onClose={() => setLoadNiveau(false)}
        isOpen={loadNiveau}
        title="Configuration des niveaux du cadre analytique"
        size="xl"
      >
        <NiveauCadreAnalytiqueList />
      </Modal>

      <Tabs defaultValue={niveauCadreAnalytiques.length > 0 ? tabActive : ""}>
        <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="flex space-x-2">
            {niveauCadreAnalytiques.length > 0
              ? niveauCadreAnalytiques.map((nivLib: NiveauCadreAnalytique) => (
                  <div
                    key={nivLib.id_nca}
                    onClick={() =>
                      handleTabClick(
                        nivLib.nombre_nca,
                        nivLib.libelle_nca,
                        nivLib.id_nca!
                      )
                    }
                  >
                    <TabsTrigger value={String(nivLib.nombre_nca)}>
                      {nivLib.libelle_nca}
                    </TabsTrigger>
                  </div>
                ))
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
          niveauCadreAnalytiques.map(
            (nivLib: NiveauCadreAnalytique, index: number) => (
              <TabsContent key={nivLib.id_nca} value={String(index + 1)}>
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
                            const parent = cadreAnalytiques.find(c => c.id_ca === cadre.parent_ca);
                            // Trouver le partenaire dans la liste des acteurs
                            const partenaire = acteurs.find(a => a.id_acteur === cadre.partenaire_ca);
                            
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
                                    <div className="font-medium">{cadre.intutile_ca}</div>
                                    {cadre.abgrege_ca && (
                                      <div className="text-xs text-gray-500">{cadre.abgrege_ca}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'XOF'
                                  }).format(cadre.cout_axe)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {parent ? (
                                    <div>
                                      <div className="font-medium text-gray-900">{parent.intutile_ca}</div>
                                      <div className="text-xs text-gray-500">{parent.code_ca}</div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 italic">Racine</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {partenaire ? (
                                    <div>
                                      <div className="font-medium text-gray-900">{partenaire.nom_acteur}</div>
                                      <div className="text-xs text-gray-500">{partenaire.code_acteur}</div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">Non défini</span>
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
            )
          )
        )}
      </Tabs>

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
          niveauCadreAnalytique={niveauCadreAnalytiques}
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
