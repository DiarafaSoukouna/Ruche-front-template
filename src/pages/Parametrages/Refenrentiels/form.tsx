import React from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select, { MultiValue, SingleValue } from "react-select";
import { allLocalite } from "../../../functions/localites/gets";
import { useEffect, useState } from "react";
import { typeLocalite } from "../../../functions/localites/types";
import { toast } from "react-toastify";
import TextArea from "../../../components/TextArea";
import SelectInput from "../../../components/SelectInput";
import { listModeAggregation, listModeleTypologie, typeReferentiel } from "../../../functions/referentiels/types";
import { updateReferentiel } from "../../../functions/referentiels/put";
import { addReferentiel } from "../../../functions/referentiels/post";
import { UniteIndicateurTypes } from "../AutresParametrages/UniteIndicateur/types";
import { getAllUniteIndicateur } from "../../../functions/uniteIndicateur/gets";
import { typeZoneService } from "../../../services/typeZoneService";
import { Personnel, TypeZone } from "../../../types/entities";
import { getAllActeurs } from "../../../functions/acteurs/gets";
import { ActeurType } from "../Acteurs/types";
import { personnelService } from "../../../services/personnelService";
interface FormProps {
  referentiel: typeReferentiel;
  isEdit: boolean;
  all: () => void;
  onClose: () => void;
}
const FormReferentiel: React.FC<FormProps> = ({ referentiel, isEdit, all, onClose }) => {
  const [localites, setLocalites] = useState<typeLocalite[]>([]);
  const [unites, setUnites] = useState<UniteIndicateurTypes[]>([]);
  const [typeZones, setTypeZones] = useState<TypeZone[]>([]);
  const [acteurs, setActeurs] = useState<ActeurType[]>([]);
  const [users, setUsers] = useState<Personnel[]>([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeReferentiel>({ mode: "onSubmit" });
  const onSubmit = async (data: typeReferentiel) => {
    console.log("data", data);
    try {
      let res;
      if (referentiel.id_ref_ind_ref) {
        res = await updateReferentiel(data);
      } else {
        res = await addReferentiel(data);
      }
      onClose();
      all();
      toast.success(
        referentiel.id_ref_ind_ref
          ? "Unités de gestion mise a jour avec succès"
          : "Unités de gestion ajoutée avec succès"
      );
      console.log(res);
    } catch (error) {
      toast.error("erreur lors de la creation de l'unité de gestion");
      console.log(error);
    }
  };
  const AllUnites = async () => {
    try {
      const res = await getAllUniteIndicateur();
      setUnites(res);
      all();
    } catch (error) {
      return error;
    }
  };
  const AllTypeZone = async () => {
    try {
      const res = await typeZoneService.getAll();
      setTypeZones(res);
      all();
    } catch (error) {
      return error;
    }
  };
  const AllUsers = async () => {
    try {
      const res = await personnelService.getAll();
      setUsers(res);
      all();
    } catch (error) {
      return error;
    }
  };
  const AllActeur = async () => {
    try {
      const res = await getAllActeurs();
      setActeurs(res?.data);
      all();
    } catch (error) {
      return error;
    }
  };
  type OptionType = {
    value: number;
    label: string;
  };
  useEffect(() => {
    AllActeur();
    AllUnites();
    AllTypeZone();
    AllUsers();
  }, []);
  const userOptions = users.map((item) => ({
    value: String(item.n_personnel),
    label: item.nom_perso +' '+ item.prenom_perso,
  }));
  const uniteOptions = unites.map((item) => ({
    value: String(item.id_unite),
    label: item.definition_ui,
  }));
  const type_zone_options = typeZones.map((item) => ({
    value: String(item.code_type_zone),
    label: item.nom_type_zone || item.code_type_zone,
  }));
  const acteurOptions = acteurs.map((item) => ({
    value: String(item.code_acteur),
    label: item.nom_acteur,
  }));
  const typologies = listModeleTypologie.map((item) => ({
    value: item.value,
    label: item.label,
  }));
  const aggregations = listModeAggregation.map((item) => ({
    value: item.value,
    label: item.label,
  }));
  console.log(referentiel);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Controller
            name="code_ref_ind"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Code"
                placeholder="Entrez le code"
                error={errors.code_ref_ind}
                required
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="intitule_ref_ind"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                label="Intitulé"
                rows={1}
                placeholder="Entrez l'intutilé"
                error={errors.intitule_ref_ind}
                required
              />
            )}
          />
        </div>

        <div className="col-span-12">

          <div className="col-span-6">
            <Controller
              name="responsable_collecte_cmr"
              control={control}
              render={({ field }) => (
                <SelectInput
                  {...field}
                  label="Responsable"
                  options={userOptions}
                  isClearable
                  placeholder="Sélectionner"
                  value={
                    userOptions.find((opt) => opt.value === String(field.value)) ||
                    null
                  }
                  onChange={(
                    option: SingleValue<{ value: string | number; label: string }>
                  ) => field.onChange(option ? option.value : null)}
                  error={errors.responsable_collecte_cmr}
                />
              )}
            />
          </div>
          {errors.responsable_collecte_cmr && (
            <p className="text-red-500 text-sm mt-1">
              {errors.responsable_collecte_cmr.message}
            </p>
          )}
        </div>
        <div className="col-span-6">
          <Controller
            name="echelle"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Unité"
                options={type_zone_options}
                isClearable
                placeholder="Sélectionner"
                value={
                  type_zone_options.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(
                  option: SingleValue<{ value: string | number; label: string }>
                ) => field.onChange(option ? option.value : null)}
                error={errors.echelle}
              />
            )}
          />
          {errors.echelle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.echelle.message}
            </p>
          )}
        </div>

        <div className="col-span-6">
          <Controller
            name="unite_cmr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Unité"
                options={uniteOptions}
                isClearable
                placeholder="Sélectionner"
                value={
                  uniteOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(
                  option: SingleValue<{ value: string | number; label: string }>
                ) => field.onChange(option ? option.value : null)}
                error={errors.unite_cmr}
              />
            )}
          />
          {errors.unite_cmr && (
            <p className="text-red-500 text-sm mt-1">
              {errors.unite_cmr.message}
            </p>
          )}
        </div>
        <div className="col-span-6">
          <Controller
            name="typologie"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Modèle"
                options={typologies}
                isClearable
                placeholder="Sélectionner"
                value={
                  typologies.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(
                  option: SingleValue<{ value: string | number; label: string }>
                ) => field.onChange(option ? option.value : null)}
                error={errors.typologie}
              />
            )}
          />
          {errors.typologie && (
            <p className="text-red-500 text-sm mt-1">
              {errors.typologie.message}
            </p>
          )}
        </div>
        <div className="col-span-6">
          <Controller
            name="fonction_agregat_cmr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Fonction agrégat"
                options={aggregations}
                isClearable
                placeholder="Sélectionner"
                value={
                  aggregations.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(
                  option: SingleValue<{ value: string | number; label: string }>
                ) => field.onChange(option ? option.value : null)}
                error={errors.fonction_agregat_cmr}
              />
            )}
          />
          {errors.fonction_agregat_cmr && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fonction_agregat_cmr.message}
            </p>
          )}
        </div>
        <div className="col-span-6">
          <Controller
            name="seuil_minimum"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Seuil minimum"
                placeholder="Entrez le Seuil minimum"
                error={errors.seuil_minimum}
                required
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="seuil_maximum"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Seuil maximum"
                placeholder="Entrez le Seuil maximum"
                error={errors.seuil_maximum}
                required
              />
            )}
          />
        </div>
      </div>
      <div className="flex space-x-3 pt-4 justify-end">
        <Button variant="outline" onClick={() => onClose()}>
          Annuler
        </Button>
        <Button className="" type="submit">
          {isEdit ? "Mettre à jour" : "Valider"}
        </Button>
      </div>
    </form>
  );
};
export default FormReferentiel;
