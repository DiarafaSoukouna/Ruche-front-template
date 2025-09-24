import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { cadreResultatService } from "../../../services/cadreResultatService";
import { niveauCadreResultatService } from "../../../services/niveauCadreResultatService";
import { acteurService } from "../../../services/acteurService";
import { programmeService } from "../../../services/programmeService";
import {
  cadreResultatCreateSchema,
  type CadreResultatCreateData,
} from "../../../schemas/cadreResultatSchemas";
import type {
  CadreResultat,
  NiveauCadreResultat,
  Acteur,
  Programme,
} from "../../../types/entities";

interface CadreResultatFormProps {
  cadre?: CadreResultat;
  onClose: () => void;
}

export default function CadreResultatForm({
  cadre,
  onClose,
}: CadreResultatFormProps) {
  const queryClient = useQueryClient();

  // Fetch related data
  const { data: niveaux = [] } = useQuery<NiveauCadreResultat[]>({
    queryKey: ["niveauxCadreResultat"],
    queryFn: niveauCadreResultatService.getAll,
  });

  const { data: acteurs = [] } = useQuery<Acteur[]>({
    queryKey: ["acteurs"],
    queryFn: acteurService.getAll,
  });

  const { data: programmes = [] } = useQuery<Programme[]>({
    queryKey: ["programmes"],
    queryFn: programmeService.getAll,
  });

  const { data: cadresResultat = [] } = useQuery<CadreResultat[]>({
    queryKey: ["cadresResultat"],
    queryFn: () => cadreResultatService.getAll(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<CadreResultatCreateData>({
    resolver: zodResolver(cadreResultatCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: cadre
      ? {
          code_cr: cadre.code_cr || "",
          intutile_cr: cadre.intutile_cr || "",
          abgrege_cr: cadre.abgrege_cr || "",
          cout_axe: cadre.cout_axe || 0,
          etat: cadre.etat ?? "Actif",
          niveau_cr: cadre.niveau_cr || null,
          partenaire_cr:
            typeof cadre.partenaire_cr === "object"
              ? cadre.partenaire_cr?.code_acteur
              : cadre.partenaire_cr,
          parent_cr: cadre.parent_cr || null,
          projet_cr: cadre.projet_cr || null,
        }
      : {
          code_cr: "",
          intutile_cr: "",
          abgrege_cr: "",
          cout_axe: 0,
          etat: "Actif",
          niveau_cr: null,
          partenaire_cr: null,
          parent_cr: null,
          projet_cr: null,
        },
  });

  const selectedNiveau = watch("niveau_cr");

  const createMutation = useMutation({
    mutationFn: cadreResultatService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresResultat"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CadreResultatCreateData) =>
      cadreResultatService.update(cadre!.id_cr, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresResultat"] });
      onClose();
    },
  });

  const onSubmit = (data: CadreResultatCreateData) => {
    if (cadre) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Filter parent options based on selected niveau
  const parentOptions = cadresResultat
    .filter((c) => {
      if (!selectedNiveau) return false;
      const selectedNiveauData = niveaux.find(
        (n) => n.id_ncr === selectedNiveau
      );
      const candidateNiveauData = c.niveau_cr
        ? niveaux.find((n) => n.id_ncr === c.niveau_cr)
        : null;

      // Parent must be from a higher level (lower nombre_ncr)
      return (
        candidateNiveauData &&
        selectedNiveauData &&
        candidateNiveauData.nombre_ncr < selectedNiveauData.nombre_ncr &&
        c.id_cr !== cadre?.id_cr
      ); // Exclude self
    })
    .map((c) => ({
      value: c.id_cr,
      label: `${c.code_cr} - ${c.intutile_cr}`,
    }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="code_cr"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code du cadre"
              placeholder="ex: CR001, RES001"
              maxLength={50}
              error={errors.code_cr}
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
              label="Coût de l'axe"
              placeholder="Entrez le coût"
              min={0}
              error={errors.cout_axe}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              required
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="intutile_cr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Intitulé du cadre"
                placeholder="Intitulé complet du cadre de résultat"
                maxLength={200}
                error={errors.intutile_cr}
                required
              />
            )}
          />
        </div>

        <Controller
          name="abgrege_cr"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Abrégé"
              placeholder="Abrégé du cadre"
              maxLength={50}
              error={errors.abgrege_cr}
              required
            />
          )}
        />

        <Controller
          name="niveau_cr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Niveau"
              placeholder="Sélectionnez un niveau"
              options={niveaux.map((niveau) => ({
                value: niveau.id_ncr,
                label: `${niveau.nombre_ncr} - ${niveau.libelle_ncr}`,
              }))}
              value={
                field.value
                  ? niveaux
                      .map((niveau) => ({
                        value: niveau.id_ncr,
                        label: `${niveau.nombre_ncr} - ${niveau.libelle_ncr}`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              error={errors.niveau_cr}
            />
          )}
        />

        {selectedNiveau && parentOptions.length > 0 && (
          <Controller
            name="parent_cr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Cadre parent"
                placeholder="Sélectionnez un cadre parent"
                options={parentOptions}
                value={
                  field.value
                    ? parentOptions.find(
                        (option) => option.value === field.value
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : null);
                }}
                isClearable
                error={errors.parent_cr}
              />
            )}
          />
        )}

        <Controller
          name="partenaire_cr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Partenaire"
              placeholder="Sélectionnez un partenaire"
              options={acteurs.map((acteur) => ({
                value: acteur.code_acteur,
                label: `${acteur.code_acteur} - ${acteur.nom_acteur}`,
              }))}
              value={
                field.value
                  ? acteurs
                      .map((acteur) => ({
                        value: acteur.code_acteur,
                        label: `${acteur.code_acteur} - ${acteur.nom_acteur}`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              error={errors.partenaire_cr}
            />
          )}
        />

        <Controller
          name="projet_cr"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Projet"
              placeholder="Sélectionnez un projet"
              options={programmes.map((programme) => ({
                value: programme.id_programme,
                label: `${programme.code_programme} - ${programme.nom_programme}`,
              }))}
              value={
                field.value
                  ? programmes
                      .map((programme) => ({
                        value: programme.id_programme,
                        label: `${programme.code_programme} - ${programme.nom_programme}`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              error={errors.projet_cr}
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
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : cadre ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
