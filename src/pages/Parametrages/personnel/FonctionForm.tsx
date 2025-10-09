import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import TextArea from "../../../components/TextArea";
import { fonctionService } from "../../../services/fonctionService";
import type { Fonction } from "../../../types/entities";

// Schema de validation pour la fonction
const fonctionSchema = z.object({
  nom_fonction: z.string().min(1, "Le nom de la fonction est requis"),
  description_fonction: z.string().min(1, "La description est requise"),
});

type FonctionFormData = z.infer<typeof fonctionSchema>;

interface FonctionFormProps {
  fonction?: Fonction;
  onClose: () => void;
}

export default function FonctionForm({
  fonction,
  onClose,
}: FonctionFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!fonction;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FonctionFormData>({
    resolver: zodResolver(fonctionSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: fonction
      ? {
          nom_fonction: fonction.nom_fonction || "",
          description_fonction: fonction.description_fonction || "",
        }
      : {
          nom_fonction: "",
          description_fonction: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: fonctionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonctions"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FonctionFormData }) =>
      fonctionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fonctions"] });
      onClose();
    },
  });

  const onSubmit = (data: FonctionFormData) => {
    if (isEdit && fonction?.id_fonction) {
      updateMutation.mutate({ id: fonction.id_fonction, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Nom de la fonction */}
        <div>
          <Controller
            name="nom_fonction"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nom de la fonction"
                placeholder="Entrez le nom de la fonction"
                error={errors.nom_fonction}
                required
              />
            )}
          />
        </div>

        {/* Description de la fonction */}
        <div>
          <Controller
            name="description_fonction"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                label="Description de la fonction"
                placeholder="Entrez la description de la fonction"
                error={errors.description_fonction}
                rows={4}
                required
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
          {isLoading
            ? "Enregistrement..."
            : isEdit
            ? "Modifier"
            : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
