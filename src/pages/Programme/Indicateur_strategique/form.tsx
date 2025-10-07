import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select, { MultiValue } from 'react-select'
import { allLocalite } from '../../../functions/localites/gets'
import { useEffect, useState } from 'react'
import { typeLocalite } from '../../../functions/localites/types'
import { toast } from 'react-toastify'
import TextArea from '../../../components/TextArea'
import { typeIndicStrategique } from '../../../functions/indicateurStrategique/types'
import { updateIndicStrategique } from '../../../functions/indicateurStrategique/put'
import { addIndicStrategique } from '../../../functions/indicateurStrategique/post'
import SelectInput from '../../../components/SelectInput'
import { ActeurType } from '../../Parametrages/Acteurs/types'
import { CadreStrategique, CadreStrategiqueConfig, Personnel } from '../../../types/entities'
import { getAllActeurs } from '../../../functions/acteurs/gets'
import { personnelService } from '../../../services/personnelService'
import { cadreStrategiqueService } from '../../../services/cadreStrategiqueService'
import { useRoot } from '../../../contexts/RootContext'
interface FormProps {
  row_indic: any
  isEdit: boolean
  niveau: string
  all: () => void
  onClose: () => void
}
const FormIndicateurStrategique: React.FC<FormProps> = ({ row_indic, isEdit, niveau, all, onClose }) => {
  const [acteurs, setActeurs] = useState<ActeurType[]>([])
  const [personnels, setPersonnels] = useState<Personnel[]>([])
  const [cadre_strategiques, setCadre_strategiques] = useState<CadreStrategique[]>([])
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeIndicStrategique>({
    mode: 'onSubmit',
    defaultValues: {
      id_indicateur_str: row_indic.id_indicateur_str,
      niveau_istr: row_indic.niveau_istr,
      code_indicateur_istr: row_indic.code_indicateur_istr,
      code_istr: row_indic.code_istr,
      intitule_indicateur_istr: row_indic.intitule_indicateur_istr,
      periodicite_iop: row_indic.periodicite_iop,
      source_istr: row_indic.source_istr,
      responsable_istr: row_indic.responsable_istr,
      description_istr: row_indic.description_istr,
      structure_istr: row_indic.structure_istr.code_acteur
    }
  })

  const { currentProgramme } = useRoot()
  const onSubmit = async (data: typeIndicStrategique) => {
    console.log('data', data)
    const dataToSend = { ...data, niveau_istr: Number(niveau), programme: currentProgramme.id_programme }
    try {
      let res
      if (row_indic.id_indicateur_str) {
        res = await updateIndicStrategique(data, row_indic.id_indicateur_str)
      } else {
        res = await addIndicStrategique(dataToSend)
      }
      onClose()
      all()
      toast.success(
        row_indic.id_indicateur_str
          ? 'Indicateur strategique mise a jour avec succès'
          : 'Indicateur strategique ajoutée avec succès'
      )
      console.log(res)
    } catch (error) {
      toast.error("erreur lors de la creation de l'unité de gestion")
      console.log(error)
    }
  }
  const AllActeur = async () => {
    try {
      const res = await getAllActeurs()
      if (res?.data)
        setActeurs(res.data)
    } catch (error) {
      return error
    }
  }
  const AllPersonnel = async () => {
    try {
      const res = await personnelService.getAll()
      setPersonnels(res)
    } catch (error) {
      return error
    }
  }
  const AllCadreStrategique = async () => {
    try {
      const res = await cadreStrategiqueService.getAll()
      setCadre_strategiques(res)
    } catch (error) {
      return error
    }
  }

  useEffect(() => {
    AllActeur()
    AllCadreStrategique()
    AllPersonnel()
  }, [])
  console.log('row_edit', row_indic);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Controller
            name="code_indicateur_istr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Code"
                placeholder="Entrez le code"
                error={errors.code_indicateur_istr}
              />
            )}
          />
        </div>

        <div className="col-span-6">
          <Controller
            name="intitule_indicateur_istr"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                label="Nom"
                placeholder="Entrez l'intitulé"
                error={errors.intitule_indicateur_istr}
                rows={1}
                required
              />
            )}
          />
        </div>
        <div className="col-span-12">
          <Controller
            name="description_istr"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                label="Description"
                placeholder="Entrez la description"
                rows={2}
                error={errors.description_istr}
                required
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="periodicite_iop"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Période"
                placeholder="Entrez la periode"
                error={errors.periodicite_iop}
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="source_istr"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Source"
                placeholder="Entrez la source"
                error={errors.source_istr}
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="code_istr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Cadre strategique"
                placeholder="Sélectionner une échelle"
                required
                options={cadre_strategiques.map((cadre) => ({
                  value: cadre.id_cs,
                  label: cadre.intutile_cs,
                }))}
                value={
                  field.value
                    ? cadre_strategiques.find((tz) => tz.id_cs === Number(field.value))
                      ? {
                        value: field.value,
                        label: cadre_strategiques.find(
                          (tz) => tz.id_cs === Number(field.value)
                        )!.intutile_cs,
                      }
                      : null
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }}
                isClearable
                error={errors.code_istr}
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="responsable_istr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Responsable"
                placeholder="Sélectionner un responsable"
                required
                options={personnels.map((personnel) => ({
                  value: personnel.id_personnel_perso ?? 0,
                  label: personnel.nom_perso ?? "",
                }))}
                value={
                  field.value
                    ? personnels.find((p) => p.id_personnel_perso === field.value)
                      ? {
                        value: field.value,
                        label: personnels.find((p) => p.id_personnel_perso === field.value)!.nom_perso ?? "",
                      }
                      : null
                    : null
                }

                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }}
                isClearable
                error={errors.responsable_istr}
              />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="structure_istr"
            control={control}
            render={({ field }) => (
              <SelectInput
                {...field}
                label="Structure"
                placeholder="Structure"
                options={acteurs.map((acteur) => ({
                  value: acteur.code_acteur ?? 0,
                  label: acteur.nom_acteur,
                }))}
                value={
                  field.value
                    ? acteurs.find((acteur) => acteur.code_acteur === field.value)
                      ? {
                        value: field.value,
                        label: `${acteurs.find(
                          (acteur) => acteur.code_acteur === field.value
                        )!.nom_acteur
                          }`,
                      }
                      : null
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }}
                error={errors.structure_istr}
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
          {isEdit ? 'Mettre à jour' : 'Valider'}
        </Button>
      </div>
    </form>
  )
}
export default FormIndicateurStrategique
