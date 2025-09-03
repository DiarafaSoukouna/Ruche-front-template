import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import { planSiteService } from "../../../services/planSiteService";
import {
  planSiteSchema,
  type PlanSiteFormData,
} from "../../../schemas/planSiteSchema";
import type { PlanSite } from "../../../types/entities";

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
          <label className="block text-sm font-medium mb-1">
            Niveau hiérarchique <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("niveau_ds", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.niveau_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.niveau_ds.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Code parent <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("parent_ds", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.parent_ds && (
            <p className="text-red-500 text-sm mt-1">
              {errors.parent_ds.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...register("code_relai_ds")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
