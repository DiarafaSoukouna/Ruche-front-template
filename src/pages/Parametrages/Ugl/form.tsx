import React from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select, { MultiValue } from "react-select";
import { typeUgl } from "../../../functions/ugl/types";
import { allLocalite } from "../../../functions/localites/gets";
import { useEffect, useState } from "react";
import { typeLocalite } from "../../../functions/localites/types";
import { addUgl } from "../../../functions/ugl/post";
import { updateUgl } from "../../../functions/ugl/put";
import { toast } from "react-toastify";
import TextArea from "../../../components/TextArea";
interface FormProps {
  ugl: typeUgl;
  isEdit: boolean;
  all: () => void;
  onClose: () => void;
}
const FormUgl: React.FC<FormProps> = ({ ugl, isEdit, all, onClose }) => {
  const [localites, setLocalites] = useState<typeLocalite[]>([]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeUgl>({ mode: "onSubmit", defaultValues:  {
    code_ugl: ugl?.code_ugl || "",
    nom_ugl: ugl?.nom_ugl || "",
    abrege_ugl: ugl?.abrege_ugl || "",
    couleur_ugl: ugl?.couleur_ugl || "",
    region_concerne_ugl: ugl?.region_concerne_ugl?.map((region) => region.id_loca) || []
  } });
const onSubmit = async (data: typeUgl) => {
  console.log("data", data);
  const dataToSend = ugl?.id_ugl ? { ...data, id_ugl: ugl.id_ugl } : data;
  try {
    let res;
    if (ugl.id_ugl) {
      res = await updateUgl(dataToSend);
    } else {
      res = await addUgl(dataToSend);
    }
    onClose();
    all();
    toast.success(
      ugl.id_ugl
        ? "Unités de gestion mise a jour avec succès"
        : "Unités de gestion ajoutée avec succès"
    );
    console.log(res);
  } catch (error) {
    toast.error("erreur lors de la creation de l'unité de gestion");
    console.log(error);
  }
};
const AllLocalites = async () => {
  try {
    const res: typeLocalite[] = await allLocalite();
    setLocalites(res);
  } catch (error) {
    return error;
  }
};
type OptionType = {
  value: number;
  label: string;
};
useEffect(() => {
  AllLocalites();
}, []);
const localiteOptions = localites.map((item) => ({
  value: item.id_loca || 0,
  label: item.intitule_loca,
}));
return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6">
        <Controller
          name="code_ugl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Code"
              placeholder="Entrez le code"
              error={errors.code_ugl}
            />
          )}
        />
      </div>
      <div className="col-span-6">
        <Controller
          name="abrege_ugl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Abréviation"
              placeholder="Entrez le code"
              error={errors.code_ugl}
            />
          )}
        />

      </div>
      <div className="col-span-12">
        <Controller
          name="nom_ugl"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Nom"
              placeholder="Entrez le libélle"
              error={errors.nom_ugl}
              required
            />
          )}
        />
      </div>
      <div className="col-span-6">
        <Controller
          name="couleur_ugl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="color"
              label="Couleur"
              placeholder="Choisir une couleur"
              error={errors.couleur_ugl}
              required
            />
          )}
        />
      </div>
      <div className="col-span-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Localites concernées
        </label>
        <Controller
          name="region_concerne_ugl"
          control={control}
          defaultValue={ugl?.region_concerne_ugl ?? []}
          render={({ field }) => (
            <Select<OptionType, true>
              {...field}
              options={localiteOptions}
              isMulti
              isClearable
              placeholder="Sélectionner"
              className="react-select-container"
              classNamePrefix="react-select"
              value={localiteOptions.filter((opt) =>
                (field.value as number[]).includes(opt.value)
              )}
              onChange={(options: MultiValue<OptionType>) =>
                field.onChange(options.map((opt) => opt.value))
              }
            />
          )}
        />
        {errors.region_concerne_ugl && (
          <p className="text-red-500 text-sm mt-1">
            {errors.region_concerne_ugl.message}
          </p>
        )}
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
export default FormUgl;
