import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import {
  cadreStrategiqueCreateSchema,
  type CadreStrategiqueCreateData,
} from "../../../schemas/cadreStrategiqueSchemas";
import type {
  CadreStrategique,
  Acteur,
  Programme,
} from "../../../types/entities";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";
import { acteurService } from "../../../services/acteurService";
import { apiClient } from "../../../lib/api";
import { useRoot } from "../../../contexts/RootContext";

interface CadreStrategiqueFormProps {
  onClose: () => void;
  niveau: number;
  currentId: number;
  niveauCadreStrategique: any[];
  editRow: CadreStrategique | null;
  cadreByNiveau: () => void;
  dataCadreStrategique: CadreStrategique[];
}

export default function CadreStrategiqueForm({
  onClose,
  niveau,
  currentId,
  niveauCadreStrategique,
  editRow,
  cadreByNiveau,
  dataCadreStrategique,
}: CadreStrategiqueFormProps) {
  const queryClient = useQueryClient();
  const { currentProgramme } = useRoot();

  // Fetch related data
  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["acteurs"],
    queryFn: acteurService.getAll,
  });

  const { data: programmes = [] } = useQuery<Programme[]>({
    queryKey: ["programmes"],
    queryFn: async (): Promise<Programme[]> => {
      const response = await apiClient.request("/programme/");
      return Array.isArray(response) ? response : [];
    },
  });

  // Get parent cadres (previous level)
  const parentCadres = dataCadreStrategique.filter(
    (cadre) => Number(cadre.niveau_cs) === niveau - 1
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CadreStrategiqueCreateData>({
    resolver: zodResolver(cadreStrategiqueCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: editRow
      ? {
          code_cs: editRow.code_cs || "",
          intutile_cs: editRow.intutile_cs || "",
          abgrege_cs: editRow.abgrege_cs || "",
          niveau_cs: Number(editRow.niveau_cs) || niveau,
          cout_axe: editRow.cout_axe || 0,
          partenaire_cs: editRow.partenaire_cs?.id_acteur || null,
          parent_cs:
            typeof editRow.parent_cs === "object"
              ? editRow.parent_cs?.id_cs
              : editRow.parent_cs,
          projet_cs: currentProgramme?.id_programme || null,
        }
      : {
          code_cs: "",
          intutile_cs: "",
          abgrege_cs: "",
          niveau_cs: Number(niveau),
          cout_axe: 0,
          partenaire_cs: null,
          parent_cs: null,
          projet_cs: currentProgramme?.id_programme || null,
        },
  });

  const createMutation = useMutation({
    mutationFn: cadreStrategiqueService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiques"] });
      cadreByNiveau();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CadreStrategiqueCreateData) =>
      cadreStrategiqueService.update(editRow!.id_cs, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiques"] });
      cadreByNiveau();
      onClose();
    },
  });

  const onSubmit = (data: CadreStrategiqueCreateData) => {
    if (editRow) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit as (data: any) => void)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="code_cs"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code du cadre"
              maxLength={50}
              error={errors.code_cs}
              required
            />
          )}
        />

        <Controller
          name="niveau_cs"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Niveau"
              value={niveau}
              disabled
              error={errors.niveau_cs}
              required
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="intutile_cs"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Intitulé du cadre"
                placeholder="Intitulé complet du cadre stratégique"
                maxLength={200}
                error={errors.intutile_cs}
                required
              />
            )}
          />
        </div>

        <Controller
          name="abgrege_cs"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Abrégé"
              placeholder="Abrégé ou acronyme"
              maxLength={100}
              error={errors.abgrege_cs}
              required
            />
          )}
        />

        <Controller
          name="cout_axe"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Coût de l'axe (XOF)"
              placeholder="Coût en Dollar"
              min={0}
              step={1000}
              error={errors.cout_axe}
              required
              onChange={(e) => {
                field.onChange(Number(e.target.value));
              }}
            />
          )}
        />

        <Controller
          name="partenaire_cs"
          control={control}
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
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner un partenaire..."
              error={errors.partenaire_cs}
            />
          )}
        />

        {niveau > 1 && (
          <Controller
            name="parent_cs"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label={`${
                  niveauCadreStrategique[niveau - 2]?.libelle || "Cadre parent"
                }`}
                options={parentCadres.map((cadreParent) => ({
                  value: cadreParent.id_cs,
                  label: `${cadreParent.intutile_cs} (${cadreParent.code_cs})`,
                }))}
                value={
                  field.value
                    ? parentCadres
                        .map((cadreParent) => ({
                          value: cadreParent.id_cs,
                          label: `${cadreParent.intutile_cs} (${cadreParent.code_cs})`,
                        }))
                        .find((option) => option.value === field.value)
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : null);
                }}
                isClearable
                placeholder="Sélectionner un cadre parent..."
                error={errors.parent_cs}
                required={niveau > 1}
              />
            )}
          />
        )}
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
            : editRow
            ? "Mettre à jour"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
