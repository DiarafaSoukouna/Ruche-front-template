import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import TextArea from "../../../components/TextArea";
// MultiSelectInput est maintenant SelectInput avec isMulti={true}
import ptbaService from "../../../services/ptbaService";
import typeActiviteService from "../../../services/typeActiviteService";
import { acteurService } from "../../../services/acteurService";
import { personnelService } from "../../../services/personnelService";
import { cadreStrategiqueService } from "../../../services/cadreStrategiqueService";
import { PtbaFormData, ptbaSchema } from "../../../schemas/ptbaSchemas";
import type { Programme, Ptba, VersionPtba } from "../../../types/entities";
import ChronogrammeSelector from "./ChronogrammeSelector";
import { allLocalite } from "../../../functions/localites/gets";
import { useRoot } from "../../../contexts/RootContext";
import versionPtbaService from "../../../services/versionPtbaService";

interface PtbaFormProps {
  activite?: Ptba;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PtbaForm({
  activite,
  onClose,
  onSuccess,
}: PtbaFormProps) {
  const isEditing = !!activite;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PtbaFormData>({
    resolver: zodResolver(ptbaSchema),
    defaultValues: {
      localites_ptba: activite?.localites_ptba || [],
      partenaire_conserne_ptba: activite?.partenaire_conserne_ptba || [],
      code_activite_ptba: activite?.code_activite_ptba || "",
      intitule_activite_ptba: activite?.intitule_activite_ptba || "",
      chronogramme: activite?.chronogramme || "",
      observation: activite?.observation || "",
      statut_activite: activite?.statut_activite || "Planifiée",
      code_crp: activite?.code_crp || "",
      responsable_ptba: activite?.responsable_ptba || undefined,
      code_programme: activite?.code_programme || "",
      version_ptba: activite?.version_ptba,
      type_activite: activite?.type_activite || 0,
    },
  });

  // Fetch options
  const { data: versions = [] } = useQuery({
    queryKey: ["versions"],
    queryFn: versionPtbaService.getAll,
  });

  const { data: typesActivite = [] } = useQuery({
    queryKey: ["types-activite"],
    queryFn: typeActiviteService.getAll,
  });

  const { data: localites = [] } = useQuery({
    queryKey: ["localites"],
    queryFn: allLocalite,
  });

  const { data: acteurs = [] } = useQuery({
    queryKey: ["acteurs"],
    queryFn: acteurService.getAll,
  });

  const { data: personnel = [] } = useQuery({
    queryKey: ["personnel"],
    queryFn: personnelService.getAll,
  });

  const { data: cadresStrategiques = [] } = useQuery({
    queryKey: ["cadres-strategiques"],
    queryFn: () => cadreStrategiqueService.getAll(),
  });

  const { currentProgramme }: { currentProgramme: Programme } = useRoot();

  // Mutations
  const createMutation = useMutation({
    mutationFn: ptbaService.create,
    onSuccess: () => {
      toast.success("Activité créée avec succès");
      onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PtbaFormData> }) =>
      ptbaService.update(id, data),
    onSuccess: () => {
      toast.success("Activité modifiée avec succès");
      onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
    },
  });

  const onSubmit = (data: PtbaFormData) => {
    if (isEditing && activite) {
      data.code_programme = currentProgramme?.code_programme;
      updateMutation.mutate({ id: activite.id_ptba, data });
    } else {
      data.code_programme = currentProgramme?.code_programme;
      createMutation.mutate(data);
    }
  };

  // Options pour les selects
  const typeActiviteOptions = typesActivite.map((type) => ({
    value: type.id_type,
    label: type.intutile_type,
  }));

  const localiteOptions = localites.map((localite) => ({
    value: localite.id_loca,
    label: localite.intitule_loca,
  }));

  const acteurOptions = acteurs.map((acteur) => ({
    value: acteur.id_acteur,
    label: acteur.nom_acteur,
  }));

  const personnelOptions = personnel.map((p) => ({
    value: p.n_personnel!,
    label: `${p.prenom_perso} ${p.nom_perso}`,
  }));

  const cadreStrategiqueOptions = cadresStrategiques.map((cadre) => ({
    value: cadre.code_cs,
    label: cadre.intutile_cs,
  }));

  const versionPtbaOptions = versions.map((version: VersionPtba) => ({
    value: version.id_version_ptba,
    label: version.version_ptba
      ? version.version_ptba + " - " + version.annee_ptba.toString()
      : version.annee_ptba.toString(),
  }));

  const statutOptions = [
    { value: "Planifiée", label: "Planifiée" },
    { value: "En cours", label: "En cours" },
    { value: "Terminée", label: "Terminée" },
    { value: "Suspendue", label: "Suspendue" },
    { value: "Annulée", label: "Annulée" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Informations de base
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="code_activite_ptba"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Code d'activité"
                placeholder="Ex: ACT-2024-001"
                error={errors.code_activite_ptba}
                required
              />
            )}
          />

          <Controller
            name="type_activite"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Type d'activité"
                options={typeActiviteOptions}
                value={typeActiviteOptions.find(
                  (opt) => opt.value === field.value
                )}
                onChange={(option) =>
                  option &&
                  !Array.isArray(option) &&
                  field.onChange(Number(option?.value))
                }
                error={errors.type_activite}
                required
              />
            )}
          />
        </div>

        <Controller
          name="intitule_activite_ptba"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Intitulé de l'activité"
              placeholder="Décrivez l'activité..."
              error={errors.intitule_activite_ptba}
              required
            />
          )}
        />
      </div>

      {/* Chronogramme */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Chronogramme</h3>

        <Controller
          name="chronogramme"
          control={control}
          render={({ field }) => (
            <ChronogrammeSelector
              value={field.value}
              onChange={field.onChange}
              error={errors.chronogramme?.message}
            />
          )}
        />
      </div>

      {/* Localisation et partenaires */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Localisation et partenaires
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="localites_ptba"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Localités concernées"
                options={localiteOptions}
                value={localiteOptions.filter((opt) =>
                  field.value?.includes(opt.value)
                )}
                onChange={(selectedOptions) => {
                  const values =
                    selectedOptions && Array.isArray(selectedOptions)
                      ? selectedOptions.map((opt) => opt.value)
                      : [];
                  field.onChange(values);
                }}
                error={
                  errors.localites_ptba ? errors.localites_ptba[0] : undefined
                }
                isMulti={true}
                required
              />
            )}
          />

          <Controller
            name="partenaire_conserne_ptba"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Partenaires concernés"
                options={acteurOptions}
                value={acteurOptions.filter((opt) =>
                  field.value?.includes(opt.value)
                )}
                onChange={(selectedOptions) => {
                  const values =
                    selectedOptions && Array.isArray(selectedOptions)
                      ? selectedOptions.map((opt) => opt.value)
                      : [];
                  field.onChange(values);
                }}
                error={
                  errors.partenaire_conserne_ptba
                    ? errors.partenaire_conserne_ptba[0]
                    : undefined
                }
                isMulti={true}
                required
              />
            )}
          />
        </div>
      </div>

      {/* Gestion et suivi */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Gestion et suivi</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="statut_activite"
            control={control}
            render={({ field }) => (
              <SelectInput
                label="Statut de l'activité"
                options={statutOptions}
                value={statutOptions.find((opt) => opt.value === field.value)}
                onChange={(option) =>
                  option &&
                  !Array.isArray(option) &&
                  field.onChange(option?.value)
                }
                error={errors.statut_activite}
                required
              />
            )}
          />

          <Controller
            name="version_ptba"
            control={control}
            render={({ field }) => {
              const versionOptions = [
                { value: "", label: "Aucune version" },
                ...versionPtbaOptions,
              ];
              return (
                <SelectInput
                  label="Version PTBA"
                  options={versionOptions}
                  value={versionOptions.find(
                    (opt) => opt.value === (field.value || "")
                  )}
                  onChange={(option) =>
                    option &&
                    !Array.isArray(option) &&
                    field.onChange(option?.value || "")
                  }
                  error={errors.version_ptba}
                  required
                />
              );
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="code_crp"
            control={control}
            render={({ field }) => {
              const cadreOptions = [
                { value: "", label: "Aucun cadre" },
                ...cadreStrategiqueOptions,
              ];
              return (
                <SelectInput
                  label="Cadre stratégique"
                  options={cadreOptions}
                  value={cadreOptions.find(
                    (opt) => opt.value === (field.value || "")
                  )}
                  onChange={(option) =>
                    option &&
                    !Array.isArray(option) &&
                    field.onChange(option?.value || "")
                  }
                  error={errors.code_crp}
                />
              );
            }}
          />

          <Controller
            name="responsable_ptba"
            control={control}
            render={({ field }) => {
              const responsableOptions = [
                { value: "", label: "Aucun responsable" },
                ...personnelOptions,
              ];
              return (
                <SelectInput
                  label="Responsable"
                  options={responsableOptions}
                  value={responsableOptions.find(
                    (opt) => opt.value === (field.value || "")
                  )}
                  onChange={(option) =>
                    option &&
                    !Array.isArray(option) &&
                    field.onChange(option?.value)
                  }
                  error={errors.responsable_ptba}
                />
              );
            }}
          />
        </div>
      </div>

      {/* Observations */}
      <Controller
        name="observation"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Observations"
            placeholder="Observations ou commentaires sur l'activité..."
            rows={4}
            error={errors.observation}
          />
        )}
      />

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          {isEditing ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
