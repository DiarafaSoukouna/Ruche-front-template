import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import Button from "../../../components/Button";
import { personnelService } from "../../../services/personnelService";
import { apiClient } from "../../../lib/api";
import {
  personnelCreateSchema,
  type PersonnelCreateData,
} from "../../../schemas/personnelSchema";
import type { Personnel } from "../../../types/entities";
import { TitrePersonnelEnum } from "../../../types/entities";
import type { Region, Structure, UGL } from "../../../types/entities";

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
  const { data: regions = [] } = useQuery<Region[]>({
    queryKey: ["/localite/"],
    queryFn: async (): Promise<Region[]> => {
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

  const { data: ugls = [] } = useQuery<UGL[]>({
    queryKey: ["/ugl/"],
    queryFn: async (): Promise<UGL[]> => {
      const response = await apiClient.request("/ugl/");
      return Array.isArray(response) ? response : [];
    },
  });

  const {
    register,
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
          titre_personnel: personnel.titre_personnel || TitrePersonnelEnum.M,
          prenom_perso: personnel.prenom_perso || "",
          nom_perso: personnel.nom_perso || "",
          contact_perso: personnel.contact_perso || "",
          fonction_perso: personnel.fonction_perso || "",
          description_fonction_perso:
            personnel.description_fonction_perso || "",
          niveau_perso: personnel.niveau_perso || 1,
          rapport_mensuel_perso: personnel.rapport_mensuel_perso || false,
          rapport_trimestriel_perso:
            personnel.rapport_trimestriel_perso || false,
          rapport_semestriel_perso: personnel.rapport_semestriel_perso || false,
          rapport_annuel_perso: personnel.rapport_annuel_perso || false,
          statut: personnel.statut || "Actif",
          region_perso:
            typeof personnel.region_perso === "number"
              ? personnel.region_perso
              : undefined,
          structure_perso:
            typeof personnel.structure_perso === "number"
              ? personnel.structure_perso
              : undefined,
          ugl_perso:
            typeof personnel.ugl_perso === "number"
              ? personnel.ugl_perso
              : undefined,
          projet_active_perso: Array.isArray(personnel.projet_active_perso)
            ? personnel.projet_active_perso.join(", ")
            : personnel.projet_active_perso || "",
        }
      : {
        titre_personnel: TitrePersonnelEnum.M,
        niveau_perso: 1,
        statut: "Actif",
      },
  });

  const mutation = useMutation({
    mutationFn: (data: PersonnelCreateData) =>
      isEdit
        ? personnelService.update(personnel.n_personnel!, data)
        : personnelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/personnel/"] });
      toast.success(
        isEdit ? "Personnel modifié avec succès" : "Personnel créé avec succès"
      );
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  const onSubmit = (data: PersonnelCreateData) => {
    mutation.mutate(data);
  };

  const onError = (errors: Record<string, { message?: string }>) => {
    console.log("Validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Identifiant <span className="text-red-500">*</span>
              </label>
              <input
                {...register("id_personnel_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.id_personnel_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.id_personnel_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Titre <span className="text-red-500">*</span>
              </label>

              <Controller
                name="titre_personnel"
                control={control}
                rules={{ required: "Le titre est obligatoire" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: TitrePersonnelEnum.M, label: "Masculin" },
                      { value: TitrePersonnelEnum.F, label: "Féminin" },
                    ]}
                    classNamePrefix="react-select"
                    onChange={(option) => field.onChange(option?.value)}
                    value={
                      field.value
                        ? {
                            value: field.value,
                            label:
                              field.value === TitrePersonnelEnum.M
                                ? "Masculin"
                                : "Féminin",
                          }
                        : null
                    }
                  />
                )}
              />

              {errors.titre_personnel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.titre_personnel.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fonction <span className="text-red-500">*</span>
              </label>
              <input
                {...register("fonction_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.fonction_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fonction_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                {...register("nom_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.nom_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nom_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Prénom(s) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("prenom_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.prenom_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.prenom_perso.message}
                </p>
              )}
            </div>

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
                    defaultCountry="ML"
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

            <div>
              <label className="block text-sm font-medium mb-1">
                Structure <span className="text-red-500">*</span>
              </label>
              <Controller
                name="structure_perso"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
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
                      field.onChange(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    isClearable
                    placeholder="Sélectionner une structure..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.structure_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.structure_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Unité de gestion locale <span className="text-red-500">*</span>
              </label>
              <Controller
                name="ugl_perso"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ugls.map((ugl) => ({
                      value: ugl.id_ugl,
                      label: `${ugl.nom_ugl} (${ugl.code_ugl})`,
                    }))}
                    value={
                      field.value
                        ? ugls
                            .map((ugl) => ({
                              value: ugl.id_ugl,
                              label: `${ugl.nom_ugl} (${ugl.code_ugl})`,
                            }))
                            .find((option) => option.value === field.value)
                        : null
                    }
                    onChange={(selectedOption) => {
                      field.onChange(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    isClearable
                    placeholder="Sélectionner une UGL..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.ugl_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ugl_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Niveau d'accès <span className="text-red-500">*</span>
              </label>

              <Controller
                name="niveau_perso"
                control={control}
                rules={{ required: "Le niveau d'accès est obligatoire" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: 1, label: "Éditeur" },
                      { value: 2, label: "Visiteur" },
                    ]}
                    classNamePrefix="react-select"
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
                  />
                )}
              />

              {errors.niveau_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.niveau_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Région <span className="text-red-500">*</span>
              </label>
              <Controller
                name="region_perso"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
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
                      field.onChange(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    isClearable
                    placeholder="Sélectionner une région..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.region_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.region_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Statut <span className="text-red-500">*</span>
              </label>

              <Controller
                name="statut"
                control={control}
                rules={{ required: "Le statut est obligatoire" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Actif", label: "Actif" },
                      { value: "Inactif", label: "Inactif" },
                      { value: "Suspendu", label: "Suspendu" },
                    ]}
                    classNamePrefix="react-select"
                    onChange={(option) =>
                      field.onChange(option ? option.value : null)
                    }
                    value={
                      field.value
                        ? { value: field.value, label: field.value }
                        : null
                    }
                  />
                )}
              />

              {errors.statut && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.statut.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description de la fonction
            </label>
            <textarea
              {...register("description_fonction_perso")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.description_fonction_perso && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description_fonction_perso.message}
              </p>
            )}
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
