import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../../components/Button";
import {
  observationPtbaSchema,
  type ObservationPtbaFormData,
} from "../../../../schemas/observationPtbaSchemas";
import type { ObservationPtba, Ptba } from "../../../../types/entities";
import observationPtbaService from "../../../../services/observationPtbaService";
import { AxiosError } from "axios";

interface ObservationPtbaFormProps {
  activite: Ptba;
  observation?: ObservationPtba | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ObservationPtbaForm({
  activite,
  observation,
  onClose,
  onSuccess,
}: ObservationPtbaFormProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ObservationPtbaFormData>({
    resolver: zodResolver(observationPtbaSchema),
    defaultValues: observation
      ? {
          observation: observation.observation || "",
          date_observation: observation.date_observation
            ? new Date(observation.date_observation).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          ptba: activite.code_activite_ptba,
        }
      : {
          observation: "",
          date_observation: new Date().toISOString().split("T")[0],
          ptba: activite.code_activite_ptba,
        },
  });

  // Mutation pour créer une observation
  const createMutation = useMutation({
    mutationFn: (data: ObservationPtbaFormData) =>
      observationPtbaService.create(data),
    onSuccess: () => {
      toast.success("Observation enregistrée avec succès");
      queryClient.invalidateQueries({
        queryKey: ["observations-ptba", activite.code_activite_ptba],
      });
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de l'enregistrement de l'observation"
      );
    },
  });

  // Mutation pour mettre à jour une observation
  const updateMutation = useMutation({
    mutationFn: (data: ObservationPtbaFormData) =>
      observationPtbaService.update(observation!.id_observation, data),
    onSuccess: () => {
      toast.success("Observation modifiée avec succès");
      queryClient.invalidateQueries({
        queryKey: ["observations-ptba", activite.code_activite_ptba],
      });
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de la modification de l'observation"
      );
    },
  });

  const onSubmit = (data: ObservationPtbaFormData) => {
    if (observation) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Observation */}
      <div>
        <Controller
          name="observation"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observation <span className="text-red-500">*</span>
              </label>
              <textarea
                {...field}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.observation ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Saisir l'observation..."
              />
              {errors.observation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.observation.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? observation
              ? "Modification..."
              : "Enregistrement..."
            : observation
            ? "Modifier"
            : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
