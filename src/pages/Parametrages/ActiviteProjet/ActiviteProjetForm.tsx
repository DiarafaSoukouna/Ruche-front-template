import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import type {
  ActiviteProjet,
  NiveauActiviteProjet,
  Programme,
} from "../../../types/entities";
import activiteProjetService from "../../../services/activiteProjetService";
import niveauActiviteProjetService from "../../../services/niveauActiviteProjetService";
import {
  activiteProjetCreateSchema,
  type ActiviteProjetFormData,
} from "../../../schemas/activiteProjetSchemas";
import { AxiosError } from "axios";
import { getAllProjet } from "../../../functions/projet";
import { Projet } from "../../../types/projet";
import { useRoot } from "../../../contexts/RootContext";
import activiteProgrammeService from "../../../services/activiteProgrammeService";
import { ActiviteProgramme } from "../../../types/activiteProgramme";

interface ActiviteProjetFormProps {
  activite?: ActiviteProjet | null;
  niveau: number; // Niveau sélectionné dans les tabs
  onClose: () => void;
  onSuccess: () => void;
}

export default function ActiviteProjetForm({
  activite,
  niveau,
  onClose,
  onSuccess,
}: ActiviteProjetFormProps) {
  const queryClient = useQueryClient();

  const { currentProgramme }: { currentProgramme: Programme } = useRoot();

  // Fetch activités pour le parent
  const { data: activites = [] } = useQuery<ActiviteProjet[]>({
    queryKey: ["activites-projet"],
    queryFn: activiteProjetService.getAll,
  });

  const { data: projets = [] } = useQuery<Projet[]>({
    queryKey: ["projets"],
    queryFn: () => getAllProjet(),
  });

  const { data: activitesProgramme = [] } = useQuery<ActiviteProgramme[]>({
    queryKey: ["activites-programme"],
    queryFn: () =>
      activiteProgrammeService.getAll(currentProgramme?.id_programme),
  });

  // Récupérer les niveaux pour la validation de la taille du code
  const { data: niveauxActiviteProjet = [] } = useQuery<NiveauActiviteProjet[]>(
    {
      queryKey: ["niveaux-activite-projet"],
      queryFn: niveauActiviteProjetService.getAll,
    }
  );

  // Calculer la taille fixe du code selon le niveau
  const fixedCodeLength = useMemo(() => {
    const niveauConfig = niveauxActiviteProjet.find(
      (n) => Number(n.nombre_niveau_activite_projet) === niveau
    );
    return Number(niveauConfig?.taille_code_niveau_activite_projet) || 2; // Valeur par défaut si pas trouvé
  }, [niveauxActiviteProjet, niveau]);

  // Créer un schéma de validation dynamique avec la taille fixe du code
  const dynamicSchema = useMemo(() => {
    return activiteProjetCreateSchema.extend({
      code_activite_projet: z
        .string("Le code est requis")
        .length(
          fixedCodeLength,
          `Le code doit contenir exactement ${fixedCodeLength} caractère(s) selon la configuration du niveau ${niveau}`
        ),
    });
  }, [fixedCodeLength, niveau]);

  // Options pour les activités parent (niveau précédent uniquement)
  const parentActivites = activites.filter(
    (act) => Number(act.niveau_activite_projet) === niveau - 1
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ActiviteProjetFormData>({
    resolver: zodResolver(dynamicSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: activite
      ? {
          code_activite_projet: activite.code_activite_projet || "",
          intitule_activite_projet: activite.intitule_activite_projet || "",
          niveau_activite_projet:
            Number(activite.niveau_activite_projet) || niveau,
          parent_activite_projet:
            typeof activite.parent_activite_projet === "object" &&
            activite.parent_activite_projet
              ? activite.parent_activite_projet.id_activite_projet
              : (activite.parent_activite_projet as number) || null,
          code_activite_programme:
            typeof activite.code_activite_programme === "object" &&
            activite.code_activite_programme
              ? activite.code_activite_programme.code_ap
              : (activite.code_activite_programme as string) || null,
          code_projet:
            typeof activite.code_projet === "object" && activite.code_projet
              ? activite.code_projet.code_projet
              : (activite.code_projet as string) || null,
        }
      : {
          code_activite_projet: "",
          intitule_activite_projet: "",
          niveau_activite_projet: niveau,
          parent_activite_projet: null,
          code_activite_programme: null,
          code_projet: null,
        },
  });

  // Mutation pour créer
  const createMutation = useMutation({
    mutationFn: (data: Partial<ActiviteProjet>) =>
      activiteProjetService.create(data),
    onSuccess: () => {
      toast.success("Activité créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["activites-projet"] });
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
    mutationFn: (data: Partial<ActiviteProjet>) =>
      activiteProjetService.update(activite!.id_activite_projet, data),
    onSuccess: () => {
      toast.success("Activité mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["activites-projet"] });
      onSuccess();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour de l'activité"
      );
    },
  });

  const onSubmit = (data: ActiviteProjetFormData) => {
    // Vérifier que les niveaux sont configurés
    if (niveauxActiviteProjet.length === 0) {
      toast.error(
        "Veuillez d'abord configurer les niveaux d'activité projet avant d'ajouter des activités."
      );
      return;
    }

    // Vérifier que le niveau actuel est configuré
    const niveauConfig = niveauxActiviteProjet.find(
      (n) => Number(n.nombre_niveau_activite_projet) === niveau
    );
    if (!niveauConfig) {
      toast.error(
        `Le niveau ${niveau} n'est pas configuré. Veuillez configurer les niveaux d'activité projet.`
      );
      return;
    }

    // Vérifier la taille exacte du code
    if (data.code_activite_projet.length !== fixedCodeLength) {
      toast.error(
        `Le code doit contenir exactement ${fixedCodeLength} caractère(s) selon la configuration du niveau ${niveau}.`
      );
      return;
    }

    // Nettoyer les données
    const cleanedData = {
      ...data,
      parent_activite_projet: data.parent_activite_projet || null,
      code_activite_programme: data.code_activite_programme || null,
      code_projet: data.code_projet || null,
    };

    if (activite) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  // Options pour les activités parent
  const parentOptions = parentActivites.map((act) => ({
    value: act.id_activite_projet,
    label: `${act.code_activite_projet} - ${act.intitule_activite_projet}`,
  }));

  // Options pour les projets
  const projetOptions = projets.map((proj) => ({
    value: proj.code_projet,
    label: `${proj.code_projet} - ${proj.intitule_projet}`,
  }));

  // Options pour les ptba
  const activiteProgrammeOptions = activitesProgramme.map((ap) => ({
    value: ap.code_ap,
    label: `${ap.code_ap} - ${ap.intutile}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code de l'activité */}
        <Controller
          name="code_activite_projet"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                type="text"
                label={`Code de l'activité (${fixedCodeLength} caractère(s) requis)`}
                maxLength={fixedCodeLength}
                error={errors.code_activite_projet}
                required
                placeholder={`Code de ${fixedCodeLength} caractère(s) exactement`}
              />
            </div>
          )}
        />

        {/* Intitulé */}
        <Controller
          name="intitule_activite_projet"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé de l'activité"
              placeholder="Ex: Formation des agriculteurs"
              error={errors.intitule_activite_projet}
              required
            />
          )}
        />

        {/* Activité parent */}
        {niveau > 1 && (
          <Controller
            name="parent_activite_projet"
            control={control}
            render={({ field }) => (
              <SelectInput
                label={`${
                  niveauxActiviteProjet[niveau - 2]
                    ?.libelle_niveau_activite_projet || "Activité parent"
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
                error={errors.parent_activite_projet}
                required={niveau > 1}
              />
            )}
          />
        )}

        {/* Code activité programme */}
        <Controller
          name="code_activite_programme"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Activité programme"
              placeholder="Sélectionner une activité programme"
              options={activiteProgrammeOptions}
              value={
                field.value
                  ? activiteProgrammeOptions.find(
                      (opt) => opt.value === field.value
                    )
                  : null
              }
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              isClearable
              error={errors.code_activite_programme}
            />
          )}
        />

        {/* Code projet */}
        <Controller
          name="code_projet"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Projet"
              placeholder="Sélectionner un projet"
              options={projetOptions}
              value={
                field.value
                  ? projetOptions.find((opt) => opt.value === field.value)
                  : null
              }
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              isClearable
              error={errors.code_projet}
              required
            />
          )}
        />
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
