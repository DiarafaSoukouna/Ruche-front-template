import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import indicateurTacheService from "../../../services/indicateurTacheService";
import tacheActivitePtbaService from "../../../services/tacheActivitePtbaService";
import {
  indicateurTacheSchema,
  IndicateurTacheFormData,
} from "../../../schemas/indicateurTacheSchemas";
import type { IndicateurTache } from "../../../types/indicateurTache";
import type {
  TacheActivitePtba,
  IndicateurCmr,
  UniteIndicateur,
} from "../../../types/entities";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";
import { indicateurCmrService } from "../../../services/indicateurCmrService";

interface IndicateurTacheFormProps {
  indicateur?: IndicateurTache;
  idActivite: number;
  idTache?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function IndicateurTacheForm({
  indicateur,
  idActivite,
  idTache,
  onClose,
  onSuccess,
}: IndicateurTacheFormProps) {
  const isEditing = !!indicateur;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndicateurTacheFormData>({
    resolver: zodResolver(indicateurTacheSchema),
    defaultValues: {
      tache: indicateur?.tache || idTache || 0,
      intitule_indicateur_tache: indicateur?.intitule_indicateur_tache || "",
      Responsable_ind_tache: indicateur?.Responsable_ind_tache || "",
      unite_ind_tache: indicateur?.unite_ind_tache || "",
      code_indicateur_ptba: indicateur?.code_indicateur_ptba || "",
      indicateur_cmr: indicateur?.indicateur_cmr || 0,
      id_activite: idActivite,
    },
  });

  // Fetch tâches de l'activité
  const { data: taches = [] } = useQuery({
    queryKey: ["taches-activite", idActivite],
    queryFn: () => tacheActivitePtbaService.getByActivite(idActivite),
  });

  const { data: unites = [] } = useQuery({
    queryKey: ["unites-mesure"],
    queryFn: () => uniteIndicateurService.getAll(),
  });

  // Fetch indicateurs CMR (si disponible)
  const { data: indicateursCmr = [] } = useQuery({
    queryKey: ["indicateurs-cmr"],
    queryFn: () => indicateurCmrService.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: indicateurTacheService.create,
    onSuccess: () => {
      toast.success("Indicateur créé avec succès");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IndicateurTacheFormData>;
    }) => indicateurTacheService.update(id, data),
    onSuccess: () => {
      toast.success("Indicateur modifié avec succès");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Erreur lors de la modification"
      );
    },
  });

  const onSubmit = (data: IndicateurTacheFormData) => {
    if (isEditing && indicateur) {
      updateMutation.mutate({ id: indicateur.id_indicateur_tache, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Options pour les tâches
  const tacheOptions = taches.map((tache: TacheActivitePtba) => ({
    value: tache.id_groupe_tache,
    label: `${tache.code_tache_gt} - ${tache.intutile_tache_gt}`,
  }));

  const uniteOptions = unites.map((unite: UniteIndicateur) => ({
    value: String(unite.id_unite),
    label: unite.unite_ui,
  }));

  // Options pour les indicateurs CMR
  const indicateurCmrOptions = [
    { value: "", label: "Aucun indicateur CMR" },
    ...indicateursCmr.map((ind: IndicateurCmr) => ({
      value: ind.id_ref_ind_cmr,
      label: ind.intitule_ref_ind,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="intitule_indicateur_tache"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé de l'indicateur"
              placeholder="Ex: Nombre de bénéficiaires formés"
              error={errors.intitule_indicateur_tache}
              required
            />
          )}
        />

        <Controller
          name="code_indicateur_ptba"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Code de l'indicateur"
              placeholder="Ex: IND-001"
              error={errors.code_indicateur_ptba}
              required
            />
          )}
        />
      </div>

      {/* Tâche et responsable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="tache"
          control={control}
          render={({ field }) => {
            const tacheSelectOptions = [
              { value: 0, label: "Sélectionner une tâche" },
              ...tacheOptions,
            ];
            return (
              <SelectInput
                label="Tâche associée"
                options={tacheSelectOptions}
                value={tacheSelectOptions.find(
                  (opt) => opt.value === field.value
                )}
                onChange={(option) =>
                  option &&
                  !Array.isArray(option) &&
                  field.onChange(Number(option.value))
                }
                error={errors.tache}
                required
              />
            );
          }}
        />

        <Controller
          name="Responsable_ind_tache"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Responsable de l'indicateur"
              placeholder="Ex: Chef de projet"
              error={errors.Responsable_ind_tache}
              required
            />
          )}
        />
      </div>

      {/* Unité et indicateur CMR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="unite_ind_tache"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Unité de mesure"
              options={uniteOptions}
              value={uniteOptions.find(
                (opt) => String(opt.value) === field.value
              )}
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              error={errors.unite_ind_tache}
              required
            />
          )}
        />

        <Controller
          name="indicateur_cmr"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Indicateur CMR associé"
              options={indicateurCmrOptions}
              value={indicateurCmrOptions.find(
                (opt) => opt.value === field.value
              )}
              onChange={(option) =>
                option &&
                !Array.isArray(option) &&
                field.onChange(Number(option.value))
              }
              error={errors.indicateur_cmr}
            />
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "En cours..." : isEditing ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
