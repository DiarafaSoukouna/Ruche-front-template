import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import SelectInput from "../../../../components/SelectInput";
import { cibleCmrProjetService } from "../../../../services/cibleCmrProjetService";
import { indicateurCadreResultatService } from "../../../../services/indicateurCadreResultatService";
import { uglService } from "../../../../services/uglService";
import {
  cibleCmrProjetSchema,
  type CibleCmrProjetFormData,
} from "../../../../schemas/cibleCmrProjetSchema";
import type {
  CibleCmrProjet,
  IndicateurCadreResultat,
  UGL,
} from "../../../../types/entities";

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
  const { data: indicateurs = [] } = useQuery<IndicateurCadreResultat[]>({
    queryKey: ["indicateurs-cadre-resultat"],
    queryFn: indicateurCadreResultatService.getAll,
  });

  // Récupérer les UGL pour le select
  const { data: ugls = [] } = useQuery<UGL[]>({
    queryKey: ["ugls"],
    queryFn: uglService.getAll,
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
  // Options pour les années (dernières 10 années + 5 années futures)
  const getAnneeOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];

    // Années passées (10 dernières années)
    for (let i = 10; i >= 0; i--) {
      const year = currentYear - i;
      options.push({
        value: new Date(year, 0, 1).toISOString(),
        label: year.toString(),
      });
    }

    // Années futures (10 prochaines années)
    for (let i = 1; i <= 10; i++) {
      const year = currentYear + i;
      options.push({
        value: new Date(year, 0, 1).toISOString(),
        label: year.toString(),
      });
    }

    return options;
  };

  // Options pour les années
  const anneeOptions = getAnneeOptions();

  // Options pour les indicateurs
  const indicateurOptions = indicateurs
    .filter((indicateur) => indicateur.code_indicateur_cr_iop != null)
    .map((indicateur) => ({
      value: indicateur.code_indicateur_cr_iop,
      label: `${indicateur.code_indicateur_cr_iop} - ${indicateur.intitule_indicateur_cr_iop}`,
    }));

  // Options pour les UGL
  const uglOptions = ugls
    .filter((ugl) => ugl.code_ugl != null)
    .map((ugl) => ({
      value: ugl.code_ugl,
      label: `${ugl.code_ugl} - ${ugl.nom_ugl}`,
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
                value={
                  anneeOptions.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value || "")
                }
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
                value={
                  indicateurOptions.find(
                    (option) => option.value === field.value
                  ) || null
                }
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value || null)
                }
              />
            )}
          />
        </div>

        {/* Code UGL */}
        <div>
          <Controller
            name="code_ug"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="UGL (Unité de Gestion Locale)"
                placeholder="Sélectionnez une UGL (optionnel)"
                options={uglOptions}
                error={errors.code_ug}
                value={
                  uglOptions.find((option) => option.value === field.value) ||
                  null
                }
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value || null)
                }
                isClearable
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
