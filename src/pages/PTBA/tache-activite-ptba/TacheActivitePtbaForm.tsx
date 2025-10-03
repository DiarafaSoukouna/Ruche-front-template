import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import TextArea from "../../../components/TextArea";
import tacheActivitePtbaService from "../../../services/tacheActivitePtbaService";
import { personnelService } from "../../../services/personnelService";
import {
  tacheActivitePtbaSchema,
  TacheActivitePtbaFormData,
  statutValidationOptions,
} from "../../../schemas/tacheActivitePtbaSchemas";
import type { Personnel, TacheActivitePtba } from "../../../types/entities";

interface TacheActivitePtbaFormProps {
  tache?: TacheActivitePtba;
  idActivite: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TacheActivitePtbaForm({
  tache,
  idActivite,
  onClose,
  onSuccess,
}: TacheActivitePtbaFormProps) {
  const isEditing = !!tache;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TacheActivitePtbaFormData>({
    resolver: zodResolver(tacheActivitePtbaSchema),
    defaultValues: {
      intutile_tache_gt: tache?.intutile_tache_gt || "",
      proportion_gt: tache?.proportion_gt || "",
      code_tache_gt: tache?.code_tache_gt || "",
      date_debut_gt: tache?.date_debut_gt || "",
      date_fin_gt: tache?.date_fin_gt || "",
      date_reelle_gt: tache?.date_reelle_gt || "",
      n_lot_gt: tache?.n_lot_gt || 1,
      valider_gt: tache?.valider_gt || "En attente",
      observation_gt: tache?.observation_gt || "",
      livrable_gt: tache?.livrable_gt || "",
      id_personnel_gt: tache?.id_personnel_gt || 0,
      responsable_gt: tache?.responsable_gt || "",
      id_activite: idActivite,
    },
  });

  // Fetch personnel options
  const { data: personnels = [] } = useQuery({
    queryKey: ["personnels"],
    queryFn: personnelService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: tacheActivitePtbaService.create,
    onSuccess: () => {
      toast.success("Tâche créée avec succès");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TacheActivitePtbaFormData> }) =>
      tacheActivitePtbaService.update(id, data),
    onSuccess: () => {
      toast.success("Tâche modifiée avec succès");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la modification");
    },
  });

  const onSubmit = (data: TacheActivitePtbaFormData) => {
    if (isEditing && tache) {
      updateMutation.mutate({ id: tache.id_groupe_tache, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Options pour le personnel
  const personnelOptions = personnels.map((personnel: Personnel) => ({
    value: personnel.n_personnel!,
    label: `${personnel.prenom_perso} ${personnel.nom_perso}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="intutile_tache_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé de la tâche"
              placeholder="Ex: Collecte des données"
              error={errors.intutile_tache_gt}
              required
            />
          )}
        />

        <Controller
          name="code_tache_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Code de la tâche"
              placeholder="Ex: TACHE-001"
              error={errors.code_tache_gt}
              required
            />
          )}
        />
      </div>

      {/* Proportion et numéro de lot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="proportion_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Proportion"
              placeholder="Ex: 25%"
              error={errors.proportion_gt}
              required
            />
          )}
        />

        <Controller
          name="n_lot_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Numéro de lot"
              placeholder="Ex: 1"
              error={errors.n_lot_gt}
              onChange={(e) => field.onChange(Number(e.target.value))}
              required
            />
          )}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Controller
          name="date_debut_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Date de début"
              error={errors.date_debut_gt}
              required
            />
          )}
        />

        <Controller
          name="date_fin_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Date de fin"
              error={errors.date_fin_gt}
              required
            />
          )}
        />

        <Controller
          name="date_reelle_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Date réelle"
              error={errors.date_reelle_gt}
              required
            />
          )}
        />
      </div>

      {/* Responsable et personnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="responsable_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Responsable"
              placeholder="Ex: Chef d'équipe"
              error={errors.responsable_gt}
              required
            />
          )}
        />

        <Controller
          name="id_personnel_gt"
          control={control}
          render={({ field }) => {
            const personnelSelectOptions = [
              { value: 0, label: "Sélectionner un personnel" },
              ...personnelOptions,
            ];
            return (
              <SelectInput
                label="Personnel assigné"
                options={personnelSelectOptions}
                value={personnelSelectOptions.find((opt) => opt.value === field.value)}
                onChange={(option) =>
                  option && !Array.isArray(option) && field.onChange(Number(option.value))
                }
                error={errors.id_personnel_gt}
                required
              />
            );
          }}
        />
      </div>

      {/* Statut et livrable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="valider_gt"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Statut de validation"
              options={statutValidationOptions}
              value={statutValidationOptions.find((opt) => opt.value === field.value)}
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              error={errors.valider_gt}
              required
            />
          )}
        />

        <Controller
          name="livrable_gt"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Livrable"
              placeholder="Ex: Rapport d'analyse"
              error={errors.livrable_gt}
              required
            />
          )}
        />
      </div>

      {/* Observation */}
      <Controller
        name="observation_gt"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Observation"
            placeholder="Observations sur la tâche..."
            rows={3}
            error={errors.observation_gt}
          />
        )}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "En cours..."
            : isEditing
            ? "Modifier"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
