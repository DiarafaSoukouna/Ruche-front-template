import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { indicateurCadreResultatService } from "../../../services/indicateurCadreResultatService";
import {
  indicateurCadreResultatCreateSchema,
  type IndicateurCadreResultatCreateData,
} from "../../../schemas/indicateursSchemas";
import type { IndicateurCadreResultat } from "../../../types/entities";

interface IndicateurCadreResultatFormProps {
  indicateur?: IndicateurCadreResultat;
  onClose: () => void;
}

export default function IndicateurCadreResultatForm({
  indicateur,
  onClose,
}: IndicateurCadreResultatFormProps) {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IndicateurCadreResultatCreateData>({
    resolver: zodResolver(indicateurCadreResultatCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: indicateur
      ? {
          niveau_iop: indicateur.niveau_iop,
          code_indicateur_cr_iop: indicateur.code_indicateur_cr_iop || "",
          code_cr_iop: indicateur.code_cr_iop || "",
          intitule_indicateur_cr_iop:
            indicateur.intitule_indicateur_cr_iop || "",
          periodicite_iop: indicateur.periodicite_iop || "",
          source_iop: indicateur.source_iop || "",
          responsable_iop: indicateur.responsable_iop || "",
          description_iop: indicateur.description_iop || "",
          structure_iop: indicateur.structure_iop || "",
          projet_iop: indicateur.projet_iop || "",
        }
      : {
          niveau_iop: undefined,
          code_indicateur_cr_iop: "",
          code_cr_iop: "",
          intitule_indicateur_cr_iop: "",
          periodicite_iop: "",
          source_iop: "",
          responsable_iop: "",
          description_iop: "",
          structure_iop: "",
          projet_iop: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: indicateurCadreResultatService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicateursCadreResultat"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: IndicateurCadreResultatCreateData) =>
      indicateurCadreResultatService.update(
        indicateur!.id_indicateur_cr_iop,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicateursCadreResultat"] });
      onClose();
    },
  });

  const onSubmit = (data: IndicateurCadreResultatCreateData) => {
    if (indicateur) {
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
          name="code_indicateur_cr_iop"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code indicateur CR IOP"
              placeholder="ex: IND001, IOP001"
              maxLength={50}
              error={errors.code_indicateur_cr_iop}
              required
            />
          )}
        />

        <Controller
          name="code_cr_iop"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code CR IOP"
              placeholder="ex: CR001, IOP001"
              maxLength={50}
              error={errors.code_cr_iop}
              required
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="intitule_indicateur_cr_iop"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Intitulé de l'indicateur CR IOP"
                placeholder="Intitulé complet de l'indicateur"
                maxLength={200}
                error={errors.intitule_indicateur_cr_iop}
                required
              />
            )}
          />
        </div>

        <Controller
          name="niveau_iop"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Niveau IOP"
              options={
                [
                  //TODO implementer les niveaux
                ]
              }
              //TODO implementer les niveaux
              value={
                field.value
                  ? { value: field.value, label: `Niveau ${field.value}` }
                  : { value: "", label: "" }
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : 1);
              }}
              placeholder="Sélectionner un niveau..."
              error={errors.niveau_iop}
              required
            />
          )}
        />

        <Controller
          name="periodicite_iop"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Périodicité IOP"
              options={
                [
                  //TODO implementer les periocites
                  // { value: "Mensuel", label: "Mensuel" },
                  // { value: "Trimestriel", label: "Trimestriel" },
                  // { value: "Semestriel", label: "Semestriel" },
                  // { value: "Annuel", label: "Annuel" },
                  // { value: "Ponctuel", label: "Ponctuel" },
                ]
              }
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : "");
              }}
              placeholder="Sélectionner une périodicité..."
              error={errors.periodicite_iop}
              required
            />
          )}
        />

        <Controller
          name="source_iop"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Source IOP"
              placeholder="Source ou système de données"
              maxLength={200}
              error={errors.source_iop}
              required
            />
          )}
        />

        <Controller
          name="responsable_iop"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Responsable IOP"
              placeholder="Responsable de l'indicateur"
              maxLength={200}
              error={errors.responsable_iop}
              required
            />
            // <SelectInput
            //   {...field}
            //   label="Responsable IOP"
            //   options={[
            //     { value: "DNACPN", label: "DNACPN" },
            //     { value: "CPS", label: "CPS" },
            //     { value: "INSTAT", label: "INSTAT" },
            //     { value: "ANPE", label: "ANPE" },
            //     { value: "DGMP", label: "DGMP" },
            //     { value: "Autre", label: "Autre" },
            //   ]}
            //   value={
            //     field.value ? { value: field.value, label: field.value } : null
            //   }
            //   onChange={(selectedOption) => {
            //     field.onChange(selectedOption ? selectedOption.value : "");
            //   }}
            //   placeholder="Sélectionner un responsable..."
            //   error={errors.responsable_iop}
            //   required
            // />
          )}
        />

        <Controller
          name="structure_iop"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Structure IOP"
              placeholder="Structure organisationnelle"
              maxLength={200}
              error={errors.structure_iop}
            />
          )}
        />

        <Controller
          name="projet_iop"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Projet IOP"
              placeholder="Projet associé"
              maxLength={200}
              error={errors.projet_iop}
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="description_iop"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description IOP
                </label>
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                  placeholder="Description détaillée de l'indicateur IOP..."
                  maxLength={1000}
                />
                {errors.description_iop && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.description_iop.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {field.value?.length || 0}/1000 caractères
                </p>
              </div>
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
          {isLoading ? "Enregistrement..." : indicateur ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
