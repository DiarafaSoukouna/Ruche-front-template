import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import {
  cadreStrategiqueConfigCreateSchema,
  type CadreStrategiqueConfigCreateData,
  getTypeOptions,
} from "../../../schemas/cadreStrategiqueSchemas";
import type { CadreStrategiqueConfig, Programme } from "../../../types/entities";
import { cadreStrategiqueConfigService } from "../../../services/cadreStrategiqueConfigService";
import { apiClient } from "../../../lib/api";

interface CadreStrategiqueConfigFormProps {
  config?: CadreStrategiqueConfig;
  onClose: () => void;
}

export default function CadreStrategiqueConfigForm({
  config,
  onClose,
}: CadreStrategiqueConfigFormProps) {
  const queryClient = useQueryClient();

  // Fetch programmes for selection
  const { data: programmes = [] } = useQuery<Programme[]>({
    queryKey: ["programmes"],
    queryFn: async (): Promise<Programme[]> => {
      const response = await apiClient.request("/programme/");
      return Array.isArray(response) ? response : [];
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CadreStrategiqueConfigCreateData>({
    resolver: zodResolver(cadreStrategiqueConfigCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: config
      ? {
          nombre: config.nombre || 1,
          libelle_csc: config.libelle_csc || "",
          type_csc: config.type_csc || 1,
          date_enregistrement: config.date_enregistrement || new Date().toISOString(),
          date_modification: new Date().toISOString(),
          etat: config.etat || 1,
          programme: config.programme?.id_programme || null,
        }
      : {
          nombre: 1,
          libelle_csc: "",
          type_csc: 1,
          date_enregistrement: new Date().toISOString(),
          date_modification: new Date().toISOString(),
          etat: 1,
          programme: null,
        },
  });

  const createMutation = useMutation({
    mutationFn: cadreStrategiqueConfigService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiquesConfigs"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CadreStrategiqueConfigCreateData) =>
      cadreStrategiqueConfigService.update(config!.id_csc, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiquesConfigs"] });
      onClose();
    },
  });

  const onSubmit = (data: CadreStrategiqueConfigCreateData) => {
    if (config) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="libelle_csc"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Libellé de la configuration"
              placeholder="ex: Configuration Effet Principal"
              maxLength={100}
              error={errors.libelle_csc}
              required
            />
          )}
        />

        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Nombre"
              placeholder="Nombre d'éléments"
              min={1}
              max={1000}
              error={errors.nombre}
              required
            />
          )}
        />

        <Controller
          name="type_csc"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Type de configuration"
              options={getTypeOptions()}
              value={
                field.value
                  ? getTypeOptions().find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : 1);
              }}
              placeholder="Sélectionner un type..."
              error={errors.type_csc}
              required
            />
          )}
        />

        <Controller
          name="programme"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Programme"
              options={programmes.map((programme) => ({
                value: programme.id_programme,
                label: `${programme.nom_programme} (${programme.code_programme})`,
              }))}
              value={
                field.value
                  ? programmes
                      .map((programme) => ({
                        value: programme.id_programme,
                        label: `${programme.nom_programme} (${programme.code_programme})`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner un programme..."
              error={errors.programme}
            />
          )}
        />

        <Controller
          name="etat"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="État"
              options={[
                { value: 1, label: "Actif" },
                { value: 0, label: "Inactif" },
              ]}
              value={
                field.value !== undefined
                  ? {
                      value: field.value,
                      label: field.value === 1 ? "Actif" : "Inactif",
                    }
                  : { value: 1, label: "Actif" }
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : 1);
              }}
              placeholder="Sélectionner un état..."
              error={errors.etat}
            />
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
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Enregistrement..."
            : config
            ? "Mettre à jour"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
