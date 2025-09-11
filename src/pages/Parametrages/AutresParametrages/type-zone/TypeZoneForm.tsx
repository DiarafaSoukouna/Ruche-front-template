import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { typeZoneService } from "../../../../services/typeZoneService";
import {
  typeZoneSchema,
  type TypeZoneFormData,
} from "../../../../schemas/typeZoneSchema";
import type { TypeZone } from "../../../../types/entities";

interface TypeZoneFormProps {
  typeZone?: TypeZone;
  onClose: () => void;
}

export default function TypeZoneForm({ typeZone, onClose }: TypeZoneFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!typeZone;

  const {
    control,
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
      : {
          code_type_zone: "",
          nom_type_zone: "",
        },
  });

  const mutation = useMutation({
    mutationFn: (data: TypeZoneFormData) =>
      isEdit
        ? typeZoneService.update(typeZone.id_type_zone!, data)
        : typeZoneService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/type_zone/"] });
      onClose();
    },
  });

  const onSubmit = (data: TypeZoneFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="code_type_zone"
        render={({ field }) => (
          <Input
            {...field}
            label="Code"
            placeholder="Code du type de zone"
            error={errors.code_type_zone}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="nom_type_zone"
        render={({ field }) => (
          <Input
            {...field}
            label="Nom"
            placeholder="Nom du type de zone"
            error={errors.nom_type_zone}
            required
          />
        )}
      />

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
