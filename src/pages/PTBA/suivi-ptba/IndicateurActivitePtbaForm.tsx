import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import SelectInput from "../../../components/SelectInput";
import type {
  Ptba,
  IndicateurActivitePtba,
  UniteIndicateur,
  IndicateurPerformanceProjet,
} from "../../../types/entities";
import indicateurActivitePtbaService from "../../../services/indicateurActivitePtbaService";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";
import indicateurPerformanceProjetService from "../../../services/indicateurPerformanceProjetService";
import { AxiosError } from "axios";

interface IndicateurActivitePtbaFormProps {
  activite: Ptba;
  indicateur?: IndicateurActivitePtba | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Schéma de validation
const indicateurSchema = z.object({
  code_indicateur_activite: z
    .string()
    .min(1, "Le code est requis")
    .max(50, "Le code ne peut pas dépasser 50 caractères"),
  intitule_indicateur_tache: z
    .string()
    .min(1, "L'intitulé est requis")
    .max(255, "L'intitulé ne peut pas dépasser 255 caractères"),
  code_indicateur_performance: z.string().optional().nullable(),
  abrege_unite: z.number("L'unité est requise"),
});

type IndicateurFormData = z.infer<typeof indicateurSchema>;

export default function IndicateurActivitePtbaForm({
  activite,
  indicateur,
  onClose,
  onSuccess,
}: IndicateurActivitePtbaFormProps) {
  // Fetch unités
  const { data: unites = [] } = useQuery<UniteIndicateur[]>({
    queryKey: ["unites-indicateur"],
    queryFn: uniteIndicateurService.getAll,
  });

  // Fetch indicateurs de performance
  const { data: indicateursPerformance = [] } = useQuery<
    IndicateurPerformanceProjet[]
  >({
    queryKey: ["indicateurs-performance"],
    queryFn: indicateurPerformanceProjetService.getAll,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IndicateurFormData>({
    resolver: zodResolver(indicateurSchema),
    defaultValues: {
      code_indicateur_activite: indicateur?.code_indicateur_activite || "",
      intitule_indicateur_tache: indicateur?.intitule_indicateur_tache || "",
      code_indicateur_performance:
        typeof indicateur?.code_indicateur_performance === "string"
          ? indicateur.code_indicateur_performance
          : "",
      abrege_unite:
        typeof indicateur?.abrege_unite === "number"
          ? indicateur.abrege_unite
          : undefined,
    },
  });

  // Mutation pour créer
  const createMutation = useMutation({
    mutationFn: (data: IndicateurFormData) =>
      indicateurActivitePtbaService.create({
        ...data,
        activite_ptba: activite.code_activite_ptba,
      }),
    onSuccess: () => {
      toast.success("Indicateur créé avec succès");
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
    mutationFn: (data: IndicateurFormData) =>
      indicateurActivitePtbaService.update(indicateur!.id_indicateur_activite, {
        ...data,
        activite_ptba: activite.code_activite_ptba,
      }),
    onSuccess: () => {
      toast.success("Indicateur modifié avec succès");
      onSuccess();
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          "Erreur lors de la modification de l'indicateur"
      );
    },
  });

  const onSubmit = (data: IndicateurFormData) => {
    if (data.code_indicateur_performance === "") {
      data.code_indicateur_performance = null;
    }
    console.log(data);
    
    if (indicateur) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Options pour les unités
  const uniteOptions = unites.map((unite) => ({
    value: unite.id_unite,
    label: `${unite.unite_ui} - ${unite.definition_ui || ""}`,
  }));

  // Options pour les indicateurs de performance
  const indicateurPerformanceOptions = indicateursPerformance.map((ind) => ({
    value: ind.code_indicateur_performance,
    label: `${ind.code_indicateur_performance} - ${ind.intitule_indicateur_tache}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code de l'indicateur */}
        <Controller
          name="code_indicateur_activite"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Code de l'indicateur"
              placeholder="Ex: IND-2024-001"
              error={errors.code_indicateur_activite}
              disabled={!!indicateur} // Désactiver en mode édition
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
              placeholder="Ex: Taux de satisfaction des bénéficiaires"
              error={errors.intitule_indicateur_tache}
              required
            />
          )}
        />

        {/* Unité */}
        <Controller
          name="abrege_unite"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Unité de mesure"
              placeholder="Sélectionner une unité"
              required
              options={[
                { value: "", label: "-- Sélectionner --" },
                ...uniteOptions,
              ]}
              value={
                field.value
                  ? uniteOptions.find((opt) => opt.value === field.value)
                  : undefined
              }
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              error={errors.abrege_unite}
            />
          )}
        />

        {/* Indicateur de performance (optionnel) */}
        <Controller
          name="code_indicateur_performance"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Indicateur de performance"
              placeholder="Sélectionner un indicateur de performance"
              options={[
                { value: "", label: "-- Aucun --" },
                ...indicateurPerformanceOptions,
              ]}
              value={
                field.value
                  ? indicateurPerformanceOptions.find(
                      (opt) => opt.value === field.value
                    )
                  : undefined
              }
              onChange={(option) =>
                option && !Array.isArray(option) && field.onChange(option.value)
              }
              error={errors.code_indicateur_performance}
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
