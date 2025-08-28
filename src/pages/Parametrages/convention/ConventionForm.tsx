import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Select from "react-select";
import Button from "../../../components/Button";
import { conventionService } from "../../../services/conventionService";
import { apiClient } from "../../../lib/api";
import {
  conventionFormSchema,
  type ConventionFormData,
  CONVENTION_STATES,
} from "../../../schemas/conventionSchema";
import { Acteur, Convention } from "../../../types/entities";

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

  // Récupération des acteurs pour le select
  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["/acteur/"],
    queryFn: async (): Promise<Acteur[]> => {
      const response = await apiClient.request("/acteur/");
      return Array.isArray(response) ? response : [];
    },
  });

  const {
    register,
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
          date_signature_conv: convention.date_signature_conv.split("T")[0], // Format for date input
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

      if (isEditing) {
        return await conventionService.update(convention.id_convention!, payload);
      } else {
        return await conventionService.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/convention/"] });
      toast.success(
        isEditing
          ? "Convention modifiée avec succès"
          : "Convention créée avec succès"
      );
      onClose();
    },
    onError: () => {
      toast.error(
        isEditing
          ? "Erreur lors de la modification de la convention"
          : "Erreur lors de la création de la convention"
      );
    },
  });

  const onSubmit = (data: ConventionFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Convention */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code Convention <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("code_convention")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: CONV-2024-001"
          />
          {errors.code_convention && (
            <p className="mt-1 text-sm text-red-600">
              {errors.code_convention.message}
            </p>
          )}
        </div>

        {/* Référence Convention */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Référence <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("reference_conv")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Référence de la convention"
          />
          {errors.reference_conv && (
            <p className="mt-1 text-sm text-red-600">
              {errors.reference_conv.message}
            </p>
          )}
        </div>
      </div>

      {/* Intitulé Convention */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Intitulé <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("intutile_conv")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Intitulé de la convention"
        />
        {errors.intutile_conv && (
          <p className="mt-1 text-sm text-red-600">
            {errors.intutile_conv.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (XOF) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("montant_conv", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
          {errors.montant_conv && (
            <p className="mt-1 text-sm text-red-600">
              {errors.montant_conv.message}
            </p>
          )}
        </div>

        {/* Date de signature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de signature <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("date_signature_conv")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.date_signature_conv && (
            <p className="mt-1 text-sm text-red-600">
              {errors.date_signature_conv.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* État */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            État <span className="text-red-500">*</span>
          </label>
          <select
            {...register("etat_conv")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {CONVENTION_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {errors.etat_conv && (
            <p className="mt-1 text-sm text-red-600">
              {errors.etat_conv.message}
            </p>
          )}
        </div>

        {/* Partenaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Partenaire
          </label>
          <Controller
            name="partenaire_conv"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
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
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : null);
                }}
                isClearable
                placeholder="Sélectionner un partenaire..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.partenaire_conv && (
            <p className="mt-1 text-sm text-red-600">
              {errors.partenaire_conv.message}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}

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
