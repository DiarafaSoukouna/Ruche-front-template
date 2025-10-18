import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus } from "lucide-react";
import Button from "../../../components/Button";
import tacheActivitePtbaService from "../../../services/tacheActivitePtbaService";
import type { TacheActivitePtba } from "../../../types/entities";

interface TacheActivitePtbaListProps {
  taches: TacheActivitePtba[];
  idActivite: number;
  onEdit: (tache: TacheActivitePtba) => void;
  onAdd: () => void;
}

export default function TacheActivitePtbaList({
  taches,
  idActivite,
  onEdit,
  onAdd,
}: TacheActivitePtbaListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: tacheActivitePtbaService.delete,
    onSuccess: () => {
      toast.success("Tâche supprimée avec succès");
      queryClient.invalidateQueries({
        queryKey: ["taches-activite", idActivite],
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header avec bouton d'ajout */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900">Tâches</h3>
          {/* <Button
            onClick={onAdd}
            size="sm"
            variant="outline"
            className="text-xs px-2 py-1"
          >
            Tout supprimer
          </Button> */}
        </div>
        <div className="flex justify-center">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une tâche
          </Button>
        </div>
      </div>

      {/* Tableau des tâches */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* En-tête du tableau */}
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900 min-w-[300px]">
                  Tâches
                </th>
                <th className="px-2 py-3 text-center font-medium text-gray-900 min-w-[60px]">
                  Resp.
                </th>
                <th>Date début</th>
                <th>Date fin</th>
                <th className="px-2 py-3 text-center font-medium text-gray-900 min-w-[50px]">
                  Lot
                </th>
                <th className="px-2 py-3 text-center font-medium text-gray-900 min-w-[60px]">
                  P%
                </th>
                <th className="px-2 py-3 text-center font-medium text-gray-900 min-w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Corps du tableau */}
            <tbody className="divide-y divide-gray-200">
              {taches.length === 0 ? (
                <tr>
                  <td
                    colSpan={16}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p>Aucune tâche associée à cette activité</p>
                      <Button onClick={onAdd} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une tâche
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                taches.map((tache, index) => (
                  <tr key={tache.id_groupe_tache} className="hover:bg-gray-50">
                    {/* Colonne Tâche */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 font-medium min-w-[20px]">
                          {index + 1}:
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {tache.intutile_tache_gt}
                          </div>
                          {tache.observation_gt && (
                            <div className="text-xs text-gray-500 mt-1">
                              {tache.observation_gt}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Colonne Responsable */}
                    <td className="px-2 py-3 text-center">
                      <span className="text-xs font-medium text-gray-700">
                        {typeof tache.responsable_gt === "object"
                          ? tache.responsable_gt?.prenom_perso +
                            " " +
                            tache.responsable_gt?.nom_perso
                          : "Non affecté"}
                      </span>
                    </td>

                    {/* Colonnes date début */}
                    <td className="px-2 py-3 text-center">
                      <span className="text-xs text-gray-700">
                        {new Date(tache.date_debut_gt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Colonnes date fin */}
                    <td className="px-2 py-3 text-center">
                      <span className="text-xs text-gray-700">
                        {new Date(tache.date_fin_gt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Colonne Lot */}
                    <td className="px-2 py-3 text-center">
                      <span className="text-xs text-gray-700">
                        {tache.n_lot_gt}
                      </span>
                    </td>

                    {/* Colonne Pourcentage */}
                    <td className="px-2 py-3 text-center">
                      <span className="text-xs font-medium text-gray-700">
                        {tache.proportion_gt}
                      </span>
                    </td>

                    {/* Colonne Actions */}
                    <td className="px-2 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(tache)}
                          className="p-1"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(tache.id_groupe_tache)}
                          disabled={deletingId === tache.id_groupe_tache}
                          className="p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
