import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { niveauCadreAnalytiqueService } from "../../../services/niveauCadreAnalytiqueService";
import { 
  niveauCadreAnalytiqueSchema, 
  typeNiveauOptions,
  type NiveauCadreAnalytiqueFormData 
} from "../../../schemas/niveauCadreAnalytiqueSchema";
import type { NiveauCadreAnalytique } from "../../../types/entities";

interface NiveauCadreAnalytiqueFormProps {
  niveau?: NiveauCadreAnalytique;
  onClose: () => void;
}

export default function NiveauCadreAnalytiqueForm({
  niveau,
  onClose,
}: NiveauCadreAnalytiqueFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!niveau;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NiveauCadreAnalytiqueFormData>({
    resolver: zodResolver(niveauCadreAnalytiqueSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: niveau
      ? {
          nombre_nca: niveau.nombre_nca || 0,
          libelle_nca: niveau.libelle_nca || "",
          code_number_nca: niveau.code_number_nca || 0,
          type_niveau: (niveau.type_niveau || 1) as 1 | 2 | 3,
        }
      : {
          nombre_nca: 0,
          libelle_nca: "",
          code_number_nca: 0,
          type_niveau: 1 as 1 | 2 | 3,
        },
  });

  const createMutation = useMutation({
    mutationFn: niveauCadreAnalytiqueService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["niveaux-cadre-analytique"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NiveauCadreAnalytiqueFormData }) =>
      niveauCadreAnalytiqueService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["niveaux-cadre-analytique"] });
      onClose();
    },
  });

  const onSubmit = (data: NiveauCadreAnalytiqueFormData) => {
    if (isEdit && niveau?.id_nca) {
      updateMutation.mutate({ id: niveau.id_nca, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <Controller
            name="nombre_nca"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Nombre"
                placeholder="Entrez le nombre du niveau"
                error={errors.nombre_nca}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                required
              />
            )}
          />
        </div>

        {/* Code numérique */}
        <div>
          <Controller
            name="code_number_nca"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Code numérique"
                placeholder="Entrez le code numérique"
                error={errors.code_number_nca}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                required
              />
            )}
          />
        </div>

        {/* Libellé */}
        <div className="md:col-span-2">
          <Controller
            name="libelle_nca"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Libellé"
                placeholder="Entrez le libellé du niveau"
                error={errors.libelle_nca}
                required
              />
            )}
          />
        </div>

        {/* Type de niveau */}
        <div className="md:col-span-2">
          <Controller
            name="type_niveau"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de niveau <span className="text-red-500">*</span>
                </label>
                <select
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez le type de niveau</option>
                  {typeNiveauOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.type_niveau && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type_niveau.message}
                  </p>
                )}
              </div>
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
