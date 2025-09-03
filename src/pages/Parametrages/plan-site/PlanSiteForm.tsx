import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { SingleValue } from "react-select";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { apiClient } from "../../../lib/api";
import type { PlanSite, NiveauStructureConfig } from "../../../types/entities";
import {
  planSiteSchema,
  type PlanSiteFormData,
} from "../../../schemas/planSiteSchema";

interface PlanSiteFormProps {
  planSite?: PlanSite;
  onClose: () => void;
}

export default function PlanSiteForm({ planSite, onClose }: PlanSiteFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!planSite;

  // Fetch all plan sites for parent selection
  const { data: allPlanSites = [] } = useQuery<PlanSite[]>({
    queryKey: ["/plan_site/"],
    queryFn: async (): Promise<PlanSite[]> => {
      const response = await apiClient.request("/plan_site/");
      return Array.isArray(response) ? response : [];
    },
  });

  // Fetch niveau structure config data
  const { data: niveauConfigs = [] } = useQuery<NiveauStructureConfig[]>({
    queryKey: ["/niveau_structure_config/"],
    queryFn: async (): Promise<NiveauStructureConfig[]> => {
      const response = await apiClient.request("/niveau_structure_config/");
      return Array.isArray(response) ? response : [];
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<PlanSiteFormData>({
    resolver: zodResolver(planSiteSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: planSite
      ? {
          code_ds: planSite.code_ds,
          intutile_ds: planSite.intutile_ds,
          niveau_ds: planSite.niveau_ds,
          parent_ds: planSite.parent_ds,
          code_relai_ds: planSite.code_relai_ds,
        }
      : {},
  });

  // Get available parents (structures with lower level than current)
  const currentLevel = watch("niveau_ds");
  const availableParents = currentLevel
    ? allPlanSites.filter((p) => {
        if (!planSite) {
          return p.niveau_ds < currentLevel;
        }
        return p.id_ds !== planSite.id_ds && p.niveau_ds < currentLevel;
      })
    : [];

  const mutation = useMutation({
    mutationFn: async (data: PlanSiteFormData) => {
      if (isEdit) {
        await apiClient.request(`/plan_site/${planSite.id_ds}/`, {
          method: "PUT",
          data: data,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await apiClient.request("/plan_site/", {
          method: "POST",
          data: data,
          headers: { "Content-Type": "application/json" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/plan_site/"] });
      toast.success(
        isEdit
          ? "Plan de site modifié avec succès"
          : "Plan de site créé avec succès"
      );
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  const onSubmit = (data: PlanSiteFormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register("code_ds")}
            label="Code"
            placeholder="Entrez le code"
            error={errors.code_ds}
            required
          />
        </div>

        <div>
          <Input
            {...register("intutile_ds")}
            label="Intitulé"
            placeholder="Entrez l'intitulé"
            error={errors.intutile_ds}
            required
          />
        </div>

        <div>
          <Controller
            name="niveau_ds"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Niveau"
                options={niveauConfigs.map((config) => ({
                  value: config.nombre_nsc,
                  label: `${config.nombre_nsc} - ${config.libelle_nsc}`,
                }))}
                placeholder="Sélectionnez un niveau"
                value={
                  niveauConfigs
                    .map((config) => ({
                      value: config.nombre_nsc,
                      label: `${config.nombre_nsc} - ${config.libelle_nsc}`,
                    }))
                    .find((option) => option.value === field.value) || null
                }
                onChange={(option: SingleValue<{ value: string | number; label: string }>) =>
                  field.onChange(option?.value)
                }
                error={errors.niveau_ds}
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="parent_ds"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Structure parente"
                required
                options={availableParents
                  .filter((parent) => parent.id_ds !== undefined)
                  .map((parent) => ({
                    value: parent.id_ds!,
                    label: `${parent.intitule_ds} (${parent.code_ds}) - Niveau ${parent.niveau_ds}`,
                  }))}
                isClearable
                placeholder="Sélectionnez une structure parente..."
                value={
                  availableParents
                    .filter((parent) => parent.id_ds !== undefined)
                    .map((parent) => ({
                      value: parent.id_ds!,
                      label: `${parent.intitule_ds} (${parent.code_ds}) - Niveau ${parent.niveau_ds}`,
                    }))
                    .find((opt) => opt.value === field.value) || null
                }
                onChange={(option: SingleValue<{ value: string | number; label: string }>) =>
                  field.onChange(option ? Number(option.value) : null)
                }
                error={errors.parent_ds}
              />
            )}
          />
        </div>

        <div>
          <Input
            {...register("code_relai_ds")}
            label="Code relai"
            placeholder="Code de liaison (optionnel)"
            error={errors.code_relai_ds}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </form>
  );
}
