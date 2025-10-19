import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { ObservationPtba } from "../../../../types/entities";
import observationPtbaService from "../../../../services/observationPtbaService";
import Button from "../../../../components/Button";

interface ObservationPtbaListProps {
  activiteCode: string;
  onEdit: (observation: ObservationPtba) => void;
}

export default function ObservationPtbaList({
  activiteCode,
  onEdit,
}: ObservationPtbaListProps) {
  const queryClient = useQueryClient();

  // Fetch observations pour cette activité
  const { data: observations = [], isLoading } = useQuery<ObservationPtba[]>({
    queryKey: ["observations-ptba", activiteCode],
    queryFn: () => observationPtbaService.getByActivite(activiteCode),
    enabled: !!activiteCode,
  });

  // Mutation pour supprimer une observation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => observationPtbaService.delete(id),
    onSuccess: () => {
      toast.success("Observation supprimée avec succès");
      queryClient.invalidateQueries({
        queryKey: ["observations-ptba", activiteCode],
      });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'observation");
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette observation ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (observations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="font-medium">Aucune observation enregistrée</p>
        <p className="text-sm mt-2">
          Cliquez sur "Ajouter une observation" pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {observations.map((observation) => (
        <div
          key={observation.id_observation}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">
                  {new Date(observation.date_observation).toLocaleDateString(
                    "fr-FR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">
                {observation.observation}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onEdit(observation)}
                variant="outline"
                size="sm"
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleDelete(observation.id_observation)}
                variant="outline"
                size="sm"
                className="bg-red-600 hover:bg-red-600/90 text-white hover:text-white"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
