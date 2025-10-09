import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus, BarChart3 } from "lucide-react";
import Button from "../../../components/Button";
import indicateurTacheService from "../../../services/indicateurTacheService";
import type { IndicateurTache } from "../../../types/indicateurTache";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";

interface IndicateurTacheListProps {
  indicateurs: IndicateurTache[];
  idActivite: number;
  onEdit: (indicateur: IndicateurTache) => void;
  onAdd: () => void;
  onViewDetails: (indicateur: IndicateurTache) => void;
}

export default function IndicateurTacheList({
  indicateurs,
  idActivite,
  onEdit,
  onAdd,
  onViewDetails,
}: IndicateurTacheListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: indicateurTacheService.delete,
    onSuccess: () => {
      toast.success("Indicateur supprimé avec succès");
      queryClient.invalidateQueries({
        queryKey: ["indicateurs-activite", idActivite],
      });
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet indicateur ?")) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  const { data: unites = [] } = useQuery({
    queryKey: ["unites-mesure"],
    queryFn: () => uniteIndicateurService.getAll(),
  });

  if (indicateurs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun indicateur
        </h3>
        <p className="text-gray-500 mb-4">
          Cette activité n'a pas encore d'indicateurs associés.
        </p>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un indicateur
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Indicateurs ({indicateurs.length})
        </h3>
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un indicateur
        </Button>
      </div>

      {/* Tableau des indicateurs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* En-tête du tableau */}
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">
                  Code
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">
                  Intitulé
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Unité
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Responsable
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Tâche
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Corps du tableau */}
            <tbody className="divide-y divide-gray-200">
              {indicateurs.map((indicateur) => (
                <tr
                  key={indicateur.id_indicateur_tache}
                  className="hover:bg-gray-50"
                >
                  {/* Code */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-medium">
                      {indicateur.code_indicateur_ptba}
                    </span>
                  </td>

                  {/* Intitulé */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {indicateur.intitule_indicateur_tache}
                    </div>
                  </td>

                  {/* Unité */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                      {
                        unites.find(
                          (u) =>
                            String(u.id_unite) ===
                            String(indicateur.unite_ind_tache)
                        )?.definition_ui
                      }
                      {" - "}
                      {
                        unites.find(
                          (u) =>
                            String(u.id_unite) ===
                            String(indicateur.unite_ind_tache)
                        )?.unite_ui
                      }
                    </span>
                  </td>

                  {/* Responsable */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-700">
                      {indicateur.Responsable_ind_tache}
                    </span>
                  </td>

                  {/* Tâche */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-gray-500">
                      Tâche #{indicateur.tache}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(indicateur)}
                        className="p-2"
                        title="Voir les détails et valeurs cibles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(indicateur)}
                        className="p-2"
                        title="Modifier l'indicateur"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(indicateur.id_indicateur_tache)
                        }
                        disabled={deletingId === indicateur.id_indicateur_tache}
                        className="p-2"
                        title="Supprimer l'indicateur"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium">Total indicateurs:</span>{" "}
              {indicateurs.length}
            </div>
            <div>
              <span className="font-medium">Unités différentes:</span>{" "}
              {new Set(indicateurs.map((ind) => ind.unite_ind_tache)).size}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Indicateurs de performance des tâches
          </div>
        </div>
      </div>
    </div>
  );
}
