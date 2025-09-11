import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { TitrePersonnel } from "../../../../types/entities";
import { titrePersonnelService } from "../../../../services/titrePersonnelService";
import {
  titrePersonnelSchema,
  TitrePersonnelFormData,
} from "../../../../schemas/titrePersonnelSchema";

interface TitrePersonnelFormProps {
  titre?: TitrePersonnel;
  onClose: () => void;
}

export default function TitrePersonnelForm({
  titre,
  onClose,
}: TitrePersonnelFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!titre;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TitrePersonnelFormData>({
    resolver: zodResolver(titrePersonnelSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      libelle_titre: titre?.libelle_titre || "",
      description_titre: titre?.description_titre || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TitrePersonnelFormData) =>
      isEditing
        ? titrePersonnelService.update(titre.id_titre, data)
        : titrePersonnelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titresPersonnel"] });
      onClose();
    },
  });

  const onSubmit = (data: TitrePersonnelFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Controller
          control={control}
          name="libelle_titre"
          render={({ field }) => (
            <Input
              label="Libellé"
              required
              {...field}
              error={errors.libelle_titre}
              placeholder="Ex: Monsieur, Madame, Docteur..."
            />
          )}
        />

        <Controller
          control={control}
          name="description_titre"
          render={({ field }) => (
            <Input
              label="Description"
              {...field}
              error={errors.description_titre}
              placeholder="Description du titre..."
            />
          )}
        />
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
