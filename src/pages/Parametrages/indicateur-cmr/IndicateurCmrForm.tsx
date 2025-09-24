import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { indicateurCmrService } from "../../../services/indicateurCmrService";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";
import {
  indicateurCmrCreateSchema,
  type IndicateurCmrCreateData,
} from "../../../schemas/indicateursSchemas";
import type { IndicateurCmr, UniteIndicateur } from "../../../types/entities";

interface IndicateurCmrFormProps {
  indicateur?: IndicateurCmr;
  onClose: () => void;
}

export default function IndicateurCmrForm({
  indicateur,
  onClose,
}: IndicateurCmrFormProps) {
  const queryClient = useQueryClient();

  // Fetch related data
  const { data: unites = [] } = useQuery<UniteIndicateur[]>({
    queryKey: ["unitesIndicateur"],
    queryFn: uniteIndicateurService.getAll,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IndicateurCmrCreateData>({
    resolver: zodResolver(indicateurCmrCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: indicateur
      ? {
          code_ref_ind: indicateur.code_ref_ind || undefined,
          Resultat_cmr: indicateur.resultat_cmr || undefined,
          intitule_ref_ind: indicateur.intitule_ref_ind || undefined,
          reference_cmr: indicateur.reference_cmr || undefined,
          annee_reference:
            indicateur.annee_reference || new Date().getFullYear(),
          responsable_collecte_cmr:
            indicateur.responsable_collecte_cmr || undefined,
          cible_cmr: indicateur.cible_cmr || undefined,
          fonction_agregat_cmr: indicateur.fonction_agregat_cmr || undefined,
          unite_cmr: indicateur.unite_cmr?.id_unite || null,
        }
      : {
          code_ref_ind: undefined,
          Resultat_cmr: undefined,
          intitule_ref_ind: undefined,
          reference_cmr: undefined,
          annee_reference: new Date().getFullYear(),
          responsable_collecte_cmr: undefined,
          cible_cmr: undefined,
          fonction_agregat_cmr: undefined,
          unite_cmr: null,
        },
  });

  const createMutation = useMutation({
    mutationFn: indicateurCmrService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicateursCmr"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: IndicateurCmrCreateData) =>
      indicateurCmrService.update(indicateur!.id_ref_ind_cmr, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicateursCmr"] });
      onClose();
    },
  });

  const onSubmit = (data: IndicateurCmrCreateData) => {
    if (indicateur) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="code_ref_ind"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code de référence"
              placeholder="ex: CMR001, REF001"
              maxLength={50}
              error={errors.code_ref_ind}
              required
            />
          )}
        />

        <Controller
          name="annee_reference"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Année de référence"
              placeholder="ex: 2024"
              min={2000}
              max={2050}
              error={errors.annee_reference}
              required
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="intitule_ref_ind"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Intitulé de l'indicateur"
                placeholder="Intitulé complet de l'indicateur de référence"
                maxLength={200}
                error={errors.intitule_ref_ind}
                required
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <Controller
            name="Resultat_cmr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Résultat CMR"
                placeholder="Résultat attendu du cadre de mesure de résultats"
                maxLength={200}
                error={errors.Resultat_cmr}
                required
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <Controller
            name="reference_cmr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Référence CMR"
                placeholder="Référence du cadre de mesure de résultats"
                maxLength={200}
                error={errors.reference_cmr}
                required
              />
            )}
          />
        </div>

        <Controller
          name="unite_cmr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Unité de mesure"
              options={unites.map((unite) => ({
                value: unite.id_unite,
                label: `${unite.unite_ui} - ${unite.definition_ui}`,
              }))}
              value={
                field.value
                  ? unites
                      .map((unite) => ({
                        value: unite.id_unite,
                        label: `${unite.unite_ui} - ${unite.definition_ui}`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner une unité..."
              error={errors.unite_cmr}
            />
          )}
        />

        <Controller
          name="cible_cmr"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Cible CMR"
              placeholder="Valeur cible à atteindre"
              maxLength={50}
              error={errors.cible_cmr}
              required
            />
          )}
        />

        <Controller
          name="fonction_agregat_cmr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Fonction d'agrégation"
              placeholder="Sélectionner une fonction"
              required
              options={[
                { value: "Somme", label: "Somme" },
                { value: "Moyenne", label: "Moyenne" },
                { value: "Minimum", label: "Minimum" },
                { value: "Maximum", label: "Maximum" },
                { value: "Comptage", label: "Comptage" },
                { value: "Médiane", label: "Médiane" },
                { value: "Ratio", label: "Ratio" },
                { value: "Pourcentage", label: "Pourcentage" },
              ]}
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : "");
              }}
              isClearable
              error={errors.fonction_agregat_cmr}
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="responsable_collecte_cmr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Responsable de collecte"
                placeholder="Responsable de la collecte des données"
                maxLength={100}
                error={errors.responsable_collecte_cmr}
                required
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : indicateur ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
