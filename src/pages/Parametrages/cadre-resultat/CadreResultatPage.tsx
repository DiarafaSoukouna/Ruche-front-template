import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/Tabs";
import CadreResultatForm from "./CadreResultatForm";
import CadreResultatDetail from "./CadreResultatDetail";
import NiveauCadreResultatTableForm from "./NiveauCadreResultatTableForm";
import { cadreResultatService } from "../../../services/cadreResultatService";
import { niveauCadreResultatService } from "../../../services/niveauCadreResultatService";
import type {
  CadreResultat,
  NiveauCadreResultat,
} from "../../../types/entities";
import {
  MapPin,
  Plus,
  EditIcon,
  TrashIcon,
  SearchIcon,
  Eye,
} from "lucide-react";

export default function CadreResultatPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNiveauOpen, setIsNiveauOpen] = useState(false);
  const [selectedCadre, setSelectedCadre] = useState<CadreResultat | null>(
    null
  );
  const [selectedCadreId, setSelectedCadreId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  const queryClient = useQueryClient();

  // Fetch niveaux for tabs
  const { data: niveaux = [] } = useQuery<NiveauCadreResultat[]>({
    queryKey: ["niveauxCadreResultat"],
    queryFn: niveauCadreResultatService.getAll,
  });

  // Fetch cadres by niveau for each tab
  const { data: cadres = [] } = useQuery<CadreResultat[]>({
    queryKey: ["cadresResultat"],
    queryFn: () => cadreResultatService.getAll(),
  });

  // Mutation pour la suppression
  const deleteMutation = useMutation({
    mutationFn: cadreResultatService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresResultat"] });
    },
  });

  // Set default active tab when niveaux are loaded
  useEffect(() => {
    if (niveaux.length > 0 && activeTab === "") {
      const sortedNiveaux = [...niveaux].sort(
        (a, b) => a.nombre_ncr - b.nombre_ncr
      );
      setActiveTab(sortedNiveaux[0].id_ncr.toString());
    }
  }, [niveaux, activeTab]);

  const handleCreate = () => {
    setSelectedCadre(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cadre: CadreResultat) => {
    setSelectedCadre(cadre);
    setIsFormOpen(true);
  };

  const handleView = (cadreId: number) => {
    setSelectedCadreId(cadreId);
    setIsDetailOpen(true);
  };

  const handleDelete = (cadre: CadreResultat) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le cadre "${cadre.intutile_cr}" ?`
      )
    ) {
      deleteMutation.mutate(cadre.id_cr);
    }
  };

  const handleEditFromDetail = () => {
    if (selectedCadreId) {
      setIsDetailOpen(false);
      // Trouver le cadre correspondant pour l'édition
      const cadre = cadres.find((c) => c.id_cr === selectedCadreId);
      if (cadre) {
        setSelectedCadre(cadre);
        setIsFormOpen(true);
      }
    }
  };

  const handleDeleteFromDetail = () => {
    if (selectedCadreId) {
      const cadre = cadres.find((c) => c.id_cr === selectedCadreId);
      if (cadre) {
        if (
          window.confirm(
            `Êtes-vous sûr de vouloir supprimer le cadre "${cadre.intutile_cr}" ?`
          )
        ) {
          deleteMutation.mutate(cadre.id_cr);
          setIsDetailOpen(false);
          setSelectedCadreId(null);
        }
      }
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCadre(null);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedCadreId(null);
  };

  // Filter cadres by niveau for current tab
  const getCadresByNiveau = (niveauId: number) => {
    return cadres.filter((cadre) => cadre.niveau_cr === niveauId);
  };

  // Sort niveaux by nombre_ncr
  const sortedNiveaux = [...niveaux].sort(
    (a, b) => a.nombre_ncr - b.nombre_ncr
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cadre de résultat</h1>
        <Button variant="outline" onClick={() => setIsNiveauOpen(true)}>
          <MapPin className="w-4 h-4 mr-2" />
          Gestion des niveaux
        </Button>
      </div>

      {/* Niveaux Management Modal */}
      <Modal
        isOpen={isNiveauOpen}
        onClose={() => setIsNiveauOpen(false)}
        title="Configuration des niveaux du cadre de résultat"
        size="xl"
      >
        <NiveauCadreResultatTableForm />
      </Modal>

      {sortedNiveaux.length > 0 && (
        <Tabs
          key={sortedNiveaux.length}
          defaultValue={activeTab || sortedNiveaux[0].id_ncr.toString()}
        >
          <div className="mt-2 mb-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="flex space-x-2">
              {sortedNiveaux.map((niveau) => (
                <TabsTrigger
                  key={niveau.id_ncr}
                  value={niveau.id_ncr.toString()}
                >
                  {niveau.libelle_ncr}
                </TabsTrigger>
              ))}
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
              <Button onClick={handleCreate}>
                <Plus size={16} className="mr-2" />
                Nouveau cadre
              </Button>
            </div>
          </div>

          {sortedNiveaux.map((niveau) => (
            <TabsContent key={niveau.id_ncr} value={niveau.id_ncr.toString()}>
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
                    {getCadresByNiveau(niveau.id_ncr).length > 0 ? (
                      getCadresByNiveau(niveau.id_ncr).map((cadre) => {
                        // Trouver le parent dans la liste des cadres de résultat
                        const parent = cadres.find(
                          (c) => c.id_cr === cadre.parent_cr
                        );

                        return (
                          <tr key={cadre.id_cr} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {cadre.code_cr}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              <div>
                                <div className="font-medium">
                                  {cadre.intutile_cr}
                                </div>
                                {cadre.abgrege_cr && (
                                  <div className="text-xs text-gray-500">
                                    {cadre.abgrege_cr}
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
                                    {parent.intutile_cr}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {parent.code_cr}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  Racine
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {cadre.partenaire_cr ? (
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {typeof cadre.partenaire_cr === "object"
                                      ? cadre.partenaire_cr.nom_acteur
                                      : cadre.partenaire_cr}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">
                                  Non défini
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleView(cadre.id_cr)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(cadre)}
                                >
                                  <EditIcon className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(cadre)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </Button>
                              </div>
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
          ))}
        </Tabs>
      )}

      {sortedNiveaux.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            Aucun niveau de cadre de résultat configuré
          </div>
          <Button onClick={() => setIsNiveauOpen(true)}>
            <MapPin className="w-4 h-4 mr-2" />
            Configurer les niveaux
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          selectedCadre
            ? "Modifier le cadre de résultat"
            : "Créer un cadre de résultat"
        }
        size="lg"
      >
        <CadreResultatForm
          cadre={selectedCadre || undefined}
          onClose={closeForm}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        title="Détails du cadre de résultat"
        size="lg"
      >
        {selectedCadreId && (
          <CadreResultatDetail
            cadreId={selectedCadreId}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
            onClose={closeDetail}
          />
        )}
      </Modal>
    </div>
  );
}
