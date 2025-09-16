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
import type { CadreStrategique, Acteur, Programme } from "../../../types/entities";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";
import { acteurService } from "../../../services/acteurService";
import { apiClient } from "../../../lib/api";

interface CadreStrategiqueFormProps {
  cadre?: CadreStrategique;
  onClose: () => void;
}

export default function CadreStrategiqueForm({
  cadre,
  onClose,
}: CadreStrategiqueFormProps) {
  const queryClient = useQueryClient();

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

  const { data: cadresParents = [] } = useQuery<CadreStrategique[]>({
    queryKey: ["cadresStrategiquesParents"],
    queryFn: cadreStrategiqueService.getAll,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CadreStrategiqueCreateData>({
    resolver: zodResolver(cadreStrategiqueCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: cadre
      ? {
          code_cs: cadre.code_cs || "",
          intutile_cs: cadre.intutile_cs || "",
          abgrege_cs: cadre.abgrege_cs || "",
          niveau_cs: cadre.niveau_cs || 1,
          cout_axe: cadre.cout_axe || 0,
          date_enregistrement: cadre.date_enregistrement || new Date().toISOString(),
          date_modification: new Date().toISOString(),
          etat: cadre.etat || 1,
          partenaire_cs: cadre.partenaire_cs?.id_acteur || null,
          parent_cs: cadre.parent_cs?.id_cs || null,
          projet_cs: cadre.projet_cs?.id_programme || null,
        }
      : {
          code_cs: "",
          intutile_cs: "",
          abgrege_cs: "",
          niveau_cs: 1,
          cout_axe: 0,
          date_enregistrement: new Date().toISOString(),
          date_modification: new Date().toISOString(),
          etat: 1,
          partenaire_cs: null,
          parent_cs: null,
          projet_cs: null,
        },
  });

  const createMutation = useMutation({
    mutationFn: cadreStrategiqueService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiques"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CadreStrategiqueCreateData) =>
      cadreStrategiqueService.update(cadre!.id_cs, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresStrategiques"] });
      onClose();
    },
  });

  const onSubmit = (data: CadreStrategiqueCreateData) => {
    if (cadre) {
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
          name="code_cs"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code du cadre"
              placeholder="ex: CS001, STRAT001"
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
              placeholder="Niveau hiérarchique"
              min={1}
              max={10}
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
              placeholder="Coût en francs CFA"
              min={0}
              step={1000}
              error={errors.cout_axe}
              required
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

        <Controller
          name="parent_cs"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Cadre parent"
              options={cadresParents
                .filter((c) => c.id_cs !== cadre?.id_cs) // Éviter l'auto-référence
                .map((cadreParent) => ({
                  value: cadreParent.id_cs,
                  label: `${cadreParent.intutile_cs} (${cadreParent.code_cs})`,
                }))}
              value={
                field.value
                  ? cadresParents
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
            />
          )}
        />

        <Controller
          name="projet_cs"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Projet/Programme"
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
              placeholder="Sélectionner un projet..."
              error={errors.projet_cs}
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
            : cadre
            ? "Mettre à jour"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
