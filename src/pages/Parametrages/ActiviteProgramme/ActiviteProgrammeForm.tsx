import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import type { ActiviteProgramme } from "../../../types/activiteProgramme";
import type { NiveauActiviteProgramme } from "../../../types/niveauActiviteProgramme";
import type { Programme } from "../../../types/entities";
import activiteProgrammeService from "../../../services/activiteProgrammeService";
import niveauActiviteProgrammeService from "../../../services/niveauActiviteProgrammeService";
import {
  activiteProgrammeCreateSchema,
  type ActiviteProgrammeFormData,
} from "../../../schemas/activiteProgrammeSchemas";
import { AxiosError } from "axios";
import { useRoot } from "../../../contexts/RootContext";

interface ActiviteProgrammeFormProps {
  activite?: ActiviteProgramme | null;
  niveau: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ActiviteProgrammeForm({
  activite,
  niveau,
  onClose,
  onSuccess,
}: ActiviteProgrammeFormProps) {
  const queryClient = useQueryClient();
  const { currentProgramme }: { currentProgramme: Programme } = useRoot();

  // Fetch activités pour le parent
  const { data: activites = [] } = useQuery<ActiviteProgramme[]>({
    queryKey: ["activites-programme"],
    queryFn: () =>
      activiteProgrammeService.getAll(currentProgramme?.id_programme),
  });

  // Récupérer les niveaux pour la validation de la taille du code
  const { data: niveauxActiviteProgramme = [] } = useQuery<
    NiveauActiviteProgramme[]
  >({
    queryKey: ["niveaux-activite-programme"],
    queryFn: () =>
      niveauActiviteProgrammeService.getAll(currentProgramme?.code_programme),
  });

  // Calculer la taille fixe du code selon le niveau
  const fixedCodeLength = useMemo(() => {
    const niveauConfig = niveauxActiviteProgramme.find(
      (n) => Number(n.nombre_niveau_ap) === niveau
    );
    return Number(niveauConfig?.taille_code_niveau_ap) || 2;
  }, [niveauxActiviteProgramme, niveau]);

  // Créer un schéma de validation dynamique avec la taille fixe du code
  const dynamicSchema = useMemo(() => {
    return activiteProgrammeCreateSchema.extend({
      code_ap: z
        .string("Le code est requis")
        .length(
          fixedCodeLength,
          `Le code doit contenir exactement ${fixedCodeLength} caractère(s) selon la configuration du niveau ${niveau}`
        ),
    });
  }, [fixedCodeLength, niveau]);

  // Options pour les activités parent (niveau précédent uniquement)
  const parentActivites = activites.filter(
    (act) => Number(act.niveau_ap) === niveau - 1
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ActiviteProgrammeFormData>({
    resolver: zodResolver(dynamicSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: activite
      ? {
          code_ap: activite.code_ap || "",
          intutile: activite.intutile || "",
          niveau_ap: Number(activite.niveau_ap) || niveau,
          code_relai_ap: activite.code_relai_ap || "",
          parent_ap:
            typeof activite.parent_ap === "object" && activite.parent_ap
              ? activite.parent_ap.id_ap
              : activite.parent_ap || null,
          id_programme: currentProgramme?.id_programme || null,
        }
      : {
          code_ap: "",
          intutile: "",
          niveau_ap: niveau,
          code_relai_ap: "",
          parent_ap: null,
          id_programme: currentProgramme?.id_programme || null,
        },
  });

  // Mutation pour créer
  const createMutation = useMutation({
    mutationFn: (data: ActiviteProgrammeFormData) =>
      activiteProgrammeService.create(data),
    onSuccess: () => {
      toast.success("Activité créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["activites-programme"] });
      onSuccess();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la création de l'activité"
      );
    },
  });

  // Mutation pour mettre à jour
  const updateMutation = useMutation({
    mutationFn: (data: ActiviteProgrammeFormData) =>
      activiteProgrammeService.update(activite!.id_ap, data),
    onSuccess: () => {
      toast.success("Activité mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["activites-programme"] });
      onSuccess();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour de l'activité"
      );
    },
  });

  const onSubmit = (data: ActiviteProgrammeFormData) => {
    // Vérifier que les niveaux sont configurés
    if (niveauxActiviteProgramme.length === 0) {
      toast.error(
        "Veuillez d'abord configurer les niveaux d'activité programme avant d'ajouter des activités."
      );
      return;
    }

    // Vérifier que le niveau actuel est configuré
    const niveauConfig = niveauxActiviteProgramme.find(
      (n) => Number(n.nombre_niveau_ap) === niveau
    );
    if (!niveauConfig) {
      toast.error(
        `Le niveau ${niveau} n'est pas configuré. Veuillez configurer les niveaux d'activité programme.`
      );
      return;
    }

    // Vérifier la taille exacte du code
    if (data.code_ap.length !== fixedCodeLength) {
      toast.error(
        `Le code doit contenir exactement ${fixedCodeLength} caractère(s) selon la configuration du niveau ${niveau}.`
      );
      return;
    }

    // Nettoyer les données
    const cleanedData = {
      ...data,
      parent_ap: data.parent_ap || null,
      id_programme: currentProgramme?.id_programme || null,
    };

    if (activite) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  // Options pour les activités parent
  const parentOptions = parentActivites.map((act) => ({
    value: act.id_ap,
    label: `${act.code_ap} - ${act.intutile}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code de l'activité */}
        <Controller
          name="code_ap"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="text"
                label={`Code de l'activité (${fixedCodeLength} caractère(s) requis)`}
                maxLength={fixedCodeLength}
                error={errors.code_ap}
                required
                placeholder={`Code de ${fixedCodeLength} caractère(s) exactement`}
              />
            </div>
          )}
        />

        {/* Intitulé */}
        <Controller
          name="intutile"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé de l'activité"
              placeholder="Ex: Formation des agriculteurs"
              error={errors.intutile}
              required
            />
          )}
        />

        {/* Code relai */}
        <Controller
          name="code_relai_ap"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Code relai"
              placeholder="Ex: REL-001"
              error={errors.code_relai_ap}
              required
            />
          )}
        />

        {/* Activité parent */}
        {niveau > 1 && (
          <Controller
            name="parent_ap"
            control={control}
            render={({ field }) => (
              <SelectInput
                label={`${
                  niveauxActiviteProgramme[niveau - 2]?.libelle_niveau_ap ||
                  "Activité parent"
                }`}
                placeholder="Sélectionner une activité parent"
                options={parentOptions}
                value={
                  field.value
                    ? parentOptions.find((opt) => opt.value === field.value)
                    : null
                }
                onChange={(option) =>
                  option &&
                  !Array.isArray(option) &&
                  field.onChange(option.value)
                }
                isClearable
                error={errors.parent_ap}
                required={niveau > 1}
              />
            )}
          />
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Enregistrement..."
            : activite
            ? "Mettre à jour"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
