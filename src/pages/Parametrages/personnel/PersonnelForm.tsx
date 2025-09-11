import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import SelectInput from "../../../components/SelectInput";
import { personnelService } from "../../../services/personnelService";
import { fonctionService } from "../../../services/fonctionService";
import { titrePersonnelService } from "../../../services/titrePersonnelService";
import { planSiteService } from "../../../services/planSiteService";
import { apiClient } from "../../../lib/api";
import {
  personnelCreateSchema,
  type PersonnelCreateData,
} from "../../../schemas/personnelSchema";
import type {
  Personnel,
  TitrePersonnel,
  PlanSite,
} from "../../../types/entities";
import type { Localite, Structure, Fonction } from "../../../types/entities";

interface PersonnelFormProps {
  personnel?: Personnel;
  onClose: () => void;
}

export default function PersonnelForm({
  personnel,
  onClose,
}: PersonnelFormProps) {
  const queryClient = useQueryClient();
  const isEdit = !!personnel;

  // Récupération des données pour les selects
  const { data: regions = [] } = useQuery<Localite[]>({
    queryKey: ["/localite/"],
    queryFn: async (): Promise<Localite[]> => {
      const response = await apiClient.request("/localite/");
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: structures = [] } = useQuery<Structure[]>({
    queryKey: ["/acteur/"],
    queryFn: async (): Promise<Structure[]> => {
      const response = await apiClient.request("/acteur/");
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: fonctions = [] } = useQuery<Fonction[]>({
    queryKey: ["fonctions"],
    queryFn: fonctionService.getAll,
  });

  const { data: planSites = [] } = useQuery<PlanSite[]>({
    queryKey: ["planSites"],
    queryFn: planSiteService.getAll,
  });

  const { data: titres = [] } = useQuery<TitrePersonnel[]>({
    queryKey: ["titresPersonnel"],
    queryFn: titrePersonnelService.getAll,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonnelCreateData>({
    resolver: zodResolver(personnelCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: personnel
      ? {
          email: personnel.email || "",
          id_personnel_perso: personnel.id_personnel_perso || "",
          titre_personnel: personnel.titre_personnel?.id_titre || undefined,
          prenom_perso: personnel.prenom_perso || "",
          nom_perso: personnel.nom_perso || "",
          contact_perso: personnel.contact_perso || "",
          fonction_perso: personnel.fonction_perso?.id_fonction || undefined,
          service_perso: personnel.service_perso?.id_ds || undefined,
          niveau_perso: personnel.niveau_perso || 1,
          rapport_mensuel_perso: personnel.rapport_mensuel_perso || false,
          rapport_trimestriel_perso:
            personnel.rapport_trimestriel_perso || false,
          rapport_semestriel_perso: personnel.rapport_semestriel_perso || false,
          rapport_annuel_perso: personnel.rapport_annuel_perso || false,
          region_perso: personnel.region_perso?.id_loca || undefined,
          structure_perso: personnel.structure_perso?.id_acteur || undefined,
        }
      : {
          niveau_perso: 1,
        },
  });

  const mutation = useMutation({
    mutationFn: (data: PersonnelCreateData) =>
      isEdit
        ? personnelService.update(personnel.n_personnel!, data)
        : personnelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/personnel/"] });
      onClose();
    },
  });

  const onSubmit = (data: PersonnelCreateData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="nom_perso"
          render={({ field }) => (
            <Input
              {...field}
              label="Nom"
              placeholder="Nom de famille"
              error={errors.nom_perso}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="prenom_perso"
          render={({ field }) => (
            <Input
              {...field}
              label="Prénom(s)"
              placeholder="Prénom(s)"
              error={errors.prenom_perso}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="id_personnel_perso"
          render={({ field }) => (
            <Input
              {...field}
              label="Identifiant"
              placeholder="Identifiant du personnel"
              error={errors.id_personnel_perso}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              label="Email"
              placeholder="Adresse email"
              error={errors.email}
              required
            />
          )}
        />

        <Controller
          name="titre_personnel"
          control={control}
          rules={{ required: "Le titre est obligatoire" }}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Titre"
              required
              options={titres.map((titre) => ({
                value: titre.id_titre,
                label: titre.libelle_titre,
              }))}
              placeholder="Sélectionner un titre"
              value={
                field.value
                  ? {
                      value: field.value,
                      label:
                        titres.find((t) => t.id_titre === field.value)
                          ?.libelle_titre || `ID: ${field.value}`,
                    }
                  : null
              }
              onChange={(option) => field.onChange(option?.value)}
              error={errors.titre_personnel}
            />
          )}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Contact <span className="text-red-500">*</span>
          </label>
          <Controller
            name="contact_perso"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="GN"
                value={value || undefined}
                onChange={(phoneValue) => {
                  onChange(phoneValue || "");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          />
          {errors.contact_perso && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contact_perso.message}
            </p>
          )}
        </div>

        <Controller
          name="structure_perso"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Structure"
              required
              options={structures.map((structure) => ({
                value: structure.id_acteur,
                label: `${structure.nom_acteur} (${structure.code_acteur})`,
              }))}
              value={
                field.value
                  ? structures
                      .map((structure) => ({
                        value: structure.id_acteur,
                        label: `${structure.nom_acteur} (${structure.code_acteur})`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner une structure..."
              error={errors.structure_perso}
            />
          )}
        />

        <Controller
          name="service_perso"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Service/Direction"
              options={planSites.map((planSite) => ({
                value: planSite.id_ds!,
                label: `${planSite.intutile_ds} (${planSite.code_ds})`,
              }))}
              value={
                field.value
                  ? planSites
                      .map((planSite) => ({
                        value: planSite.id_ds!,
                        label: `${planSite.intutile_ds} (${planSite.code_ds})`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner un service..."
              error={errors.service_perso}
              isSearchable
            />
          )}
        />

        <Controller
          name="fonction_perso"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Fonction"
              required
              options={fonctions.map((fonction) => ({
                value: fonction.id_fonction!,
                label: fonction.nom_fonction,
              }))}
              value={
                field.value
                  ? fonctions
                      .map((fonction) => ({
                        value: fonction.id_fonction!,
                        label: fonction.nom_fonction,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner une fonction..."
              error={errors.fonction_perso}
            />
          )}
        />

        <Controller
          name="niveau_perso"
          control={control}
          rules={{ required: "Le niveau d'accès est obligatoire" }}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Niveau d'accès"
              required
              options={[
                { value: 1, label: "Éditeur" },
                { value: 2, label: "Visiteur" },
              ]}
              placeholder="Sélectionner un niveau d'accès"
              onChange={(option) =>
                field.onChange(option ? Number(option.value) : null)
              }
              value={
                field.value
                  ? {
                      value: field.value,
                      label: field.value === 1 ? "Éditeur" : "Visiteur",
                    }
                  : null
              }
              error={errors.niveau_perso}
            />
          )}
        />

        <Controller
          name="region_perso"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              label="Région"
              required
              options={regions.map((region) => ({
                value: region.id_loca,
                label: `${region.intitule_loca} (${region.code_loca})`,
              }))}
              value={
                field.value
                  ? regions
                      .map((region) => ({
                        value: region.id_loca,
                        label: `${region.intitule_loca} (${region.code_loca})`,
                      }))
                      .find((option) => option.value === field.value)
                  : null
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : null);
              }}
              isClearable
              placeholder="Sélectionner une région..."
              error={errors.region_perso}
            />
          )}
        />
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
