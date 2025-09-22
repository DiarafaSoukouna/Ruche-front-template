import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { cibleCmrProjetService } from "../../../services/cibleCmrProjetService";
import { indicateurCadreResultatService } from "../../../services/indicateurCadreResultatService";
import {
  cibleCmrProjetSchema,
  getAnneeOptions,
  type CibleCmrProjetFormData,
} from "../../../schemas/cibleCmrProjetSchema";
import type { CibleCmrProjet } from "../../../types/entities";

interface CibleCmrProjetFormProps {
  cible?: CibleCmrProjet;
  onClose: () => void;
}

export default function CibleCmrProjetForm({
  cible,
  onClose,
}: CibleCmrProjetFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!cible;

  // Récupérer les indicateurs pour le select
  const { data: indicateurs = [] } = useQuery({
    queryKey: ["indicateurs-cadre-resultat"],
    queryFn: indicateurCadreResultatService.getAll,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CibleCmrProjetFormData>({
    resolver: zodResolver(cibleCmrProjetSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: cible
      ? {
          annee: cible.annee || "",
          valeur_cible_indcateur_crp: cible.valeur_cible_indcateur_crp || 0,
          code_indicateur_crp: cible.code_indicateur_crp || null,
          code_ug: cible.code_ug || "",
          code_projet: cible.code_projet || "",
        }
      : {
          annee: "",
          valeur_cible_indcateur_crp: 0,
          code_indicateur_crp: null,
          code_ug: "",
          code_projet: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: cibleCmrProjetService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cibles-cmr-projet"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CibleCmrProjetFormData }) =>
      cibleCmrProjetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cibles-cmr-projet"] });
      onClose();
    },
  });

  const onSubmit = (data: CibleCmrProjetFormData) => {
    if (isEdit && cible?.id_cible_indicateur_crp) {
      updateMutation.mutate({ id: cible.id_cible_indicateur_crp, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Options pour les années
  const anneeOptions = getAnneeOptions();

  // Options pour les indicateurs
  const indicateurOptions = indicateurs
    .filter((indicateur) => indicateur.id_icr != null)
    .map((indicateur) => ({
      value: Number(indicateur.id_icr),
      label: `${indicateur.code_icr} - ${indicateur.libelle_icr}`,
    }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Année */}
        <div>
          <Controller
            name="annee"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Année de la cible"
                placeholder="Sélectionnez l'année"
                options={anneeOptions}
                error={errors.annee}
                required
                value={anneeOptions.find(option => option.value === field.value) || null}
                onChange={(selectedOption) => field.onChange(selectedOption?.value || "")}
              />
            )}
          />
        </div>

        {/* Valeur cible */}
        <div>
          <Controller
            name="valeur_cible_indcateur_crp"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Valeur cible de l'indicateur CRP"
                placeholder="Entrez la valeur cible"
                error={errors.valeur_cible_indcateur_crp}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                required
              />
            )}
          />
        </div>

        {/* Indicateur de résultat */}
        <div className="md:col-span-2">
          <Controller
            name="code_indicateur_crp"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Indicateur de résultat du projet"
                placeholder="Sélectionnez un indicateur (optionnel)"
                options={indicateurOptions}
                error={errors.code_indicateur_crp}
                value={indicateurOptions.find(option => option.value === field.value) || null}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value ? Number(selectedOption.value) : null)
                }
              />
            )}
          />
        </div>

        {/* Code UG */}
        <div>
          <Controller
            name="code_ug"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Code UG"
                placeholder="Entrez le code UG (optionnel)"
                error={errors.code_ug}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            )}
          />
        </div>

        {/* Code projet */}
        <div>
          <Controller
            name="code_projet"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Code du projet concerné"
                placeholder="Entrez le code du projet (optionnel)"
                error={errors.code_projet}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : isEdit ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
