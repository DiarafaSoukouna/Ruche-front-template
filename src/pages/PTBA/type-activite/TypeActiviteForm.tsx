import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import typeActiviteService from "../../../services/typeActiviteService";
import {
  TypeActiviteFormData,
  typeActiviteSchema,
} from "../../../schemas/ptbaSchemas";
import type { TypeActivite } from "../../../types/entities";
import Input from "../../../components/Input";
import TextArea from "../../../components/TextArea";

interface TypeActiviteFormProps {
  type?: TypeActivite;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TypeActiviteForm({
  type,
  onClose,
  onSuccess,
}: TypeActiviteFormProps) {
  const isEditing = !!type;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TypeActiviteFormData>({
    resolver: zodResolver(typeActiviteSchema),
    defaultValues: {
      code_type: type?.code_type || "",
      intutile_type: type?.intutile_type || "",
      description: type?.description || "",
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: typeActiviteService.create,
    onSuccess: () => {
      toast.success("Type d'activité créé avec succès");
      onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TypeActiviteFormData>;
    }) => typeActiviteService.update(id, data),
    onSuccess: () => {
      toast.success("Type d'activité modifié avec succès");
      onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });

  const onSubmit = (data: TypeActiviteFormData) => {
    if (isEditing && type) {
      updateMutation.mutate({ id: type.id_type, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="code_type"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Code du type"
              placeholder="Ex: FORM, SENS, EQUIP"
              error={errors.code_type}
              required
            />
          )}
        />

        <Controller
          name="intutile_type"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé du type"
              placeholder="Ex: Formation, Sensibilisation, Équipement"
              error={errors.intutile_type}
              required
            />
          )}
        />
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Description"
            placeholder="Description détaillée du type d'activité..."
            rows={4}
            error={errors.description}
            required
          />
        )}
      />

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isEditing ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
