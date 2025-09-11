import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { uniteIndicateurService } from "../../../../services/uniteIndicateurService";
import {
  uniteIndicateurCreateSchema,
  type UniteIndicateurCreateData,
} from "../../../../schemas/indicateursSchemas";
import type { UniteIndicateur } from "../../../../types/entities";

interface UniteIndicateurFormProps {
  unite?: UniteIndicateur;
  onClose: () => void;
}

export default function UniteIndicateurForm({
  unite,
  onClose,
}: UniteIndicateurFormProps) {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UniteIndicateurCreateData>({
    resolver: zodResolver(uniteIndicateurCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: unite
      ? {
          unite_ui: unite.unite_ui || "",
          definition_ui: unite.definition_ui || "",
        }
      : {
          unite_ui: "",
          definition_ui: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: uniteIndicateurService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitesIndicateur"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UniteIndicateurCreateData) =>
      uniteIndicateurService.update(unite!.id_unite, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unitesIndicateur"] });
      onClose();
    },
  });

  const onSubmit = (data: UniteIndicateurCreateData) => {
    if (unite) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Controller
          name="unite_ui"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Unité"
              placeholder="ex: %, Nombre, Kg, etc."
              maxLength={50}
              error={errors.unite_ui}
              required
            />
          )}
        />

        <Controller
          name="definition_ui"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Définition <span className="text-destructive">*</span>
              </label>
              <textarea
                {...field}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                placeholder="Définition détaillée de l'unité d'indicateur..."
                maxLength={500}
              />
              {errors.definition_ui && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.definition_ui.message}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {field.value?.length || 0}/500 caractères
              </p>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : unite ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
