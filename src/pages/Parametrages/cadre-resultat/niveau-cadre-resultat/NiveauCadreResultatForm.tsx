import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import SelectInput from "../../../../components/SelectInput";
import { niveauCadreResultatService } from "../../../../services/niveauCadreResultatService";
import {
  niveauCadreResultatCreateSchema,
  getTypeNiveauOptions,
  type NiveauCadreResultatCreateData,
} from "../../../../schemas/cadreResultatSchemas";
import type { NiveauCadreResultat } from "../../../../types/entities";

interface NiveauCadreResultatFormProps {
  niveau?: NiveauCadreResultat;
  onClose: () => void;
}

export default function NiveauCadreResultatForm({
  niveau,
  onClose,
}: NiveauCadreResultatFormProps) {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NiveauCadreResultatCreateData>({
    resolver: zodResolver(niveauCadreResultatCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: niveau
      ? {
          nombre_ncr: niveau.nombre_ncr || 0,
          libelle_ncr: niveau.libelle_ncr || "",
          code_number_ncr: niveau.code_number_ncr || 0,
          type_niveau: niveau.type_niveau || 1,
        }
      : {
          nombre_ncr: 0,
          libelle_ncr: "",
          code_number_ncr: 0,
          type_niveau: 1,
        },
  });

  const createMutation = useMutation({
    mutationFn: niveauCadreResultatService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["niveauxCadreResultat"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: NiveauCadreResultatCreateData) =>
      niveauCadreResultatService.update(niveau!.id_ncr, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["niveauxCadreResultat"] });
      onClose();
    },
  });

  const onSubmit = (data: NiveauCadreResultatCreateData) => {
    if (niveau) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const typeNiveauOptions = getTypeNiveauOptions();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="nombre_ncr"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Nombre"
              placeholder="Entrez le nombre"
              min={1}
              error={errors.nombre_ncr}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              required
            />
          )}
        />

        <Controller
          name="code_number_ncr"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Code numérique"
              placeholder="Entrez le code numérique"
              min={1}
              error={errors.code_number_ncr}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              required
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="libelle_ncr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Libellé"
                placeholder="Entrez le libellé du niveau"
                maxLength={100}
                error={errors.libelle_ncr}
                required
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <Controller
            name="type_niveau"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Type de niveau"
                placeholder="Sélectionnez le type de niveau"
                options={typeNiveauOptions}
                value={
                  typeNiveauOptions.find(
                    (option) => option.value === field.value
                  ) || null
                }
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value || 1)
                }
                error={errors.type_niveau}
                required
              />
            )}
          />
        </div>
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
          {isLoading ? "Enregistrement..." : niveau ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
