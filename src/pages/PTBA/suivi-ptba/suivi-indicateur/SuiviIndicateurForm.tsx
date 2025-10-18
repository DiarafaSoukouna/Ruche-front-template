import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import SelectInput from "../../../../components/SelectInput";
import {
  suiviIndicateurActiviteSchema,
  type SuiviIndicateurActiviteFormData,
} from "../../../../schemas/suiviIndicateurSchemas";
import type {
  IndicateurActivitePtba,
  SuiviIndicateurActivite,
} from "../../../../types/entities";
import { allLocalite } from "../../../../functions/localites/gets";
import { typeLocalite } from "../../../../functions/localites/types";
import suiviIndicateurActiviteService from "../../../../services/suiviIndicateurActiviteService";
import { AxiosError } from "axios";

interface SuiviIndicateurFormProps {
  indicateur: IndicateurActivitePtba;
  suivi?: SuiviIndicateurActivite | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SuiviIndicateurForm({
  indicateur,
  suivi,
  onClose,
  onSuccess,
}: SuiviIndicateurFormProps) {
  const queryClient = useQueryClient();

  // Fetch localités
  const { data: localites = [] } = useQuery<typeLocalite[]>({
    queryKey: ["localites"],
    queryFn: () => allLocalite(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SuiviIndicateurActiviteFormData>({
    resolver: zodResolver(suiviIndicateurActiviteSchema),
    defaultValues: suivi
      ? {
          localite:
            typeof suivi.localite === "object" && suivi.localite
              ? suivi.localite.code_loca
              : typeof suivi.localite === "string"
              ? suivi.localite
              : null,
          date_suivi_indicateur: suivi.date_suivi_indicateur
            ? new Date(suivi.date_suivi_indicateur).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          valeur_suivi_indicateur: suivi.valeur_suivi_indicateur || 0,
          indicateur_activite: indicateur.code_indicateur_activite,
        }
      : {
          localite: null,
          date_suivi_indicateur: new Date().toISOString().split("T")[0],
          valeur_suivi_indicateur: 0,
          indicateur_activite: indicateur.code_indicateur_activite,
        },
  });

  // Mutation pour créer un suivi
  const createMutation = useMutation({
    mutationFn: (data: SuiviIndicateurActiviteFormData) =>
      suiviIndicateurActiviteService.create(data),
    onSuccess: () => {
      toast.success("Suivi enregistré avec succès");
      queryClient.invalidateQueries({
        queryKey: ["suivis-indicateur", indicateur.code_indicateur_activite],
      });
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de l'enregistrement du suivi"
      );
    },
  });

  // Mutation pour mettre à jour un suivi
  const updateMutation = useMutation({
    mutationFn: (data: SuiviIndicateurActiviteFormData) =>
      suiviIndicateurActiviteService.update(suivi!.id_suivi_indicateur, data),
    onSuccess: () => {
      toast.success("Suivi modifié avec succès");
      queryClient.invalidateQueries({
        queryKey: ["suivis-indicateur", indicateur.code_indicateur_activite],
      });
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de la modification du suivi"
      );
    },
  });

  const onSubmit = (data: SuiviIndicateurActiviteFormData) => {
    if (suivi) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Options pour les localités
  const localiteOptions = localites.map((localite) => ({
    value: localite.code_loca || "",
    label: localite.intitule_loca || "",
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Valeur */}
        <Controller
          name="valeur_suivi_indicateur"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              step="0.01"
              label="Valeur"
              placeholder="Entrer la valeur"
              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              error={errors.valeur_suivi_indicateur}
              required
            />
          )}
        />

        {/* Localité */}
        <Controller
          name="localite"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Localité"
              placeholder="Sélectionner une localité"
              options={[
                { value: "", label: "-- Sélectionner --" },
                ...localiteOptions,
              ]}
              value={
                localiteOptions.find((opt) => opt.value === field.value) || null
              }
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              error={errors.localite}
            />
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
            ? suivi
              ? "Modification..."
              : "Enregistrement..."
            : suivi
            ? "Modifier"
            : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
