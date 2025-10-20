import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, TrashIcon } from "lucide-react";
import type { SuiviIndicateurActivite } from "../../../../types/entities";
import { toast } from "react-toastify";
import suiviIndicateurActiviteService from "../../../../services/suiviIndicateurActiviteService";
import Button from "../../../../components/Button";

interface SuiviIndicateurListProps {
  suivis: SuiviIndicateurActivite[];
  onEdit: (suivi: SuiviIndicateurActivite) => void;
}

export default function SuiviIndicateurList({
  suivis,
  onEdit,
}: SuiviIndicateurListProps) {
  const queryClient = useQueryClient();

  // Mutation pour supprimer un suivi
  const deleteMutation = useMutation({
    mutationFn: (id: number) => suiviIndicateurActiviteService.delete(id),
    onSuccess: () => {
      toast.success("Suivi supprimé avec succès");
      queryClient.invalidateQueries({
        queryKey: ["suivis-indicateur", suivis],
      });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du suivi");
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce suivi ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (suivis.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        Aucun suivi enregistré
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Localité
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Date suivi
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Valeur
            </th>
            <th className="px-4 py-2 text-center font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {suivis.map((suivi) => (
            <tr key={suivi.id_suivi_indicateur} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                {typeof suivi.localite === "object"
                  ? suivi.localite?.intitule_loca
                  : suivi.localite || "N/A"}
              </td>
              <td className="px-4 py-3">
                {new Date(suivi.date_suivi_indicateur).toLocaleDateString(
                  "fr-FR"
                )}
              </td>
              <td className="px-4 py-3 font-semibold">
                {suivi.valeur_suivi_indicateur}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => onEdit(suivi)}
                    variant="outline"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(suivi.id_suivi_indicateur)}
                    variant="outline"
                    className="bg-red-600 hover:bg-red-600/90 text-white hover:text-white"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
