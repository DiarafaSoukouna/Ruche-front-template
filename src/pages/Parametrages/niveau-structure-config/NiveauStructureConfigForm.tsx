import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import Button from "../../../components/Button";
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
        {/* Niveau */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau hiérarchique <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("nombre_nsc", { valueAsNumber: true })}
            defaultValue={1}
            placeholder="ex: 1, 2, 3..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max="99"
          />
          {errors.nombre_nsc && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nombre_nsc.message}
            </p>
          )}
        </div>

        {/* Code numérique */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code numérique <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("code_number_nsc")}
            placeholder="ex: MIN, DIR, SRV"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={20}
          />
          {errors.code_number_nsc && (
            <p className="text-red-500 text-sm mt-1">
              {errors.code_number_nsc.message}
            </p>
          )}
        </div>
      </div>

      {/* Libellé */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Libellé <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("libelle_nsc")}
          placeholder="ex: Ministère, Direction, Service, Sous-service"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={100}
        />
        {errors.libelle_nsc && (
          <p className="text-red-500 text-sm mt-1">
            {errors.libelle_nsc.message}
          </p>
        )}
      </div>

      {/* Programme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Programme <span className="text-red-500">*</span>
        </label>
        <Controller
          name="id_programme"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
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
              noOptionsMessage={() => "Aucun programme trouvé"}
              loadingMessage={() => "Chargement des programmes..."}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: errors.id_programme
                    ? "#ef4444"
                    : state.isFocused
                    ? "#3b82f6"
                    : "#d1d5db",
                  "&:hover": {
                    borderColor: errors.id_programme ? "#ef4444" : "#3b82f6",
                  },
                  boxShadow: state.isFocused
                    ? errors.id_programme
                      ? "0 0 0 1px #ef4444"
                      : "0 0 0 1px #3b82f6"
                    : "none",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                    ? "#eff6ff"
                    : "white",
                  color: state.isSelected ? "white" : "#374151",
                }),
              }}
              formatOptionLabel={(option: ProgrammeSelectOption) => (
                <div>
                  <div className="font-medium">
                    {option.programme.sigle_programme}
                  </div>
                  <div className="text-sm text-gray-500">
                    {option.programme.nom_programme}
                  </div>
                  <div className="text-xs text-gray-400">
                    {option.programme.annee_debut_programme} -{" "}
                    {option.programme.annee_fin_programme}
                  </div>
                </div>
              )}
            />
          )}
        />
        {errors.id_programme && (
          <p className="text-red-500 text-sm mt-1">
            {errors.id_programme.message}
          </p>
        )}
      </div>

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
