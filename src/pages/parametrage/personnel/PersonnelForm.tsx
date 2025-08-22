import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Button from "../../../components/Button";
import { personnelService } from "../../../services/personnelService";
import {
  personnelCreateSchema,
  personnelUpdateSchema,
  type PersonnelCreateData,
  type PersonnelUpdateData,
} from "../../../schemas/personnelSchema";
import type { Personnel } from "../../../types/entities";
import { TitrePersonnelEnum } from "../../../types/entities";

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonnelCreateData | PersonnelUpdateData>({
    resolver: zodResolver(isEdit ? personnelUpdateSchema : personnelCreateSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: personnel
      ? {
          password: "", // Toujours vide pour la sécurité
          email: personnel.email || "",
          id_personnel_perso: personnel.id_personnel_perso || "",
          titre_personnel: personnel.titre_personnel,
          prenom_perso: personnel.prenom_perso || "",
          nom_perso: personnel.nom_perso || "",
          contact_perso: personnel.contact_perso || "",
          fonction_perso: personnel.fonction_perso || "",
          description_fonction_perso:
            personnel.description_fonction_perso || "",
          niveau_perso: personnel.niveau_perso || undefined,
          rapport_mensuel_perso: personnel.rapport_mensuel_perso || false,
          rapport_trimestriel_perso: personnel.rapport_trimestriel_perso || false,
          rapport_semestriel_perso: personnel.rapport_semestriel_perso || false,
          rapport_annuel_perso: personnel.rapport_annuel_perso || false,
          statut: personnel.statut || "",
          region_perso: personnel.region_perso || undefined,
          structure_perso: personnel.structure_perso || "",
          ugl_perso: personnel.ugl_perso || "",
          projet_active_perso: Array.isArray(personnel.projet_active_perso)
            ? personnel.projet_active_perso.join(", ")
            : personnel.projet_active_perso || "",
        }
      : {},
  });

  const mutation = useMutation({
    mutationFn: (data: PersonnelCreateData | PersonnelUpdateData) =>
      isEdit
        ? personnelService.update(personnel.n_personnel!, data)
        : personnelService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      toast.success(
        isEdit ? "Personnel modifié avec succès" : "Personnel créé avec succès"
      );
      onClose();
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  const onSubmit = (data: PersonnelCreateData | PersonnelUpdateData) => {
    mutation.mutate(data);
  };

  const onError = (errors: Record<string, { message?: string }>) => {
    console.log('Validation errors:', errors);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Modifier le personnel" : "Ajouter un personnel"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Mot de passe requis"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ID Personnel <span className="text-red-500">*</span>
              </label>
              <input
                {...register("id_personnel_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Identifiant unique"
              />
              {errors.id_personnel_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.id_personnel_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Structure
              </label>
              <input
                {...register("structure_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.structure_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.structure_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Titre</label>
              <select
                {...register("titre_personnel")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un titre</option>
                <option value={TitrePersonnelEnum.M}>M - Masculin</option>
                <option value={TitrePersonnelEnum.F}>F - Féminin</option>
              </select>
              {errors.titre_personnel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.titre_personnel.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
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
              <label className="block text-sm font-medium mb-1">Prénom</label>
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
                Contact téléphonique
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
              <label className="block text-sm font-medium mb-1">UGL</label>
              <input
                {...register("ugl_perso")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.ugl_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ugl_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fonction</label>
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
                Niveau d'accès
              </label>
              <input
                type="number"
                {...register("niveau_perso", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.niveau_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.niveau_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Région</label>
              <input
                type="number"
                {...register("region_perso", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {errors.region_perso && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.region_perso.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select
                {...register("statut")}
                value={personnel?.statut}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un statut</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
                <option value="Suspendu">Suspendu</option>
              </select>
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
      </div>
    </div>
  );
}
