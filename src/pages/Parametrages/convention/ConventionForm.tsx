import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { conventionService } from "../../../services/conventionService";
import { apiClient } from "../../../lib/api";
import {
  conventionFormSchema,
  type ConventionFormData,
  CONVENTION_STATES,
} from "../../../schemas/conventionSchema";
import { Acteur, Convention } from "../../../types/entities";
import SelectInput from "../../../components/SelectInput";

interface ConventionFormProps {
  convention?: Convention;
  onClose: () => void;
}

export default function ConventionForm({
  convention,
  onClose,
}: ConventionFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!convention;

  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["/acteur/"],
    queryFn: async (): Promise<Acteur[]> => {
      const response = await apiClient.request("/acteur/");
      return Array.isArray(response) ? response : [];
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ConventionFormData>({
    resolver: zodResolver(conventionFormSchema),
    defaultValues: convention
      ? {
          code_convention: convention.code_convention,
          intutile_conv: convention.intutile_conv,
          reference_conv: convention.reference_conv,
          montant_conv: convention.montant_conv,
          date_signature_conv: convention.date_signature_conv.split("T")[0],
          etat_conv: convention.etat_conv,
          partenaire_conv: convention.partenaire_conv?.id_acteur || null,
        }
      : {
          code_convention: "",
          intutile_conv: "",
          reference_conv: "",
          montant_conv: 0,
          date_signature_conv: "",
          etat_conv: "active",
          partenaire_conv: null,
        },
  });

  const mutation = useMutation({
    mutationFn: async (data: ConventionFormData) => {
      const payload = {
        ...data,
        partenaire_conv: data.partenaire_conv || null,
      };
      return isEditing
        ? conventionService.update(convention!.id_convention!, payload)
        : conventionService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/convention/"] });
      onClose();
    },
  });

  const onSubmit = (data: ConventionFormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          control={control}
          name="code_convention"
          render={({ field }) => (
            <Input
              {...field}
              label="Code convention"
              placeholder="Ex: CONV-2024-001"
              error={errors.code_convention}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="reference_conv"
          render={({ field }) => (
            <Input
              {...field}
              label="Référence convention"
              placeholder="Référence de la convention"
              error={errors.reference_conv}
              required
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="intutile_conv"
        render={({ field }) => (
          <Input
            {...field}
            label="Intitulé convention"
            placeholder="Intitulé de la convention"
            error={errors.intutile_conv}
            required
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          control={control}
          name="montant_conv"
          render={({ field }) => (
            <Input
              {...field}
              label="Montant convention ($)"
              placeholder="Montant ($)"
              type="number"
              error={errors.montant_conv}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === "" ? undefined : Number(val));
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="date_signature_conv"
          render={({ field }) => (
            <Input
              {...field}
              label="Date signature convention"
              type="date"
              error={errors.date_signature_conv}
              required
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Controller
            control={control}
            name="etat_conv"
            render={({ field }) => (
              <SelectInput
                {...field}
                options={CONVENTION_STATES.map((state) => ({
                  value: state.value,
                  label: state.label,
                }))}
                label="État"
                required
                value={
                  CONVENTION_STATES.map((state) => ({
                    value: state.value,
                    label: state.label,
                  })).find((option) => option.value === field.value) || null
                }
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : "")
                }
                error={errors.etat_conv}
                placeholder="Sélectionner un état"
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="partenaire_conv"
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Partenaire"
                options={acteurs.map((acteur) => ({
                  value: acteur.id_acteur,
                  label: `${acteur.nom_acteur} (${acteur.code_acteur})`,
                }))}
                value={
                  field.value
                    ? acteurs
                        .map((acteur) => ({
                          value: acteur.id_acteur,
                          label: `${acteur.nom_acteur} (${acteur.code_acteur})`,
                        }))
                        .find((option) => option.value === field.value)
                    : null
                }
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : null)
                }
                isClearable
                placeholder="Sélectionner un partenaire..."
                classNamePrefix="react-select"
                error={errors.partenaire_conv}
              />
            )}
          />
        </div>
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
