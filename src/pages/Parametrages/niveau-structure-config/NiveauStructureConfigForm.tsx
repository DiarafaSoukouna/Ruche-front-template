import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { niveauStructureConfigService } from "../../../services/niveauStructureConfigService";
import { programmeService } from "../../../services/programmeService";
import {
  niveauStructureConfigFormSchema,
  type NiveauStructureConfigFormData,
} from "../../../schemas/niveauStructureConfigSchema";
import type { NiveauStructureConfig } from "../../../types/entities";
import type { ProgrammeSelectOption } from "../../../types/programme";

interface NiveauStructureConfigFormProps {
  config?: NiveauStructureConfig;
  onClose: () => void;
}

export default function NiveauStructureConfigForm({
  config,
  onClose,
}: NiveauStructureConfigFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!config;

  // Fetch programmes for select options
  const { data: programmeOptions = [], isLoading: isLoadingProgrammes } =
    useQuery<ProgrammeSelectOption[]>({
      queryKey: ["/programme/", "select-options"],
      queryFn: programmeService.getSelectOptions,
    });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<NiveauStructureConfigFormData>({
    resolver: zodResolver(niveauStructureConfigFormSchema),
    defaultValues: isEditing
      ? {
          nombre_nsc: config.nombre_nsc,
          libelle_nsc: config.libelle_nsc,
          code_number_nsc: config.code_number_nsc,
          id_programme: config.id_programme || undefined,
        }
      : {
          nombre_nsc: 1,
          libelle_nsc: "",
          code_number_nsc: "",
          id_programme: undefined,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: NiveauStructureConfigFormData) =>
      isEditing
        ? niveauStructureConfigService.update(config!.id_nsc!, data)
        : niveauStructureConfigService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/niveau_structure_config/"],
      });
      queryClient.invalidateQueries({ queryKey: ["/plan_site/"] }); // Refresh plan sites too
      onClose();
    },
    onError: (error) => {
      console.error("Erreur lors de l'enregistrement:", error);
    },
  });

  const onSubmit = (data: NiveauStructureConfigFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register("nombre_nsc", { valueAsNumber: true })}
          type="number"
          label="Niveau hiérarchique"
          placeholder="ex: 1, 2, 3..."
          defaultValue={1}
          min="1"
          max="99"
          error={errors.nombre_nsc}
          required
        />

        <Input
          {...register("code_number_nsc")}
          type="text"
          label="Code numérique"
          placeholder="ex: MIN, DIR, SRV"
          maxLength={20}
          error={errors.code_number_nsc}
          required
        />
      </div>

      <Input
        {...register("libelle_nsc")}
        type="text"
        label="Libellé"
        placeholder="ex: Ministère, Direction, Service, Sous-service"
        maxLength={100}
        error={errors.libelle_nsc}
        required
      />

      <Controller
        name="id_programme"
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            label="Programme"
            required
            options={programmeOptions}
            value={
              programmeOptions.find(
                (option) => option.value === field.value
              ) || null
            }
            onChange={(selectedOption) => {
              field.onChange(selectedOption?.value || 0);
            }}
            placeholder="Sélectionner un programme..."
            isLoading={isLoadingProgrammes}
            isSearchable
            isClearable
            error={errors.id_programme}
          />
        )}
      />

      {/* Aperçu */}
      {watch("libelle_nsc") && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h4>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Niveau {watch("nombre_nsc")} - {watch("libelle_nsc")}
            </span>
            <span className="text-xs text-gray-500">
              Code: {watch("code_number_nsc") || "Non défini"}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="min-w-[120px]"
        >
          {mutation.isPending
            ? "Enregistrement..."
            : `${isEditing ? "Modifier" : "Créer"} le niveau`}
        </Button>
      </div>
    </form>
  );
}
