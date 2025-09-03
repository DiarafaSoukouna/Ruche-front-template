import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import { apiClient } from "../../../lib/api";
import type { PlanSite, NiveauStructureConfig } from "../../../types/entities";
import {
  planSiteSchema,
  type PlanSiteFormData,
} from "../../../schemas/planSiteSchema";
import Select from "react-select";

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
          <label className="block text-sm font-medium mb-1">
            Code <span className="text-red-500">*</span>
          </label>
          <input
            {...register("code_ds")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.code_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.code_ds.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Intitulé <span className="text-red-500">*</span>
          </label>
          <input
            {...register("intutile_ds")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.intutile_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.intutile_ds.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau
          </label>
          <Controller
            name="niveau_ds"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={niveauConfigs.map((config) => ({
                  value: config.nombre_nsc,
                  label: `${config.nombre_nsc} - ${config.libelle_nsc}`,
                }))}
                className="w-full"
                classNamePrefix="react-select"
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value)
                }
                value={
                  niveauConfigs
                    .map((config) => ({
                      value: config.nombre_nsc,
                      label: `${config.nombre_nsc} - ${config.libelle_nsc}`,
                    }))
                    .find((option) => option.value === field.value) || null
                }
                placeholder="Sélectionnez un niveau"
              />
            )}
          />
          {errors.niveau_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.niveau_ds.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Structure parente <span className="text-red-500">*</span>
          </label>
          <Controller
            name="parent_ds"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  ...availableParents.map((parent) => ({
                    value: parent.id_ds,
                    label: `${parent.intitule_ds} (${parent.code_ds}) - Niveau ${parent.niveau_ds}`,
                  })),
                ]}
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Sélectionnez une structure parente..."
                onChange={(option) =>
                  field.onChange(option ? Number(option.value) : null)
                }
                value={
                  availableParents
                    .map((parent) => ({
                      value: parent.id_ds,
                      label: `${parent.intitule_ds} (${parent.code_ds}) - Niveau ${parent.niveau_ds}`,
                    }))
                    .find((opt) => opt.value === field.value) || null
                }
              />
            )}
          />
          {errors.parent_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parent_ds.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Code relai <span className="text-red-500">*</span>
          </label>
          <input
            {...register("code_relai_ds")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Code de liaison (optionnel)"
          />
          {errors.code_relai_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.code_relai_ds.message}
            </p>
          )}
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
