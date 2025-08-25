import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const mutation = useMutation({
    mutationFn: (data: PlanSiteFormData) =>
      isEdit
        ? planSiteService.update(planSite.id_ds!, data)
        : planSiteService.create(data),
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
          <label className="block text-sm font-medium mb-1">
            Code relai <span className="text-red-500">*</span>
          </label>
          <input
            {...register("code_relai_ds")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
