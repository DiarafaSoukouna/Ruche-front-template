import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import SelectInput from "../../../../components/SelectInput";
import { niveauCadreStrategiqueService } from "../../../../services/niveauCadreStrategiqueService";
import { toast } from "react-toastify";
import type { NiveauCadreStrategique } from "../../../../types/entities";

// Schéma pour un niveau individuel
const niveauSchema = z.object({
  nombre_nsc: z.number().min(1, "Le nombre est obligatoire"),
  libelle_nsc: z.string().min(1, "Le libellé est obligatoire"),
  code_number_nsc: z.number().min(1, "Le code numérique est obligatoire"),
  type_niveau: z.union([z.literal("1"), z.literal("2"), z.literal("3")], {
    error: "Sélectionnez un type de niveau",
  }),
});

// Schéma pour le formulaire complet
const multiNiveauSchema = z.object({
  niveaux: z.array(niveauSchema).min(1, "Au moins un niveau est requis"),
});

type MultiNiveauFormData = z.infer<typeof multiNiveauSchema>;

interface NiveauCadreStrategiqueMultiFormProps {
  onBack: () => void;
  onSuccess: () => void;
  editingNiveau?: NiveauCadreStrategique;
}

export default function NiveauCadreStrategiqueMultiForm({
  onBack,
  onSuccess,
  editingNiveau,
}: NiveauCadreStrategiqueMultiFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!editingNiveau;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MultiNiveauFormData>({
    resolver: zodResolver(multiNiveauSchema),
    defaultValues: {
      niveaux:
        isEdit && editingNiveau
          ? [
              {
                nombre_nsc: editingNiveau.nombre_nsc,
                libelle_nsc: editingNiveau.libelle_nsc,
                code_number_nsc: editingNiveau.code_number_nsc,
                type_niveau: editingNiveau.type_niveau.toString() as
                  | "1"
                  | "2"
                  | "3",
              },
            ]
          : [
              {
                nombre_nsc: 1,
                libelle_nsc: "",
                code_number_nsc: 1,
                type_niveau: "1",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "niveaux",
  });

  const typeNiveauOptions = [
    { value: "1", label: "1 - Effet" },
    { value: "2", label: "2 - Produit" },
    { value: "3", label: "3 - Impact" },
  ];

  const addNiveau = () => {
    append({
      nombre_nsc: fields.length + 1,
      libelle_nsc: "",
      code_number_nsc: fields.length + 1,
      type_niveau: "1",
    });
  };

  const removeNiveau = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: MultiNiveauFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit && editingNiveau) {
        // Mode édition - un seul niveau
        const niveauData = {
          nombre_nsc: data.niveaux[0].nombre_nsc,
          libelle_nsc: data.niveaux[0].libelle_nsc,
          code_number_nsc: data.niveaux[0].code_number_nsc,
          type_niveau: parseInt(data.niveaux[0].type_niveau) as 1 | 2 | 3,
        };

        await niveauCadreStrategiqueService.update(
          editingNiveau.id_nsc,
          niveauData
        );
        toast.success("Niveau stratégique modifié avec succès");
      } else {
        // Mode création - plusieurs niveaux possibles
        const niveauxToCreate = data.niveaux.map((niveau) => ({
          nombre_nsc: niveau.nombre_nsc,
          libelle_nsc: niveau.libelle_nsc,
          code_number_nsc: niveau.code_number_nsc,
          type_niveau: parseInt(niveau.type_niveau) as 1 | 2 | 3,
        }));

        // Créer tous les niveaux en parallèle avec Promise.all
        await Promise.all(
          niveauxToCreate.map((niveau) =>
            niveauCadreStrategiqueService.create(niveau)
          )
        );

        toast.success(
          `${niveauxToCreate.length} niveau(x) stratégique(s) créé(s) avec succès`
        );
      }

      onSuccess();
      onBack();
    } catch (error) {
      toast.error(
        isEdit
          ? "Erreur lors de la modification du niveau"
          : "Erreur lors de la création des niveaux"
      );
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Modifier le niveau" : "Ajouter des niveaux"}
          </h2>
          <p className="text-gray-600">
            {isEdit
              ? "Modifiez les informations du niveau stratégique"
              : "Ajoutez un ou plusieurs niveaux stratégiques"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Niveau {index + 1}
                </h3>
                {!isEdit && fields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeNiveau(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <Controller
                  name={`niveaux.${index}.nombre_nsc`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label="Nombre"
                      placeholder="Entrez le nombre"
                      error={errors.niveaux?.[index]?.nombre_nsc}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      required
                    />
                  )}
                />

                {/* Code numérique */}
                <Controller
                  name={`niveaux.${index}.code_number_nsc`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label="Code numérique"
                      placeholder="Entrez le code numérique"
                      error={errors.niveaux?.[index]?.code_number_nsc}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      required
                    />
                  )}
                />

                {/* Libellé */}
                <Controller
                  name={`niveaux.${index}.libelle_nsc`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Libellé"
                      placeholder="Entrez le libellé"
                      error={errors.niveaux?.[index]?.libelle_nsc}
                      required
                    />
                  )}
                />

                {/* Type de niveau */}
                <Controller
                  name={`niveaux.${index}.type_niveau`}
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      label="Type de niveau"
                      placeholder="Sélectionnez le type"
                      options={typeNiveauOptions}
                      error={errors.niveaux?.[index]?.type_niveau}
                      value={
                        typeNiveauOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "1")
                      }
                      required
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bouton pour ajouter un niveau (seulement en mode création) */}
        {!isEdit && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addNiveau}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un niveau
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Enregistrement..."
              : isEdit
              ? "Modifier"
              : "Créer les niveaux"}
          </Button>
        </div>
      </form>
    </div>
  );
}
