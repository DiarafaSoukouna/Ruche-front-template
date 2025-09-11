import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { dictionnaireIndicateurService } from "../../../services/dictionnaireIndicateurService";
import { uniteIndicateurService } from "../../../services/uniteIndicateurService";
import {
  dictionnaireIndicateurCreateSchema,
  type DictionnaireIndicateurCreateData,
} from "../../../schemas/indicateursSchemas";
import type {
  Acteur,
  DictionnaireIndicateur,
  TypeZone,
  UniteIndicateur,
} from "../../../types/entities";
import { typeZoneService } from "../../../services/typeZoneService";
import { acteurService } from "../../../services/acteurService";

interface DictionnaireIndicateurFormProps {
  dictionnaire?: DictionnaireIndicateur;
  onClose: () => void;
}

export default function DictionnaireIndicateurForm({
  dictionnaire,
  onClose,
}: DictionnaireIndicateurFormProps) {
  const queryClient = useQueryClient();

  // Fetch unités for selection
  const { data: unites = [] } = useQuery<UniteIndicateur[]>({
    queryKey: ["unitesIndicateur"],
    queryFn: uniteIndicateurService.getAll,
  });

  // Fetch type zones for selection
  const { data: typeZones = [] } = useQuery<TypeZone[]>({
    queryKey: ["typeZones"],
    queryFn: typeZoneService.getAll,
  });

  // Fetch acteurs for selection
  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["acteurs"],
    queryFn: acteurService.getAll,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DictionnaireIndicateurCreateData>({
    resolver: zodResolver(dictionnaireIndicateurCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: dictionnaire
      ? {
          code_ref_ind: dictionnaire.code_ref_ind || "",
          intitule_ref_ind: dictionnaire.intitule_ref_ind || "",
          unite_cmr: dictionnaire.unite_cmr?.id_unite || undefined,
          fonction_agregat_cmr: dictionnaire.fonction_agregat_cmr || "",
          echelle: dictionnaire.echelle?.id_type_zone || undefined,
          typologie: dictionnaire.typologie || "",
          seuil_minimum: dictionnaire.seuil_minimum || undefined,
          seuil_maximum: dictionnaire.seuil_maximum || undefined,
          responsable_collecte_cmr:
            dictionnaire.responsable_collecte_cmr?.id_acteur || undefined,
        }
      : {
          code_ref_ind: "",
          intitule_ref_ind: "",
          unite_cmr: undefined,
          fonction_agregat_cmr: "",
          echelle: undefined,
          typologie: "",
          seuil_minimum: undefined,
          seuil_maximum: undefined,
          responsable_collecte_cmr: undefined,
        },
  });

  const createMutation = useMutation({
    mutationFn: dictionnaireIndicateurService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionnaireIndicateur"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DictionnaireIndicateurCreateData) =>
      dictionnaireIndicateurService.update(dictionnaire!.id_ref_ind_ref, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionnaireIndicateur"] });
      onClose();
    },
  });

  const onSubmit = (data: DictionnaireIndicateurCreateData) => {
    if (dictionnaire) {
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
          name="code_ref_ind"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code de référence"
              placeholder="ex: REF001, IND001"
              maxLength={50}
              error={errors.code_ref_ind}
              required
            />
          )}
        />

        <Controller
          name="intitule_ref_ind"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Intitulé"
              placeholder="Intitulé de l'indicateur"
              maxLength={200}
              error={errors.intitule_ref_ind}
              required
            />
          )}
        />

        <Controller
          name="unite_cmr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Unité de mesure"
              required
              placeholder="Sélectionner une unité"
              options={unites.map((unite) => ({
                value: unite.id_unite,
                label: `${unite.unite_ui} - ${unite.definition_ui}`,
              }))}
              value={
                field.value
                  ? unites.find((u) => u.id_unite === field.value)
                    ? {
                        value: field.value,
                        label: `${
                          unites.find((u) => u.id_unite === field.value)!
                            .unite_ui
                        } - ${
                          unites.find((u) => u.id_unite === field.value)!
                            .definition_ui
                        }`,
                      }
                    : null
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              error={errors.unite_cmr}
            />
          )}
        />

        <Controller
          name="fonction_agregat_cmr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Fonction d'agrégation"
              placeholder="Sélectionner une fonction"
              required
              options={[
                { value: "Somme", label: "Somme" },
                { value: "Moyenne", label: "Moyenne" },
                { value: "Minimum", label: "Minimum" },
                { value: "Maximum", label: "Maximum" },
                { value: "Comptage", label: "Comptage" },
                { value: "Médiane", label: "Médiane" },
                { value: "Ratio", label: "Ratio" },
                { value: "Pourcentage", label: "Pourcentage" },
              ]}
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : "");
              }}
              isClearable
              error={errors.fonction_agregat_cmr}
            />
          )}
        />

        <Controller
          name="echelle"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Échelle"
              placeholder="Sélectionner une échelle"
              required
              options={typeZones.map((typeZone) => ({
                value: typeZone.id_type_zone,
                label: typeZone.nom_type_zone,
              }))}
              value={
                field.value
                  ? typeZones.find((tz) => tz.id_type_zone === field.value)
                    ? {
                        value: field.value,
                        label: typeZones.find(
                          (tz) => tz.id_type_zone === field.value
                        )!.nom_type_zone,
                      }
                    : null
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : "");
              }}
              isClearable
              error={errors.echelle}
            />
          )}
        />

        <Controller
          name="typologie"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Typologie"
              placeholder="Sélectionner une typologie"
              required
              options={[
                { value: "Impact", label: "Impact" },
                { value: "Effet", label: "Effet" },
                { value: "Produit", label: "Produit" },
                { value: "Processus", label: "Processus" },
                { value: "Contexte", label: "Contexte" },
              ]}
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : "");
              }}
              isClearable
              error={errors.typologie}
            />
          )}
        />

        <Controller
          name="seuil_minimum"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Seuil minimum"
              placeholder="Valeur minimale"
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : Number(value));
              }}
              error={errors.seuil_minimum}
              required
            />
          )}
        />

        <Controller
          name="seuil_maximum"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Seuil maximum"
              placeholder="Valeur maximale"
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === "" ? undefined : Number(value));
              }}
              error={errors.seuil_maximum}
              required
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="responsable_collecte_cmr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Responsable de collecte"
                placeholder="Responsable de la collecte des données"
                options={acteurs.map((acteur) => ({
                  value: acteur.id_acteur,
                  label: acteur.nom_acteur,
                }))}
                value={
                  field.value
                    ? acteurs.find((acteur) => acteur.id_acteur === field.value)
                      ? {
                          value: field.value,
                          label: `${
                            acteurs.find(
                              (acteur) => acteur.id_acteur === field.value
                            )!.nom_acteur
                          }`,
                        }
                      : null
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }}
                error={errors.responsable_collecte_cmr}
                required
              />
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
          {isLoading
            ? "Enregistrement..."
            : dictionnaire
            ? "Modifier"
            : "Créer"}
        </Button>
      </div>
    </form>
  );
}
