import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import SelectInput from "../../../components/SelectInput";
import type {
  IndicateurPerformanceProjet,
  UniteIndicateur,
  ActiviteProjet,
} from "../../../types/entities";
import indicateurPerformanceProjetService from "../../../services/indicateurPerformanceProjetService";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";
import activiteProjetService from "../../../services/activiteProjetService";
import { createIndicateurPerformanceProjetSchema } from "../../../schemas/indicateurPerformanceProjetSchemas";
import type { CreateIndicateurPerformanceProjetFormData } from "../../../schemas/indicateurPerformanceProjetSchemas";
import { AxiosError } from "axios";
import Input from "../../../components/Input";
import { Projet } from "../../../types/projet";
import { getAllProjet } from "../../../functions/projet";

interface IndicateurPerformanceProjetFormProps {
  indicateur?: IndicateurPerformanceProjet | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function IndicateurPerformanceProjetForm({
  indicateur,
  onClose,
  onSuccess,
}: IndicateurPerformanceProjetFormProps) {
  const queryClient = useQueryClient();

  // Fetch unités
  const { data: unites = [] } = useQuery<UniteIndicateur[]>({
    queryKey: ["unites-indicateur"],
    queryFn: uniteIndicateurService.getAll,
  });

  // Fetch activités projet
  const { data: activitesProjet = [] } = useQuery<ActiviteProjet[]>({
    queryKey: ["activites-projet"],
    queryFn: activiteProjetService.getAll,
  });

  const { data: projets = [] } = useQuery<Projet[]>({
    queryKey: ["projets"],
    queryFn: () => getAllProjet(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateIndicateurPerformanceProjetFormData>({
    resolver: zodResolver(createIndicateurPerformanceProjetSchema),
    defaultValues: {
      code_indicateur_performance:
        indicateur?.code_indicateur_performance || "",
      intitule_indicateur_tache: indicateur?.intitule_indicateur_tache || "",
      code_activite_projet:
        typeof indicateur?.code_activite_projet === "string"
          ? indicateur.code_activite_projet
          : "",
      unite_indicateur_performance:
        typeof indicateur?.unite_indicateur_performance === "number"
          ? indicateur.unite_indicateur_performance
          : undefined,
      code_projet:
        typeof indicateur?.code_projet === "string"
          ? indicateur.code_projet
          : indicateur?.code_projet?.code_projet || "",
    },
  });

  // Mutation pour créer
  const createMutation = useMutation({
    mutationFn: (data: CreateIndicateurPerformanceProjetFormData) =>
      indicateurPerformanceProjetService.create(data),
    onSuccess: () => {
      toast.success("Indicateur de performance créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["indicateurs-performance"] });
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de la création de l'indicateur"
      );
    },
  });

  // Mutation pour mettre à jour
  const updateMutation = useMutation({
    mutationFn: (data: CreateIndicateurPerformanceProjetFormData) =>
      indicateurPerformanceProjetService.update(
        indicateur!.id_indicateur_performance,
        data
      ),
    onSuccess: () => {
      toast.success("Indicateur de performance modifié avec succès");
      queryClient.invalidateQueries({ queryKey: ["indicateurs-performance"] });
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de la modification de l'indicateur"
      );
    },
  });

  const onSubmit = (data: CreateIndicateurPerformanceProjetFormData) => {
    // Convertir les chaînes vides en null
    const cleanedData = {
      ...data,
      code_activite_projet: data.code_activite_projet || null,
      code_projet: data.code_projet || null,
      unite_indicateur_performance: data.unite_indicateur_performance || null,
    };

    if (indicateur) {
      updateMutation.mutate(cleanedData);
    } else {
      createMutation.mutate(cleanedData);
    }
  };

  // Options pour les unités
  const uniteOptions = unites.map((unite) => ({
    value: unite.id_unite,
    label: `${unite.unite_ui} - ${unite.definition_ui || ""}`,
  }));

  // Options pour les activités projet
  const activiteProjetOptions = activitesProjet.map((activite) => ({
    value: activite.code_activite_projet,
    label: `${activite.code_activite_projet} - ${activite.intitule_activite_projet}`,
  }));

  // Options pour les projets
  const projetOptions = projets.map((proj) => ({
    value: proj.code_projet,
    label: `${proj.code_projet} - ${proj.intitule_projet}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code de l'indicateur */}
        <Controller
          name="code_indicateur_performance"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Code de l'indicateur"
              placeholder="Ex: PERF-2024-001"
              error={errors.code_indicateur_performance}
              disabled={!!indicateur}
              required
            />
          )}
        />

        {/* Intitulé */}
        <Controller
          name="intitule_indicateur_tache"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé de l'indicateur"
              placeholder="Ex: Taux de réussite du projet"
              error={errors.intitule_indicateur_tache}
              required
            />
          )}
        />

        {/* Unité */}
        <Controller
          name="unite_indicateur_performance"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Unité de mesure"
              placeholder="Sélectionner une unité"
              options={[{ value: "", label: "-- Aucune --" }, ...uniteOptions]}
              value={
                field.value
                  ? uniteOptions.find((opt) => opt.value === field.value)
                  : undefined
              }
              onChange={(option) =>
                option &&
                !Array.isArray(option) &&
                field.onChange(option.value || null)
              }
              error={errors.unite_indicateur_performance}
            />
          )}
        />

        {/* Code Activité Projet */}
        <Controller
          name="code_activite_projet"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Activité Projet"
              placeholder="Sélectionner une activité"
              options={[
                { value: "", label: "-- Aucune --" },
                ...activiteProjetOptions,
              ]}
              value={
                field.value
                  ? activiteProjetOptions.find(
                      (opt) => opt.value === field.value
                    )
                  : undefined
              }
              onChange={(option) =>
                option &&
                !Array.isArray(option) &&
                field.onChange(option.value || null)
              }
              error={errors.code_activite_projet}
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

      {/* Actions */}
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
            : indicateur
            ? "Modifier"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
