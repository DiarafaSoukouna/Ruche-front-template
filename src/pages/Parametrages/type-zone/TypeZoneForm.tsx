import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import { typeZoneService } from "../../../services/typeZoneService";
import {
  typeZoneSchema,
  type TypeZoneFormData,
} from "../../../schemas/typeZoneSchema";
import type { TypeZone } from "../../../types/entities";

interface TypeZoneFormProps {
  typeZone?: TypeZone;
  onClose: () => void;
}

export default function TypeZoneForm({ typeZone, onClose }: TypeZoneFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!typeZone;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeZoneFormData>({
    resolver: zodResolver(typeZoneSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: typeZone
      ? {
          code_type_zone: typeZone.code_type_zone,
          nom_type_zone: typeZone.nom_type_zone || "",
        }
      : {},
  });

  const mutation = useMutation({
    mutationFn: (data: TypeZoneFormData) =>
      isEdit
        ? typeZoneService.update(typeZone.id_type_zone!, data)
        : typeZoneService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/type_zone/"] });
      toast.success(
        isEdit
          ? "Type de zone modifié avec succès"
          : "Type de zone créé avec succès"
      );
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  const onSubmit = (data: TypeZoneFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Code *</label>
        <input
          {...register("code_type_zone")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {errors.code_type_zone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.code_type_zone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nom</label>
        <input
          {...register("nom_type_zone")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {errors.nom_type_zone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.nom_type_zone.message}
          </p>
        )}
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
